 //middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/models');
const { JWT_SECRET } = require('../routes/auth'); // Import JWT_SECRET từ auth.js

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
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