const Address = require('../models/Address');
const ApiError = require('../utils/ApiError');

/**
 * Danh sách địa chỉ của user
 */
const getAddresses = async (userId) => {
  return Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
};

/**
 * Thêm địa chỉ mới
 */
const createAddress = async (userId, data) => {
  // Nếu đây là địa chỉ đầu tiên, tự động set default
  const count = await Address.countDocuments({ userId });
  if (count === 0) {
    data.isDefault = true;
  }

  return Address.create({ ...data, userId });
};

/**
 * Cập nhật địa chỉ
 */
const updateAddress = async (userId, addressId, data) => {
  const address = await Address.findOne({ _id: addressId, userId });
  if (!address) {
    throw new ApiError(404, 'Địa chỉ không tồn tại');
  }

  // Không cho phép client set isDefault qua update — dùng endpoint riêng
  delete data.isDefault;
  delete data.userId;

  Object.assign(address, data);
  await address.save();

  return address;
};

/**
 * Xóa địa chỉ
 */
const deleteAddress = async (userId, addressId) => {
  const address = await Address.findOneAndDelete({ _id: addressId, userId });
  if (!address) {
    throw new ApiError(404, 'Địa chỉ không tồn tại');
  }

  // Nếu xóa address mặc định, set address đầu tiên còn lại làm default
  if (address.isDefault) {
    const firstAddress = await Address.findOne({ userId });
    if (firstAddress) {
      firstAddress.isDefault = true;
      await firstAddress.save();
    }
  }

  return address;
};

/**
 * Đặt làm địa chỉ mặc định
 * Business rule: unset default cũ → set default mới
 */
const setDefault = async (userId, addressId) => {
  const address = await Address.findOne({ _id: addressId, userId });
  if (!address) {
    throw new ApiError(404, 'Địa chỉ không tồn tại');
  }

  // Unset tất cả default của user
  await Address.updateMany({ userId }, { isDefault: false });

  // Set default cho address được chọn
  address.isDefault = true;
  await address.save();

  return address;
};

module.exports = { getAddresses, createAddress, updateAddress, deleteAddress, setDefault };
