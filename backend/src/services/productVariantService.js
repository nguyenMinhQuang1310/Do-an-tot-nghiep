const ProductVariant = require('../models/ProductVariant');
const ApiError = require('../utils/ApiError');

/**
 * Danh sách variants của 1 product
 */
const getVariantsByProductId = async (productId) => {
  return ProductVariant.find({ productId });
};

/**
 * Tạo variant (Admin)
 */
const createVariant = async (productId, data) => {
  return ProductVariant.create({ ...data, productId });
};

/**
 * Cập nhật variant (Admin) — name, price, image, size, color
 */
const updateVariant = async (id, data) => {
  const variant = await ProductVariant.findById(id);
  if (!variant) {
    throw new ApiError(404, 'Variant không tồn tại');
  }

  // Không cho update stock qua endpoint này — dùng updateStock
  delete data.stock;
  delete data.productId;

  Object.assign(variant, data);
  await variant.save();

  return variant;
};

/**
 * Cập nhật stock bằng Atomic $inc hoặc set tuyệt đối
 */
const updateStock = async (id, { adjustment, stock: absoluteStock }) => {
  if (adjustment !== undefined) {
    // Atomic $inc với điều kiện stock + adjustment >= 0
    const variant = await ProductVariant.findOneAndUpdate(
      { _id: id, stock: { $gte: -adjustment } },
      { $inc: { stock: adjustment } },
      { returnDocument: 'after' }
    );

    if (!variant) {
      throw new ApiError(400, 'Không đủ tồn kho hoặc variant không tồn tại');
    }

    return variant;
  }

  if (absoluteStock !== undefined) {
    const variant = await ProductVariant.findByIdAndUpdate(
      id,
      { stock: absoluteStock },
      { returnDocument: 'after', runValidators: true }
    );

    if (!variant) {
      throw new ApiError(404, 'Variant không tồn tại');
    }

    return variant;
  }

  throw new ApiError(400, 'Phải cung cấp adjustment hoặc stock');
};

/**
 * Xóa variant (Admin)
 */
const deleteVariant = async (id) => {
  const variant = await ProductVariant.findByIdAndDelete(id);
  if (!variant) {
    throw new ApiError(404, 'Variant không tồn tại');
  }
  return variant;
};

module.exports = {
  getVariantsByProductId,
  createVariant,
  updateVariant,
  updateStock,
  deleteVariant,
};
