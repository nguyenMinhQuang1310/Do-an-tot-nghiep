const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

router.use(authenticate, authorizeAdmin);

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderByIdAdmin);
router.patch('/:id/status', orderController.updateOrderStatus);
router.patch('/:id/payment-status', orderController.updatePaymentStatus);

module.exports = router;
