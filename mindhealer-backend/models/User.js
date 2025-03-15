const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        bio: { type: String, default: "" },
        avatar: { type: String, default: "" }, // URL to profile picture
        age: { type: Number, default: null },
        location: { type: String, default: "" }
    }
});

module.exports = mongoose.model('User', UserSchema);
