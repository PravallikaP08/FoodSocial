import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../styles/reels.css';
import { Link } from 'react-router-dom';

const Saved = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());
  const [likedIds, setLikedIds] = useState(new Set());
  const [commentedIds, setCommentedIds] = useState(new Set());
  const [activeCommentVideoId, setActiveCommentVideoId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const videoRefs = useRef(new Map());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(err => console.log('Auto-play failed:', err));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.8 }
    );

    return () => observerRef.current?.disconnect();
  }, []);

  // Auto-login function for demo users
  const autoLogin = async () => {
    try {
      const loginData = { email: 'demo@example.com', password: 'password123' };
      const res = await axios.post('http://localhost:3000/api/auth/user/login', loginData, { withCredentials: true });
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        return res.data.token;
      }
    } catch (error) {
      console.log('Saved page auto-login failed');
    }
    return null;
  };

  const fetchSavedVideos = async () => {
    try {
      setLoading(true);
      let token = localStorage.getItem('token');
      
      if (!token) {
        token = await autoLogin();
      }

      if (!token) {
        setVideos([]);
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/food/saved', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.success && response.data.foodItems) {
        setVideos(response.data.foodItems);
        // Add all fetched videos to savedIds
        setSavedIds(new Set(response.data.foodItems.map(f => f._id)));
      }
    } catch (error) {
      console.error('Error fetching saved videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedVideos();
  }, []);

  const setVideoRef = (id) => (el) => {
    if (el) {
      videoRefs.current.set(id, el);
      observerRef.current?.observe(el);
    } else {
      videoRefs.current.delete(id);
    }
  };

  const handleVideoClick = (id) => {
    const video = videoRefs.current.get(id);
    if (video) video.paused ? video.play() : video.pause();
  };

  const handleSave = async (foodId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to save this food reel!');
        return;
      }

      const response = await axios.post('http://localhost:3000/api/food/save', { foodId }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.success) {
        console.log('Save toggled:', response.data.message);
        // Toggle in local state
        setSavedIds(prev => {
          const next = new Set(prev);
          if (next.has(foodId)) next.delete(foodId);
          else next.add(foodId);
          return next;
        });

        // Update saveCount in local state
        setVideos(prev => prev.map(v => 
          v._id === foodId ? { ...v, saveCount: response.data.saveCount } : v
        ));
        
        // Remove from UI in Saved page since it's no longer saved
        setVideos(prev => prev.filter(v => v._id !== foodId));
      }
    } catch (error) {
      console.error('Error saving reel:', error);
    }
  };

  const handleLike = async (foodId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to like this reel!');
        return;
      }

      const response = await axios.post("http://localhost:3000/api/food/like", { foodId }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      if (response.data.success) {
        // Toggle in local state
        setLikedIds(prev => {
          const next = new Set(prev);
          if (next.has(foodId)) next.delete(foodId);
          else next.add(foodId);
          return next;
        });

        // Update likeCount in local state
        setVideos(prev => prev.map(v => 
          v._id === foodId ? { ...v, likeCount: response.data.likeCount } : v
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCommentClick = async (foodId) => {
    if (activeCommentVideoId === foodId) {
      setActiveCommentVideoId(null);
      setCommentText("");
      setCommentsList([]);
    } else {
      setActiveCommentVideoId(foodId);
      setCommentText("");
      setCommentsList([]);
      try {
        const response = await axios.get(`http://localhost:3000/api/food/${foodId}/comments`, {
          withCredentials: true
        });
        if (response.data.success) {
          setCommentsList(response.data.comments);
        }
      } catch (err) {
        console.error("Error fetching comments", err);
      }
    }
  };

  const submitComment = async (e, foodId) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to comment!");
        return;
      }
      const response = await axios.post('http://localhost:3000/api/food/comment', { foodId, text: commentText }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.success) {
        setCommentedIds(prev => {
          const next = new Set(prev);
          next.add(foodId);
          return next;
        });
        
        // Update comments list
        setCommentsList(prev => [response.data.comment, ...prev]);

        // Update comment count locally
        setVideos(prevVideos => prevVideos.map(v => {
          if (v._id === foodId) {
            return { ...v, commentCount: response.data.commentCount };
          }
          return v;
        }));
        
        setCommentText("");
      }
    } catch (err) {
      console.error("Error posting comment", err);
    }
  };

  if (loading) return <div className="reels-page" style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading saved pieces...</div>;

  return (
    <div className="reels-page saved-page">
      {videos.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'white', marginTop: '20vh' }}>
          <h2 style={{ fontWeight: 800 }}>No Saved Reels</h2>
          <p style={{ opacity: 0.6, margin: '1rem 0 2rem' }}>Go to the feed and save some food videos!</p>
          <Link to="/" className="reel-button">Explore Food</Link>
        </div>
      ) : (
        <div className="reels-feed" role="list">
          {videos.map((item) => (
            <section key={item._id} className="reel" role="listitem" onClick={() => handleVideoClick(item._id)}>
              <video
                ref={setVideoRef(item._id)}
                className="reel-video"
                src={item.video}
                muted playsInline loop preload="metadata"
              />
              <div className="reel-overlay">
                <div className="reel-overlay-gradient" />
                <div className="reel-actions">
                  <button 
                    className={`action-item ${likedIds.has(item._id) ? 'is-liked' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleLike(item._id); }}
                  >
                    <div className="action-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill={likedIds.has(item._id) ? "white" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <span>{item.likeCount || 0}</span>
                  </button>

                  <button 
                    className={`action-item is-saved`}
                    onClick={(e) => { e.stopPropagation(); handleSave(item._id); }}
                  >
                    <div className="action-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="white" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <span>{Math.max(0, item.saveCount || 0)}</span>
                  </button>

                  <button 
                    className={`action-item ${commentedIds.has(item._id) ? 'is-commented' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleCommentClick(item._id); }}
                  >
                    <div className="action-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill={commentedIds.has(item._id) ? "white" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </div>
                    <span>{item.commentCount || 0}</span>
                  </button>
                </div>
                <div className="reel-meta">
                  {activeCommentVideoId === item._id && (
                    <div style={{
                        marginBottom: '15px',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '12px',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        maxHeight: '40vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {commentsList.map(c => (
                          <div key={c._id} style={{ fontSize: '13px' }}>
                            <span style={{ fontWeight: 'bold', marginRight: '5px' }}>{c.user?.fullName || 'User'}</span>
                            <span>{c.text}</span>
                          </div>
                        ))}
                        {commentsList.length === 0 && <div style={{ fontSize: '13px', opacity: 0.6 }}>No comments yet.</div>}
                      </div>
                      <form 
                        onSubmit={(e) => submitComment(e, item._id)} 
                        style={{ display: 'flex', gap: '10px' }}
                      >
                        <input 
                          type="text" 
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            outline: 'none',
                            fontSize: '14px'
                          }}
                          autoFocus
                        />
                        <button 
                          type="submit" 
                          style={{
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px'
                          }}
                        >
                          Post
                        </button>
                      </form>
                    </div>
                  )}
                  <div className="reel-content">
                    <p className="reel-description">{item.description}</p>
                    {item.foodPartner && (
                      <Link className="reel-button" to={`/food-partner/${item.foodPartner._id || item.foodPartner}`} onClick={(e) => e.stopPropagation()}>
                        Visit Store
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
