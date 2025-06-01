import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading: authLoading } = useAuth();
  const { activeRole, loading: appLoading } = useApp();

  // Show loading state if auth or app context is still loading
  if (authLoading || appLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have an active role yet, redirect to role selection
  if (!activeRole) {
    return <Navigate to="/user-type-selection" replace />;
  }

  // If user's active role is not in the allowed roles, redirect to appropriate dashboard
  if (!allowedRoles.includes(activeRole)) {
    // Redirect based on their active role
    if (activeRole === 'homeowner') {
      return <Navigate to="/homeowner/dashboard" replace />;
    } else if (activeRole === 'provider') {
      return <Navigate to="/provider/dashboard" replace />;
    } else if (activeRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      // Fallback to user type selection if role is unknown
      return <Navigate to="/user-type-selection" replace />;
    }
  }

  // If all checks pass, render the protected content
  return children;
};

export default RoleProtectedRoute;
