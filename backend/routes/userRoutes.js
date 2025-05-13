const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   GET /api/users/banks
// @desc    Get all bank users (admin role)
// @access  Private (SuperAdmin only)
router.get('/banks', auth, userController.getBankUsers);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, userController.getProfile);

module.exports = router;
