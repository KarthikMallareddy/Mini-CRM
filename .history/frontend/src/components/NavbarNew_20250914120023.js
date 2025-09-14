import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null; // Don't show navbar on auth pages
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          📊 Mini CRM
        </Link>

        <div className="navbar-nav">
          <Link 
            to="/dashboard" 
            className={`navbar-link ${isActive('/dashboard')}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/reports" 
            className={`navbar-link ${isActive('/reports')}`}
          >
            Reports
          </Link>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
