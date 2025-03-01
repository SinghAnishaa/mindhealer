const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this model is correctly imported
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware
require('dotenv').config();

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error('❌ Signup Error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send token and user info as response
        res.status(200).json({
            message: 'Login successful!',
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// **Protected Route**
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Welcome, ${req.user.id}! You have access to this protected route.` });
});

module.exports = router;
