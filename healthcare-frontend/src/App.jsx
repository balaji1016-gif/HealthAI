import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import your components (Ensure filenames match your project exactly)
import AuthLogin from './pages/AuthLogin';
import Register from './pages/register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Home from './pages/Home';

// Protected Route Component
// This prevents users from typing /patient-dashboard in the URL without logging in
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role?.toUpperCase() !== allowedRole.toUpperCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      {/* Toast notifications will appear globally */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Patient Route */}
        <Route 
          path="/patient-dashboard" 
          element={
            <ProtectedRoute allowedRole="PATIENT">
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Doctor Route */}
        <Route 
          path="/doctor-dashboard" 
          element={
            <ProtectedRoute allowedRole="DOCTOR">
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all: redirect unknown URLs to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
