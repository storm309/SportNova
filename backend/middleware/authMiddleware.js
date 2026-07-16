const jwt = require("jsonwebtoken");
const { verifyToken } = require("@clerk/clerk-sdk-node");
const User = require("../models/User");
const fallbackStore = require("../utils/fallbackStore");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = header.split(" ")[1];

    let isClerk = false;
    let decoded;

    try {
      // Try verifying as a custom local JWT first
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Not a valid local JWT, try Clerk
      try {
        decoded = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
        isClerk = true;
      } catch (clerkErr) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
    }

    if (isClerk) {
      const clerkId = decoded.sub; // clerk user id
      let user;
      
      try {
        const mongoose = require("mongoose");
        if (mongoose.connection.readyState !== 1) {
          throw new Error("MongoDB disconnected"); // instantly trigger fallback
        }
        user = await User.findOne({ clerkId });
      } catch (dbErr) {
        // Fallback for when MongoDB is disconnected and Mongoose times out
        const allUsers = fallbackStore.listUsers();
        user = allUsers.find(u => u.clerkId === clerkId);
      }

      if (!user) {
        req.user = { clerkId, role: "unassigned" };
      } else {
        req.user = { id: user._id ? user._id.toString() : user.id, clerkId: user.clerkId, role: user.role };
      }
    } else {
      // Custom JWT
      req.user = decoded;
    }

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(500).json({ message: "Server error during authentication" });
  }
};