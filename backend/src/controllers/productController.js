const productService = require('../services/productService');

const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const result = await productService.getProductByIdOrSlug(req.params.idOrSlug);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Đã xóa sản phẩm', data: product });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductByIdOrSlug, createProduct, updateProduct, deleteProduct };
