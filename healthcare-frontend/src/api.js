import axios from 'axios';

const API = axios.create({
  baseURL: 'https://healthai-nx8q.onrender.com/api',
});

// Helper to get the token for secure requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("No token found in localStorage for this request.");
  }
  return config;
});

// --- API ENDPOINTS ---

export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);

// Fetch patient details
export const getPatients = (email) => API.get(`/auth/me?email=${email}`);

// AI Diagnosis
export const getAiAssessment = (email) => API.post('/auth/diagnose', { email: email });

// NEW FUNCTIONALITY ENDPOINTS
export const updateVitals = (data) => API.post('/auth/update-vitals', data);
export const bookAppointment = (data) => API.post('/appointments/request', data);
export const confirmAppointment = (id, schedule) => API.post(`/appointments/approve/${id}`, schedule);

export default API;
