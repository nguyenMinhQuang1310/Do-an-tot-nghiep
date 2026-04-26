const slugify = require('slugify');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');

/**
 * Danh sách categories (public)
 */
const getCategories = async () => {
  return Category.find().sort({ name: 1 });
};

/**
 * Chi tiết category theo id hoặc slug
 */
const getCategoryByIdOrSlug = async (idOrSlug) => {
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

  const category = await Category.findOne(query);
  if (!category) {
    throw new ApiError(404, 'Category không tồn tại');
  }
  return category;
};

/**
 * Tạo category (Admin)
 */
const createCategory = async ({ name, slug: customSlug }) => {
  const slug = customSlug || slugify(name, { lower: true, strict: true });

  return Category.create({ name, slug });
};

/**
 * Cập nhật category (Admin)
 */
const updateCategory = async (id, data) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category không tồn tại');
  }

  if (data.name && !data.slug) {
    data.slug = slugify(data.name, { lower: true, strict: true });
  }

  Object.assign(category, data);
  await category.save();

  return category;
};

/**
 * Bật/tắt category (Admin)
 */
const toggleActive = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category không tồn tại');
  }

  category.isActive = !category.isActive;
  await category.save();

  return category;
};

module.exports = { getCategories, getCategoryByIdOrSlug, createCategory, updateCategory, toggleActive };
