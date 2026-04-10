import axios from 'axios';

const API = axios.create({
  // Your Render backend URL
  baseURL: 'https://healthai-nx8q.onrender.com/api',
});

// Add a request interceptor to attach the JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
