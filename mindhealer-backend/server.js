require('dotenv').config();
const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const chatbotRoutes = require('./routes/chatbot'); 
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// ✅ Logging Middleware for Debugging
app.use((req, res, next) => {
    console.log(`🔹 Incoming Request: ${req.method} ${req.url}`);
    next();
});

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Serve Static Files (For Uploaded Images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Failed:', err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chatbot', chatbotRoutes); 
app.use('/api/dashboard', dashboardRoutes);

// ✅ Default Route
app.get('/', (req, res) => {
    res.json({ message: '🚀 MindHealer Backend is running!' });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
