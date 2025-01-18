// middlewares/authMiddleware.js  
const jwt = require('jsonwebtoken');  
const User = require('../models/models');  

const authMiddleware = async (req, res, next) => {  
    const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header  

    if (!token) {  
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });  
    }  

    try {  
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token  
        const user = await User.findById(decoded.id); // Tìm người dùng trong cơ sở dữ liệu  
        if (!user) {  
            return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });  
        }  

        req.user = user; // Lưu thông tin người dùng vào req  
        next();  
    } catch (error) {  
        console.error('Authentication error:', error);  
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });  
    }  
};  

module.exports = authMiddleware;