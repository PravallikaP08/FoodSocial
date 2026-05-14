import React, { useState, useEffect } from "react";
import "../../styles/profile.css";
import { useParams } from "react-router-dom";
import axios from "axios";

// To use a local image, you should place it in 'src/assets/' and import it like this:
// import defaultAvatar from "../../assets/avatar.jpg";

// 📸 AVATAR CONFIGURATION 
// To add an image: 
// 1. Use an online URL (like "https://example.com/photo.jpg")
// 2. OR move your file to "Frontend/public/" and use "/your-file-name.jpg"
const AVATAR_IMAGE_PATH = "https://plus.unsplash.com/premium_photo-1690407617686-d449aa2aad3c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // <-- PASTE YOUR IMAGE LINK HERE

const Profile = () => {
  const { id } = useParams();
  const [profileData, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/food-partner/${id}`, {
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
            {(AVATAR_IMAGE_PATH || profileData?.profileImage) ? (
              <img 
                src={AVATAR_IMAGE_PATH || profileData.profileImage} 
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
              <span className="business-name-tag">{profileData?.name}</span>
            </div>
            <p className="business-address-text">{profileData?.address}</p>
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