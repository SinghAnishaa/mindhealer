const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();

// Ensure `uploads` directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });


// ✅ **Signup Route**
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            username,
            email,
            password: hashedPassword,
            profileImage: "",
            bio: "",
            age: null,
            location: ""
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error('❌ Signup Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ✅ **Login Route**
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful!',
            token,
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
        console.error('❌ Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ✅ **Get User Details (Protected)**
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); 
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("❌ Fetch User Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ **Upload Profile Image (Protected)**
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
        console.error("❌ Profile Image Upload Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ **Update User Profile (Protected)**
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
        console.error("❌ Profile Update Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ **Protected Route Example**
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Welcome, ${req.user.id}! You have access to this protected route.` });
});

module.exports = router;
