const productVariantService = require('../services/productVariantService');

const getVariants = async (req, res, next) => {
  try {
    const variants = await productVariantService.getVariantsByProductId(req.params.productId);
    res.json({ success: true, data: variants });
  } catch (error) {
    next(error);
  }
};

const createVariant = async (req, res, next) => {
  try {
    const variant = await productVariantService.createVariant(req.params.productId, req.body);
    res.status(201).json({ success: true, data: variant });
  } catch (error) {
    next(error);
  }
};

const updateVariant = async (req, res, next) => {
  try {
    const variant = await productVariantService.updateVariant(req.params.id, req.body);
    res.json({ success: true, data: variant });
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const variant = await productVariantService.updateStock(req.params.id, req.body);
    res.json({ success: true, data: variant });
  } catch (error) {
    next(error);
  }
};

const deleteVariant = async (req, res, next) => {
  try {
    await productVariantService.deleteVariant(req.params.id);
    res.json({ success: true, message: 'Đã xóa variant' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getVariants, createVariant, updateVariant, updateStock, deleteVariant };
