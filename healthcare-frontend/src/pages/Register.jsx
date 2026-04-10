import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',           // Matches Patient.java
    email: '',          // Matches Patient.java
    password: '',       // Matches Patient.java
    age: '',            // Matches Patient.java
    bloodPressure: '',  // Matches Patient.java
    heartRate: '',      // Matches Patient.java
    medicalHistory: ''  // Matches Patient.java
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // We send the full object to your Render backend
      await API.post('/auth/register', formData);
      toast.success("Account Created! Please Login.");
      navigate('/login');
    } catch (error) {
      console.error("Registration Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Patient Registration</h2>
        <p style={styles.subtitle}>Fill in your details to begin AI monitoring</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Full Name */}
          <div style={styles.inputGroup}>
            <label>Full Name</label>
            <input type="text" name="name" onChange={handleChange} required style={styles.input} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Email */}
            <div style={styles.inputGroup}>
              <label>Email</label>
              <input type="email" name="email" onChange={handleChange} required style={styles.input} />
            </div>
            {/* Password */}
            <div style={styles.inputGroup}>
              <label>Password</label>
              <input type="password" name="password" onChange={handleChange} required style={styles.input} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Age */}
            <div style={styles.inputGroup}>
              <label>Age</label>
              <input type="number" name="age" onChange={handleChange} required style={styles.input} />
            </div>
            {/* BP */}
            <div style={styles.inputGroup}>
              <label>Blood Pressure</label>
              <input type="text" name="bloodPressure" placeholder="120/80" onChange={handleChange} style={styles.input} />
            </div>
          </div>

          {/* Heart Rate */}
          <div style={styles.inputGroup}>
            <label>Heart Rate (BPM)</label>
            <input type="number" name="heartRate" onChange={handleChange} style={styles.input} />
          </div>

          {/* Medical History */}
          <div style={styles.inputGroup}>
            <label>Medical History</label>
            <textarea name="medicalHistory" onChange={handleChange} style={{...styles.input, height: '60px'}} />
          </div>

          <button type="submit" style={styles.button}>Create Patient Account</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', padding: '20px' },
  card: { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' },
  title: { textAlign: 'center', marginBottom: '10px' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '20px' },
  inputGroup: { marginBottom: '15px', flex: 1 },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Register;
