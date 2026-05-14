import React from "react";
import { Link } from "react-router-dom";
import "../../styles/auth-shared.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import API_BASE_URL from "../../config";


const UserRegister = () => {
  const navigate=useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/user/register`, {
        fullName: firstName + " " + lastName,
        email,
        password
      },
      {
        withCredentials: true
      });
      
      console.log(response.data);
      alert("Registration successful! Redirecting to login...");
      navigate("/user/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="form-container">
    <div className="form-title">Create an account</div>
      <div className="form-subtle">Quick and simple signup for app users</div>
      <div className="switch-row">
        <span className="switch-label">Switch:</span>
        <Link to="/user/register" className="link-user">User</Link>
        <span style={{margin: '0 0.4rem', color: 'var(--color-muted)'}}></span>
        <Link to="/food-partner/register" className="link-partner">Food partner</Link>
      </div>
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label label-upper">First name</label>
          <input name="firstName" className="form-input" type="text" placeholder="Jane" autoComplete="given-name" />
        </div>
        <div className="form-group">
          <label className="form-label label-upper">Last name</label>
          <input name="lastName" className="form-input" type="text" placeholder="Doe" autoComplete="family-name" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label label-upper">Email</label>
       <input name="email" className="form-input" type="email" placeholder="you@example.com" />
      </div>
      <div className="form-group">
        <label className="form-label label-upper">Password</label>
        <input name="password" className="form-input" type="password" placeholder="Create password" />
      </div>
      <button className="form-btn" type="submit">Sign Up</button>
      <div className="link-row small">
        <span style={{color: 'var(--color-muted)'}}>Already have an account? </span>
        <Link to="/user/login" className="helper-link link-user">Sign in</Link>
      </div>
    </form>
  </div>
);
}
export default UserRegister;



// <input className="form-input" type="email" placeholder="you@example.com" /><input className="form-input" type="password" placeholder="Create password" />