const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    targetGender: {
      type: String,
      required: true,
      enum: ['men', 'women', 'unisex', 'kids'],
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'inactive'],
      default: 'draft',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'Sản phẩm phải có ít nhất 1 ảnh',
      },
    },
  },
  { timestamps: true }
);

// Text Index cho tìm kiếm sản phẩm
productSchema.index({ name: 'text', description: 'text' });

// Quy ước: images[0] dùng làm thumbnail
// Không có basePrice — giá nằm ở ProductVariant
// Không hard-delete sản phẩm đã có trong order

module.exports = mongoose.model('Product', productSchema);
