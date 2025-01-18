// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/models'); // Import model User
const { loginUser } = require('../controllers/authController'); // Nhập hàm từ controller  

const router = express.Router();

// Route đăng ký (register)

// Tạo access token  
const createAccessToken = (user) => {  
  // Tạo token với thông tin người dùng và thời gian hết hạn  
  return jwt.sign(  
      { _id: user._id, username: user.username, role: user.role },  
      process.env.ACCESS_TOKEN_SECRET,  
      { expiresIn: '1h' }  
  );  
};  

// Route đăng nhập (login)  
router.post('/login', async (req, res) => {  
  const { username, password } = req.body;  

  try {  
      // Tìm user trong database  
      const user = await User.findOne({ username });  
      if (!user) {  
          return res.status(401).json({ success: false, message: 'Invalid credentials' });  
      }  

      // So sánh mật khẩu (so sánh trực tiếp mà không mã hóa)  
      if (user.password !== password) { // Ở đây, bạn cần rất cẩn thận vì mật khẩu không được mã hóa  
          return res.status(401).json({ success: false, message: 'Invalid credentials' });  
      }  

      // Cập nhật thời gian đăng nhập gần nhất  
      user.lastLogin = new Date();  
      await user.save();  

      // Tạo token  
      const accessToken = createAccessToken(user); // Sử dụng hàm tạo token  

      // Chuẩn bị phản hồi  
      const userResponse = {  
          _id: user._id,  
          fullName: user.fullName,  
          username: user.username,  
          email: user.email,  
          role: user.role,  
          lastLogin: user.lastLogin,  
          token: accessToken, // Đính kèm token vào phản hồi  
      };  

      res.json({  
          success: true,  
          user: userResponse,  
      });  
  } catch (error) {  
      console.error('Login error:', error);  
      res.status(500).json({ success: false, message: 'Login failed', error: error.message });  
  }  
});  
module.exports = router;