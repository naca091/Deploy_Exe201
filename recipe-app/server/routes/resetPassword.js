const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { User } = require('../models/models');

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dinhquoctien1980@gmail.com', // Replace with your email
        pass: 'psfe eump swij hnke' // Replace with your app password
    }
});

// Store verification codes temporarily (in production, use Redis or similar)
const verificationCodes = new Map();

// Generate random 6-digit code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request password reset
router.post('/reset-password-request', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate verification code
        const verificationCode = generateVerificationCode();
        
        // Store code with timestamp (expires in 10 minutes)
        verificationCodes.set(email, {
            code: verificationCode,
            timestamp: Date.now(),
            attempts: 0
        });

        // Send email
        const mailOptions = {
            from: 'dinhquoctien1980@gmail.com',
            to: email,
            subject: 'Password Reset Verification Code',
            text: `Your verification code is: ${verificationCode}\nThis code will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Verification code sent successfully'
        });

    } catch (error) {
        console.error('Reset password request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process reset password request'
        });
    }
});

// Verify code and reset password
router.post('/verify-reset-code', async (req, res) => {
    try {
        const { email, verificationCode, newPassword } = req.body;

        // Get stored verification data
        const storedData = verificationCodes.get(email);
        
        if (!storedData) {
            return res.status(400).json({
                success: false,
                message: 'No verification code found or code expired'
            });
        }

        // Check if code is expired (10 minutes)
        if (Date.now() - storedData.timestamp > 600000) {
            verificationCodes.delete(email);
            return res.status(400).json({
                success: false,
                message: 'Verification code expired'
            });
        }

        // Verify code
        if (storedData.code !== verificationCode) {
            storedData.attempts += 1;
            
            // Max 3 attempts
            if (storedData.attempts >= 3) {
                verificationCodes.delete(email);
                return res.status(400).json({
                    success: false,
                    message: 'Too many failed attempts. Please request a new code.'
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
        }

        // Update password
        const user = await User.findOne({ email });
        user.password = newPassword;
        await user.save();

        // Clear verification code
        verificationCodes.delete(email);

        res.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Verify reset code error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password'
        });
    }
});

module.exports = router;