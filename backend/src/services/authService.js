const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Đăng ký customer mới
 */
const register = async ({ fullName, email, password, phone }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email đã được sử dụng');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    passwordHash,
    phone,
    role: 'customer',
  });

  const token = generateToken(user);

  return {
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

/**
 * Đăng nhập
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Email hoặc mật khẩu không đúng');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Tài khoản đã bị khóa');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Email hoặc mật khẩu không đúng');
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

/**
 * Lấy profile user hiện tại
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    throw new ApiError(404, 'User không tồn tại');
  }
  return user;
};

module.exports = { register, login, getProfile };
