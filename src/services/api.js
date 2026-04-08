import axios from 'axios';

const BASE_URL = "http://localhost:8081/api/patients";

export const getPatients = async () => {
    const response = await axios.get(BASE_URL);
    return response.data; // Returns the list of patients from Java
};

export const getAiAnalysis = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}/ai-assessment`);
    return response.data.assessment; // Returns the AI's diagnosis
};