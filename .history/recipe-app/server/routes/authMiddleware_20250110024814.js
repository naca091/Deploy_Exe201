// authMiddleware.js  
const User = require('../models/models'); // Đảm bảo đường dẫn chính xác tới model User  

const authMiddleware = async (req, res, next) => {  
    const userId = req.headers['authorization']; // Giả sử bạn gửi user ID trong header  

    if (!userId) {  
        return res.status(401).json({  
            success: false,  
            message: 'Unauthorized: No user ID provided',  
        });  
    }  

    try {  
        // Tìm người dùng trong database bằng user ID  
        const user = await User.findById(userId);  
        if (!user) {  
            return res.status(401).json({  
                success: false,  
                message: 'Unauthorized: User not found',  
            });  
        }  

        // Nếu người dùng tồn tại, gán thông tin người dùng vào req.user  
        req.user = user;  
        next(); // Tiếp tục với request  
    } catch (error) {  
        console.error('Authentication error:', error);  
        res.status(500).json({  
            success: false,  
            message: 'Authentication failed',  
            error: error.message,  
        });  
    }  
};  

module.exports = authMiddleware;