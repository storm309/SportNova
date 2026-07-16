
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CoachDashboard from "./pages/CoachDashboard";
import AdminPanel from "./pages/AdminPanel";
import ScoutDashboard from "./pages/ScoutDashboard";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

function ProtectedRoute({ children, roles }) {
  const { user, token, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}
function PublicRoute({ children }) {
  const { token, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (token) {
    if (!user) return <Navigate to="/dashboard" replace />;
    switch (user.role) {
      case "coach": return <Navigate to="/coach" replace />;
      case "admin": return <Navigate to="/admin" replace />;
      case "scout": return <Navigate to="/scout" replace />;
      default: return <Navigate to="/dashboard" replace />;
    }
  }
  return children;
}
export default function App() {
  return (
    <Routes>
      {}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/sso-callback"
        element={<AuthenticateWithRedirectCallback />}
      />
      {}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["player"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/coach"
        element={
          <ProtectedRoute roles={["coach"]}>
            <CoachDashboard />
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/scout"
        element={
          <ProtectedRoute roles={["scout"]}>
            <ScoutDashboard />
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/unauthorized"
        element={
          <div className="text-center text-white p-20">
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="text-slate-400 mt-4">You do not have permission to access this page.</p>
          </div>
        }
      />
      {}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
