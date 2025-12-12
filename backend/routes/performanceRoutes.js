// backend/routes/performanceRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const auth = require("../middleware/authMiddleware");
const Performance = require("../models/Performance");

// ---------- Multer config ----------
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

const upload = multer({ storage, fileFilter });

// ---------- 1) Add performance ----------
router.post(
  "/add",
  auth,
  upload.single("videoFile"),
  async (req, res) => {
    try {
      const { sport, speed, stamina, strength, videoUrl } = req.body;

      const perf = new Performance({
        userId: req.user.id,
        sport,
        speed,
        stamina,
        strength,
        videoUrl: videoUrl || "",
        videoFile: req.file ? `/uploads/${req.file.filename}` : "",
      });

      await perf.save();
      res.json({ message: "Performance saved", performance: perf });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error saving performance" });
    }
  }
);

// ---------- 2) Player: Get My Performance ----------
router.get("/my", auth, async (req, res) => {
  try {
    const data = await Performance.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- 3) Coach/Admin: Get All Performance ----------
router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.role !== "coach" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const data = await Performance.find().sort({ createdAt: -1 });
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
