import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        shopping <span>Mart</span>
      </NavLink>
      <div className="navbar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          🏠 Home
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          📦 Products
        </NavLink>
        <NavLink to="/products/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          ➕ Add Product
        </NavLink>
      </div>
      <div className="nav-user">
        <div className="nav-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
