require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import authentication routes
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' })); // Allow frontend communication
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Failed:', err));

// Routes
app.use('/api/auth', authRoutes);

// Default Route (for testing API status)
app.get('/', (req, res) => {
    res.json({ message: '🚀 MindHealer Backend is running!' });
});

// Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
