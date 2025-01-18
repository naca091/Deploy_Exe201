// authMiddleware.js  
const authService = require('./authService');  

exports.verifyToken = async (req, res, next) => {  
  try {  
    const token = req.headers.authorization?.split(' ')[1];  
    if (!token) {  
      return res.status(401).json({ success: false, message: 'No token provided' });  
    }  

    const user = await authService.verifyToken(token);  
    req.user = user;  
    next();  
  } catch (error) {  
    res.status(403).json({ success: false, message: 'Failed to authenticate token' });  
  }  
};