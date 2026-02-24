
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
function ProtectedRoute({ children, roles }) {
  const { user, token, loading } = useAuth();
  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}
function PublicRoute({ children }) {
  const { token } = useAuth();
  if (token) return <Navigate to="/" replace />;
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
