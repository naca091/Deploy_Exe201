// backend/server.js hoặc index.js
const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Your routes here
app.post('/api/users/register', async (req, res) => {
    try {
        const { User } = require('../server/models/models'); // Import your existing model
        const { username, password, email, fullName, phone, address } = req.body;

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

        // Create new user
        const newUser = new User({
            username,
            password,
            email,
            fullName,
            phone,
            address
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});