import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const ProviderLayout = () => {
  const { user, loading, providerProfile } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have a provider profile, redirect to create profile
  if (!providerProfile && !loading) {
    return <Navigate to="/provider/create-profile" replace />;
  }

  return (
    <DashboardLayout userType="provider">
      <Outlet />
    </DashboardLayout>
  );
};

export default ProviderLayout;
