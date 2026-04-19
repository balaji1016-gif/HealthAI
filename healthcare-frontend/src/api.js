import axios from 'axios';

const API = axios.create({
  // Ensure there is NO trailing slash here
  baseURL: 'https://healthai-nx8q.onrender.com', 
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Added the full path '/api/auth' to match your Controller exactly
export const login = (credentials) => API.post('/api/auth/login', credentials);
export const register = (userData) => API.post('/api/auth/register', userData);
export const getPatients = (email) => API.get(`/api/auth/patients?email=${email}`);

// THE FIX: Explicitly calling /api/auth/update-vitals
export const updateVitals = (data) => API.put('/api/auth/update-vitals', data);

export const getAiAssessment = (email) => API.post('/api/auth/diagnose', { email: email });
export const bookAppointment = (data) => API.post('/appointments/request', data);
export const confirmAppointment = (id, schedule) => API.post(`/appointments/approve/${id}`, schedule);

export default API;
