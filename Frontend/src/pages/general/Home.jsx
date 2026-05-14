import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import '../../styles/reels.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Home = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [likedIds, setLikedIds] = useState(new Set());
  const [commentedIds, setCommentedIds] = useState(new Set());
  const [activeCommentVideoId, setActiveCommentVideoId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [activeMood, setActiveMood] = useState(() => localStorage.getItem('activeMood') || null);
  const { addToCart } = useCart();
  const videoRefs = useRef(new Map());
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  
  const autoLogin = async () => {
    try {
      console.log('Attempting auto-login...');
      
      
      const loginData = {
        email: 'demo@example.com', 
        password: 'password123'    
      };

      
      const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/user/login`, loginData, {
        withCredentials: true
      });

      if (loginResponse.data && loginResponse.data.token) {
        localStorage.setItem('token', loginResponse.data.token);
        console.log('Auto-login successful');
        return loginResponse.data.token;
      }
    } catch (error) {
      console.log('Auto-login failed, trying without authentication...');
    }
    return null;
  };

  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch((error) => {
              console.log('Auto-play failed:', error);
            });
          } else {
            video.pause();
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.8
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Fetch saved IDs for initial state
  useEffect(() => {
    const fetchSavedIds = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/food/saved`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          });
          if (res.data.success && res.data.foodItems) {
            setSavedIds(new Set(res.data.foodItems.map(f => f._id)));
          }
        } catch (err) {
          console.error('Failed to fetch saved IDs:', err);
        }
      }
    };
    fetchSavedIds();
  }, []);

  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        let token = localStorage.getItem('token');
        
        console.log('Initial token check:', token ? 'Found' : 'Not found');

        // If no token, try auto-login first
        if (!token) {
          token = await autoLogin();
        }

        // Try to fetch videos with token if available
        const response = await axios.get(`http://localhost:3000/api/food${activeMood ? `?mood=${activeMood}` : ''}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        });

        console.log('API Response:', response.data);

        if (response.data && response.data.foodItems) {
          setVideos(response.data.foodItems);
          console.log('Videos loaded successfully:', response.data.foodItems.length);
        } else {
          console.warn('No food items found in response');
          setVideos([]);
        }

      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err.message || 'Failed to connect to server');
        
        if (err.response?.status === 401) {
          console.log('Authentication failed, trying without token...');
          try {
            const publicResponse = await axios.get(`${API_BASE_URL}/api/food`, {
              withCredentials: true
            });

            if (publicResponse.data && publicResponse.data.foodItems) {
              setVideos(publicResponse.data.foodItems);
              setError(null);
              console.log('Videos loaded without authentication');
            } else {
              setVideos([]);
            }
          } catch (secondError) {
            console.error('Failed to fetch without authentication:', secondError);
            setVideos([]);
            setError('Authentication failed. Please login to view the feed.');
          }
        } else {
          console.error('API Error:', err.message);
          setVideos([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [activeMood]);

  // Set video refs for interaction
  const setVideoRef = (id) => (el) => {
    if (el) {
      videoRefs.current.set(id, el);
      
      // Observe with the main observer
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    } else {
      videoRefs.current.delete(id);
    }
  };

  // Handle video click for play/pause and SAVE
  const handleVideoClick = (id) => {
    const video = videoRefs.current.get(id);
    if (video) {
      if (video.paused) {
        video.play().catch(error => {
          console.log('Play failed on click:', error);
        });
      } else {
        video.pause();
      }
    }
  };

  // Set viewport height for mobile
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  // Manual retry function
  const retryFetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let token = localStorage.getItem('token');
      if (!token) token = await autoLogin();

      const response = await axios.get(`${API_BASE_URL}/api/food${activeMood ? `?mood=${activeMood}` : ''}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true
      });

      if (response.data?.foodItems) {
        setVideos(response.data.foodItems);
      }
    } catch (err) {
      console.error('Retry failed:', err);
      setError(err.message || 'Still unable to connect');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle save/unsave
  const handleSave = async (foodId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to save this food reel!');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/food/save`, { foodId }, {
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

      const response = await axios.post(`${API_BASE_URL}/api/food/like`, { foodId }, {
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
        const response = await axios.get(`${API_BASE_URL}/api/food/${foodId}/comments`, {
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
      const response = await axios.post(`${API_BASE_URL}/api/food/comment`, { foodId, text: commentText }, {
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
  return (
    <div ref={containerRef} className="reels-page">
      {/* Mood Selector */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        zIndex: 100,
        padding: '0 20px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {['Happy', 'Lazy', 'Healthy', 'Budget', 'Party'].map(mood => (
          <button
            key={mood}
            onClick={() => {
              const newMood = activeMood === mood ? null : mood;
              setActiveMood(newMood);
              if (newMood) localStorage.setItem('activeMood', newMood);
              else localStorage.removeItem('activeMood');
            }}
            style={{
              padding: '8px 20px',
              borderRadius: '25px',
              border: 'none',
              background: activeMood === mood ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              boxShadow: activeMood === mood ? '0 4px 15px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            {mood}
          </button>
        ))}
      </div>
      {/* Loading state */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '18px',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.7)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          Loading videos...
        </div>
      )}

      {/* Error state */}
      {!loading && (error || videos.length === 0) && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          padding: '40px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          width: 'min(400px, 90vw)',
          zIndex: 50
        }}>
          <div style={{ marginBottom: '1.5rem', color: error ? '#ff6b6b' : 'var(--accent-secondary)' }}>
            {error ? (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            ) : (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>
            {error ? 'Feed Unavailable' : 'No Videos Found'}
          </h3>
          <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>
            {error 
              ? "We couldn't load the latest food videos. Check your connection or login to your account."
              : activeMood 
                ? `No videos found for the "${activeMood}" mood. Try another category!` 
                : "The food feed is currently empty. Be the first to upload a food reel!"}
          </p>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {error ? (
              <button 
                onClick={retryFetch}
                className="form-btn"
                style={{ padding: '0.8rem', fontSize: '0.9rem' }}
              >
                Retry Connection
              </button>
            ) : activeMood ? (
              <button 
                onClick={() => { setActiveMood(null); localStorage.removeItem('activeMood'); }}
                className="form-btn"
                style={{ padding: '0.8rem', fontSize: '0.9rem' }}
              >
                Clear Mood Filter
              </button>
            ) : null}
            
            <Link 
              to={localStorage.getItem('token') ? "/create-food" : "/choose-register"} 
              style={{
                color: 'var(--accent-secondary)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              {localStorage.getItem('token') ? "Upload a Video" : "Go to Login Page"}
            </Link>
          </div>
        </div>
      )}

      {/* Videos */}
      <div className="reels-feed" role="list">
        {videos.map((item) => (
          <section 
            key={item._id} 
            className="reel" 
            role="listitem"
            onClick={() => handleVideoClick(item._id)}
          >
            <video
              ref={setVideoRef(item._id)}
              className="reel-video"
              src={item.video}
              muted
              playsInline
              loop
              autoPlay
              preload="auto"
            />
            <div className="reel-overlay">
              <div className="reel-overlay-gradient" aria-hidden="true" />
              
              {/* Vertical Action Bar */}
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
                  className={`action-item ${savedIds.has(item._id) ? 'is-saved' : ''}`}
                  onClick={(e) => { e.stopPropagation(); handleSave(item._id); }}
                >
                  <div className="action-icon-wrapper">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill={savedIds.has(item._id) ? "white" : "none"} stroke="currentColor" strokeWidth="2">
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
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {item.foodPartner && (
                      <Link
                        className="reel-button"
                        to={`/food-partner/${item.foodPartner._id || item.foodPartner}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit Store
                      </Link>
                    )}
                    {item.isOrderable && (
                      <button
                        className="reel-button"
                        style={{ background: 'var(--accent-primary)', border: 'none' }}
                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                      >
                        Order Now - ₹{item.price}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Home;