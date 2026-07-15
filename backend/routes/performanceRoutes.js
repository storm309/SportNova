
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/authMiddleware");
const Performance = require("../models/Performance");
const { validatePerformance } = require("../utils/validators");
const { asyncHandler } = require("../utils/errorHandler");
const fallbackStore = require("../utils/fallbackStore");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `video_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) cb(null, true);
  else cb(new Error("Only video files allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.post(
  "/add",
  auth,
  upload.single("videoFile"),
  asyncHandler(async (req, res) => {
    const { sport, speed, stamina, strength, videoUrl } = req.body;
    const validation = validatePerformance(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    let perf;
    try {
      perf = new Performance({
        userId: req.user.id,
        sport: sport.trim(),
        speed: Number(speed),
        stamina: Number(stamina),
        strength: Number(strength),
        videoUrl: videoUrl || "",
        videoFile: req.file ? `/uploads/${req.file.filename}` : "",
      });

      await perf.save();
    } catch (error) {
      perf = fallbackStore.createPerformanceRecord({
        userId: req.user.id,
        sport: sport.trim(),
        speed: Number(speed),
        stamina: Number(stamina),
        strength: Number(strength),
        videoUrl: videoUrl || "",
        videoFile: req.file ? `/uploads/${req.file.filename}` : "",
      });
    }

    res.status(201).json({ message: "Performance saved", performance: perf });
  })
);

router.get("/my", auth, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  let data = [];
  let total = 0;

  try {
    data = await Performance.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    total = await Performance.countDocuments({ userId: req.user.id });
  } catch (error) {
    const fallbackResult = fallbackStore.listPerformancesByUser(req.user.id, { page, limit });
    data = fallbackResult.data;
    total = fallbackResult.total;
  }

  res.json({
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

router.get("/all", auth, asyncHandler(async (req, res) => {
  if (req.user.role !== "coach" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { page = 1, limit = 20, sport } = req.query;
  const skip = (page - 1) * limit;
  const query = {};
  if (sport) query.sport = sport;

  let data = [];
  let total = 0;

  try {
    data = await Performance.find(query)
      .populate("userId", "name email sport")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    total = await Performance.countDocuments(query);
  } catch (error) {
    const fallbackResult = fallbackStore.listPerformances(query, { page, limit });
    data = fallbackResult.data.map((item) => ({
      ...item,
      userId: item.userId ? { _id: item.userId, name: "Fallback User", email: "", sport: item.sport } : null,
    }));
    total = fallbackResult.total;
  }

  res.json({
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

module.exports = router;
