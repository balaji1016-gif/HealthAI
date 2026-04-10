import React, { useState, useEffect } from 'react';
import API from '../api'; // Ensure this points to your axios config
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Attempting to fetch the profile from your Spring Boot backend
        const res = await API.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch failed (404):", err);
        
        // FALLBACK: If your backend endpoint isn't ready, 
        // we use data from localStorage or dummy data to prevent a crash.
        const savedRole = localStorage.getItem('role');
        setUser({
          fullName: "Valued Patient", // Fallback name
          email: "Data Syncing...",
          role: savedRole || "PATIENT",
          bloodPressure: "--/--",
          heartRate: 0,
          diagnosisSummary: "Waiting for backend synchronization..."
        });

        toast.error("Profile data not found on server. Using local session.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 1. LOADING GUARD: Prevents "Cannot read properties of null"
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Fetching your health records...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>HealthAI</h2>
        <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} style={styles.logoutBtn}>
          Logout
        </button>
      </nav>

      <main style={styles.main}>
        <header style={styles.header}>
          {/* 2. OPTIONAL CHAINING: user?.fullName protects the UI */}
          <h1>Welcome, {user?.fullName || "User"}</h1>
          <p style={styles.date}>{new Date().toLocaleDateString()} | Patient Portal</p>
        </header>

        <div style={styles.grid}>
          {/* Vitals Card */}
          <div style={styles.card}>
            <h3>Current Vitals</h3>
            <div style={styles.vitalsRow}>
              <span>Blood Pressure:</span>
              <strong style={styles.value}>{user?.bloodPressure || "N/A"}</strong>
            </div>
            <div style={styles.vitalsRow}>
              <span>Heart Rate:</span>
              <strong style={styles.value}>{user?.heartRate || 0} BPM</strong>
            </div>
