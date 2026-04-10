import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

const AuthLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Logging in...");
    try {
      const response = await API.post('/auth/login', credentials);
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      toast.success("Login Successful!", { id: loadingToast });
      
      setTimeout(() => {
        const normalizedRole = role ? role.toUpperCase() : '';
        if (normalizedRole === 'PATIENT') navigate('/patient-dashboard');
        else if (normalizedRole === 'DOCTOR') navigate('/doctor-dashboard');
        else navigate('/');
      }, 150);
    } catch (error) {
      toast.error("Login Failed", { id: loadingToast });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>HealthAI Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="login-email" style={styles.label}>Email</label>
            <input id="login-email" type="email" name="email" autoComplete="email" onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="login-password" style={styles.label}>Password</label>
            <input id="login-password" type="password" name="password" autoComplete="current-password" onChange={handleChange} required style={styles.input} />
          </div>
          {/* LINE 87 IS HERE - CHECK BRACKETS CAREFULLY */}
          <button type="submit" style={styles.button}>
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9' },
  card: { background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', marginBottom: '25px', color: '#1e293b' },
  inputGroup: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#334155' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' },
  button: { width: '100%', padding: '14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default AuthLogin;
