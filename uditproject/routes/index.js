const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoute = require('./userRoutes');

// Authentication routes
router.use('/api/user', authRoutes);
router.use('/api', userRoute)

module.exports = router;
