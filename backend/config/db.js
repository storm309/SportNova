const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("⚠️ MONGO_URI not set. Running without database connection for now.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("⚠️ MongoDB Connection Error:", error.message);
    console.warn("Continuing without database connection. API routes will use fallback behavior where needed.");
  }
};

module.exports = connectDB;
