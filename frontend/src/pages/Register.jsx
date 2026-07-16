import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Lock, Mail, ArrowRight, AlertCircle,
  CheckCircle2, Eye, EyeOff, ShieldCheck, Megaphone, Search, Calendar
} from "lucide-react";
import { useSignUp } from "@clerk/clerk-react";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "player", age: "", gender: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();

  const handleGoogleSignUp = () => {
    if (!isSignUpLoaded) return;
    signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      if (res.data.token) {
        setMsg("Registration successful! Redirecting...");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setTimeout(() => { navigate("/login"); }, 1500);
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'player', icon: ShieldCheck, label: 'Player', color: 'bg-blue-500' },
    { id: 'coach', icon: Megaphone, label: 'Coach', color: 'bg-orange-500' },
    { id: 'scout', icon: Search, label: 'Scout', color: 'bg-green-500' },
    { id: 'admin', icon: ShieldCheck, label: 'Admin', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0F19] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white relative p-4">
      {/* Full Page Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-[#0B0F19]/80 to-[#0B0F19] z-10" />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[120px] z-10"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[120px] z-10"
        />
      </div>

      {/* Main Registration Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[550px] relative z-20"
      >
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 sm:px-8 sm:py-6 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Subtle top border glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
              <p className="text-indigo-200/70 text-sm font-medium mt-0.5">Join SportNova today.</p>
            </div>
            <Link to="/" className="group flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <img src="/logo.png" alt="Logo" className="h-6 w-auto drop-shadow-md" />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Grid for Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    name="name" type="text" required value={form.name} onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    name="email" type="email" required value={form.email} onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Grid for Password, Age, Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    name="password" type={showPassword ? "text" : "password"} required value={form.password} onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium shadow-inner"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Age</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    name="age" type="number" min="5" max="100" value={form.age} onChange={handleChange}
                    placeholder="25"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium shadow-inner"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                <select
                  name="gender" value={form.gender} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium shadow-inner appearance-none"
                >
                  <option value="" className="bg-slate-900">Select</option>
                  <option value="male" className="bg-slate-900">Male</option>
                  <option value="female" className="bg-slate-900">Female</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">I am a...</label>
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
                        className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all duration-200 ${isSelected
                          ? `border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(79,70,229,0.3)]`
                          : `border-white/5 bg-black/20 text-slate-400 hover:border-white/20 hover:bg-black/40`
                          }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
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
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:opacity-70 disabled:hover:scale-100 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? "Creating Profile..." : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          {/* Feedback Messages */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
            </motion.div>
          )}
          {msg && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" /><span>{msg}</span>
            </motion.div>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700/50"></div></div>
            <div className="relative flex justify-center text-xs"><span className="bg-slate-900 px-3 py-1 rounded-full text-slate-400 border border-slate-700/50">Or</span></div>
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={!isSignUpLoaded}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-white hover:bg-gray-100 text-slate-900 py-3 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-md flex items-center justify-center gap-3 disabled:opacity-70"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
            Sign up with Google
          </motion.button>

        </div>
        
        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-slate-300 text-[13px] font-medium drop-shadow-md">
            Already have an account? <Link to="/login" className="text-white hover:text-indigo-300 font-bold ml-1 transition-colors underline decoration-indigo-500 underline-offset-4">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}