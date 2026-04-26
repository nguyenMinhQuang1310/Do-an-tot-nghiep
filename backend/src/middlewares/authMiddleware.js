const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * Xác thực JWT từ header Authorization: Bearer <token>
 * Gắn req.user = { id, role }
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Vui lòng đăng nhập');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('_id role isActive');

    if (!user) {
      throw new ApiError(401, 'User không tồn tại');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Tài khoản đã bị khóa');
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Kiểm tra quyền admin — phải gọi sau authenticate
 */
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new ApiError(403, 'Chỉ admin mới có quyền truy cập'));
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
