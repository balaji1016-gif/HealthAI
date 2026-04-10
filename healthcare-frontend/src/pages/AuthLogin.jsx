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
    const load = toast.loading("Logging in...");
    try {
      const res = await API.post('/auth/login', credentials);
      
      // Save data for the Dashboard to use
      localStorage.setItem('token', res.data.id); // Or actual JWT
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userEmail', res.data.email); 

      toast.success("Welcome back!", { id: load });

      // Direct redirect
      window.location.href = res.data.role === 'DOCTOR' ? '/doctor-dashboard' : '/patient-dashboard';
    } catch (err) {
      toast.error("Login failed", { id: load });
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>HealthAI Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        <label htmlFor="email">Email</label><br/>
        <input id="email" name="email" type="email" autoComplete="email" onChange={handleChange} required /><br/><br/>
        
        <label htmlFor="password">Password</label><br/>
        <input id="password" name="password" type="password" autoComplete="current-password" onChange={handleChange} required /><br/><br/>
        
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default AuthLogin;
