const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Performance = require("../models/Performance");

// 1️⃣ GET all players
router.get("/players", auth, async (req, res) => {
  if (req.user.role !== "coach" && req.user.role !== "admin" && req.user.role !== "scout")
    return res.status(403).json({ message: "Access denied" });

  const players = await User.find({ role: "player" }).select("-password");
  res.json(players);
});

// 2️⃣ GET player performance
router.get("/player/:id/performance", auth, async (req, res) => {
  const data = await Performance.find({ userId: req.params.id }).sort({ createdAt: -1 });
  res.json(data);
});

// 3️⃣ Compare two players
router.get("/compare", auth, async (req, res) => {
  const { p1, p2 } = req.query;

  const p1Data = await Performance.findOne({ userId: p1 }).sort({ createdAt: -1 });
  const p2Data = await Performance.findOne({ userId: p2 }).sort({ createdAt: -1 });

  res.json({
    p1: {
      speed: p1Data?.speed || 0,
      stamina: p1Data?.stamina || 0,
      strength: p1Data?.strength || 0
    },
    p2: {
      speed: p2Data?.speed || 0,
      stamina: p2Data?.stamina || 0,
      strength: p2Data?.strength || 0
    }
  });
});

module.exports = router;
