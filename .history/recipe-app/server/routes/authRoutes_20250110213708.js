const express = require('express');
const router = express.Router();
const authController = require('../routes/authService');

//Auth routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authenticateToken, authController.logout);
module.exports = router;
