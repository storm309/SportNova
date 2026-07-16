import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { isLoaded: isClerkLoaded, userId: clerkUserId, signOut: clerkSignOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  
  const [localToken, setLocalToken] = useState(() => localStorage.getItem("token"));
  const [dbUser, setDbUser] = useState(null);
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      // If we have a local custom JWT from the manual login form
      if (localToken) {
        try {
          const res = await api.get("/auth/me");
          if (isMounted) setDbUser(res.data.user);
        } catch {
          if (isMounted) {
            setDbUser(null);
            setLocalToken(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } finally {
          if (isMounted) setSyncing(false);
        }
        return;
      }

      // If no local token, fallback to checking Clerk Google Auth
      if (!isClerkLoaded) return;
      
      if (clerkUserId && clerkUser) {
        try {
          const res = await api.get("/auth/me");
          if (isMounted) setDbUser(res.data.user);
        } catch {
          console.warn("User not synced in DB yet. Needs onboarding.");
          if (isMounted) setDbUser(null);
        }
      } else {
        if (isMounted) setDbUser(null);
      }
      
      if (isMounted) setSyncing(false);
    };

    fetchUser();

    return () => { isMounted = false; };
  }, [isClerkLoaded, clerkUserId, clerkUser, localToken]);

  // We are loading if we are still syncing, or if clerk isn't loaded and we don't have a local token.
  const loading = syncing || (!isClerkLoaded && !localToken);
  
  // Expose a unified token string for legacy protected routes
  const token = localToken || (clerkUserId ? "clerk-active" : null);
  
  const user = dbUser || null;

  const logout = () => {
    if (clerkUserId) clerkSignOut();
    setDbUser(null);
    setLocalToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, setDbUser, setToken: setLocalToken, logout, loading, clerkUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
