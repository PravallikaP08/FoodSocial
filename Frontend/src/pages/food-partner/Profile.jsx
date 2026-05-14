import React, { useState, useEffect } from "react";
import "../../styles/profile.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config";

// To use a local image, you should place it in 'src/assets/' and import it like this:
// import defaultAvatar from "../../assets/avatar.jpg";

// 📸 AVATAR CONFIGURATION 
// To add an image: 
// 1. Use an online URL (like "https://example.com/photo.jpg")
// 2. OR move your file to "Frontend/public/" and use "/your-file-name.jpg"
const AVATAR_IMAGE_PATH = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1074&auto=format&fit=crop"; // Food-themed default photo

const Profile = () => {
  const { id } = useParams();
  const [profileData, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/food-partner/${id}`, {
          withCredentials: true,
          timeout: 10000
        });
        if (response.data && response.data.success) {
          setProfile(response.data.foodPartner);
          setVideos(response.data.foodPartner.foodItems || []);
        } else {
          setError("Failed to load profile data");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();

    // Check if current user is the owner of this profile
    const info = localStorage.getItem("partnerInfo");
    if (info) {
      const partner = JSON.parse(info);
      if (partner.id === id || partner._id === id) {
        setIsOwner(true);
      }
    }
  }, [id]);

  if (loading) {
    return (
      <main className="profile-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  if (error || !profileData) {
    return (
      <main className="profile-page">
        <div className="error-state">
          <h3>Unable to load profile</h3>
          <p>{error || "No profile data found"}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-card-inner">
          <div className="avatar-circle">
            {(profileData?.profileImage || AVATAR_IMAGE_PATH) ? (
              <img 
                src={profileData.profileImage || AVATAR_IMAGE_PATH} 
                alt="Profile" 
                className="avatar-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : null}
            <span className="avatar-initial">
              {profileData?.name?.charAt(0).toUpperCase() || "?"}
            </span>
          </div>
          <div className="header-text">
            <div className="business-labels">
              <h1 className="business-name-tag">{profileData?.restaurantName || profileData?.name}</h1>
              <span className="partner-name">by {profileData?.fullName}</span>
            </div>
            <div className="business-address">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="business-address-text">{profileData?.address}</p>
            </div>
            {isOwner && (
              <button 
                onClick={() => navigate('/food-partner/edit')} 
                className="edit-profile-btn"
                style={{
                  marginTop: '15px',
                  background: 'rgba(59, 70, 246, 0.1)',
                  color: '#3b82f6',
                  border: '1px solid #3b82f6',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Edit Store Profile
              </button>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-label">total meals</span>
            <span className="stat-value">{profileData?.totalMeals || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">customer serve</span>
            <span className="stat-value">
              {profileData?.customersServed >= 1000 
                ? `${(profileData.customersServed / 1000).toFixed(0)}K` 
                : (profileData?.customersServed || 0)}
            </span>
          </div>
        </div>
      </section>

      <hr className="profile-sep" />

      <section className="profile-grid" aria-label="Videos">
        {videos.map((video) => (
          <div key={video._id || video.id} className="profile-grid-item">
            <video 
              src={video.video} 
              muted 
              loop 
              playsInline
              onMouseOver={(e) => e.target.play()}
              onMouseOut={(e) => {
                e.target.pause();
                e.target.currentTime = 0;
              }}
              className="profile-grid-video"
            />
          </div>
        ))}
        {/* Fill the grid with empty blocks if necessary */}
        {videos.length < 9 && Array.from({ length: 9 - videos.length }).map((_, i) => (
          <div key={`empty-${i}`} className="profile-grid-item empty">
            <div className="placeholder-content">video</div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Profile;