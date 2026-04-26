const mongoose = require('mongoose');

// ─── Embedded Subdocument: Shipping Address (SNAPSHOT) ───
const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    cityProvince: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

// ─── Embedded Subdocument: Order Item (SNAPSHOT) ───
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
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
    image: {
      type: String,
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
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// ─── Main Order Schema ───
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    inventoryRestored: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cod', 'bank_transfer'],
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paidAt: { type: Date },
    confirmedAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: {
      type: Date,
      index: true, // Mốc tính doanh thu & thống kê
    },
    cancelledAt: { type: Date },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'Đơn hàng phải có ít nhất 1 sản phẩm',
      },
    },
  },
  { timestamps: true }
);

// ─── Luồng trạng thái hợp lệ ───
// pending → confirmed → shipping → delivered
// pending → cancelled
// confirmed → cancelled
// shipping, delivered, cancelled: KHÔNG được quay lui hoặc cancel

module.exports = mongoose.model('Order', orderSchema);
