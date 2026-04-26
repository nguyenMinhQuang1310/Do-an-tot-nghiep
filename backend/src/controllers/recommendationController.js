const recommendationService = require('../services/recommendationService');

const getRecommendations = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await recommendationService.getRecommendations(req.user.id, limit);
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

const getSimilarProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const products = await recommendationService.getSimilarProducts(req.params.productId, limit);
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations, getSimilarProducts };
