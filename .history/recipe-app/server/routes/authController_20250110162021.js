const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
    async login(req, res) {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username }).populate('role');
            
            if (!user || user.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: 'Username hoặc password không đúng'
                });
            }

            if (user.status !== 'active') {
                return res.status(403).json({
                    success: false,
                    message: 'Tài khoản đã bị khóa hoặc vô hiệu hóa'
                });
            }

            user.lastLogin = new Date();
            await user.save();

            const token = jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                    role: user.role.roleId
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '24h' }
            );

            const userResponse = {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                xu: user.xu,
                lastLogin: user.lastLogin,
                token
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
    }

    async register(req, res) {
        const { username, password, email, fullName } = req.body;

        try {
            // Kiểm tra username và email tồn tại
            const existingUser = await User.findOne({
                $or: [{ username }, { email }]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username hoặc email đã tồn tại'
                });
            }

            // Tìm role mặc định cho user mới (ví dụ roleId = 2 cho normal user)
            const defaultRole = await Role.findOne({ roleId: 2 });
            
            const newUser = new User({
                username,
                password,
                email,
                fullName,
                role: defaultRole._id,
                xu: 0
            });

            await newUser.save();

            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công'
            });

        } catch (error) {
            console.error('Register Error:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi đăng ký'
            });
        }
    }
}

module.exports = new AuthController();