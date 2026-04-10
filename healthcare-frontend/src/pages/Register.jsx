import React, { useState } from 'react';
import API from '../services/api'; 
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        medicalHistory: '',
        // Initializing vitals as empty or default
        bloodPressure: '120/80',
        heartRate: 72
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // This hits your Render backend /api/auth/register
            await API.post('/auth/register', formData);
            alert("Patient Registered Successfully!");
            navigate('/login');
        } catch (error) {
            console.error("Error:", error.response?.data);
            alert("Registration Failed. Check if the backend is running.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Patient Registration</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
                <textarea name="medicalHistory" placeholder="Medical History (e.g. Asthma, None)" onChange={handleChange} />
                
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Register Patient
                </button>
            </form>
        </div>
    );
};

export default Register;
