const express = require('express');
const bcrypt = require('bcrypt');
const { User, Role } = require('../models/models');

const router = express.Router();

// Utility function for logging errors
const logError = (message, error) => {
    console.error(`${message}:`, error);
};

// --- CRUD Operations ---

// Get all users with pagination, search, and sorting
router.get('/api/users', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortField = 'createdAt', sortOrder = 'asc' } = req.query;

        const query = {
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        };

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .populate('role')
            .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .select('-password');

        res.json({
            success: true,
            data: users,
            pagination: {
                total,
                page: parseInt(page),
                lastPage: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logError('Error fetching users', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});

// Get a specific user by ID
router.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role').select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        logError('Error fetching user', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user' });
    }
});

// Update a user by ID
router.put('/api/users/:id', async (req, res) => {
    try {
        const { password, email, username, ...updateData } = req.body;

        if (email || username) {
            const existingUser = await User.findOne({
                _id: { $ne: req.params.id },
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email or username already exists' });
            }
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(req.params.id, { ...updateData, email, username }, { new: true, runValidators: true }).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, data: user, message: 'User updated successfully' });
    } catch (error) {
        logError('Error updating user', error);
        res.status(500).json({ success: false, message: 'Failed to update user' });
    }
});

// Delete a user by ID
router.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        logError('Error deleting user', error);
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
});
// POST: Tạo người dùng mới
router.post('/api/user', async (req, res) => {
  const { fullName, address, phone, email, coins, role, username, password } = req.body;

  try {
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      address,
      phone,
      email,
      coins,
      role,
      username,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});
// --- Authentication ---

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password, email, fullName, phone, address } = req.body;

    try {
        if (!username || !password || !email || !fullName) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }

        const memberRole = await Role.findOne({ roleId: 2 });
        if (!memberRole) {
            return res.status(500).json({ success: false, message: 'System initialization in progress. Please try again later.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            fullName,
            phone: phone || '',
            address: address || '',
            role: memberRole._id,
            coins: 0,
            avatar: ''
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'Registration successful! Please login to continue.' });
    } catch (error) {
        logError('Registration error', error);
        res.status(500).json({ success: false, message: 'Registration failed. Please try again later.' });
    }
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      console.log('Login attempt:', { username });

      const user = await User.findOne({ 
          $or: [
              { username: username },
              { email: username }
          ]
      }).select('+password').populate('role');

      if (!user) {
          console.log('Login failed: User not found');
          return res.status(401).json({
              success: false,
              message: 'Invalid credentials'
          });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match status:', isMatch);

      if (!isMatch) {
          console.log('Login failed: Incorrect password');
          return res.status(401).json({
              success: false,
              message: 'Invalid credentials'
          });
      }

      user.lastLogin = new Date();
      await user.save();

      res.json({
          success: true,
          user: {
              fullName: user.fullName,
              username: user.username,
              email: user.email,
              role: user.role,
              lastLogin: user.lastLogin
          }
      });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message
      });
  }
});


module.exports = router;
