import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useSignIn } from "@clerk/clerk-react";
import api from "../api/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();

  const handleGoogleLogin = () => {
    if (!isSignInLoaded) return;
    signIn.authenticateWithRedirect({
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
      const res = await api.post("/auth/login", form);
      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMsg("Login successful! Redirecting...");
        setTimeout(() => {
          const role = res.data.user.role;
          if (role === "coach") {
            window.location.href = "/coach";
          } else if (role === "admin") {
            window.location.href = "/admin";
          } else if (role === "scout") {
            window.location.href = "/scout";
          } else {
            window.location.href = "/dashboard";
          }
        }, 800);
      } else {
        setError(res.data.message || "Login failed: No token from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0F19] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white relative p-4 sm:p-8">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-[#0B0F19]/80 to-[#0B0F19] z-10" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] z-10" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] z-10" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-[440px] relative z-20">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <div className="flex justify-center mb-8">
            <Link to="/" className="group flex flex-col items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-16 w-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
              <span className="text-xl font-black text-white tracking-tight uppercase">SportNova</span>
            </Link>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-indigo-200/70 font-medium">Access your athlete dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  name="email" type="email" required value={form.email} onChange={handleChange}
                  placeholder="coach@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                 <Link to="#" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  name="password" type={showPassword ? "text" : "password"} required value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium shadow-inner"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? "Authenticating..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700/50"></div></div>
            <div className="relative flex justify-center text-xs"><span className="bg-slate-900 px-3 py-1 rounded-full text-slate-400 border border-slate-700/50">Or</span></div>
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={!isSignInLoaded}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-white hover:bg-gray-100 text-slate-900 py-3.5 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-md flex items-center justify-center gap-3 disabled:opacity-70"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </motion.button>

        </div>
        
        <div className="text-center mt-6">
          <p className="text-slate-300 text-sm font-medium drop-shadow-md">
            Don't have an account? <Link to="/register" className="text-white hover:text-indigo-300 font-bold ml-1 transition-colors underline decoration-indigo-500 underline-offset-4">Create Profile</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
