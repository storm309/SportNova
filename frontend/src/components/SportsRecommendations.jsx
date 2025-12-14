import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, Trophy, Dumbbell, Zap, Activity, Brain, 
  Utensils, ChevronRight, Loader2, AlertCircle, RefreshCw 
} from "lucide-react";
import api from "../api/api";

const SportsRecommendations = ({ userRole = "player" }) => {
  const [activeTab, setActiveTab] = useState("Cricket");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadedCount, setLoadedCount] = useState(5);

  const sports = [
    "Cricket", "Football", "Basketball", "Tennis", 
    "Badminton", "Hockey", "Volleyball", "Swimming"
  ];

  // Updated colors for Dark Mode
  const categoryColors = {
    Technique: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Fitness: "bg-green-500/10 text-green-400 border-green-500/20",
    Mental: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Strategy: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Nutrition: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  const categoryIcons = {
    Technique: <Activity className="w-4 h-4" />,
    Fitness: <Dumbbell className="w-4 h-4" />,
    Mental: <Brain className="w-4 h-4" />,
    Strategy: <Target className="w-4 h-4" />,
    Nutrition: <Utensils className="w-4 h-4" />,
  };

  const roleInfo = {
    player: {
      title: "AI-Powered Training Recommendations",
      subtitle: "Personalized training tips to enhance your performance",
      icon: <Zap className="w-6 h-6 text-purple-500" />
    },
    coach: {
      title: "AI Coaching Strategies",
      subtitle: "Expert coaching techniques and team management tips",
      icon: <Trophy className="w-6 h-6 text-yellow-500" />
    },
    scout: {
      title: "AI Scouting Insights",
      subtitle: "Talent identification and player evaluation strategies",
      icon: <Target className="w-6 h-6 text-green-500" />
    },
    admin: {
      title: "AI Management Recommendations",
      subtitle: "Strategic insights for program administration",
      icon: <Activity className="w-6 h-6 text-blue-500" />
    }
  };

  const currentRoleInfo = roleInfo[userRole] || roleInfo.player;

  const fetchRecommendations = async (sport, count = 5) => {
    setLoading(true);
    setError("");
    
    try {
      const res = await api.post("/recommendations/generate", {
        sport,
        count
      });
      
      if (res.data.recommendations) {
        setRecommendations(res.data.recommendations);
        setLoadedCount(count);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err.response?.data?.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (sport) => {
    if (activeTab === sport && recommendations.length > 0) return; // Don't refetch if already active and loaded
    setActiveTab(sport);
    setLoadedCount(5);
    setRecommendations([]); // Clear previous to show loading state specifically for new tab
    fetchRecommendations(sport, 5);
  };

  const handleLoadMore = () => {
    const newCount = loadedCount + 5;
    setLoadedCount(newCount);
    fetchRecommendations(activeTab, newCount);
  };

  return (
    <div className="w-full text-white">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-black uppercase flex items-center gap-2 mb-1">
          {currentRoleInfo.icon}
          {currentRoleInfo.title}
        </h2>
        <p className="text-sm text-slate-400">
          {currentRoleInfo.subtitle}
        </p>
      </div>

      {/* Sports Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sports.map((sport) => (
          <button
            key={sport}
            onClick={() => handleTabClick(sport)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              activeTab === sport
                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-6 min-h-[200px]">
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Error Generating Content</p>
              <p className="text-xs opacity-80">{error}</p>
              {error.includes("API key") && (
                <p className="text-xs mt-1 font-mono bg-black/30 p-1 rounded">
                  Check backend .env file
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && recommendations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-10 h-10 mb-3 animate-spin text-purple-500" />
            <p className="text-sm font-medium animate-pulse">Consulting AI Coach...</p>
          </div>
        )}

        {/* Initial State (No data yet) */}
        {!loading && recommendations.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Trophy className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">Select a sport above to generate insights</p>
            <button 
              onClick={() => handleTabClick(activeTab)}
              className="mt-4 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold rounded-lg border border-purple-500/30 transition-colors"
            >
              Generate for {activeTab}
            </button>
          </div>
        )}

        {/* Recommendations List */}
        <AnimatePresence mode="wait">
          {recommendations.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-4"
            >
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-900 border border-slate-800 p-4 rounded-xl hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs text-slate-400 font-mono">
                        {index + 1}
                      </span>
                      {rec.title}
                    </h3>
                    
                    {rec.category && (
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        categoryColors[rec.category] || "bg-slate-800 text-slate-400 border-slate-700"
                      }`}>
                        {categoryIcons[rec.category] || <Activity className="w-3 h-3" />}
                        {rec.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed pl-8">
                    {rec.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button */}
        {!loading && recommendations.length > 0 && (
          <div className="mt-6 text-center border-t border-slate-800 pt-6">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="group flex items-center justify-center gap-2 mx-auto px-6 py-2.5 bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white rounded-lg font-bold text-sm transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              )}
              Load More Insights
            </button>
            <p className="text-xs text-slate-600 mt-2">
              Showing {recommendations.length} insights for {activeTab}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SportsRecommendations;