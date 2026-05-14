import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth-shared.css";
import axios from "axios";
import API_BASE_URL from "../../config";

const UserLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/user/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log("✅ Login response:", response.data);

      // 🟢 Save token in localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("🔐 Token saved:", response.data.token);
      } else {
        console.warn("⚠️ No token found in response!");
      }

      // ✅ Redirect after login
      navigate("/feed");
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-title">Welcome back</div>
      <div className="form-subtle">Sign in to continue to your account</div>

      <div className="switch-row">
        <span className="switch-label">Switch:</span>
        <Link to="/user/login" className="link-user">User</Link>
        <span style={{ margin: "0 0.4rem", color: "var(--color-muted)" }}></span>
        <Link to="/food-partner/login" className="link-partner">Food Partner</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            name="email"
            className="form-input"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            name="password"
            className="form-input"
            type="password"
            placeholder="Your password"
            required
          />
        </div>

        <button className="form-btn" type="submit">Login</button>

        <a className="helper-link" href="#">Forgot password?</a>

        <div className="link-row">
          <Link to="/user/register" className="helper-link link-user">
            Register as User
          </Link>
          <span style={{ color: "var(--color-muted)" }}> </span>
          <Link to="/food-partner/register" className="helper-link link-partner">
            Register as Partner
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
