// authRoutes.js
const express = require('express');
const User = require('../models/models'); // Import model User
const { loginUser } = require('../routes/authController');


// Route đăng ký (register)


router.post('/login', loginUser);

module.exports = router;