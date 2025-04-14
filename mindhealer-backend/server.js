require('dotenv').config();
const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const http = require('http');

// Import Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const chatbotRoutes = require('./routes/chatbot'); 
const dashboardRoutes = require('./routes/dashboard');
const forumRoutes = require('./routes/forum');

const app = express();

// Create HTTP server for socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"],
    },
});

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
app.use('/api/forum', forumRoutes);

// ✅ Default Route
app.get('/', (req, res) => {
    res.json({ message: '🚀 MindHealer Backend is running!' });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Track online users
const onlineUsers = new Set();

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('🔗 New client connected:', socket.id);

    // Generate anonymous user ID
    const userId = `user${Math.floor(Math.random() * 10000)}`;
    socket.userId = userId;
    onlineUsers.add(userId);
    
    // Broadcast updated user count to all clients
    io.emit('userCount', onlineUsers.size);
    console.log(`👤 User count: ${onlineUsers.size}`);

    // Join a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`👤 ${userId} joined room: ${room}`);
        io.to(room).emit('userJoined', { userId, room });
    });

    // Handle messages
    socket.on('message', ({ room, message }) => {
        console.log(`📩 Message from ${userId} in ${room}: ${message}`);
        io.to(room).emit('message', { userId, message });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
        onlineUsers.delete(userId);
        io.emit('userCount', onlineUsers.size);
        console.log(`👤 User count: ${onlineUsers.size}`);
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
