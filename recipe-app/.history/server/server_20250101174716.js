const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); // thay vì 'bcryptjs'
const { User, Role, Menu, UserMenu, Category, Ingredient } = require('./models/models');
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
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running' });
});

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
router.get('/api/ingredients', async (req, res) => {
    try {
        const ingredients = await Ingredient.find().sort({ name: 1 });
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ingredients', error: error.message });
    }
});

// Get single ingredient
router.get('/api/ingredients/:id', async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id);
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }
        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ingredient', error: error.message });
    }
});

// Create ingredient
router.post('/api/ingredients', async (req, res) => {
    try {
        const { name } = req.body;
        
        // Check for existing ingredient
        const existingIngredient = await Ingredient.findOne({ name: name });
        if (existingIngredient) {
            return res.status(400).json({ message: 'Ingredient already exists' });
        }

        const ingredient = new Ingredient({ name });
        await ingredient.save();
        
        res.status(201).json(ingredient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ingredient', error: error.message });
    }
});

// Update ingredient
router.put('/api/ingredients/:id', async (req, res) => {
    try {
        const { name } = req.body;
        
        // Check for existing ingredient with same name but different ID
        const existingIngredient = await Ingredient.findOne({ 
            name: name, 
            _id: { $ne: req.params.id } 
        });
        
        if (existingIngredient) {
            return res.status(400).json({ message: 'Ingredient name already exists' });
        }

        const ingredient = await Ingredient.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );

        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ingredient', error: error.message });
    }
});

// Delete ingredient
router.delete('/api/ingredients/:id', async (req, res) => {
    try {
        const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
        
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        res.json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ingredient', error: error.message });
    }
});

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