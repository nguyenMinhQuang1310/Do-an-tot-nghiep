const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Danh sách users (Admin) — có pagination
 */
const getUsers = async ({ page = 1, limit = 10 }) => {
  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Chi tiết 1 user
 */
const getUserById = async (id) => {
  const user = await User.findById(id).select('-passwordHash');
  if (!user) {
    throw new ApiError(404, 'User không tồn tại');
  }
  return user;
};

/**
 * Bật/tắt trạng thái user
 */
const toggleActive = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User không tồn tại');
  }

  user.isActive = !user.isActive;
  await user.save();

  return { _id: user._id, isActive: user.isActive };
};

module.exports = { getUsers, getUserById, toggleActive };
