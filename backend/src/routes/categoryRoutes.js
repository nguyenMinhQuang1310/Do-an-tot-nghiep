const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:idOrSlug', categoryController.getCategoryByIdOrSlug);

// Admin routes
router.post('/', authenticate, authorizeAdmin, categoryController.createCategory);
router.put('/:id', authenticate, authorizeAdmin, categoryController.updateCategory);
router.patch('/:id/toggle-active', authenticate, authorizeAdmin, categoryController.toggleActive);

module.exports = router;
