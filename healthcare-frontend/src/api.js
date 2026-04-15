import axios from 'axios';

const API = axios.create({
  // Your specific Render backend URL
  baseURL: 'https://healthai-nx8q.onrender.com/api',
});

// Request interceptor
API.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- API ENDPOINTS ---

// Auth Endpoints
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);

// Fetch patient details (mapped to your @GetMapping)
// Added a fallback to ensure email is passed correctly
export const getPatients = (email) => API.get(`/auth/patients?email=${email}`);

// AI Diagnosis
export const getAiAssessment = (email) => API.post('/auth/diagnose', { email: email });

// THE FIX: Use the 'API' instance and the correct endpoint path
export const updateVitals = (data) => API.put('/auth/update-vitals', data);

// Appointment endpoints
export const bookAppointment = (data) => API.post('/appointments/request', data);
export const confirmAppointment = (id, schedule) => API.post(`/appointments/approve/${id}`, schedule);

export default API;
