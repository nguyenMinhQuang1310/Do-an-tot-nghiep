const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const productVariantController = require('../controllers/productVariantController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', productController.getProducts);
router.get('/:idOrSlug', productController.getProductByIdOrSlug);

// Public: variants of a product
router.get('/:productId/variants', productVariantController.getVariants);

// Admin routes
router.post('/', authenticate, authorizeAdmin, productController.createProduct);
router.put('/:id', authenticate, authorizeAdmin, productController.updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, productController.deleteProduct);

// Admin: create variant under product
router.post('/:productId/variants', authenticate, authorizeAdmin, productVariantController.createVariant);

module.exports = router;
