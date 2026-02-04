import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect unauthenticated users to sign-in
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
