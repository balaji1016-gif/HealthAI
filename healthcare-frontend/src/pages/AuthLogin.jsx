import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Ensure api.js is in your root src folder
import toast from 'react-hot-toast';

const AuthLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Authenticating...");

    try {
      const response = await API.post('/auth/login', credentials);
      const { token, role } = response.data;

      // 1. Commit Auth data to LocalStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      toast.success("Login Successful!", { id: loadingToast });

      // 2. Short timeout to ensure storage is committed before navigation
      // and normalization to prevent case-sensitivity issues with the Java backend
      setTimeout(() => {
        const normalizedRole = role ? role.toUpperCase() : '';
        
        if (normalizedRole === 'PATIENT') {
          navigate('/patient-dashboard');
        } else if (normalizedRole === 'DOCTOR') {
          navigate('/doctor-dashboard');
        } else {
          console.error("Unrecognized role:", role);
          toast.error("Role not recognized. Redirecting to home.");
          navigate('/');
        }
      }, 150);

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Email or Password", { id: loadingToast });
      console.error("Login Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h2 style={styles.title}>HealthAI Login</h2>
          <p style={styles.subtitle}>Enter your details to access your dashboard</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="login-email" style={styles.label}>Email Address</label>
            <input 
              id="login-email"
              type="email" 
              name="email" 
              placeholder="name@example.com"
              autoComplete="email"
              onChange={handleChange} 
              required 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="login-password" style={styles.label}>Password</label>
            <input 
              id="login-password"
              type="password" 
              name="password" 
              placeholder="••••••••"
              autoComplete="current-password"
              onChange={handleChange} 
              required 
              style={styles.input} 
            />
          </div>

          <button type="submit" style={
