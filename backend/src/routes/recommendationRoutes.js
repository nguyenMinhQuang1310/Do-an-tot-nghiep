const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const behaviorLogController = require('../controllers/behaviorLogController');
const { authenticate } = require('../middlewares/authMiddleware');

// Gợi ý cá nhân hóa (cần đăng nhập)
router.get('/for-you', authenticate, recommendationController.getRecommendations);

// Sản phẩm tương tự (public)
router.get('/similar/:productId', recommendationController.getSimilarProducts);

// Log hành vi (cần đăng nhập)
router.post('/log', authenticate, behaviorLogController.logEvent);

module.exports = router;
