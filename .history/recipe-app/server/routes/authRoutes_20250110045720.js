// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/models'); // Import model User

const router = express.Router();

// Route đăng ký (register)


// Route đăng nhập (login)
router.post('/login', async (req, res) => {  
  const { username, password } = req.body; // Giả sử bạn lấy username và password từ body  

  try {  
      const user = await User.findOne({ username }); // Tìm người dùng theo username  
      if (!user || !(await user.comparePassword(password))) { // Kiểm tra mật khẩu  
          return res.status(401).json({ success: false, message: 'Invalid credentials' });  
      }  

      // Tạo token sau khi đăng nhập thành công  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });  

      res.json({ success: true, token }); // Trả về token cho client  
  } catch (error) {  
      console.error('Login error:', error);  
      res.status(500).json({ success: false, message: 'Login failed', error: error.message });  
  }  
});  

module.exports = router;