import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, Search, LogOut, Eye, Filter, Star, TrendingUp,
  MapPin, Trophy, Activity, ChevronRight, Mail
} from "lucide-react";
import api from "../api/api";

export default function ScoutDashboard() {
  const navigate = useNavigate();

  const [athletes, setAthletes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [athletePerformance, setAthletePerformance] = useState([]);

  useEffect(() => {
    const loadAthletes = async () => {
      try {
        const res = await api.get("/coach/players"); // Scouts can use same endpoint as coaches
        setAthletes(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    loadAthletes();
  }, []);

  const loadAthletePerformance = async (athleteId) => {
    try {
      setSelectedAthlete(athleteId);
      const res = await api.get(`/coach/player/${athleteId}/performance`);
      setAthletePerformance(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Filter athletes - using useMemo for better performance
  const filteredAthletes = useMemo(() => {
    return athletes.filter((a) => {
      const matchesSearch = !searchTerm || a.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSport = !sportFilter || a.sport?.toLowerCase() === sportFilter.toLowerCase();
      return matchesSearch && matchesSport;
    });
  }, [searchTerm, sportFilter, athletes]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center bg-slate-900 p-5 rounded-lg border border-white/10 mb-6"
      >
        <h1 className="text-2xl font-black uppercase tracking-wider">
          Talent <span className="text-green-500">Scout</span> Hub
        </h1>

        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 border border-red-500 text-red-400 hover:bg-red-600 hover:text-white transition rounded flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Logout
        </motion.button>
      </motion.div>

      {/* GRID */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* LEFT: SEARCH & FILTERS */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-3 bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-white/10 h-[80vh] overflow-y-auto"
        >
          <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-green-400" /> Search Athletes
          </h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full p-2 mb-3 rounded bg-slate-800 border border-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Sport Filter */}
          <select
            className="w-full p-2 mb-4 rounded bg-slate-800 border border-slate-700"
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
          >
            <option value="">All Sports</option>
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
            <option value="cricket">Cricket</option>
            <option value="athletics">Athletics</option>
            <option value="swimming">Swimming</option>
          </select>

          {/* Athletes List */}
          <div className="space-y-2">
            {filteredAthletes.map((athlete, index) => (
              <motion.div
                key={athlete._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => loadAthletePerformance(athlete._id)}
                className={`p-3 rounded-lg cursor-pointer border hover:border-green-500 transition-all ${
                  selectedAthlete === athlete._id
                    ? "border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    : "border-slate-700 bg-slate-800 hover:bg-slate-750"
                }`}
              >
                <div className="font-bold flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-green-400" />
                  {athlete.name}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {athlete.sport || "Not specified"} • Age: {athlete.age || "N/A"}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* MIDDLE: ATHLETE PROFILE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-6 bg-slate-900/80 backdrop-blur-sm p-6 rounded-lg border border-white/10 h-[80vh] overflow-y-auto"
        >
          {!selectedAthlete ? (
            <div className="h-full flex items-center justify-center text-slate-500">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select an athlete to view details</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-green-400" /> Athlete Profile
              </h2>

              {/* Performance Records */}
              {athletePerformance.length === 0 ? (
                <p className="text-slate-500 text-center mt-10">
                  No performance data available.
                </p>
              ) : (
                <div className="space-y-4">
                  {athletePerformance.map((perf, index) => (
                    <motion.div
                      key={perf._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)" }}
                      className="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{perf.sport}</h3>
                          <p className="text-xs text-slate-400">
                            {new Date(perf.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-green-400">
                            {Math.round((perf.speed + perf.stamina + perf.strength) / 3)}
                          </div>
                          <div className="text-xs text-slate-500">AVG SCORE</div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="bg-slate-900 p-3 rounded text-center">
                          <div className="text-blue-400 font-bold text-xl">
                            {perf.speed}
                          </div>
                          <div className="text-xs text-slate-500">Speed</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded text-center">
                          <div className="text-orange-400 font-bold text-xl">
                            {perf.stamina}
                          </div>
                          <div className="text-xs text-slate-500">Stamina</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded text-center">
                          <div className="text-purple-400 font-bold text-xl">
                            {perf.strength}
                          </div>
                          <div className="text-xs text-slate-500">Strength</div>
                        </div>
                      </div>

                      {/* Videos */}
                      {(perf.videoUrl || perf.videoFile) && (
                        <div className="flex gap-2 mt-2">
                          {perf.videoUrl && (
                            <a
                              href={perf.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs"
                            >
                              View Video
                            </a>
                          )}
                          {perf.videoFile && (
                            <a
                              href={`http://localhost:5000${perf.videoFile}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs"
                            >
                              Uploaded Video
                            </a>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* RIGHT: STATS & ACTIONS */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-3 space-y-4"
        >
          {/* Quick Stats */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:border-green-500/30 transition-all"
          >
            <h3 className="text-sm font-bold uppercase mb-3 text-slate-400">
              Quick Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Athletes</span>
                <span className="font-bold text-green-400">{athletes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Filtered Results</span>
                <span className="font-bold">{filteredAthletes.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Shortlist */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:border-yellow-500/30 transition-all"
          >
            <h3 className="text-sm font-bold uppercase mb-3 text-slate-400 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" /> Shortlist
            </h3>
            <p className="text-xs text-slate-500">
              Feature coming soon - Save your favorite athletes for quick access.
            </p>
          </motion.div>

          {/* Actions */}
          {selectedAthlete && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-white/10"
            >
              <h3 className="text-sm font-bold uppercase mb-3 text-slate-400">
                Actions
              </h3>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mb-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-500/30"
              >
                <Mail className="w-4 h-4" />
                Contact Athlete
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Star className="w-4 h-4" />
                Add to Shortlist
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
