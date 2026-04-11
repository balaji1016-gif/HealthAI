import axios from 'axios';

const API = axios.create({
  // Your exact Render backend URL
  baseURL: 'https://healthai-nx8q.onrender.com/api',
});

// Interceptor to attach the token if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- API FUNCTIONS ---

// Fetch current user details
export const getPatients = (email) => API.get(`/auth/me?email=${email}`);

// Send diagnosis request - We send email inside an object to match @RequestBody
export const getAiAssessment = (email) => API.post('/auth/diagnose', { email: email });

// Auth helpers
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);

export default API;
