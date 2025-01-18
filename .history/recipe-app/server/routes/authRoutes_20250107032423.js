// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/models'); // Import model User

const router = express.Router();

// Route đăng ký (register)


// Route đăng nhập (login)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm user trong database
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // So sánh password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Trả về thông tin user
    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
});

module.exports = router;