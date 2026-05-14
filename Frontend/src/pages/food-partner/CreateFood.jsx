import React, { useState, useEffect } from 'react';
import '../../styles/CreateFood.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const CreateFood = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [fileSize, setFileSize] = useState("");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    // Clean up the object URL when component unmounts or file changes
    useEffect(() => {
        return () => {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
        };
    }, [videoPreview]);

    const handleVideoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
            // Calculate size in MB
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            setFileSize(`${sizeMB} MB`);
        }
    };

    const handleRemove = () => {
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoFile(null);
        setVideoPreview(null);
        setFileSize("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!videoFile) {
            alert("Please upload a video!");
            return;
        }

        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append("video", videoFile);
            formData.append("name", name);
            formData.append("description", description);
            
            // Get token from localStorage
            const token = localStorage.getItem("token");
            
            if (!token) {
                alert("Please login first to create food posts");
                navigate("/food-partner/login");
                return;
            }
            
            const response = await axios.post("http://localhost:3000/api/food", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true,
            });

            console.log("✅ Food created:", response.data);
            alert("Food profile created successfully!");
            navigate("/");
            
        } catch (error) {
            console.error("❌ Error creating food:", error);
            
            if (error.response?.status === 401) {
                alert("Session expired or invalid token. Please login again.");
                localStorage.removeItem("token");
                navigate("/food-partner/login");
            } else if (error.response?.status === 403) {
                alert("You don't have permission to create food posts.");
            } else {
                alert(error.response?.data?.message || "Failed to create food profile. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-food-page">
            <div className="create-food-card">
                <header className="create-food-header">
                    <h1 className="create-food-title">Create Food</h1>
                    <p className="create-food-subtitle">
                        Upload a short video, give it a name, and add a description.
                    </p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <span className="field-label">Food Video</span>

                        {videoPreview ? (
                            <div className="preview-container">
                                <div className="preview-top-bar">
                                    <span className="file-size-tag">{fileSize}</span>
                                    <div className="preview-actions">
                                        <label htmlFor="video-upload" className="action-link change">Change</label>
                                        <button type="button" onClick={handleRemove} className="action-link remove">Remove</button>
                                    </div>
                                </div>
                                <div className="video-preview-wrapper">
                                    <video
                                        src={videoPreview}
                                        className="video-preview-element"
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                    />
                                </div>
                            </div>
                        ) : (
                            <label className="upload-area" htmlFor="video-upload">
                                <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="upload-text-main">Tap to upload or drag and drop</span>
                                <span className="upload-text-sub">MP4, WebM, MOV • Up to 100MB</span>
                            </label>
                        )}

                        <input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            style={{ display: 'none' }}
                            required={!videoFile}
                        />
                    </div>

                    <div className="form-field">
                        <label className="field-label" htmlFor="food-name">Name</label>
                        <input
                            id="food-name"
                            className="create-food-input"
                            type="text"
                            placeholder="e.g., Spicy Paneer Wrap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label className="field-label" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            className="create-food-textarea"
                            placeholder="Write a short description: ingredients, taste, spice level, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <button className="save-button" type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Food"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;