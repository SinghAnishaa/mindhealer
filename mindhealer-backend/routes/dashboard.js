// routes/dashboard.js
const express = require('express');
const router = express.Router();
const UserMood = require('../models/UserMood');
const authenticate = require('../middleware/authMiddleware'); // Your JWT auth middleware
const normalizeMood = (emoji) => {
    switch (emoji) {
      case '😊': return 'happy';
      case 'neutral': return 'neutral';
      case '😢': return 'sad';
      case '😠': return 'angry';
      case '😴': return 'tired';
      default: return emoji;
    }
};

const moodToScore = {
  'happy': 5,
  'neutral': 3,
  'sad': 2,
  'angry': 1,
  'tired': 0
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
      // Get all entries for the user, sorted by date
      const allEntries = await UserMood.find({ userId: req.user._id }).sort({ createdAt: -1 });
      
      // Get recent entries (last 5) for the recent entries section
      const recentEntries = allEntries.slice(0, 5);
      
      // Calculate start date from the oldest entry
      const startDate = allEntries.length > 0 ? allEntries[allEntries.length - 1].createdAt : new Date();
      
      // Calculate average mood
      let averageMood = "N/A";
      let moodDescription = "";
      if (allEntries.length > 0) {
        const totalScore = allEntries.reduce((sum, entry) => sum + moodToScore[entry.mood], 0);
        const averageScore = totalScore / allEntries.length;
        
        // Convert score back to mood emoji with description
        if (averageScore >= 4.5) {
          averageMood = "😊";
          moodDescription = "Very Happy";
        }
        else if (averageScore >= 3) {
          averageMood = "😐";
          moodDescription = "Neutral";
        }
        else if (averageScore >= 2) {
          averageMood = "😢";
          moodDescription = "Sad";
        }
        else if (averageScore >= 1) {
          averageMood = "😠";
          moodDescription = "Angry";
        }
        else {
          averageMood = "😴";
          moodDescription = "Tired";
        }
      }
      
      // Calculate first entry date and days since start
      const firstEntry = allEntries.length > 0 ? allEntries[allEntries.length - 1].createdAt : new Date();
      const daysSinceStart = Math.floor((new Date() - new Date(firstEntry)) / (1000 * 60 * 60 * 24));
      
      // Calculate mood trends
      let moodTrend = "No entries yet";
      if (allEntries.length > 0) {
        const recentMoods = allEntries.slice(0, 7); // Last week's moods
        const avgScore = recentMoods.reduce((sum, entry) => sum + moodToScore[entry.mood], 0) / recentMoods.length;
        
        if (avgScore >= 4.5) moodTrend = "Consistently Happy";
        else if (avgScore >= 3.5) moodTrend = "Generally Positive";
        else if (avgScore >= 2.5) moodTrend = "Mostly Neutral";
        else if (avgScore >= 1.5) moodTrend = "Somewhat Low";
        else moodTrend = "Needs Attention";
      }

      // Get total number of entries
      const totalEntries = allEntries.length;

      const formattedStartDate = startDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      let averageMoodExplanation = "Since Start";
      if (allEntries.length >= 7) {
        averageMoodExplanation = "Weekly Average";
      } else if (allEntries.length >= 365) {
        averageMoodExplanation = "Yearly Average";
      }

      res.json({
        recentMoods: recentEntries,
        allMoods: allEntries,        // Send all entries for the chart
        chartData: allEntries.map(entry => ({
          date: entry.createdAt.toISOString().split('T')[0],
          mood: entry.mood,
          score: moodToScore[entry.mood]
        })),
        startDate: formattedStartDate,
        averageMood: `${averageMood} (${moodDescription})`,  // Combine emoji and description
        averageMoodExplanation,
        firstEntryDate: firstEntry,
        daysSinceStart,
        moodTrend,
        totalEntries
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch snapshot.' });
    }
  });
  
  module.exports = router;
