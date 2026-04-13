import axios from 'axios';

const API = axios.create({
  baseURL: 'https://healthai-nx8q.onrender.com/api',
});

// Since your Spring Boot app isn't using JWT @Header authentication yet,
// we don't need to attach the Bearer token, but we'll keep the interceptor 
// simple so it doesn't cause errors.
API.interceptors.request.use((config) => {
  return config;
});

// --- API ENDPOINTS ---

export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);

// Fetch patient details (Mapped to your @GetMapping("/me"))
export const getPatients = (email) => API.get(`/auth/me?email=${email}`);

// AI Diagnosis (Mapped to your @PostMapping("/diagnose"))
export const getAiAssessment = (email) => API.post('/auth/diagnose', { email: email });

// NOTE: These should be added to your Java Controller if not already there
export const updateVitals = (data) => API.post('/auth/register', data); 
export const bookAppointment = (data) => API.post('/appointments/request', data);
export const confirmAppointment = (id, schedule) => API.post(`/appointments/approve/${id}`, schedule);

export default API;
