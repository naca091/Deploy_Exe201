const express = require('express');
const router = express.Router();
const { User, LoginStat } = require('../models/models');

router.get('/login-count', async (req, res) => {
  try {
    // Lấy ngày hiện tại (reset về 00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Đếm tổng số user
    const totalUsers = await User.countDocuments();
    
    // Đếm số user đã login trong ngày
    const loginCount = await LoginStat.distinct('userId', {
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).count();

    res.json({
      success: true,
      data: {
        totalUsers,
        loginCount
      }
    });
  } catch (error) {
    console.error('Error fetching login stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch login statistics'
    });
  }
});

module.exports = router;  
