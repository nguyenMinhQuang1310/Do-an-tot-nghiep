const categoryService = require('../services/categoryService');

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

const getCategoryByIdOrSlug = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryByIdOrSlug(req.params.idOrSlug);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

const toggleActive = async (req, res, next) => {
  try {
    const category = await categoryService.toggleActive(req.params.id);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCategoryByIdOrSlug, createCategory, updateCategory, toggleActive };
