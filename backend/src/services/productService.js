const slugify = require('slugify');
const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');
const ApiError = require('../utils/ApiError');

/**
 * Danh sách sản phẩm — filter, search, pagination, sort
 */
const getProducts = async (query) => {
  let {
    page = 1,
    limit = 10,
    categoryId,
    targetGender,
    search,
    status,
    sort = 'newest',
  } = query;

  page = parseInt(page);
  limit = parseInt(limit);

  // Base filter: chỉ sản phẩm chưa bị xóa
  const filter = { isDeleted: false };

  // Public mặc định chỉ hiện active
  if (status) {
    filter.status = status;
  } else {
    filter.status = 'active';
  }

  if (categoryId) filter.categoryId = categoryId;
  if (targetGender) filter.targetGender = targetGender;

  // Text search
  if (search) {
    filter.$text = { $search: search };
  }

  // Sort options
  let sortOption = { createdAt: -1 }; // newest
  if (sort === 'price_asc' || sort === 'price_desc') {
    // Sort theo price cần aggregate vì price ở ProductVariant
    return getProductsSortedByPrice(filter, sort, page, limit);
  }
  if (sort === 'best_selling') {
    return getProductsSortedByBestSelling(filter, page, limit);
  }
  if (sort === 'oldest') sortOption = { createdAt: 1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('categoryId', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Sort sản phẩm theo số lượng bán (đơn delivered), có fallback theo createdAt.
 */
const getProductsSortedByBestSelling = async (filter, page, limit) => {
  const pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: 'orders',
        let: { pid: '$_id' },
        pipeline: [
          { $match: { orderStatus: 'delivered' } },
          { $unwind: '$items' },
          { $match: { $expr: { $eq: ['$items.productId', '$$pid'] } } },
          {
            $group: {
              _id: null,
              soldCount: { $sum: '$items.quantity' },
            },
          },
        ],
        as: 'sales',
      },
    },
    {
      $addFields: {
        soldCount: {
          $ifNull: [{ $arrayElemAt: ['$sales.soldCount', 0] }, 0],
        },
      },
    },
    { $sort: { soldCount: -1, createdAt: -1 } },
    {
      $facet: {
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        total: [{ $count: 'count' }],
      },
    },
  ];

  const [result] = await Product.aggregate(pipeline);
  const products = result.data;
  const total = result.total[0]?.count || 0;

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Sort sản phẩm theo giá (giá thấp nhất từ variants)
 */
const getProductsSortedByPrice = async (filter, sort, page, limit) => {
  const sortDir = sort === 'price_asc' ? 1 : -1;

  const pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: 'productvariants',
        localField: '_id',
        foreignField: 'productId',
        as: 'variants',
      },
    },
    {
      $addFields: {
        minPrice: { $min: '$variants.price' },
      },
    },
    { $sort: { minPrice: sortDir } },
    {
      $facet: {
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        total: [{ $count: 'count' }],
      },
    },
  ];

  const [result] = await Product.aggregate(pipeline);
  const products = result.data;
  const total = result.total[0]?.count || 0;

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Chi tiết sản phẩm + variants
 */
const getProductByIdOrSlug = async (idOrSlug) => {
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

  const product = await Product.findOne({ ...query, isDeleted: false }).populate(
    'categoryId',
    'name slug'
  );

  if (!product) {
    throw new ApiError(404, 'Sản phẩm không tồn tại');
  }

  const variants = await ProductVariant.find({ productId: product._id });

  return { product, variants };
};

/**
 * Tạo sản phẩm (Admin)
 */
const createProduct = async (data) => {
  if (!data.slug) {
    data.slug = slugify(data.name, { lower: true, strict: true });
  }

  return Product.create(data);
};

/**
 * Cập nhật sản phẩm (Admin)
 */
const updateProduct = async (id, data) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new ApiError(404, 'Sản phẩm không tồn tại');
  }

  if (data.name && !data.slug) {
    data.slug = slugify(data.name, { lower: true, strict: true });
  }

  Object.assign(product, data);
  await product.save();

  return product;
};

/**
 * Soft delete sản phẩm (Admin)
 */
const deleteProduct = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new ApiError(404, 'Sản phẩm không tồn tại');
  }

  product.isDeleted = true;
  product.deletedAt = new Date();
  product.status = 'inactive';
  await product.save();

  return product;
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
