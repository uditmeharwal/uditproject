const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// Register a new user
const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };

        jwt.sign(payload, config.jwtSecret, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token: token, user: payload.user });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };

        jwt.sign(payload, config.jwtSecret, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token: token, user: payload.user });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Verify a user
const VerifyUser = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);

        // If token is valid, send success response with decoded payload including name and email
        const { id, name, email, role } = decoded.user;
        res.status(200).json({ id, name, email, role });
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Get all users with pagination
const getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Default limit of 10 users per page

    try {
        const count = await User.countDocuments();
        const users = await User.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            totalUsers: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            users: users,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

const AddUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };


        res.json({ user: payload.user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Update user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role  } = req.body;

    try {
        let user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne(); // Use deleteOne to remove the user

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};





module.exports = {
    register,
    login,
    VerifyUser,
    getAllUsers,
    updateUser,
    deleteUser,
    AddUser
};
