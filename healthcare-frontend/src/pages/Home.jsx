import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container" style={styles.container}>
      <header style={styles.header}>
        <h1>AI Healthcare Dashboard</h1>
        <p>Advanced Health Monitoring & AI-Powered Insights</p>
      </header>

      <div style={styles.cardContainer}>
        {/* Patient Card */}
        <div style={styles.card}>
          <h3>For Patients</h3>
          <p>Track your vitals, view AI health analysis, and manage your medical records.</p>
          <div style={styles.buttonGroup}>
            <button 
              onClick={() => navigate('/login')} 
              style={styles.loginBtn}
            >
              Patient Login
            </button>
            <button 
              onClick={() => navigate('/register')} 
              style={styles.registerBtn}
            >
              Register as Patient
            </button>
          </div>
        </div>

        {/* Doctor Card */}
        <div style={styles.card}>
          <h3>For Doctors</h3>
          <p>Monitor patient statistics, review AI suggestions, and manage clinical data.</p>
          <div style={styles.buttonGroup}>
            <button 
              onClick={() => navigate('/login')} 
              style={styles.doctorBtn}
            >
              Doctor Login
            </button>
            {/* Typically doctors are registered by admins, but you can add a link here if needed */}
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; 2026 AI Health Systems | B.E. Computer Science Project</p>
      </footer>
    </div>
  );
};

// Simple Inline Styles for the Demo
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '50px 20px',
    backgroundColor: '#f4f7f6',
    minHeight: '100vh'
  },
  header: {
    marginBottom: '50px'
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap'
  },
  card: {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px'
  },
  loginBtn: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  registerBtn: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  doctorBtn: {
    padding: '10px',
    backgroundColor: '#6f42c1',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  footer: {
    marginTop: '100px',
    color: '#777'
  }
};

export default Home;
