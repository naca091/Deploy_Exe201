// authService.js  
const User = require('./userModel');  
const jwt = require('jsonwebtoken');  

exports.login = async (email, password) => {  
  const user = await User.findOne({ email });  
  if (!user || !(await user.comparePassword(password))) {  
    throw new Error('Invalid email or password');  
  }  
  const token = await user.generateToken();  
  return { user, token };  
};  

exports.register = async (name, email, password) => {  
  const existingUser = await User.findOne({ email });  
  if (existingUser) {  
    throw new Error('Email already registered');  
  }  
  const user = await User.create({ name, email, password });  
  const token = await user.generateToken();  
  return { user, token };  
};  

exports.verifyToken = async (token) => {  
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);  
  const user = await User.findById(decoded.userId);  
  if (!user) {  
    throw new Error('Invalid token');  
  }  
  return user;  
};