const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/authMiddleware");
const { asyncHandler } = require("../utils/errorHandler");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* --------------------------------------
   GET RECOMMENDATIONS BY SPORT
-------------------------------------- */
router.post("/generate", authMiddleware, asyncHandler(async (req, res) => {
  const { sport, count = 5 } = req.body;
  const userRole = req.user.role; // Get role from authenticated user

  if (!sport || sport.trim().length < 2) {
    return res.status(400).json({ message: "Valid sport type is required" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      message: "Gemini API key not configured. Please add GEMINI_API_KEY to .env file" 
    });
  }

  // Validate count
  const recommendationCount = Math.min(Math.max(1, Number(count)), 10); // Between 1-10

  // Get the generative model
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp",
    generationConfig: { responseMimeType: "application/json" }
  });

  // Create role-specific prompts
  const rolePrompts = {
    player: `Generate ${recommendationCount} specific and actionable training recommendations for ${sport} players to improve their performance. 
    Focus on skill development, technique improvement, fitness training, and personal development.`,
    
    coach: `Generate ${recommendationCount} professional coaching strategies and training methods for ${sport} coaches. 
    Focus on team management, training session planning, player development techniques, and coaching best practices.`,
    
    scout: `Generate ${recommendationCount} strategic scouting insights and talent identification tips for ${sport} scouts. 
    Focus on player evaluation criteria, talent spotting techniques, performance analysis, and recruitment strategies.`,
    
    admin: `Generate ${recommendationCount} strategic management and operational recommendations for ${sport} program administrators. 
    Focus on program development, resource management, policy implementation, and organizational excellence.`
  };

  const basePrompt = rolePrompts[userRole] || rolePrompts.player;

  // Create the prompt
  const prompt = `${basePrompt}
  Each recommendation should be practical, specific to ${sport}, and relevant to a ${userRole}'s needs.
  
  You must return a JSON array of objects with this structure:
  [
    {
      "title": "Brief title",
      "description": "Detailed description",
      "category": "Technique, Fitness, Mental, Strategy, or Nutrition"
    }
  ]
  
  Ensure each recommendation is unique and actionable.`;

  // Generate content
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Parse the JSON response
  let recommendations;
  try {
    recommendations = JSON.parse(text);
  } catch (parseError) {
    console.error("Failed to parse Gemini response:", text);
    // Fallback regex in case JSON mode slips
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      recommendations = JSON.parse(jsonMatch[0]);
    } else {
      return res.status(500).json({ 
        message: "Failed to parse recommendations",
        rawResponse: text
      });
    }
  }

  res.json({
    sport,
    recommendations,
    count: recommendations.length,
    role: userRole
  });
}));

module.exports = router;