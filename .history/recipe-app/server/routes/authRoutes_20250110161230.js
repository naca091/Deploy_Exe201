// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/models'); // Import model User
const { loginUser } = require('../controllers/authController');


// Route đăng ký (register)

const express = require('express');
const router = express.Router();

router.post('/login', loginUser);

module.exports = router;