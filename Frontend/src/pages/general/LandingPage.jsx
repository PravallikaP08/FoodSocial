import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/landing.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <header className="landing-header">
          <h1 className="landing-logo">Food<span>Social</span></h1>
          <p className="landing-tagline">Discover. Share. Eat.</p>
        </header>

        <main className="landing-actions">
          <Link to="/login?role=user" className="landing-btn btn-user">
            Login as User
            <span className="btn-subtitle">Browse & Order</span>
          </Link>
          
          <Link to="/login?role=partner" className="landing-btn btn-partner">
            Login as Food Partner
            <span className="btn-subtitle">Manage your Store</span>
          </Link>

          <Link to="/signup" className="landing-signup-link">
            Don't have an account? <span>Create Account</span>
          </Link>
        </main>
      </div>
      
      <div className="landing-footer">
        <p>© 2026 FoodSocial. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LandingPage;
