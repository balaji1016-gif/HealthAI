import axios from 'axios';

const API = axios.create({
  baseURL: 'https://healthai-nx8q.onrender.com/api',
});

// Request interceptor - stays simple for your current Java setup
API.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- API ENDPOINTS ---

export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);

// Fetch patient details (Mapped to your @GetMapping("/me"))
export const getPatients = (email) => API.get(`/auth/me?email=${email}`);

// AI Diagnosis (Mapped to your @PostMapping("/diagnose"))
export const getAiAssessment = (email) => API.post('/auth/diagnose', { email: email });

// Update vitals (Note: Reusing register endpoint as per your current Java controller)
export const updateVitals = (data) => API.post('/auth/register', data); 

// Appointment endpoints
export const bookAppointment = (data) => API.post('/appointments/request', data);
export const confirmAppointment = (id, schedule) => API.post(`/appointments/approve/${id}`, schedule);
// In your api/index.js or wherever you define 'updateVitals'
export const updateVitals = (data) => axios.put(`${API_URL}/api/auth/update-vitals`, data);

export default API;
