import React, { useState, useEffect } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        setUser({ fullName: "Patient", bloodPressure: "N/A", heartRate: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
        <h1>Welcome, {user?.fullName}</h1>
        <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
      </header>

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Vitals</h3>
          <p>BP: {user?.bloodPressure}</p>
          <p>Heart Rate: {user?.heartRate} BPM</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>AI Summary</h3>
          <p>{user?.diagnosisSummary || "No reports found."}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
