import axios from 'axios';

const API_BASE_URL = "https://healthai-nx8q.onrender.com/api/patients";

export const getPatients = () => axios.get(API_BASE_URL);
export const getAiAssessment = (id) => axios.get(`${API_BASE_URL}/${id}/ai-assessment`);