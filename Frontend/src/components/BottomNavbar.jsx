import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/reels.css';

const BottomNavbar = () => {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/feed" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </NavLink>

      <NavLink 
        to="/saved" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <span>Saved</span>
      </NavLink>
    </nav>
  );
};

export default BottomNavbar;
