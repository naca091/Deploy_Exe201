// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');
const JWT_SECRET = "bdf24ce3abeb1bb3b456256171f4c3eeacb6786dc2de7ba43d256a0ddb7d52be";

const auth = async (req, res, next) => {
    try {
        // Get token from header and validate format
        const authHeader = req.headers.authorization || req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Handle different authorization header formats
        let token;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else {
            token = authHeader;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Token missing.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Get user from database
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User no longer exists.'
                });
            }

            // Attach user and token to request
            req.user = user;
            req.token = token;
            next();
            
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired.'
                });
            }
            throw error;
        }

    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

module.exports = auth;