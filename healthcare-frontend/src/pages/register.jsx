import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api'; 
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    bloodPressure: '',
    heartRate: '',
    medicalHistory: '',
    role: 'PATIENT'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calls your Render backend
      await API.post('/auth/register', formData);
      toast.success("Registration Successful!");
      navigate('/login');
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data || "Registration Failed";
      toast.error(typeof errorMsg === 'string' ? errorMsg : "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Patient Registration</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={styles.input} />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={styles.input} />
          <input type="number" name="age" placeholder="Age" onChange={handleChange} required style={styles.input} />
          <input type="text" name="bloodPressure" placeholder="BP (e.g., 120/80)" onChange={handleChange} style={styles.input} />
          <input type="number" name="heartRate" placeholder="Heart Rate" onChange={handleChange} style={styles.input} />
          <textarea name="medicalHistory" placeholder="Medical History" onChange={handleChange} style={styles.textarea} />
          
          <button type="submit" disabled={loading} style={loading ? styles.buttonDisabled : styles.button}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#28a745', fontWeight: 'bold', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', padding: '20px' },
  card: { background: '#fff', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px' },
  textarea: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd', height: '80px', boxSizing: 'border-box', fontSize: '14px' },
  button: { width: '100%', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  buttonDisabled: { width: '100%', padding: '12px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'not-allowed', fontWeight: 'bold', fontSize: '16px' }
};

export default Register;
