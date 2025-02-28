// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');
const JWT_SECRET = "71917999b687ce0c5cc3fb267d1f3c99c29497ad1d63bc8ae4d50a245c19ef15";

const auth = async (req, res, next) => {
  try {
      const authHeader = req.header('Authorization');
      console.log('Auth header:', authHeader); // Debug log

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new Error('No token provided or invalid format');
      }

      const token = authHeader.replace('Bearer ', '');
      console.log('Token received:', token.substring(0, 10) + '...'); // Debug log, only show first 10 chars

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
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