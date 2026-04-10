import React, { useState, useEffect } from 'react';
import API from '../api';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        // We pass the email as a query parameter to match the Java @RequestParam
        const res = await API.get(`/auth/me?email=${email}`);
        setUser(res.data);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Loading Health Profile...</div>;

  return (
    <div style={{ padding: '30px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', pb: '10px' }}>
        <h1>Welcome, {user?.fullName || "Patient"}</h1>
        <button onClick={() => { localStorage.clear(); window.location.href='/'; }}>Logout</button>
      </header>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px #ddd' }}>
          <h3>Vitals</h3>
          <p><strong>Blood Pressure:</strong> {user?.bloodPressure || 'N/A'}</p>
          <p><strong>Heart Rate:</strong> {user?.heartRate || 0} BPM</p>
        </div>
        
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px #ddd' }}>
          <h3>AI Diagnosis</h3>
          <p>{user?.diagnosisSummary || "No AI notes available."}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
