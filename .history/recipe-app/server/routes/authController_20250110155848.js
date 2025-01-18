// controllers/authController.js  
const jwt = require('jsonwebtoken');  
const User = require('../models/models'); // Thay đổi đường dẫn đến User Model  
const ACCESS_TOKEN_SECRET = 8770422009;
// Hàm xác thực người dùng và tạo token  
const loginUser = async (req, res) => {  
    const { username, password } = req.body; // Lấy thông tin từ body của request  
    try {  
        const user = await User.findOne({ username }); // Tìm kiếm người dùng trong cơ sở dữ liệu  
        if (user && user.password === password) { // Kiểm tra mật khẩu  
            const token = jwt.sign({ _id: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' }); // Tạo token với thời gian sống 1 giờ  
            res.json({ success: true, user: { ...user.toObject(), token } }); // Trả về user cùng với token  
        } else {  
            res.status(401).json({ success: false, message: 'Invalid credentials' }); // Đăng nhập không thành công  
        }  
    } catch (error) {  
        console.error('Login Error:', error);  
        res.status(500).json({ success: false, message: 'Server error' });  
    }  
};  

module.exports = {  
  loginUser  
};