const express = require("express");
const fetch = require("node-fetch");
const Chat = require("../models/Chat");
const authMiddleware = require("../middleware/authMiddleware");
require("dotenv").config();

const router = express.Router();

const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Rate limiting to prevent spam (5 requests per minute)
const userRequestCounts = new Map();
const RATE_LIMIT = 5; // Max 5 requests per user per minute
const TIME_WINDOW = 60 * 1000; // 1 minute

// Helper function: Retry Hugging Face API calls with Exponential Backoff
const fetchWithRetry = async (message, retries = 3, delay = 2000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch(HF_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: `User: ${message}\nAI:`, // Add backticks
                    parameters: { max_new_tokens: 50 }
                })
            });

            const text = await response.text(); // Read response as text first
            try {
                const data = JSON.parse(text); // Safely parse JSON
                if (response.ok && !data.error) return data;
                
                if (data.error && data.error_type === "overloaded") {
                    console.warn(`⚠️ Model overloaded. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                } else {
                    console.error("Hugging Face API Error:", data.error);
                    return { error: "Hugging Face API Error", details: data.error };
                }
            } catch (jsonError) {
                console.error("Invalid JSON response from Hugging Face API:", text);
                return { error: "Invalid JSON response", details: text };
            }
        } catch (error) {
            console.error("API request failed:", error);
            return { error: "Network error", details: error.message };
        }
    }
    return { error: "Hugging Face API is overloaded or unavailable. Try again later." };
};

// Chat Route: Handle user messages & call Hugging Face API
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

        // Call Hugging Face API with retry
        console.log("🚀 Sending request to Hugging Face API...");
        const hfResponse = await fetchWithRetry(message);

        if (hfResponse.error) {
            return res.status(500).json({ error: hfResponse.error, details: hfResponse.details });
        }

        // Extract chatbot response safely
        const botReply = hfResponse[0]?.generated_text?.split("AI:")?.pop()?.trim() || "I'm not sure how to respond.";

        // Store chatbot response in DB
        chat.messages.push({ role: "assistant", content: botReply });
        await chat.save();

        // Return response
        res.json({ response: botReply });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
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
