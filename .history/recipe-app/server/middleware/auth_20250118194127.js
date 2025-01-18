// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');
const JWT_SECRET = "b1c85f1955577a9721f8c389162b691bebf9a1729a6606c7d75d18623d7988fc";

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