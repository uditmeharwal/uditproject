// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../controllers/middleware');

// Register user (public access)
router.post('/register', authController.register);

// Login user (public access)
router.post('/login', authController.login);

//verify user
router.get('/verify', authController.VerifyUser);

// Logout user (typically handled client-side)
router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear token cookie or handle client-side logout
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
