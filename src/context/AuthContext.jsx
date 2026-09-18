import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email, password) => {
    // Mock login
    if (email === 'admin@trendwheel.com' && password === 'admin') {
      const adminUser = { id: 1, name: 'Admin User', email, role: 'admin' };
      setUser(adminUser);
      return { success: true };
    }
    const customerUser = { id: 2, name: 'Test User', email, role: 'customer' };
    setUser(customerUser);
    return { success: true };
  };

  const register = (userData) => {
    const newUser = { id: Date.now(), ...userData, role: 'customer' };
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
