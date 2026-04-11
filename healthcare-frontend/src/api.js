import axios from 'axios';

const API = axios.create({
  // This must match your Render backend URL exactly
  baseURL: 'https://healthai-nx8q.onrender.com/api',
});

// Helper to get the token for secure requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- API ENDPOINTS ---

// 1. Fetch patient details (using email as the ID)
export const getPatients = (email) => API.get(`/auth/me?email=${email}`);

// 2. AI Diagnosis - This sends the email to the backend for analysis
export const getAiAssessment = (email) => API.post('/auth/diagnose', { email: email });

// 3. Auth Endpoints
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);

export default API;
