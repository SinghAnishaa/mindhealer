const express = require('express');
const router = express.Router();

// In-memory storage for posts (replace with database in the future)
const posts = {};

// Global posts storage
const globalPosts = [];

// Endpoint to fetch posts for a topic
router.get('/posts/:topic', (req, res) => {
    const { topic } = req.params;
    res.json(posts[topic] || []);
});

// Endpoint to add a new post
router.post('/posts/:topic', (req, res) => {
    const { topic } = req.params;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const post = {
        id: Date.now(),
        userId: `user${Math.floor(Math.random() * 10000)}`,
        message,
        timestamp: new Date().toISOString(),
    };

    if (!posts[topic]) {
        posts[topic] = [];
    }

    posts[topic].push(post);
    res.status(201).json(post);
});

// Endpoint to fetch global posts
router.get('/posts/global', (req, res) => {
    res.json(globalPosts);
});

// Endpoint to add a global post
router.post('/posts/global', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const post = {
        id: Date.now(),
        userId: `user${Math.floor(Math.random() * 10000)}`,
        message,
        timestamp: new Date().toISOString(),
    };

    globalPosts.push(post);
    res.status(201).json(post);
});

module.exports = router;