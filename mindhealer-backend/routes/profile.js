const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this exists
const User = require('../models/User');

const router = express.Router();

// Get User Profile
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update Profile
router.put('/update', authMiddleware, async (req, res) => {
    try {
        const { bio, avatar, age, location } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { profile: { bio, avatar, age, location } },
            { new: true }
        ).select('-password');

        res.json({ message: 'Profile updated successfully!', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
