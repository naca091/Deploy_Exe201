const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role'); // Thêm import Role model

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-secret-key';

class AuthController {
    // Hàm login
    async login(req, res) {
        const { username, password } = req.body;

        try {
            // Tìm user và populate role
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

            // Cập nhật thời gian đăng nhập
            user.lastLogin = new Date();
            await user.save();

            // Tạo token 
            const token = jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                    role: user.role.roleId
                },
                ACCESS_TOKEN_SECRET,
                { expiresIn: '24h' }
            );

            // Chuẩn bị dữ liệu user trả về
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

    // Hàm đăng ký
    async register(req, res) {
        const { username, password, email, fullName } = req.body;

        try {
            // Validate input
            if (!username || !password || !email || !fullName) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin'
                });
            }

            // Kiểm tra username và email tồn tại
            const existingUser = await User.findOne({
                $or: [
                    { username: username.toLowerCase() },
                    { email: email.toLowerCase() }
                ]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username hoặc email đã tồn tại'
                });
            }

            // Lấy role mặc định (user role)
            const defaultRole = await Role.findOne({ roleId: 2 });
            if (!defaultRole) {
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi khi tạo tài khoản: Không tìm thấy role mặc định'
                });
            }

            // Tạo user mới
            const newUser = new User({
                username: username.toLowerCase(),
                password, // Trong thực tế nên hash password
                email: email.toLowerCase(),
                fullName,
                role: defaultRole._id,
                xu: 0,
                status: 'active',
                createdAt: new Date()
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

    // Hàm logout
    async logout(req, res) {
        try {
            // Trong trường hợp này chỉ cần trả về success vì token được handle ở client
            res.json({
                success: true,
                message: 'Đăng xuất thành công'
            });
        } catch (error) {
            console.error('Logout Error:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi đăng xuất'
            });
        }
    }
}

module.exports = new AuthController();