import { createContext, useContext, useState, useEffect } from 'react';
import employees from '../data';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('user');
    // console.log("Stored token:", token);
    if (token) {
      setUser(JSON.parse(token));
    }
    
    
  }, []);

  const login = async (email, password) => {
    // For demo: all users have password 'password123'
    const employee = employees.find(emp => emp.email === email);
    if (!employee || password !== 'pass123') {
      throw new Error('Invalid credentials');
    }
    setUser(employee);
    localStorage.setItem('user', JSON.stringify(employee));
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, employeeData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
