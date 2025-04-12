const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getChatResponse } = require("../utils/gemini");
const Chat = require("../models/Chat");
require("dotenv").config();

// Rate limiting to prevent spam (5 requests per minute)
const userRequestCounts = new Map();
const RATE_LIMIT = 5; // Max 5 requests per user per minute
const TIME_WINDOW = 60 * 1000; // 1 minute

// Chat Route: Handle user messages & call Gemini API
router.post("/chat", authMiddleware, async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user?._id;

        if (!message) return res.status(400).json({ error: "Message is required" });
        if (!userId) {
            console.error("Missing userId:", req.user);
            return res.status(401).json({ error: "Unauthorized: userId is missing" });
        }

        // Implement Rate Limiting
        const now = Date.now();
        const requestHistory = userRequestCounts.get(userId) || [];
        const recentRequests = requestHistory.filter(ts => now - ts < TIME_WINDOW);
        
        if (recentRequests.length >= RATE_LIMIT) {
            return res.status(429).json({ error: "Rate limit exceeded. Please wait before sending more messages." });
        }

        userRequestCounts.set(userId, [...recentRequests, now]);

        // Fetch or create chat history
        let chat = await Chat.findOne({ userId });
        if (!chat) chat = new Chat({ userId, messages: [] });

        // Save user message
        chat.messages.push({ role: "user", content: message });

        // Call Gemini API
        console.log("🚀 Sending request to Gemini API...");
        const response = await getChatResponse(message);

        if (response.error) {
            return res.status(500).json(response);
        }

        // Store chatbot response in DB
        chat.messages.push({ role: "assistant", content: response.response });
        await chat.save();

        // Return response
        res.json(response);

    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// Retrieve Chat History for a User
router.get("/history", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: Missing user ID" });
        }

        const chat = await Chat.findOne({ userId });
        if (!chat) return res.status(404).json({ message: "No chat history found." });

        res.json({ messages: chat.messages });
    } catch (error) {
        console.error("❌ Error fetching chat history:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

module.exports = router;



