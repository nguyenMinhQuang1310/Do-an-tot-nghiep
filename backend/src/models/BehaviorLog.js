const mongoose = require('mongoose');

const sourceContextSchema = new mongoose.Schema(
  {
    pageType: {
      type: String,
      required: true,
      trim: true,
    },
    route: {
      type: String,
      required: true,
      trim: true,
    },
    searchKeyword: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const behaviorLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant',
    },
    eventType: {
      type: String,
      required: true,
      enum: ['view', 'add_to_cart', 'purchase'],
    },
    sourceContext: {
      type: sourceContextSchema,
    },
  },
  { timestamps: true }
);

// Trọng số recommendation:
// purchase = 5, add_to_cart = 3, view = 1
// Fallback: sản phẩm bán chạy nhất trong cùng category

module.exports = mongoose.model('BehaviorLog', behaviorLogSchema);
