// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');
const JWT_SECRET = "16d139b9a1550760dad34a6de1122b68466745b34a583cbc45acaf0e822ad480";

const auth = async (req, res, next) => {
  try {
      const authHeader = req.header('Authorization');
      console.log('Auth header:', authHeader); // Debug log

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new Error('No token provided or invalid format');
      }

      const token = authHeader.replace('Bearer ', '');
      console.log('Token received:', token.substring(0, 10) + '...'); // Debug log, only show first 10 chars

      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug log

      const user = await User.findById(decoded.userId);
      if (!user) {
          throw new Error('User not found');
      }

      req.token = token;
      req.user = user;
      next();
  } catch (error) {
      console.error('Auth middleware error:', error); // Debug log
      res.status(401).json({ 
          success: false,
          message: 'Authentication failed: ' + error.message 
      });
  }
};

module.exports = auth;