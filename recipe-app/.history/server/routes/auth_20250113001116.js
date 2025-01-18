// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { User } = require('../models/models');

// Thêm JWT_SECRET trực tiếp
const JWT_SECRET = "71917999b687ce0c5cc3fb267d1f3c99c29497ad1d63bc8ae4d50a245c19ef15";

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Email or password is incorrect',
      });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

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

//logout
router.post('/logout', (req, res) => {
  // Ghi nhật ký hoặc xử lý đăng xuất nếu cần
  res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
  });
});

//register 
router.post('//register', async (req, res) => {
  const { username, password, email, fullName, phone, address, xu = 0 } = req.body;

  try {
      // Kiểm tra input đầu vào
      if (!username || !password || !email || !fullName) {
          return res.status(400).json({
              success: false,
              message: 'All required fields must be provided',
          });
      }

      // Kiểm tra xem username hoặc email đã tồn tại chưa
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
          return res.status(400).json({
              success: false,
              message: 'Username or email already exists',
          });
      }

      // Tìm role cho member (roleId = 1) với cơ chế retry
      let memberRole;
      for (let i = 0; i < 3; i++) { // Thử tối đa 3 lần
          memberRole = await Role.findOne({ roleId: 1 });
          if (memberRole) break;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Chờ 1 giây trước khi thử lại
      }

      if (!memberRole) {
          return res.status(500).json({
              success: false,
              message: 'System initialization in progress. Please try again later.',
          });
      }

      // Tạo người dùng mới (không hash mật khẩu)
      const newUser = new User({
          username,
          password, // Lưu mật khẩu trực tiếp (không hash)
          email,
          fullName,
          phone: phone || '',
          address: address || '',
          role: memberRole._id, // Sử dụng role được tìm thấy
          xu, // Giá trị mặc định cho xu
          avatar: '', // Giá trị mặc định cho avatar
      });

      await newUser.save();

      res.status(201).json({
          success: true,
          message: 'Registration successful! Please login to continue.',
      });
  } catch (error) {
      console.error('Registration error:', error);

      // Xử lý lỗi Validation
      if (error.name === 'ValidationError') {
          const errors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({
              success: false,
              message: errors.join(', '),
          });
      }

      res.status(500).json({
          success: false,
          message: 'Registration failed. Please try again later.',
      });
  }
});

module.exports = router;
