import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Ensure 'api.js' is in your services folder
import toast from 'react-hot-toast';

const AuthLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/login', credentials);
      const { token, role } = response.data;

      // Store Auth Data
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      toast.success("Login Successful!");
      
      // Navigate based on role from your Java backend
      if (role === 'PATIENT') {
        navigate('/patient-dashboard');
      } else {
        navigate('/doctor-dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your HealthAI Portal</p>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label>Email Address</label>
            <input type="email" name="email" onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} required style={styles.input} />
          </div>
          <button type="submit" style={styles.button}>SIGN IN</button>
        </form>
        <p style={styles.footer}>
          New user? <span onClick={() => navigate('/register')} style={styles.link}>Register here</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f4f8' },
  card: { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', margin: '0 0 10px 0', color: '#333' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '20px' },
  inputGroup: { marginBottom: '15px' },
  input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  footer: { marginTop: '20px', textAlign: 'center', fontSize: '14px' },
  link: { color: '#3182ce', cursor: 'pointer', fontWeight: 'bold' }
};

export default AuthLogin;
