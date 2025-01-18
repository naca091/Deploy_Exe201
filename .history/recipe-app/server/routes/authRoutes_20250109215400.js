// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/models'); // Import model User

const router = express.Router();

// Route đăng ký (register)  
router.post('/register', [  
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),  
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'), // Giữ lại kiểm tra độ dài mật khẩu  
  body('fullName').notEmpty().withMessage('Full name is required'),  
  body('email').isEmail().withMessage('Invalid email address'),  
  body('phone').optional().isString().withMessage('Phone must be a string'), // Trường tùy chọn  
  body('address').optional().isString().withMessage('Address must be a string') // Trường tùy chọn  
], async (req, res) => {  
  const errors = validationResult(req);  
  if (!errors.isEmpty()) {  
    return res.status(400).json({ success: false, errors: errors.array() });  
  }  

  const { username, password, fullName, email, phone, address } = req.body;  

  try {  
    // Kiểm tra xem người dùng có tồn tại không  
    const existingUser = await User.findOne({ $or: [{ username }, { email }] }); // Kiểm tra cả username và email  
    if (existingUser) {  
      return res.status(400).json({ success: false, message: 'Username or email already exists' });  
    }  

    // Tạo người dùng mới mà không hash password  
    const newUser = new User({  
      username,  
      password, // Lưu mật khẩu trực tiếp  
      fullName,  
      email,  
      phone: phone || '', // Mặc định là chuỗi rỗng  
      address: address || '', // Mặc định là chuỗi rỗng  
      xu: 0, // Giá trị mặc định cho xu  
      avatar: '', // Giá trị avatar mặc định  
    });  
    
    await newUser.save();  

    res.status(201).json({  
      success: true,  
      message: 'User registered successfully',  
    });  
  } catch (error) {  
    console.error('Registration error:', error);  
    res.status(500).json({  
      success: false,  
      message: 'Registration failed',  
      error: error.message,  
    });  
  }  



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
  router.post('/login', async (req, res) => {  
    const { username, password } = req.body;  
  
    try {  
      const user = await User.findOne({ username }).select('+password');  
      if (!user) {  
        return res.status(401).json({ success: false, message: 'User not found' });  
      }  
  
      const isPasswordValid = password === user.password; // So sánh password trực tiếp  
      if (!isPasswordValid) {  
        return res.status(401).json({ success: false, message: 'Invalid credentials' });  
      }  
  
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
      res.status(500).json({ success: false, message: 'Login failed', error: error.message });  
    }  
  });  
  
module.exports = router;