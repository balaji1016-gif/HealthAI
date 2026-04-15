import axios from 'axios';

// 1. Create the base instance
const API = axios.create({
  // Your specific Render backend URL
  baseURL: 'https://healthai-nx8q.onrender.com/api',
});

// 2. Request interceptor (for future use with JWT tokens)
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- AUTH ENDPOINTS ---

// Logs in the user and returns the Patient object
export const login = (credentials) => API.post('/auth/login', credentials);

// Registers a new user (Doctor or Patient)
export const register = (userData) => API.post('/auth/register', userData);

// --- PATIENT & VITALS ENDPOINTS ---

// Fetches fresh data for a specific patient
export const getPatients = (email) => API.get(`/auth/patients?email=${email}`);

// THE FIX: PUT request to update the vitals in the database
// Ensure your Java code has @PutMapping("/update-vitals")
export const updateVitals = (data) => API.put('/auth/update-vitals', data);

// AI Diagnosis - Sends the email to trigger the clinical insight logic
export const getAiAssessment = (email) => API.post('/auth/diagnose', { email: email });

// --- APPOINTMENT ENDPOINTS ---

// Patients use this to request a time slot
export const bookAppointment = (data) => API.post('/appointments/request', data);

// Doctors use this to approve or schedule the request
export const confirmAppointment = (id, schedule) => API.post(`/appointments/approve/${id}`, schedule);

// 3. Export the instance as default
export default API;
