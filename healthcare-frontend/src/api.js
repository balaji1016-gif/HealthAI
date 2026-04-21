import axios from 'axios';

const API = axios.create({
  // ENSURE THIS URL MATCHES YOUR RENDER DASHBOARD EXACTLY
  baseURL: 'https://healthai-nx8q.onrender.com', 
});

API.interceptors.request.use((config) => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

export const login = (credentials) => API.post('/api/auth/login', credentials);
export const register = (userData) => API.post('/api/auth/register', userData);
export const getPatients = () => API.get('/api/auth/patients');
export const getAiAssessment = (data) => API.post('/api/auth/diagnose', data);

export default API;
