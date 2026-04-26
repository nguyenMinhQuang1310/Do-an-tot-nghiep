const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

router.use(authenticate, authorizeAdmin);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id/toggle-active', userController.toggleActive);

module.exports = router;
