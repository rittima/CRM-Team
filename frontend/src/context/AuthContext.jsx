// // import { createContext, useContext, useState, useEffect } from 'react';
// // import employees from '../data';

// // const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [employeeData, setEmployeeData] = useState([]);

// //   useEffect(() => {
// //     const token = localStorage.getItem('user');
// //     // console.log("Stored token:", token);
// //     if (token) {
// //       setUser(JSON.parse(token));
// //     }
    
    
// //   }, []);

// //   const login = async (email, password) => {
// //     // For demo: all users have password 'password123'
// //     const employee = employees.find(emp => emp.email === email);
// //     if (!employee || password !== 'pass123') {
// //       throw new Error('Invalid credentials');
// //     }
// //     setUser(employee);
// //     localStorage.setItem('user', JSON.stringify(employee));
// //   };

// //   const logout = () => {
// //     localStorage.removeItem('user');
// //     setUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, login, logout, employeeData }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export const useAuth = () => useContext(AuthContext);




// // frontend/src/context/AuthContext.jsx
// import React, { createContext, useContext, useEffect, useState } from "react";
// import api from "../services/axios"
// import { useLocationTracker } from "../hooks/useLocationTracker";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [bootLoading, setBootLoading] = useState(true);
  
//   // Initialize location tracking for authenticated users
//   const locationTracker = useLocationTracker(user);

//   useEffect(() => {
//     const load = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) { setBootLoading(false); return; }
//       try {
//         const res = await api.get("/auth/me");
//         setUser(res.data);
        
//         // Check if user is currently checked in and start location tracking
//         await checkAttendanceAndStartTracking(res.data._id);
//       } catch (e) {
//         localStorage.removeItem("token");
//         setUser(null);
//       } finally {
//         setBootLoading(false);
//       }
//     };
//     load();
//   }, []);

//   // Check attendance status and start location tracking if checked in
//   const checkAttendanceAndStartTracking = async (userId) => {
//     try {
//       const today = new Date().toISOString().split('T')[0];
//       const response = await api.get(`/attendance/status/${userId}/${today}`);
      
//       if (response.data.hasCheckedIn && !response.data.hasCheckedOut) {
//         // User is currently checked in, start location tracking
//         locationTracker.startTracking();
//       }
//     } catch (error) {
//       // Don't fail if attendance check fails
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const res = await api.post("/auth/login", { email, password });
//       const { token, ...userData } = res.data;
//       localStorage.setItem("token", token);
//       setUser(userData);
//       return { success: true, role: userData.role };
//     } catch (err) {
//       return { success: false, message: err.response?.data?.message || "Login failed" };
//     }
//   };

//   const register = async (payload) => {
//     try {
//       const res = await api.post("/auth/register", payload);
//       const { token, ...userData } = res.data;
//       localStorage.setItem("token", token);
//       setUser(userData);
//       return { success: true };
//     } catch (err) {
//       return { success: false, message: err.response?.data?.message || "Register failed" };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       login, 
//       register, 
//       logout, 
//       bootLoading,
//       locationTracker // Expose location tracking functionality
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);



// frontend/src/context/AuthContext.jsx
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
      if (!token) { setBootLoading(false); return; }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        
        // Check if user is currently checked in and start location tracking
        await checkAttendanceAndStartTracking(res.data._id);
      } catch (e) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setBootLoading(false);
      }
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
