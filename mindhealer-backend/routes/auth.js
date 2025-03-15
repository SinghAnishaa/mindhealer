const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();

// ✅ Helper Functions to Generate Tokens
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" }); // Short-lived
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" }); // Long-lived
};

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

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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

// ✅ **Login Route (with Refresh Token)**
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // ✅ Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // ✅ Store refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();

        // ✅ Set refresh token as HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,  // Set to true in production (HTTPS)
            sameSite: "Strict",
            path: "/api/auth/refresh-token"
        });

        res.status(200).json({
            message: 'Login successful!',
            accessToken,
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




// ✅ **Refresh Token Endpoint**
router.post('/refresh-token', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ error: "No refresh token provided" });

        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ error: "Invalid refresh token" });

        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ error: "Refresh token expired" });

            const newAccessToken = generateAccessToken(user);
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error("❌ Refresh Token Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});




// ✅ **Logout Route (Invalidate Refresh Token)**
router.post('/logout', async (req, res) => {
    try {
        const user = await User.findOne({ refreshToken: req.cookies.refreshToken });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.clearCookie("refreshToken", { path: "/api/auth/refresh-token" });
        res.json({ message: "Logout successful!" });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// ✅ **Get User Details (Protected)**
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
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
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ **Protected Route Example**
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Welcome, ${req.user.id}! You have access to this protected route.` });
});

module.exports = router;
