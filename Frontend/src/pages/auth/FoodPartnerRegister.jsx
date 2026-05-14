import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth-shared.css";
import axios from "axios";
import API_BASE_URL from "../../config";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const businessName = e.target.businessName.value.trim();
    const contactName = e.target.contactName.value.trim();
    const phone = e.target.phone.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const address = e.target.address.value.trim();

    if (!businessName || !contactName || !phone || !email || !password || !address) {
      alert("Please fill in all fields");
      return;
    }

    axios
      .post(
        `${API_BASE_URL}/api/auth/food-partner/register`,
        {
          fullName: contactName,
          email,
          password,
          restaurantName: businessName,
          phone,
          address,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        alert("Partner registration successful! Welcome aboard.");
        navigate("/food-partner/login");
      })
      .catch((error) => {
        console.error("Partner registration error:", error);
        alert(error.response?.data?.message || "Registration failed. Please try again.");
      });
  };

  return (
    <div className="form-container">
      <div className="form-title">Partner Sign Up</div>
      <div className="form-subtle">
        Register your business to start listing items
      </div>

      <div className="switch-row">
        <span className="switch-label">Switch:</span>
        <Link to="/user/register" className="link-user">
          User
        </Link>
        <span style={{ margin: "0 0.4rem", color: "var(--color-muted)" }}></span>
        <Link to="/food-partner/register" className="link-partner active">
          Food Partner
        </Link>
        <span style={{ margin: "0 0.4rem", color: "var(--color-muted)" }}></span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label label-upper">Business name</label>
          <input
            name="businessName"
            className="form-input"
            type="text"
            placeholder="Acme Bakery"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label label-upper">Contact name</label>
            <input
              name="contactName"
              className="form-input"
              type="text"
              placeholder="Jane Doe"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label label-upper">Phone</label>
            <input
              name="phone"
              className="form-input"
              type="tel"
              placeholder="+1 555 123 4567"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label label-upper">Email</label>
          <input
            name="email"
            className="form-input"
            type="email"
            placeholder="business@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label label-upper">Password</label>
          <input
            name="password"
            className="form-input"
            type="password"
            placeholder="Create password"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label label-upper">Address</label>
          <input
            name="address"
            className="form-input"
            type="text"
            placeholder="123 Market Street, City, State, ZIP"
            required
          />
        </div>

        <div className="form-note">
          Full address helps customers find you faster.
        </div>

        <button className="form-btn" type="submit">
          Create Partner Account
        </button>

        <div className="link-row small">
          <span style={{ color: "var(--color-muted)" }}>
            Already have an account?{" "}
          </span>
          <Link to="/food-partner/login" className="helper-link link-partner">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default FoodPartnerRegister;
