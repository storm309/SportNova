
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Performance = require("../models/Performance");
const auth = require("../middleware/authMiddleware");
const { asyncHandler } = require("../utils/errorHandler");
const { validateObjectId } = require("../utils/validators");
const fallbackStore = require("../utils/fallbackStore");

function requireAdmin(req, res) {
  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Admin access only" });
    return false;
  }
  return true;
}

router.get("/users", auth, asyncHandler(async (req, res) => {
  if (!requireAdmin(req, res)) return;

  const { page = 1, limit = 20, role } = req.query;
  const skip = (page - 1) * limit;
  const query = {};
  if (role) query.role = role;

  let users = [];
  let total = 0;

  try {
    users = await User.find(query)
      .select("-password")
      .limit(Number(limit))
      .skip(skip);

    total = await User.countDocuments(query);
  } catch (error) {
    users = fallbackStore.listUsers(query).slice(skip, skip + Number(limit));
    total = fallbackStore.listUsers(query).length;
  }

  res.json({
    data: users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

router.patch("/users/:id/role", auth, asyncHandler(async (req, res) => {
  if (!requireAdmin(req, res)) return;

  if (!validateObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const { role } = req.body;
  const allowed = ["player", "coach", "admin", "scout"];

  if (!allowed.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  let user;
  try {
    user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: "-password" }
    );
  } catch (error) {
    user = fallbackStore.updateUserRole(req.params.id, role);
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
}));

router.delete("/users/:id", auth, asyncHandler(async (req, res) => {
  if (!requireAdmin(req, res)) return;

  if (!validateObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  let user;
  try {
    user = await User.findByIdAndDelete(req.params.id);
    await Performance.deleteMany({ userId: req.params.id });
  } catch (error) {
    user = fallbackStore.deleteUserById(req.params.id);
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User & performances deleted" });
}));

router.delete("/performance/:id", auth, asyncHandler(async (req, res) => {
  if (!requireAdmin(req, res)) return;

  if (!validateObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid performance ID" });
  }

  let performance;
  try {
    performance = await Performance.findByIdAndDelete(req.params.id);
  } catch (error) {
    performance = fallbackStore.deletePerformanceById(req.params.id);
  }

  if (!performance) {
    return res.status(404).json({ message: "Performance not found" });
  }

  res.json({ message: "Performance deleted" });
}));

module.exports = router;
