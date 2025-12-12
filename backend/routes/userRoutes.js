const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// ✔ GET ALL PLAYERS (Coach can view players)
router.get("/players", auth, async (req, res) => {
  try {
    const players = await User.find({ role: "player" }).select("-password");
    res.json(players);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error loading players" });
  }
});

module.exports = router;
