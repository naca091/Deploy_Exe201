const jwt = require('jsonwebtoken');  
const User = require('../models/models'); // Thay đổi đường dẫn đến User Model  
const ACCESS_TOKEN_SECRET = 8770422009;
const {loginUser} = require('../routes/authController');

// Middleware xác thực token  
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token xác thực'
            });
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Token không hợp lệ hoặc đã hết hạn'
                });
            }

            // Kiểm tra user có tồn tại không
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(403).json({
                    success: false,
                    message: 'Không tìm thấy người dùng'
                });
            }

            req.user = decoded;
            next();
        });

    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({
            success: false,
            message: 'Xác thực thất bại'
        });
    }
};

module.exports = {
    loginUser,
    authenticateToken
};