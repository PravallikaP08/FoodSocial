import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth-shared.css';

const ChooseRegister = () => (
  <div className="form-container" style={{ textAlign: 'center' }}>
    <div className="form-title">Join the Community</div>
    <p className="form-subtle">Select your role to get started with the ultimate food experience</p>
    
    <div style={{
      display: 'grid', 
      gap: '1.25rem', 
      marginTop: '2rem',
      gridTemplateColumns: '1fr'
    }}>
      <Link to="/user/register" className="form-btn" style={{ 
        background: 'linear-gradient(135deg, var(--accent-primary) 0%, #4338ca 100%)',
        textDecoration: 'none'
      }}>
        <span>Register as User</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
        <div style={{ height: '1px', flex: 1, background: 'var(--glass-border)' }}></div>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: 600 }}>OR</span>
        <div style={{ height: '1px', flex: 1, background: 'var(--glass-border)' }}></div>
      </div>

      <Link to="/food-partner/register" className="form-btn" style={{ 
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--glass-border)',
        textDecoration: 'none',
        boxShadow: 'none'
      }}>
        <span>Register as Food Partner</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </Link>
    </div>

    <div className="link-row small" style={{ marginTop: '2.5rem', opacity: 0.8 }}>
      <span>Already have an account? </span>
      <Link to="/user/login" className="helper-link link-user" style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>Sign in</Link>
    </div>
  </div>
);

export default ChooseRegister;
