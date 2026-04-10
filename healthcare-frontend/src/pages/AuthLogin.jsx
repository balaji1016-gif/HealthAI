import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Path to your api.js in the root src folder
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

      // Normalize role string to handle any casing from Java (e.g., "Patient" vs "PATIENT")
      const normalizedRole = role.toUpperCase();
      
      if (normalizedRole === 'PATIENT') {
        navigate('/patient-dashboard');
      } else if (normalizedRole === 'DOCTOR') {
        navigate('/doctor-dashboard');
      } else {
        // Fallback if role is undefined or unrecognized
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h2 style={styles.title}>HealthAI Portal</h2>
          <p style={styles.subtitle}>Please enter your credentials to continue</p>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Email Field with Label and Autocomplete */}
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

          {/* Password Field with Label and Autocomplete */}
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

          <button type="submit" style={styles.button}>SIGN IN</button>
        </form>

        <footer style={styles.footer}>
          <p>
            New user? <span onClick={() => navigate('/register')} style={styles.link}>Create an account</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh', 
    backgroundColor: '#f8fafc',
    fontFamily: 'Arial, sans-serif'
  },
  card: { 
    background: '#ffffff', 
    padding: '40px', 
    borderRadius: '12px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
    width: '100%', 
    maxWidth: '400px' 
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { margin: '0', color: '#1a202c', fontSize: '24px' },
  subtitle: { color: '#718096', fontSize: '14px', marginTop: '8px' },
  inputGroup: { marginBottom: '20px' },
  label: { 
    display: 'block', 
    marginBottom: '8px', 
    fontSize: '14px', 
    fontWeight: '600', 
    color: '#4a5568' 
  },
  input: { 
    width: '100%', 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    boxSizing: 'border-box',
    fontSize: '16px'
  },
  button: { 
    width: '100%', 
    padding: '14px', 
    backgroundColor: '#3182ce', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background 0.2s'
  },
  footer: { marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#718096' },
  link: { color: '#3182ce', cursor: 'pointer', fontWeight: 'bold' }
};

export default AuthLogin;
