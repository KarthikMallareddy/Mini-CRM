import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, CustomerDetail } from './components';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/customers/:id" 
          element={isAuthenticated ? <CustomerDetail /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/reports" 
          element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
