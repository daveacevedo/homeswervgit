import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const ProviderLayout = () => {
  return (
    <DashboardLayout userType="provider">
      <Outlet />
    </DashboardLayout>
  );
};

export default ProviderLayout;
