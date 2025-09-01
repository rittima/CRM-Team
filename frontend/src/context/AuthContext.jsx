import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/axios";
import { useLocationTracker } from "../hooks/useLocationTracker";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bootLoading, setBootLoading] = useState(true);
  
  // Initialize location tracking for authenticated users
  const locationTracker = useLocationTracker(user);

    useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setUser(null) || setUser(undefined);

        setBootLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        // console.log("User data loaded:", res.data.userId);

        await checkAttendanceAndStartTracking(res.data._id);
      } catch (e) {
        localStorage.removeItem("token");
        setUser(null);
      }

      setBootLoading(false);
    };

    load();
  }, []);

  // Check attendance status and start location tracking if checked in
  const checkAttendanceAndStartTracking = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get(`/attendance/status/${userId}/${today}`);
      
      if (response.data.hasCheckedIn && !response.data.hasCheckedOut) {
        // User is currently checked in, start location tracking
        locationTracker.startTracking();
      }
    } catch (error) {
      // Don't fail if attendance check fails
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true, role: userData.role };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };


  const register = async (payload) => {
    try {
      const res = await api.post("/auth/register", payload);
      const { token, ...userData } = res.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Register failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      bootLoading,
      locationTracker // Expose location tracking functionality
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);