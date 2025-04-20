// File: src/components/Navbar.jsx
import React from 'react';
import './navbar.css'; // You'll need to create this CSS file
import { Typography } from '@mui/material';

const Navbar = () => {
  return (
    <nav className="navbar">
    <div className="navbar-container">
      <a href="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
        <Typography variant="h3" component="span" sx={{ fontWeight: 'bold', color: 'inherit' }}>
          PlanFit
        </Typography>
      </a>
        
        <div className="navbar-content">
          <a href="/dashboard" className="dashboard-button">
            Dashboard
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;