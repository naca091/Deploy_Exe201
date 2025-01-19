// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');
const JWT_SECRET = "a990db5c4af7b98eb9f36b753a7ec19c6c12c1d881cd7f985a7781e8966f61d7";

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