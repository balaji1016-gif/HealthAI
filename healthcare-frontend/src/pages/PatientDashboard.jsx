import React, { useState, useEffect } from 'react';
import API from '../api';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (email) {
          const res = await API.get(`/auth/me?email=${email}`);
          setUser(res.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <h1>Patient Portal</h1>
        <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
          Logout
        </button>
      </header>

      <main style={{ marginTop: '20px' }}>
        <h2>Welcome, {user?.fullName || "Patient"}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Vitals</h3>
            <p>Blood Pressure: {user?.bloodPressure || 'N/A'}</p>
            <p>Heart Rate: {user?.heartRate || 0} BPM</p>
          </div>

          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>AI Summary</h3>
            <p>{user?.diagnosisSummary || "No data available."}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
