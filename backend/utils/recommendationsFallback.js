const buildFallbackRecommendations = (sport, count = 5, role = "player", mode = "training") => {
  const safeSport = (sport || "training").toString().trim() || "training";
  const safeCount = Math.max(1, Math.min(Number(count) || 5, 10));
  const safeRole = (role || "player").toString().trim() || "player";

  if (mode === "search") {
    return [
      {
        title: `About ${safeSport}`,
        description: `A quick overview for ${safeSport} with practical guidance, technique focus, and recovery planning.`,
        category: "Insight",
      },
    ];
  }

  const templates = [
    {
      title: `${safeSport} fundamentals`,
      description: `Focus on posture, timing, and repetition so ${safeSport} athletes can build consistent form.`,
      category: "Technique",
    },
    {
      title: `${safeSport} conditioning`,
      description: `Add interval training and recovery periods to improve endurance and reduce fatigue in ${safeSport}.`,
      category: "Fitness",
    },
    {
      title: `${safeRole} game awareness`,
      description: `Improve match reading and decision-making with small-sided scenarios and video review.`,
      category: "Strategy",
    },
    {
      title: `${safeSport} recovery`,
      description: `Support recovery with mobility work, sleep habits, and hydration routines for better training quality.`,
      category: "Nutrition",
    },
    {
      title: `${safeSport} confidence`,
      description: `Use short goal-setting and reflection exercises to keep motivation high during training blocks.`,
      category: "Mental",
    },
  ];

  return templates.slice(0, safeCount).map((item) => ({ ...item }));
};

module.exports = {
  buildFallbackRecommendations,
};
