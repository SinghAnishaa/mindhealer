// routes/dashboard.js
const express = require('express');
const router = express.Router();
const UserMood = require('../models/UserMood');
const authenticate = require('../middleware/authMiddleware'); // Your JWT auth middleware
const normalizeMood = (emoji) => {
    switch (emoji) {
      case '😊': return 'happy';
      case '😐': return 'neutral';
      case '😢': return 'sad';
      case '😠': return 'angry';
      case '😴': return 'tired';
      default: return emoji;
    }
};

// POST: Save mood & journal
router.post('/mood', authenticate, async (req, res) => {
    try {
      const { mood, journal } = req.body;
  
      // ✅ Validate mood presence
      if (!mood || typeof mood !== 'string' || mood.trim() === '') {
        return res.status(400).json({ error: 'Mood is required and must be a non-empty string.' });
      }
  
      // ✅ Normalize mood (emoji → keyword)
      const normalizedMood = normalizeMood(mood);
  
      const entry = new UserMood({
        userId: req.user._id,
        mood: normalizedMood,
        journal: journal || '' // Optional, default to empty string
      });
  
      await entry.save();
      res.status(201).json(entry);
    } catch (error) {
      console.error('❌ Error saving mood:', error.message);
      res.status(500).json({ error: 'Failed to save mood entry.' });
    }
  });
  
// GET: Fetch dashboard snapshot
router.get('/snapshot', authenticate, async (req, res) => {
    try {
      const recentEntries = await UserMood.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5);
  
      // Example prompts
      const prompts = [
        "What are three things you're grateful for today?",
        "Describe a moment today that made you smile.",
        "What do you need most right now?"
      ];
  
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  
      res.json({
        recentMoods: recentEntries,
        journalPrompt: randomPrompt
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch snapshot.' });
    }
  });
  
  module.exports = router;
  