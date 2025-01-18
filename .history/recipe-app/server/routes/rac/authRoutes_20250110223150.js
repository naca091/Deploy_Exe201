
//authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../authController');
const { authenticateToken } = require('../authMiddleware');

//Auth routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authenticateToken, authController.logout);
module.exports = router;
