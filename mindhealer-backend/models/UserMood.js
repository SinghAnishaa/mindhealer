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

// Add a static method to fetch the first entry for a user
UserMoodSchema.statics.getFirstEntryForUser = async function (userId) {
  return this.findOne({ userId }).sort({ createdAt: 1 }).exec();
};

module.exports = mongoose.model('UserMood', UserMoodSchema);
