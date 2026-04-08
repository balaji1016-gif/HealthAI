import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  // 1. Get user data from local storage
  const user = JSON.parse(localStorage.getItem("user"));

  // 2. If no user is logged in, send them back to the Home/Login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. If the user's role doesn't match the required role for this page,
  // send them back to the Home page
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // 4. If everything is correct, show the requested page
  return children;
};

export default ProtectedRoute;