const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname.includes('onrender.com') 
        ? 'https://foodsocial-backend.onrender.com' 
        : 'http://localhost:3000');

export default API_BASE_URL;
