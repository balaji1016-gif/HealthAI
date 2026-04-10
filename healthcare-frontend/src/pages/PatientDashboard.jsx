import React, { useState, useEffect } from 'react';
import API from '../api';

const PatientDashboard = () => {
  const [user, setUser] = useState(null); // Initially null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Replace with your actual profile endpoint (e.g., /api/patients/me)
        const res = await API.get('/auth/me'); 
        setUser(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- THE FIX ---
  // This prevents the "Cannot read properties of null" error
  if (loading) {
    return <div style={styles.loading}>Loading Health Profile...</div>;
  }

  return (
    <div style={styles.container}>
      <h1>Patient Dashboard</h1>
      {/* Use Optional Chaining (?.) for extra safety */}
      <div style={styles.card}>
        <h3>Welcome, {user?.fullName}</h3> 
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Age:</strong> {user?.age}</p>
        <p><strong>Blood Pressure:</strong> {user?.bloodPressure}</p>
        <hr />
        <h4>AI Diagnosis Summary</h4>
        <p>{user?.diagnosisSummary || "No AI notes yet."}</p>
      </div>
    </div>
  );
};

const styles = {
  loading: { display: 'flex', justifyContent: 'center', marginTop: '50px', fontSize: '20px' },
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  card: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }
};

export default PatientDashboard;
