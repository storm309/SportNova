const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/authMiddleware");
const { asyncHandler } = require("../utils/errorHandler");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* --------------------------------------
   GET RECOMMENDATIONS OR ANSWERS
-------------------------------------- */
router.post("/generate", authMiddleware, asyncHandler(async (req, res) => {
  // Frontend se 'type' bhi accept karein (search vs training)
  const { sport, count = 5, type = "training" } = req.body;
  const userRole = req.user.role; 

  if (!sport || sport.trim().length < 2) {
    return res.status(400).json({ message: "Valid input is required" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      message: "Gemini API key not configured." 
    });
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash", // Ya "gemini-2.0-flash-exp"
    generationConfig: { responseMimeType: "application/json" }
  });

  // --- LOGIC TO DECIDE PROMPT TYPE ---
  
  const isSearchMode = type === "search" || sport.split(" ").length > 3;

  let prompt;

  if (isSearchMode) {

    prompt = `
      You are an expert sports AI consultant. The user (${userRole}) has asked this specific question or topic: "${sport}".
      
      Provide a direct, conversational, and highly accurate answer. 
      Do NOT generate random drills unless specifically asked. 
      
      Split your answer into logical parts (paragraphs or key points).
      You MUST return a JSON array with this structure:
      [
        {
          "title": "A short heading for this part of the answer",
          "description": "The detailed content/answer text.",
          "category": "Insight" 
        }
      ]
      
      Keep the "category" as "Insight", "Fact", or "History" based on the content.
    `;
  } else {
    // --- MODE 2: TRAINING DRILLS (OLD LOGIC) ---
    
    const recommendationCount = Math.min(Math.max(1, Number(count)), 10);
    
    const rolePrompts = {
      player: `Generate ${recommendationCount} actionable training recommendations for ${sport} players. Focus on skills, fitness, and technique.`,
      coach: `Generate ${recommendationCount} coaching strategies for ${sport} coaches. Focus on team management and drills.`,
      scout: `Generate ${recommendationCount} scouting tips for ${sport}. Focus on talent identification.`,
      admin: `Generate ${recommendationCount} management tips for ${sport} programs.`
    };

    const basePrompt = rolePrompts[userRole] || rolePrompts.player;

    prompt = `
      ${basePrompt}
      You must return a JSON array of objects with this structure:
      [
        {
          "title": "Brief title",
          "description": "Detailed description",
          "category": "Technique, Fitness, Mental, Strategy, or Nutrition"
        }
      ]
      Ensure recommendations are unique.
    `;
  }

  // Generate content
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON
    let recommendations;
    recommendations = JSON.parse(text);

    res.json({
      sport,
      recommendations,
      count: recommendations.length,
      role: userRole,
      mode: isSearchMode ? "search" : "training" 
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ 
      message: "AI Service Error",
      error: error.message 
    });
  }
}));

module.exports = router;