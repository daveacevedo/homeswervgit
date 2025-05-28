import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useApp } from './contexts/AppContext';

// Layout components
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Provider pages
import ProviderDashboard from './pages/provider/Dashboard';
import ProviderProfile from './pages/provider/Profile';
import ProviderJobs from './pages/provider/Jobs';
import ProviderCalendar from './pages/provider/Calendar';
import ProviderMessages from './pages/provider/Messages';
import ProviderSettings from './pages/provider/Settings';

// Homeowner pages
import HomeownerDashboard from './pages/homeowner/Dashboard';
import HomeownerProfile from './pages/homeowner/Profile';
import HomeownerProjects from './pages/homeowner/Projects';
import HomeownerProviders from './pages/homeowner/Providers';
import HomeownerMessages from './pages/homeowner/Messages';
import HomeownerSettings from './pages/homeowner/Settings';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProviders from './pages/admin/Providers';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

// Community pages
import CommunityHub from './pages/community/CommunityHub';
import ProjectDetails from './pages/community/ProjectDetails';

// Public pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Pricing from './pages/public/Pricing';
import NotFound from './pages/public/NotFound';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { userProfile, loading: profileLoading } = useApp();
  
  const loading = authLoading || profileLoading;
  const userRole = userProfile?.role || 'homeowner';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${userRole}/dashboard`} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${userRole}/dashboard`} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Community routes - accessible to all */}
        <Route path="/community" element={<MainLayout />}>
          <Route index element={<CommunityHub />} />
          <Route path="project/:id" element={<ProjectDetails />} />
        </Route>

        {/* Provider routes */}
        <Route 
          path="/provider" 
          element={
            user && userRole === 'provider' 
              ? <MainLayout /> 
              : <Navigate to={user ? `/${userRole}/dashboard` : "/login"} />
          }
        >
          <Route path="dashboard" element={<ProviderDashboard />} />
          <Route path="profile" element={<ProviderProfile />} />
          <Route path="jobs" element={<ProviderJobs />} />
          <Route path="calendar" element={<ProviderCalendar />} />
          <Route path="messages" element={<ProviderMessages />} />
          <Route path="settings" element={<ProviderSettings />} />
        </Route>

        {/* Homeowner routes */}
        <Route 
          path="/homeowner" 
          element={
            user && (userRole === 'homeowner' || userRole === 'provider') 
              ? <MainLayout /> 
              : <Navigate to={user ? `/${userRole}/dashboard` : "/login"} />
          }
        >
          <Route path="dashboard" element={<HomeownerDashboard />} />
          <Route path="profile" element={<HomeownerProfile />} />
          <Route path="projects" element={<HomeownerProjects />} />
          <Route path="providers" element={<HomeownerProviders />} />
          <Route path="messages" element={<HomeownerMessages />} />
          <Route path="settings" element={<HomeownerSettings />} />
        </Route>

        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            user && userRole === 'admin' 
              ? <AdminLayout /> 
              : <Navigate to={user ? `/${userRole}/dashboard` : "/login"} />
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="providers" element={<AdminProviders />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
