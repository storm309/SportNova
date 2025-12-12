// backend/server.js

require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const coachRoutes = require("./routes/coachRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: "GET,POST,PUT,PATCH,DELETE",
  credentials: true
}));

// Serve uploaded video files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/auth", authRoutes);
app.use("/performance", performanceRoutes);
app.use("/coach", coachRoutes);
app.use("/admin", adminRoutes);





// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
