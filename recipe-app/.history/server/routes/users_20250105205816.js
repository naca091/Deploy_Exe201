const express = require('express');
const bcrypt = require('bcrypt');
const { User, Role } = require('../models/models');

const router = express.Router();

// User Registration Route
router.post('/register', async (req, res) => {
    const { username, password, email, fullName, phone, address } = req.body;

    try {
        // Validate input
        if (!username || !password || !email || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided',
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists',
            });
        }

        // Find member role with retry mechanism
        let memberRole;
        for (let i = 0; i < 3; i++) { // Try up to 3 times
            memberRole = await Role.findOne({ roleId: 1 });
            if (memberRole) break;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }

        if (!memberRole) {
            return res.status(500).json({
                success: false,
                message: 'System initialization in progress. Please try again later.',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            fullName,
            phone: phone || '',
            address: address || '',
            role: memberRole._id,
            coins: 0, // Default value for coins
            avatar: '', // Default avatar value
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please login to continue.',
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: errors.join(', '),
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again later.',
        });
    }
});

// User Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user and include password for comparison
        const user = await User.findOne({ username })
            .select('+password')
            .populate('role');

        // Check if user exists and password matches
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Update last login timestamp
        user.lastLogin = new Date();
        await user.save();

        // Create response object
        const userResponse = {
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            address: user.address,
            phone: user.phone,
            coins: user.coins,
            avatar: user.avatar,
            role: user.role,
            lastLogin: user.lastLogin,
        };

        res.json({
            success: true,
            user: userResponse,
        });
    } catch (error) {
        console.error('Login error:', error);

        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message,
        });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('role');
        res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
        });
    }
});

// Get single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
        });
    }
});

// Update user by ID
router.put('/:id', async (req, res) => {
    try {
        const { fullName, email, phone, address, role } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { fullName, email, phone, address, role },
            { new: true, runValidators: true }
        ).populate('role');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            data: user,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
        });
    }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
        });
    }
});

module.exports = router;