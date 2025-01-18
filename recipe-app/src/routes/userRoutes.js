// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model

// POST /api/users/register
router.post('/register', async (req, res) => {
    try {
        const { username, password, fullName, email, phone, address } = req.body;

        // Kiểm tra trùng lặp username hoặc email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }

        // Tạo user mới
        const newUser = new User({ username, password, fullName, email, phone, address });
        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
