// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Performance = require("../models/Performance");
const auth = require("../middleware/authMiddleware");

function requireAdmin(req, res) {
  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Admin access only" });
    return false;
  }
  return true;
}

// 👤 Get all users
router.get("/users", auth, async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✏️ Change role
router.patch("/users/:id/role", auth, async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const { role } = req.body;
    const allowed = ["player", "coach", "admin"];
    if (!allowed.includes(role)) return res.status(400).json({ message: "Invalid role" });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: "-password" }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ❌ Delete user
router.delete("/users/:id", auth, async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    await User.findByIdAndDelete(req.params.id);
    await Performance.deleteMany({ userId: req.params.id });
    res.json({ message: "User & performances deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ❌ Delete performance
router.delete("/performance/:id", auth, async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    await Performance.findByIdAndDelete(req.params.id);
    res.json({ message: "Performance deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
