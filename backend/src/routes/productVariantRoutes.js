const express = require('express');
const router = express.Router();
const productVariantController = require('../controllers/productVariantController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

router.use(authenticate, authorizeAdmin);

router.put('/:id', productVariantController.updateVariant);
router.patch('/:id/stock', productVariantController.updateStock);
router.delete('/:id', productVariantController.deleteVariant);

module.exports = router;
