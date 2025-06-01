import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const RoleRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const { activeRole, loading: roleLoading } = useApp();

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!activeRole) {
    return <Navigate to="/user-type-selection" replace />;
  }

  if (activeRole !== requiredRole) {
    // Redirect to the appropriate dashboard based on active role
    if (activeRole === 'homeowner') {
      return <Navigate to="/homeowner/dashboard" replace />;
    } else if (activeRole === 'provider') {
      return <Navigate to="/provider/dashboard" replace />;
    } else if (activeRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user-type-selection" replace />;
    }
  }

  return children;
};

export default RoleRoute;
