import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Note: These keys MUST match the private fields in your Patient.java exactly
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    bloodPressure: '',
    heartRate: '',
    medicalHistory: '',
    role: 'PATIENT' // Defaulting to Patient as per your project focus
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hits your Render backend: https://healthai-nx8q.onrender.com/api/auth/register
      await API.post('/auth/register', formData);
      toast.success("Registration Successful! Please login.");
      navigate('/login');
    } catch (error) {
      console.error("Error Details:", error.response?.data);
      toast.error(error.response?.data?.message || "Registration Failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>HealthAI Patient Signup</h2>
        <p style={styles.subtitle}>Enter your details to initialize AI monitoring</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Section 1: Account Info */}
          <div style={styles.sectionHeader}>Account Information</div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required style={styles.input} />
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" name="email" placeholder="john@example.com" onChange={handleChange} required style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required style={styles.input} />
            </div>
          </div>
