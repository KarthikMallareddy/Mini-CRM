import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

const AuthContext = createContext({
  isAuthenticated: false,
  token: null,
  login: (token) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Keep state in sync if token is changed elsewhere
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token') {
        setToken(localStorage.getItem('token'));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const value = useMemo(() => ({
    isAuthenticated: !!token,
    token,
    login,
    logout,
  }), [token]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
