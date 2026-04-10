import React, { useState, useEffect } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        // If email is missing, don't even try the request
        if (!email) {
          setLoading(false);
          return;
        }
        
        const res = await API.get(`/auth/me?email=${email}`);
        setUser(res.data);
      } catch (err) {
        console.error("Fetch failed:", err);
        // Fallback user object if backend is down
        setUser({ fullName: "Patient", bloodPressure: "N/A", heartRate: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <p>Loading Health Records...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
        <h2 style={{ color: '#2563eb' }}>HealthAI</h2>
        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </nav>

      <main style={{ marginTop: '30px' }}>
        <h1>Welcome, {user?.fullName || "Guest"}</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {/* Vitals Card */}
          <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Your Vitals</h3>
            <p><strong>Blood Pressure:</strong> {user?.bloodPressure || 'N/A'}</p>
            <p><strong>Heart Rate:</strong> {user?.heartRate || 0} BPM</p>
          </div>

          {/* AI Insights Card */}
          <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>AI Summary</h3>
            <p style={{ lineHeight: '1.5' }}>
              {user?.diagnosisSummary || "Diagnosis notes will appear once analysis is complete."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
