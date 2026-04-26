const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Stock phải là số nguyên',
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound Unique Index: chống trùng biến thể cùng product
productVariantSchema.index({ productId: 1, size: 1, color: 1 }, { unique: true });

// Rule tồn kho — dùng atomic $inc khi trừ/hoàn kho:
// ProductVariant.findOneAndUpdate(
//   { _id: variantId, stock: { $gte: requestedQuantity } },
//   { $inc: { stock: -requestedQuantity } }
// )

module.exports = mongoose.model('ProductVariant', productVariantSchema);
