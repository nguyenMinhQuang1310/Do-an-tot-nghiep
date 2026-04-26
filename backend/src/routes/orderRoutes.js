const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/authMiddleware');

router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.get('/:id', orderController.getMyOrderById);
router.patch('/:id/cancel', orderController.cancelOrder);

module.exports = router;
