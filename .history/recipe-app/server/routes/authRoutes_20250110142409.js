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
      const user = await User.findOne({ username });  
      if (!user) {  
          return res.status(401).json({ success: false, message: 'Invalid credentials' });  
      }  

      // So sánh mật khẩu (so sánh trực tiếp)  
      if (user.password !== password) {  
          return res.status(401).json({ success: false, message: 'Invalid credentials' });  
      }  

      // Cập nhật thời gian đăng nhập gần nhất  
      user.lastLogin = new Date();  
      await user.save();  

      // Tạo token  
      const accessToken = jwt.sign(  
          { _id: user._id, username: user.username, role: user.role },  
          process.env.ACCESS_TOKEN_SECRET,  
          { expiresIn: '1h' }  
      );  

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