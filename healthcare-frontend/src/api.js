import axios from 'axios';

const API = axios.create({
  baseURL: 'https://healthai-nx8q.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPatients = (email) => API.get(`/auth/me?email=${email}`);
export const getAiAssessment = (email) => API.post('/auth/diagnose', { email: email });
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);

// NEW ENDPOINTS
export const updateVitals = (data) => API.post('/vitals/update', data);
export const bookAppointment = (data) => API.post('/appointments/request', data);
export const confirmAppointment = (id, schedule) => API.post(`/appointments/approve/${id}`, schedule);

export default API;
