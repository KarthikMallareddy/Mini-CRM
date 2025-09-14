import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Mini CRM</h1>
      </div>
      
      {isAuthenticated && (
        <div className="navbar-nav">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/reports" 
            className={`nav-link ${isActive('/reports') ? 'nav-link-active' : ''}`}
          >
            Reports
          </Link>
        </div>
      )}

      {isAuthenticated && (
        <button onClick={handleLogout} className="btn btn-danger btn-sm">
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
