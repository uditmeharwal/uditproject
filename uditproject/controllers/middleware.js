// controllers/middleware.js

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// Middleware function to validate JWT token and check user role
const auth = (requiredRole) => async (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);

        // Get user and check role
        const user = await User.findById(decoded.user.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        if (user.role !== requiredRole) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Store user details in request object
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = auth;
