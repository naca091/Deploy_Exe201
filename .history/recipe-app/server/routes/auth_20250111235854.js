const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Tìm user và populate purchasedMenus
    const user = await User.findOne({ email })
      .populate({
        path: 'purchasedMenus.menuId',
        select: 'name description unlockPrice defaultStatus'
      });

    // Kiểm tra user và password
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Email or password is incorrect'
      });
    }

    // Tạo token với userId
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Trả về response với đầy đủ thông tin
    res.json({
      success: true,
      message: 'Login successful',
      token,
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
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});