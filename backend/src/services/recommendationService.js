const BehaviorLog = require('../models/BehaviorLog');
const Product = require('../models/Product');
const Order = require('../models/Order');
const mongoose = require('mongoose');

/**
 * Trọng số cho mỗi loại event.
 */
const WEIGHTS = { purchase: 5, add_to_cart: 3, view: 1 };

/**
 * Gợi ý sản phẩm cho user dựa trên hành vi (rule-based).
 *
 * Thuật toán:
 * 1. Lấy tất cả BehaviorLog của user trong 30 ngày gần nhất.
 * 2. Tính score cho mỗi productId = Σ (weight × count).
 * 3. Từ các sản phẩm user đã tương tác, lấy categoryId + targetGender.
 * 4. Tìm sản phẩm cùng category/gender nhưng user CHƯA tương tác.
 * 5. Chấm điểm candidate theo category/gender affinity và sắp xếp giảm dần.
 *
 * Fallback: Nếu user mới (không có behavior), trả về best-selling products.
 */
const getRecommendations = async (userId, limit = 8) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // ─── Bước 1: Lấy behavior logs 30 ngày ───
  const logs = await BehaviorLog.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { productId: '$productId', eventType: '$eventType' },
        count: { $sum: 1 },
      },
    },
  ]);

  // ─── Bước 2: Tính score cho mỗi product ───
  const productScores = {};
  logs.forEach((log) => {
    const pid = log._id.productId.toString();
    const weight = WEIGHTS[log._id.eventType] || 1;
    productScores[pid] = (productScores[pid] || 0) + weight * log.count;
  });

  const interactedProductIds = Object.keys(productScores);

  // ─── Fallback: User mới, trả best-selling ───
  if (interactedProductIds.length === 0) {
    return getBestSellingFallback(limit);
  }

  // ─── Bước 3: Lấy category/gender từ sản phẩm đã tương tác ───
  const interactedProducts = await Product.find(
    { _id: { $in: interactedProductIds }, isDeleted: false },
    { _id: 1, categoryId: 1, targetGender: 1 }
  ).lean();

  const categoryIds = [...new Set(interactedProducts.map((p) => p.categoryId.toString()))];
  const genders = [...new Set(interactedProducts.map((p) => p.targetGender))];

  // ─── Bước 4: Tìm sản phẩm tương tự nhưng chưa tương tác ───
  const candidateProducts = await Product.find({
    _id: { $nin: interactedProductIds.map((id) => new mongoose.Types.ObjectId(id)) },
    isDeleted: false,
    status: 'active',
    $or: [
      { categoryId: { $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)) } },
      { targetGender: { $in: genders } },
    ],
  })
    .populate('categoryId', 'name slug')
    .limit(limit * 4)
    .lean();

  // ─── Bước 4.1: Tính affinity score cho category/gender từ lịch sử tương tác ───
  const categoryScores = {};
  const genderScores = {};
  interactedProducts.forEach((p) => {
    const pid = p._id.toString();
    const baseScore = productScores[pid] || 0;
    const catKey = p.categoryId?.toString();
    const genderKey = p.targetGender;

    if (catKey) categoryScores[catKey] = (categoryScores[catKey] || 0) + baseScore;
    if (genderKey) genderScores[genderKey] = (genderScores[genderKey] || 0) + baseScore;
  });

  // ─── Bước 5: Enrich với minPrice từ variants ───
  const ProductVariant = require('../models/ProductVariant');
  const productIds = candidateProducts.map((p) => p._id);
  const priceAgg = await ProductVariant.aggregate([
    { $match: { productId: { $in: productIds } } },
    { $group: { _id: '$productId', minPrice: { $min: '$price' } } },
  ]);
  const priceMap = {};
  priceAgg.forEach((p) => { priceMap[p._id.toString()] = p.minPrice; });

  const ranked = candidateProducts
    .map((p) => {
      const catKey = p.categoryId?._id?.toString() || p.categoryId?.toString();
      const genderKey = p.targetGender;
      const affinityScore = (categoryScores[catKey] || 0) + (genderScores[genderKey] || 0);

      return {
        ...p,
        minPrice: priceMap[p._id.toString()] || null,
        recommendationScore: affinityScore,
      };
    })
    .sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) {
        return b.recommendationScore - a.recommendationScore;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return ranked.slice(0, limit);
};

/**
 * Gợi ý sản phẩm tương tự (cùng category hoặc gender) cho 1 sản phẩm.
 * Dùng ở trang ProductDetail.
 */
const getSimilarProducts = async (productId, limit = 6) => {
  const product = await Product.findById(productId).lean();
  if (!product) return [];

  const similar = await Product.find({
    _id: { $ne: product._id },
    isDeleted: false,
    status: 'active',
    $or: [
      { categoryId: product.categoryId },
      { targetGender: product.targetGender },
    ],
  })
    .populate('categoryId', 'name slug')
    .limit(limit * 2)
    .lean();

  // Enrich với minPrice
  const ProductVariant = require('../models/ProductVariant');
  const productIds = similar.map((p) => p._id);
  const priceAgg = await ProductVariant.aggregate([
    { $match: { productId: { $in: productIds } } },
    { $group: { _id: '$productId', minPrice: { $min: '$price' } } },
  ]);
  const priceMap = {};
  priceAgg.forEach((p) => { priceMap[p._id.toString()] = p.minPrice; });

  const enriched = similar.map((p) => ({
    ...p,
    minPrice: priceMap[p._id.toString()] || null,
  }));

  // Shuffle
  for (let i = enriched.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [enriched[i], enriched[j]] = [enriched[j], enriched[i]];
  }

  return enriched.slice(0, limit);
};

/**
 * Fallback: Sản phẩm bán chạy nhất.
 */
const getBestSellingFallback = async (limit = 8) => {
  const agg = await Order.aggregate([
    { $match: { orderStatus: 'delivered' } },
    { $unwind: '$items' },
    { $group: { _id: '$items.productId', totalQty: { $sum: '$items.quantity' } } },
    { $sort: { totalQty: -1 } },
    { $limit: limit },
  ]);

  const productIds = agg.map((a) => a._id);
  const products = await Product.find({
    _id: { $in: productIds },
    isDeleted: false,
    status: 'active',
  })
    .populate('categoryId', 'name slug')
    .lean();

  const rankMap = {};
  agg.forEach((item, idx) => {
    rankMap[item._id.toString()] = idx;
  });

  // Enrich với minPrice
  const ProductVariant = require('../models/ProductVariant');
  const priceAgg = await ProductVariant.aggregate([
    { $match: { productId: { $in: productIds } } },
    { $group: { _id: '$productId', minPrice: { $min: '$price' } } },
  ]);
  const priceMap = {};
  priceAgg.forEach((p) => { priceMap[p._id.toString()] = p.minPrice; });

  return products
    .map((p) => ({
      ...p,
      minPrice: priceMap[p._id.toString()] || null,
    }))
    .sort((a, b) => (rankMap[a._id.toString()] ?? 999999) - (rankMap[b._id.toString()] ?? 999999));
};

module.exports = { getRecommendations, getSimilarProducts };
