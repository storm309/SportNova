
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./utils/errorHandler");
const { requestLogger, logEvent } = require("./utils/logger");
const { authRateLimiter, apiRateLimiter } = require("./middleware/rateLimiter");
const authRoutes = require("./routes/authRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const coachRoutes = require("./routes/coachRoutes");
const adminRoutes = require("./routes/adminRoutes");
const recommendationsRoutes = require("./routes/recommendationsRoutes");
connectDB();
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: "GET,POST,PUT,PATCH,DELETE",
  credentials: true
}));
app.use(requestLogger);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRateLimiter, authRoutes);
app.use("/performance", apiRateLimiter, performanceRoutes);
app.use("/coach", apiRateLimiter, coachRoutes);
app.use("/admin", apiRateLimiter, adminRoutes);
app.use("/recommendations", apiRateLimiter, recommendationsRoutes);
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Route not found" 
  });
});
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health\n`);
  logEvent("SERVER_START", { port: PORT });
});
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
