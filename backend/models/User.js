const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    clerkId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String }, // Optional for Clerk users
    role: { type: String, enum: ["player", "coach", "admin", "scout"] },
    age: { type: Number, min: 5, max: 100 },
    gender: { type: String, enum: ["male", "female", "other"] },
    sport: { type: String },
    height: { type: Number },
    weight: { type: Number },
    position: { type: String },
    achievements: { type: String },
    contactDetails: { type: String },
    createdAt: { type: Date, default: Date.now }
});
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
module.exports = mongoose.model("User", userSchema);
