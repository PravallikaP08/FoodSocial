import React, { useState, useEffect } from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        restaurantName: '',
        fullName: '',
        phone: '',
        address: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const info = localStorage.getItem("partnerInfo");
        if (info) {
            const partner = JSON.parse(info);
            setFormData({
                restaurantName: partner.restaurantName || '',
                fullName: partner.fullName || '',
                phone: partner.phone || '',
                address: partner.address || ''
            });
            if (partner.profileImage) setPreview(partner.profileImage);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (profileImage) data.append("profileImage", profileImage);

            const response = await axios.put("http://localhost:3000/api/food-partner/update", data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            if (response.data.success) {
                localStorage.setItem("partnerInfo", JSON.stringify(response.data.foodPartner));
                alert("Profile updated successfully!");
                navigate(`/food-partner/${response.data.foodPartner._id || response.data.foodPartner.id}`);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '500px', margin: '40px auto' }}>
            <h2 className="form-title">Edit Store Profile</h2>
            <p className="form-subtle">Update your restaurant information and branding</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ 
                        width: '100px', 
                        height: '100px', 
                        borderRadius: '50%', 
                        background: '#1e293b', 
                        margin: '0 auto 15px',
                        overflow: 'hidden',
                        border: '2px solid #3b82f6'
                    }}>
                        {preview ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" /> : null}
                    </div>
                    <label htmlFor="profile-img" className="helper-link" style={{ cursor: 'pointer', color: '#3b82f6' }}>
                        Change Profile Image
                    </label>
                    <input id="profile-img" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </div>

                <div className="form-group">
                    <label className="form-label">Restaurant Name</label>
                    <input name="restaurantName" className="form-input" value={formData.restaurantName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Owner Full Name</label>
                    <input name="fullName" className="form-input" value={formData.fullName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input name="phone" className="form-input" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Address</label>
                    <input name="address" className="form-input" value={formData.address} onChange={handleChange} required />
                </div>

                <button className="form-btn" type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Save Changes"}
                </button>
                
                <button type="button" onClick={() => navigate(-1)} className="helper-link" style={{ width: '100%', background: 'none', border: 'none', marginTop: '15px' }}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
