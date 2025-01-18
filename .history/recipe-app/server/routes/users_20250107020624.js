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
router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
        const user = await User.findOne({
            $or: [{ username }, { email: username }]
        }).select('+password').populate('role');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
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
        logError('Login error', error);
        res.status(500).json({ success: false, message: 'Login failed. Please try again later.' });
    }
});

module.exports = router;
