// models/UserMood.js
const mongoose = require('mongoose');

const UserMoodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: {
    type: String,
    enum: ['happy', 'neutral', 'sad', 'angry', 'tired'], // ✅ Only word-based values
    required: true
  },
  journal: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserMood', UserMoodSchema);
