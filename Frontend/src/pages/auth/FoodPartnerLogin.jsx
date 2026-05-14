import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config";
import "../../styles/PartnerLogin.css";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/food-partner/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log("✅ Partner Login Successful:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("partnerInfo", JSON.stringify(response.data.foodPartner));
      navigate("/create-food");
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-login-page">
      <div className="login-card">
        <header className="login-header">
          <h1 className="login-title">Partner login</h1>
          <p className="login-subtitle">Access your dashboard and manage orders.</p>
        </header>

        {error && <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="login-input"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="login-input"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button className="signin-button" type="submit" disabled={loading}>
            {loading ? <div className="spinner-small"></div> : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <footer className="login-footer">
          New partner? <Link to="/food-partner/register" className="register-link">Create an account</Link>
        </footer>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
