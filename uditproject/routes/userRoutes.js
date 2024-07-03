// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Get all users (admin access)
router.get('/users', authController.getAllUsers);

// Get all users (admin access)
router.post('/user', authController.AddUser);

// Update user (admin access)
router.put('/user/:id', authController.updateUser);

// Delete user (admin access)
router.delete('/user/:id', authController.deleteUser);

module.exports = router;
