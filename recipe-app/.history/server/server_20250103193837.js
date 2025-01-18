const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); // thay vì 'bcryptjs'
const { User, Role, Menu, UserMenu, Category } = require('./models/models');
const ingredientRoutes = require('../server/routes/ingredients');
const categoryRoutes = require('../server/routes/categories');
const menusRouter = require("./routes/menus");

const debug = require('debug')('app:server');

// Load environment variables
dotenv.config();

const app = express();

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recipe_db';

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('📦 MongoDB Connected Successfully');
        // Chạy initialization sau khi kết nối thành công
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// Test Route
app.use(ingredientRoutes);
app.use(categoryRoutes);
app.use("/uploads", express.static("uploads")); // Phục vụ file tĩnh từ thư mục uploads

// Routes
app.use("/api/menus", menusRouter);

// User Registration Route
app.post('/api/users/register', async (req, res) => {
    try {
        const { username, password, email, fullName, phone, address } = req.body;

        // Validation
        if (!username || !password || !email || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        // Find member role with retry mechanism
        let memberRole;
        for (let i = 0; i < 3; i++) { // Try 3 times
            memberRole = await Role.findOne({ roleId: 1 });
            if (memberRole) break;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }

        if (!memberRole) {
            return res.status(500).json({
                success: false,
                message: 'System initialization in progress. Please try again in a few moments.'
            });
        }

        // Create new user
        const newUser = new User({
            username,
            password,
            email,
            fullName,
            phone: phone || '',
            address: address || '',
            role: memberRole._id
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please login to continue.'
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again later.'
        });
    }
});
// User Login Route
// server.js - Login route
app.post('/api/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user and populate role information
        const user = await User.findOne({ 
            $or: [{ username }, { email: username }] 
        }).select('+password').populate('role');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create response without sensitive data
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        };

        res.json({
            success: true,
            message: 'Login successful',
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something broke!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
// 404 handler
app.use((req, res) => {
    debug('Route not found:', req.originalUrl);
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error handler
app.use((err, req, res, next) => {
    debug('Error occurred:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});
// Use routes
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`MongoDB URI: ${MONGO_URI}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully.');
    mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully.');
    mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
});