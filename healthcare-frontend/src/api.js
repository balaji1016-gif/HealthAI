import axios from 'axios';

const API = axios.create({
  baseURL: 'https://healthai-nx8q.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const getPatients = (email) => API.get(`/auth/patients?email=${email}`);

// Updated to use the correct endpoint path
export const updateVitals = (data) => API.put('/auth/update-vitals', data);

export const getAiAssessment = (email) => API.post('/auth/diagnose', { email: email });
export const bookAppointment = (data) => API.post('/appointments/request', data);
export const confirmAppointment = (id, schedule) => API.post(`/appointments/approve/${id}`, schedule);

export default API;
