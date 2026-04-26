const statsService = require('../services/statsService');

const getOverview = async (req, res, next) => {
  try {
    const stats = await statsService.getOverview();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

const getRevenue = async (req, res, next) => {
  try {
    const result = await statsService.getRevenue(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getBestSelling = async (req, res, next) => {
  try {
    const result = await statsService.getBestSelling(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview, getRevenue, getBestSelling };
