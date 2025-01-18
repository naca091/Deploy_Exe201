// controllers/authController.js  
const jwt = require('jsonwebtoken');
const User = require('../models/models');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-secret-key';

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Tìm user và so sánh password trực tiếp
        const user = await User.findOne({ username });
        
        if (!user || user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Username hoặc password không đúng'
            });
        }

        // Cập nhật lastLogin
        user.lastLogin = new Date();
        await user.save();

        // Tạo token với thông tin cần thiết
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        // Chuẩn bị thông tin user để trả về
        const userResponse = {
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            xu: user.xu,
            token: token // Gửi token về client
        };

        res.json({
            success: true,
            user: userResponse
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi đăng nhập'
        });
    }
};
module.exports = {  
  loginUser  
};