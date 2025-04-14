const io = require('socket.io-client');

// Connect to the WebSocket server
const socket = io('http://localhost:5050');

// Log connection success
socket.on('connect', () => {
    console.log('✅ Connected to WebSocket server');

    // Join a room (e.g., Anxiety)
    const room = 'Anxiety';
    socket.emit('joinRoom', room);
    console.log(`🚪 Joined room: ${room}`);

    // Send a test message
    const testMessage = 'Hello, this is a test message!';
    socket.emit('message', { room, message: testMessage });
    console.log(`📩 Sent message: ${testMessage}`);
});

// Listen for messages from the server
socket.on('message', ({ userId, message }) => {
    console.log(`💬 Message from ${userId}: ${message}`);
});

// Listen for userJoined events
socket.on('userJoined', ({ userId, room }) => {
    console.log(`👤 ${userId} joined room: ${room}`);
});

// Handle disconnection
socket.on('disconnect', () => {
    console.log('❌ Disconnected from WebSocket server');
});