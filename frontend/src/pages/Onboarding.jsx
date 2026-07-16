import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ShieldCheck, Megaphone, Search, Calendar, ArrowRight } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user: clerkUser, isLoaded } = useUser();
  const { setDbUser } = useAuth();

  const [form, setForm] = useState({ role: "player", age: "", gender: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const email = clerkUser.primaryEmailAddress.emailAddress;
      const name = clerkUser.fullName || "User";

      const res = await api.post("/auth/sync", {
        email,
        name,
        role: form.role,
        age: form.age,
        gender: form.gender
      });

      setDbUser(res.data.user);

      const r = res.data.user.role;
      if (r === "coach") navigate("/coach");
      else if (r === "admin") navigate("/admin");
      else if (r === "scout") navigate("/scout");
      else navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Failed to sync profile");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'player', icon: ShieldCheck, label: 'Player' },
    { id: 'coach', icon: Megaphone, label: 'Coach' },
    { id: 'scout', icon: Search, label: 'Scout' },
    { id: 'admin', icon: ShieldCheck, label: 'Admin' },
  ];

  if (!isLoaded) return <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0F19] text-slate-200 font-sans p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-[#0B0F19]/80 to-[#0B0F19] z-10" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[500px] relative z-20">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Complete Profile</h2>
            <p className="text-indigo-200/70 text-sm">Just a few more details to get you started, {clerkUser?.firstName || "there"}.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Age</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    name="age" type="number" min="5" max="100" value={form.age} onChange={handleChange} required
                    placeholder="25"
                    className="w-full pl-10 pr-3 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                <select
                  name="gender" value={form.gender} onChange={handleChange} required
                  className="w-full px-3 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none"
                >
                  <option value="" className="bg-slate-900">Select</option>
                  <option value="male" className="bg-slate-900">Male</option>
                  <option value="female" className="bg-slate-900">Female</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">I am a...</label>
              <div className="grid grid-cols-4 gap-2">
                {roles.map((r) => {
                  const isSelected = form.role === r.id;
                  const Icon = r.icon;
                  return (
                    <label key={r.id} className="cursor-pointer">
                      <input type="radio" name="role" value={r.id} checked={isSelected} onChange={handleChange} className="hidden" />
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-200 ${isSelected
                          ? `border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(79,70,229,0.3)]`
                          : `border-white/5 bg-black/20 text-slate-400 hover:border-white/20 hover:bg-black/40`
                          }`}
                      >
                        <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{r.label}</span>
                      </motion.div>
                    </label>
                  );
                })}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold tracking-wide mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? "Saving..." : <>Enter Platform <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
            {error && <div className="text-red-400 text-xs text-center mt-2">{error}</div>}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
