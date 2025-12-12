import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, Shield, Trash2, LogOut, Search, LayoutDashboard, 
  UserCog, Trophy, ChevronDown, AlertCircle, Ban 
} from "lucide-react";

// --- REAL API ---
import api from "../api/api";


export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // 🚨 redirect if not admin
  const validateAdmin = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.user.role !== "admin") {
        navigate("/dashboard");
      }

    } catch (err) {
      navigate("/login");
    }
  };

  // Load all users
  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(res.data);
    } catch (err) {
      console.log(err);
      setMsg("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateAdmin();
    loadUsers();
  }, []);

  // Change User Role
  const changeRole = async (id, role) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.patch(
        `/admin/users/${id}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.map(u => u._id === id ? res.data : u));
      setMsg(`User role updated to ${role.toUpperCase()}`);

      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      console.log(err);
      setMsg("Error updating role");
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(users.filter(u => u._id !== id));
      setMsg("User deleted");

      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      console.log(err);
      setMsg("Error deleting user");
    }
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Filter Users
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'border-purple-500 text-purple-400 bg-purple-500/10';
      case 'coach': return 'border-blue-500 text-blue-400 bg-blue-500/10';
      default: return 'border-emerald-500 text-emerald-400 bg-emerald-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-10">
      
      {/* HEADER */}
      <div className="relative z-10 max-w-[1400px] mx-auto p-4 space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900/80 p-6 rounded-sm border-b border-white/10"
        >
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl font-black italic uppercase">
                System <span className="text-blue-500">Administration</span>
              </h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Global Command Interface</p>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout} 
            className="border border-red-500/30 text-red-400 px-6 py-2 rounded-sm skew-x-[-10deg] hover:bg-red-500 hover:text-white"
          >
            <span className="skew-x-[10deg] flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Secure Logout
            </span>
          </motion.button>
        </motion.div>

        {/* FEEDBACK MESSAGE */}
        {msg && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-blue-500/10 border-l-4 border-blue-500 text-blue-400 text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" /> {msg}
          </motion.div>
        )}

        {/* USER TABLE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-900/80 rounded-sm border border-white/5 overflow-hidden shadow-xl"
        >

          {/* Toolbar */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-black uppercase flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" /> User Database
            </h2>

            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="SEARCH..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-sm text-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800">
                  <th className="p-5">Identity</th>
                  <th className="p-5">Role</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, index) => (
                    <motion.tr 
                      key={u._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                      className="border-b border-slate-800"
                    >
                      {/* NAME */}
                      <td className="p-5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="p-5">
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u._id, e.target.value)}
                          className={`pl-3 pr-8 py-1.5 rounded-sm text-xs font-bold uppercase border ${getRoleColor(u.role)}`}
                        >
                          <option value="player">Player</option>
                          <option value="coach">Coach</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* STATUS */}
                      <td className="p-5">
                        <span className="text-green-400 text-xs font-bold uppercase">
                          Active
                        </span>
                      </td>

                      {/* DELETE */}
                      <td className="p-5 text-right">
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
