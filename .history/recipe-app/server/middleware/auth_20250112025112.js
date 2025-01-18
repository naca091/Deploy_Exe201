/* middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/models');

const auth = async (req, res, next) => {
  try {
    // Kiểm tra header có Bearer token
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header must start with Bearer');
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tìm user và kiểm tra tồn tại
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Gán user vào request để các middleware/route tiếp theo có thể sử dụng
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Please authenticate',
      error: error.message
    });
  }
};
*/
const jwt = require('jsonwebtoken');
const User = require('../models/models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
    next(error); 
  }
};

module.exports = auth;