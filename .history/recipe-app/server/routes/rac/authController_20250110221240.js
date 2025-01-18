const jwt = require('jsonwebtoken');  
const User = require('../../models/models');  

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-secret-key';  

const authController = {  
    login: async (req, res) => {  
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

            // Kiểm tra trạng thái user  
            if (user.status === 'blocked') {  
                return res.status(403).json({  
                    success: false,  
                    message: 'Tài khoản đã bị khóa'  
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
                    role: user.role  
                },  
                ACCESS_TOKEN_SECRET,  
                { expiresIn: '24h' }  
            );  

            // Chuẩn bị dữ liệu trả về  
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
    },  

    authenticateToken: async (req, res, next) => {  
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

                // Kiểm tra user trong database  
                const user = await User.findById(decoded.userId);  
                if (!user || user.status === 'blocked') {  
                    return res.status(403).json({  
                        success: false,  
                        message: 'Tài khoản không tồn tại hoặc đã bị khóa'  
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
    },  

    checkRole: (requiredRole) => {  
        return (req, res, next) => {  
            if (!req.user || req.user.role.roleId !== requiredRole) {  
                return res.status(403).json({  
                    success: false,  
                    message: 'Không có quyền truy cập'  
                });  
            }  
            next();  
        };  
    }  
};  

module.exports = authController;