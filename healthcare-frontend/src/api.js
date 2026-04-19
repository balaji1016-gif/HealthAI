import axios from 'axios';

const API = axios.create({
  baseURL: 'https://healthai-nx8q.onrender.com', 
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
}, (error) => Promise.reject(error));

export const login = (credentials) => API.post('/api/auth/login', credentials);
export const register = (userData) => API.post('/api/auth/register', userData);
export const getPatients = (email) => API.get(`/api/auth/patients?email=${email}`);
export const updateVitals = (data) => API.put('/api/auth/update-vitals', data);
export const getAiAssessment = (data) => API.post('/api/auth/diagnose', data);

export default API;
