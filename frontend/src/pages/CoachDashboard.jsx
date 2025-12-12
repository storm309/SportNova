import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, Activity, Trophy, Search, LogOut, PlayCircle,
  FileVideo, Zap, Dumbbell, Heart, Swords, TrendingUp,
  ChevronRight
} from "lucide-react";
import api from "../api/api";

// --- CHART COMPONENT ---
const PerformanceChart = ({ data }) => (
  <div className="h-48 flex items-end justify-between px-4 pb-4 gap-2 relative">
    <div className="absolute inset-0 border-b border-l border-white/10 opacity-30"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    />

    {data.length === 0 ? (
      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold uppercase">
        Select player to load metrics
      </div>
    ) : (
      data.map((p, i) => (
        <div key={i} className="relative w-full flex items-end group">
          <div
            className="w-full bg-blue-600 rounded-sm hover:bg-blue-400 transition-all"
            style={{ height: `${p.speed}%` }}
          />
          <div
            className="absolute bottom-0 w-full bg-orange-500/70 rounded-sm"
            style={{ height: `${p.stamina}%` }}
          />
        </div>
      ))
    )}
  </div>
);

export default function CoachDashboard() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [performance, setPerformance] = useState([]);

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [msg, setMsg] = useState("");

  // Comparison
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [compareData, setCompareData] = useState(null);

  useEffect(() => { loadPlayers(); }, []);

  const loadPlayers = async () => {
    try {
      const res = await api.get("/coach/players");
      setPlayers(res.data);
      setFilteredPlayers(res.data);
    } catch (err) {
      console.log(err);
      setMsg("Failed to load players.");
    }
  };

  const loadPerformance = async (playerId) => {
    try {
      setSelectedPlayer(playerId);
      const res = await api.get(`/coach/player/${playerId}/performance`);
      setPerformance(res.data);
    } catch (err) {
      console.log(err);
      setMsg("Could not load performance.");
    }
  };

  const comparePlayers = async () => {
    if (!p1 || !p2 || p1 === p2) return;

    try {
      const res = await api.get(`/coach/compare?p1=${p1}&p2=${p2}`);
      setCompareData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Search filter
  useEffect(() => {
    setFilteredPlayers(
      players.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, players]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center bg-slate-900 p-5 rounded border border-white/10 mb-6"
      >
        <h1 className="text-2xl font-black uppercase tracking-wider">
          Tactical <span className="text-blue-500">Command</span>
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="px-5 py-2 border border-red-500 text-red-400 hover:bg-red-600 hover:text-white transition rounded"
        >
          <LogOut className="inline w-4 h-4 mr-2" /> Logout
        </motion.button>
      </motion.div>

      {/* GRID */}
      <div className="grid lg:grid-cols-12 gap-6">

        {/* LEFT: PLAYER LIST */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-3 bg-slate-900/80 p-4 rounded border border-white/10 h-[80vh] overflow-y-auto"
        >

          <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" /> Players
          </h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 mb-3 rounded bg-slate-800 border border-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredPlayers.map((p, index) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.03, x: 5 }}
              onClick={() => loadPerformance(p._id)}
              className={`p-3 rounded cursor-pointer border mb-2 hover:border-blue-500 
                ${selectedPlayer === p._id ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-800"}
              `}
            >
              <div className="font-bold">{p.name}</div>
              <div className="text-xs text-slate-400">{p.position || "Player"}</div>
            </motion.div>
          ))}

        </motion.div>

        {/* MIDDLE: PERFORMANCE FEED */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-5 bg-slate-900/80 p-4 rounded border border-white/10 h-[80vh] overflow-y-auto"
        >
          <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" /> Recent Performance
          </h2>

          {!selectedPlayer ? (
            <p className="text-slate-500 text-center mt-10">Select a player...</p>
          ) : performance.length === 0 ? (
            <p className="text-slate-500 text-center mt-10">No performance data.</p>
          ) : (
            performance.map((p, index) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded bg-slate-800 border border-slate-700 mb-3"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{p.sport}</h3>
                    <p className="text-xs text-slate-400">
                      {new Date(p.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Video buttons */}
                  <div className="flex gap-2">
                    {p.videoUrl && (
                      <a
                        href={p.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 border border-slate-600 rounded hover:border-blue-500"
                      >
                        <PlayCircle className="w-4 h-4" />
                      </a>
                    )}

                    {p.videoFile && (
                      <a
                        href={`http://localhost:5000${p.videoFile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 border border-slate-600 rounded hover:border-green-500"
                      >
                        <FileVideo className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <Stat icon={<Zap />} label="Speed" value={p.speed} />
                  <Stat icon={<Heart />} label="Stamina" value={p.stamina} />
                  <Stat icon={<Dumbbell />} label="Strength" value={p.strength} />
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* RIGHT: ANALYTICS */}
        <div className="lg:col-span-4 space-y-6">

          {/* Trend Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-900 p-4 rounded border border-white/10"
          >
            <h2 className="text-lg font-bold uppercase flex items-center gap-2 mb-4">
              <TrendingUp className="text-purple-400" /> Trend Analysis
            </h2>

            <div className="border border-slate-700 bg-slate-950 rounded">
              <PerformanceChart data={performance} />
            </div>
          </motion.div>

          {/* Comparison */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-slate-900 p-4 rounded border border-white/10"
          >
            <h2 className="text-lg font-bold uppercase flex items-center gap-2 mb-4">
              <Swords className="text-orange-400" /> Compare Players
            </h2>

            <select
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              className="w-full p-2 bg-slate-800 border border-slate-700 mb-3"
            >
              <option value="">Select Player 1</option>
              {players.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <select
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              className="w-full p-2 bg-slate-800 border border-slate-700 mb-3"
            >
              <option value="">Select Player 2</option>
              {players.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!p1 || !p2 || p1 === p2}
              onClick={comparePlayers}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 rounded text-white font-bold disabled:opacity-50"
            >
              Compare
            </motion.button>

            {/* Comparison Result */}
            {compareData && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 space-y-4"
              >
                {["speed", "stamina", "strength"].map((stat) => (
                  <ComparisonBar
                    key={stat}
                    label={stat.toUpperCase()}
                    p1={compareData.p1[stat]}
                    p2={compareData.p2[stat]}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---
const Stat = ({ icon, label, value }) => (
  <div className="bg-slate-900 p-2 rounded text-center border border-slate-700">
    <span className="text-xs text-slate-500">{label}</span>
    <div className="text-lg font-bold">{value}</div>
  </div>
);

const ComparisonBar = ({ label, p1, p2 }) => {
  const total = p1 + p2;
  const pct1 = ((p1 / total) * 100).toFixed(1);
  const pct2 = ((p2 / total) * 100).toFixed(1);

  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>Player 1</span>
        <span>{label}</span>
        <span>Player 2</span>
      </div>

      <div className="flex h-3 rounded overflow-hidden">
        <div className="bg-blue-500" style={{ width: `${pct1}%` }} />
        <div className="bg-orange-500" style={{ width: `${pct2}%` }} />
      </div>

      <div className="flex justify-between text-xs mt-1">
        <span>{p1}</span>
        <span>{p2}</span>
      </div>
    </div>
  );
};
