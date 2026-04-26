const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// GMT+7 offset in milliseconds
const GMT7_OFFSET = 7 * 60 * 60 * 1000;

/**
 * Tổng quan thống kê
 */
const getOverview = async () => {
  const [totalOrders, pendingOrders, revenue, totalUsers, totalProducts] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'pending' }),
    Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments({ isDeleted: false, status: 'active' }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    totalRevenue: revenue[0]?.total || 0,
    totalUsers,
    totalProducts,
  };
};

/**
 * Doanh thu theo khoảng thời gian
 * - groupBy: 'day' | 'month'
 * - Dùng deliveredAt, timezone GMT+7
 */
const getRevenue = async ({ startDate, endDate, groupBy = 'day' }) => {
  const match = {
    orderStatus: 'delivered',
    deliveredAt: { $ne: null },
  };

  if (startDate) match.deliveredAt.$gte = new Date(startDate);
  if (endDate) match.deliveredAt.$lte = new Date(endDate);

  // Group format theo timezone GMT+7
  let dateFormat;
  if (groupBy === 'month') {
    dateFormat = { $dateToString: { format: '%Y-%m', date: '$deliveredAt', timezone: '+07:00' } };
  } else {
    dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$deliveredAt', timezone: '+07:00' } };
  }

  const result = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: dateFormat,
        revenue: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return result;
};

/**
 * Sản phẩm bán chạy
 * - Tính bằng tổng Order.items.quantity, gộp theo productId
 * - Chỉ tính order delivered
 * - Dùng deliveredAt
 */
const getBestSelling = async ({ limit = 10, startDate, endDate }) => {
  limit = parseInt(limit);

  const match = {
    orderStatus: 'delivered',
    deliveredAt: { $ne: null },
  };

  if (startDate) match.deliveredAt = { ...match.deliveredAt, $gte: new Date(startDate) };
  if (endDate) match.deliveredAt = { ...match.deliveredAt, $lte: new Date(endDate) };

  const result = await Order.aggregate([
    { $match: match },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.subtotal' },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: 1,
        totalQuantity: 1,
        totalRevenue: 1,
        productName: '$product.name',
        productImage: { $arrayElemAt: ['$product.images', 0] },
        productSlug: '$product.slug',
      },
    },
  ]);

  return result;
};

module.exports = { getOverview, getRevenue, getBestSelling };
