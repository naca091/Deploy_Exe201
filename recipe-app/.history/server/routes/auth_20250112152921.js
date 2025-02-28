// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { User } = require('../models/models');
const JWT_SECRET = "eefef971649a4687dfc6be6123e03c4c23554470b5e8cdeb95adbef49ded70d4";

// Login route
router.post('/api/auth/login', async (req, res) => {
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  const { email, password } = req.body || {};

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET, // Ensure you have JWT_SECRET in your environment variables
      { expiresIn: '24h' }
    );

    // Return user information
    res.json({
      success: true,
      message: 'Login successful',
      token,
      userEmail: user.email,
      userxu: user.xu
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'purchasedMenus.menuId',
        select: 'name description unlockPrice defaultStatus'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        xu: user.xu,
        purchasedMenus: user.purchasedMenus.map(pm => ({
          menuId: pm.menuId._id,
          name: pm.menuId.name,
          description: pm.menuId.description,
          unlockPrice: pm.menuId.unlockPrice,
          defaultStatus: pm.menuId.defaultStatus
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user information',
      error: error.message
    });
  }
});

// Export router 
module.exports = router;