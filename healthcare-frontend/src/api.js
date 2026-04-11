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

// --- ADD THESE EXPORTS BELOW ---

// Fetch the list of patients (or current user profile)
export const getPatients = () => API.get('/auth/me'); 

// Trigger the AI Diagnosis
// We pass an object { email } because the backend expects a Patient object or @RequestBody
export const getAiAssessment = (email) => API.post('/auth/diagnose', { email });

// Authentication helpers
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);

export default API;
