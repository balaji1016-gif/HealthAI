import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Hits your Render backend: https://healthai-nx8q.onrender.com/api/auth/login
      const response = await API.post('/auth/login', credentials);
      
      const { token, role, name } = response.data;

      // 1. Store the token and role for the ProtectedRoute
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userName', name);

      toast.success(`Welcome back, ${name}!`);

      // 2. Role-Based Redirection
      if (role === 'PATIENT') {
        navigate('/patient-dashboard');
      } else if (role === 'DOCTOR') {
        navigate('/doctor-dashboard');
      } else {
        toast.error("Unauthorized role detected.");
      }

    } catch (error) {
      console.error("Login Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Secure Login</h2>
        <p style={styles.subtitle}>Access your AI Healthcare Dashboard</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Enter your password" 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={loading ? {...styles.button, opacity: 0.7} : styles.button}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <span onClick={() => navigate('/register')} style={styles.link}>Register here</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  },
  title: { margin: '0 0 10px 0', color: '#333' },
  subtitle: { color: '#666', marginBottom: '30px' },
  form: { textAlign: 'left' },
  inputGroup: { marginBottom: '20px' },
  input: {
    width: '100%',
    padding: '12px',
    marginTop: '5px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background 0.3s'
  },
  footerText: { marginTop: '20px', fontSize: '14px', color: '#666' },
  link: { color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;
