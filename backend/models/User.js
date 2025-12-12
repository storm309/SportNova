const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["player", "coach", "admin", "scout"], default: "player" },
    // Additional fields for athlete profile
    age: { type: Number },
    gender: { type: String },
    sport: { type: String },
    height: { type: Number },
    weight: { type: Number },
    position: { type: String },
    achievements: { type: String },
    contactDetails: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
