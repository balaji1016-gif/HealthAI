import axios from 'axios';

const API_URL = "http://localhost:8081/api/auth";

export const registerUser = (userData) => axios.post(`${API_URL}/register`, userData);
export const loginUser = (credentials) => axios.post(`${API_URL}/login`, credentials);