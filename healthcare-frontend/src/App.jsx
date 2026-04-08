import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Home from './pages/Home';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      {/* Professional Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '16px', background: '#333', color: '#fff' }
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute allowedRole="PATIENT">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRole="DOCTOR">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;