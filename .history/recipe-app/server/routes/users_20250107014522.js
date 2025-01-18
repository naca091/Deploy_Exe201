const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { User, Role } = require('../models/models');
const winston = require('winston');
const sanitize = require('mongo-sanitize');

const router = express.Router();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const DEFAULT_ROLE_ID = process.env.DEFAULT_ROLE_ID || 2; // Default role for new users
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
};

// Helper function to create a new user
const createUser = async (userData) => {
  const { username, password, email, fullName, phone, address, role, coins, isActive } = userData;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create new user
  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    fullName,
    phone: phone || '',
    address: address || '',
    role: role || DEFAULT_ROLE_ID, // Use default role if not provided
    coins: coins || 0,
    isActive: isActive !== undefined ? isActive : true, // Default to true if not provided
  });

  await newUser.save();
  return newUser;
};

// User Registration Route
router.post('/register', [
  body('username').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('fullName').notEmpty().withMessage('Full name is required'),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array() });
  }

  try {
    const sanitizedBody = sanitize(req.body);
    const { username, password, email, fullName, phone, address } = sanitizedBody;

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    // Find the default role (e.g., member role)
    const memberRole = await Role.findOne({ roleId: DEFAULT_ROLE_ID });
    if (!memberRole) {
      return res.status(500).json({ success: false, message: 'System initialization in progress. Please try again later.' });
    }

    // Create new user
    const newUser = await createUser({
      username,
      password,
      email,
      fullName,
      phone,
      address,
      role: memberRole._id, // Assign the default role
    });

    res.status(201).json({ success: true, message: 'Registration successful! Please login to continue.' });
  } catch (error) {
    next(error);
  }
});

// Admin Create User Route
router.post('/', [
  body('username').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('role').notEmpty().withMessage('Role is required'),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array() });
  }

  try {
    const sanitizedBody = sanitize(req.body);
    const { username, password, email, fullName, role, phone, address, coins, isActive } = sanitizedBody;

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    // Create new user
    const newUser = await createUser({
      username,
      password,
      email,
      fullName,
      phone,
      address,
      role,
      coins,
      isActive,
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error);
  }
});

// User Login Route
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    logger.info('Login request received', { username });

    // Find user by username or email
    const user = await User.findOne({ $or: [{ username }, { email: username }] })
      .select('+password')
      .populate('role');

    if (!user) {
      logger.warn('User not found', { username });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Password mismatch', { username });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Return user data (excluding password)
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      lastLogin: user.lastLogin,
    };

    res.json({ success: true, user: userData });
  } catch (error) {
    next(error);
  }
});

// Use error handler
router.use(errorHandler);

module.exports = router;