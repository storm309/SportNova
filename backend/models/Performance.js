// backend/models/Performance.js
const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sport: { type: String, required: true },
  speed: { type: Number, required: true },
  stamina: { type: Number, required: true },
  strength: { type: Number, required: true },

  // ✅ video support
  videoUrl: { type: String, default: "" },   // YouTube / external url
  videoFile: { type: String, default: "" },  // uploaded file path

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Performance", performanceSchema);
