import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import register from './pages/register';
import AuthLogin from './pages/AuthLogin';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      {/* Global Notification System */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { 
            borderRadius: '12px', 
            background: '#333', 
            color: '#fff',
            fontSize: '14px'
          }
        }}
      />

      <Routes>
        {/* Public Access Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/register" element={<Register />} />

        {/* Secure Patient Routes */}
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute allowedRole="PATIENT">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Secure Doctor Routes */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRole="DOCTOR">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Security Fallback: Redirect invalid URLs to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
