// making critical chatbot fixes

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();

// Helper Function to Generate Auth Token
const generateAuthToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" }); // Short-lived token
};

// Ensure `uploads` directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${req.user?.id || 'unknown'}-${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// **Signup Route**
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            username,
            email,
            password: await bcrypt.hash(password, 10),
            profile: {
                bio: "",
                avatar: "",
                age: null,
                location: ""
            }
        });

        await user.save();

        // Generate JWT token
        const authToken = generateAuthToken(user);

        res.status(201).json({
            message: 'Signup successful!',
            authToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile
            }
        });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// **Login Route**
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT authToken
        const authToken = generateAuthToken(user);

        console.log(" Sending Auth Token:", authToken); // Debugging Line

        res.status(200).json({
            message: 'Login successful!',
            authToken: authToken || "",  // Ensure this is being sent
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                bio: user.bio,
                age: user.age,
                location: user.location
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// **Logout Route**
router.post('/logout', async (req, res) => {
    try {
        res.json({ message: "Logout successful!" });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// **Get User Details (Protected)**
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// **Upload Profile Image (Protected)**
router.post('/upload-profile-image', authMiddleware, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No image uploaded." });

        const profileImage = `/uploads/${req.file.filename}`;
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.profileImage = profileImage;
        await user.save();

        res.json({ message: "Profile image uploaded successfully!", imageUrl: profileImage });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// **Update User Profile (Protected)**
router.put('/update-profile', authMiddleware, upload.single('profileImage'), async (req, res) => {
    try {
        const { bio, age, location } = req.body;
        const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (bio !== undefined) user.bio = bio;
        if (age !== undefined) user.age = parseInt(age);
        if (location !== undefined) user.location = location;
        if (profileImage) user.profileImage = profileImage;

        await user.save();
        res.json({ message: "Profile updated successfully!", user });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// **Protected Route Example**
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Welcome, ${req.user.id}! You have access to this protected route.` });
});

module.exports = router;
