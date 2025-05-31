import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import AdminLayout from '../../layouts/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminRoute() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  // Show loading spinner while checking authentication and admin status
  if (authLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to home if authenticated but not an admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Render admin layout with outlet for nested routes
  return <AdminLayout />;
}
