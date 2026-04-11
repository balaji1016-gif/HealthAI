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

    // Clean the data before sending to prevent 500 errors
    const payload = {
      ...formData,
      age: parseInt(formData.age) || 0,
      bloodPressure: formData.bloodPressure || "Not Provided",
      heartRate: formData.heartRate || "Not Provided"
    };

    try {
      const response = await API.post('/auth/register', payload);
      if (response.status === 201) {
        toast.success("Account Created Successfully!");
        navigate('/login');
      }
    } catch (error) {
      console.error("Full Error Object:", error);
      const errorMessage = error.response?.data || "Server Error (500)";
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Patient Signup</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={styles.input} />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
          <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required style={styles.input} />
          <input type="text" name="bloodPressure" placeholder="Blood Pressure (120/80)" value={formData.bloodPressure} onChange={handleChange} style={styles.input} />
          <input type="text" name="heartRate" placeholder="Heart Rate (BPM)" value={formData.heartRate} onChange={handleChange} style={styles.input} />
          <textarea name="medicalHistory" placeholder="Past Medical Conditions" value={formData.medicalHistory} onChange={handleChange} style={styles.textarea} />
          
          <button type="submit" disabled={loading} style={loading ? styles.buttonDisabled : styles.button}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          Already registered? <Link to="/login" style={{ color: '#28a745', fontWeight: 'bold', textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', padding: '20px' },
  card: { background: '#fff', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd', height: '80px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  buttonDisabled: { width: '100%', padding: '12px', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'not-allowed' }
};

export default Register;
