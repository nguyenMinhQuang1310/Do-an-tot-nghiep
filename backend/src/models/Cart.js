const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'Quantity phải là số nguyên',
      },
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'checked_out'],
      default: 'active',
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Partial Unique Index: mỗi user chỉ có tối đa 1 cart active
cartSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } }
);

// KHÔNG lưu giá trong cart — lookup từ ProductVariant.price realtime

module.exports = mongoose.model('Cart', cartSchema);
