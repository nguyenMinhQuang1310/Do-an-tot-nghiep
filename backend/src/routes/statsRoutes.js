const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

router.use(authenticate, authorizeAdmin);

router.get('/overview', statsController.getOverview);
router.get('/revenue', statsController.getRevenue);
router.get('/best-selling', statsController.getBestSelling);

module.exports = router;
