//authmiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/models');

class AuthMiddleware {
    async authenticate(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'Không tìm thấy token xác thực'
                });
            }

            const token = authHeader.split(' ')[1];

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user || user.status !== 'active') {
                return res.status(403).json({
                    success: false,
                    message: 'Tài khoản không tồn tại hoặc đã bị khóa'
                });
            }

            req.user = decoded;
            next();

        } catch (error) {
            console.error('Auth Middleware Error:', error);
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({
                    success: false,
                    message: 'Token đã hết hạn'
                });
            }
            res.status(401).json({
                success: false,
                message: 'Token không hợp lệ'
            });
        }
    }

    checkRole(requiredRole) {
        return (req, res, next) => {
            if (req.user.role !== requiredRole) {
                return res.status(403).json({
                    success: false,
                    message: 'Không có quyền truy cập'
                });
            }
            next();
        };
    }
}

module.exports = new AuthMiddleware();