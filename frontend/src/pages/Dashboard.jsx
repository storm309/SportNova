import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Activity, LogOut, Zap, Heart, Dumbbell, Trophy, Upload, 
  Video, Plus, CheckCircle2, AlertCircle, Link as LinkIcon, 
  HelpCircle, BarChart3, ChevronRight 
} from "lucide-react";

// REAL API
const api = axios.create({
  baseURL: "http://localhost:5000",
});


// --------------------- CHART ---------------------
const PerformanceChart = ({ data }) => (
  <div className="relative h-full w-full flex items-end justify-between gap-3 px-4 pb-2 pt-8">
    <div className="absolute inset-0 z-0 flex flex-col justify-between px-4 pb-2 opacity-10 pointer-events-none">
      <div className="w-full h-px bg-white"></div>
      <div className="w-full h-px bg-white"></div>
      <div className="w-full h-px bg-white"></div>
      <div className="w-full h-px bg-white"></div>
    </div>

    {data.length === 0 ? (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 z-10">
        <BarChart3 className="w-10 h-10 mb-2 opacity-50" />
        <span className="uppercase tracking-widest text-xs font-bold">No Data Available</span>
      </div>
    ) : (
      data.map((d, i) => (
        <div key={i} className="group relative w-full h-full flex items-end justify-center z-10">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100">
            {d.sport}
          </div>

          <div className="w-full max-w-[30px] h-[80%] flex items-end gap-[2px]">
            <div className="w-1/2 bg-blue-600 rounded-sm" style={{ height: `${d.speed}%` }}></div>
            <div className="w-1/2 bg-orange-600 rounded-sm" style={{ height: `${d.strength}%` }}></div>
          </div>
        </div>
      ))
    )}
  </div>
);


// --------------------- DASHBOARD ---------------------

export default function Dashboard() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ sport: "", speed: "", stamina: "", strength: "", videoUrl: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    verifyLogin();
    loadData();
  }, []);

  // redirect if not logged in
  const verifyLogin = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  // Load user performances
  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/performance/my", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (videoFile) fd.append("videoFile", videoFile);

      const token = localStorage.getItem("token");

      const res = await api.post("/performance/add", fd, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setMsg("Performance recorded!");
      loadData();

      setForm({ sport: "", speed: "", stamina: "", strength: "", videoUrl: "" });
      setVideoFile(null);

      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.log(err);
      setMsg("Error saving performance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };


  // --------------------- UI ---------------------

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-12">

      {/* HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-6 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between bg-slate-900 p-6 rounded-sm"
        >
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="SportNova" className="h-10 opacity-90" />
            <h1 className="text-2xl font-black italic">Athlete <span className="text-blue-500">Hub</span></h1>
          </div>

          <div className="flex items-center gap-4">
            <a href="mailto:shivam@gmail.com" className="text-slate-400 hover:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Support
            </a>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout} 
              className="border border-red-500 text-red-400 px-6 py-2 rounded-sm"
            >
              <LogOut className="w-4 h-4" /> Exit
            </motion.button>
          </div>
        </motion.div>


        {/* GRID */}
        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT FORM */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="bg-slate-900 p-8 rounded-sm">

              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" /> New Record
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">

                <input 
                  name="sport" 
                  placeholder="Sport" 
                  value={form.sport}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-sm"
                />

                <div className="grid grid-cols-3 gap-3">
                  <input name="speed" placeholder="Speed" type="number" value={form.speed} onChange={handleChange} className="bg-slate-950 p-2 border border-slate-700 rounded-sm" />
                  <input name="stamina" placeholder="Stamina" type="number" value={form.stamina} onChange={handleChange} className="bg-slate-950 p-2 border border-slate-700 rounded-sm" />
                  <input name="strength" placeholder="Power" type="number" value={form.strength} onChange={handleChange} className="bg-slate-950 p-2 border border-slate-700 rounded-sm" />
                </div>

                <input name="videoUrl" placeholder="Video URL" value={form.videoUrl} onChange={handleChange} className="w-full p-3 bg-slate-950 border border-slate-700 rounded-sm" />

                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 py-3 rounded-sm mt-4"
                >
                  {isSubmitting ? "Saving..." : "Confirm Entry"}
                </motion.button>

                {msg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm mt-2 text-green-400"
                  >
                    {msg}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>


          {/* RIGHT CHART */}
          <div className="lg:col-span-8 space-y-6">

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-slate-900 p-6 rounded-sm h-[350px]"
            >
              <h2 className="text-lg font-black mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" /> Metrics Analysis
              </h2>

              <div className="bg-slate-950 border border-slate-800 rounded-sm h-full">
                <PerformanceChart data={list} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-900 p-6 rounded-sm"
            >
              <h2 className="text-lg font-black mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-400" /> Recent Logs
              </h2>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {list.map((p, index) => (
                  <motion.div 
                    key={p._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="bg-slate-950 border p-4 rounded-sm"
                  >
                    <h3 className="font-black">{p.sport}</h3>
                    <p className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleString()}</p>
                    <div className="flex gap-3 mt-2">
                      <span>Speed: {p.speed}</span>
                      <span>Stamina: {p.stamina}</span>
                      <span>Power: {p.strength}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}
