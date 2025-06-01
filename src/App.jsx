import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import PrivateRoute from './components/auth/PrivateRoute';
import RoleRoute from './components/auth/RoleRoute';

// Public Pages
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import ForSale from './pages/ForSale';
import About from './pages/About';
import Contact from './pages/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import UserTypeSelection from './pages/auth/UserTypeSelection';

// Homeowner Pages
import HomeownerDashboard from './pages/homeowner/Dashboard';
import HomeownerProperties from './pages/homeowner/Properties';
import HomeownerPropertyDetail from './pages/homeowner/PropertyDetail';
import HomeownerProjects from './pages/homeowner/Projects';
import HomeownerProjectDetail from './pages/homeowner/ProjectDetail';
import HomeownerVisionBoard from './pages/homeowner/VisionBoard';
import HomeownerProviders from './pages/homeowner/Providers';
import HomeownerSettings from './pages/homeowner/Settings';

// Provider Pages
import ProviderDashboard from './pages/provider/Dashboard';
import ProviderJobs from './pages/provider/Jobs';
import ProviderJobDetail from './pages/provider/JobDetail';
import ProviderProfile from './pages/provider/Profile';
import ProviderSettings from './pages/provider/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProperties from './pages/admin/Properties';
import AdminProjects from './pages/admin/Projects';
import AdminProviders from './pages/admin/Providers';
import AdminSettings from './pages/admin/Settings';

// Layout Components
import MainLayout from './layouts/MainLayout';
import HomeownerLayout from './components/layouts/HomeownerLayout';
import ProviderLayout from './components/layouts/ProviderLayout';
import AdminLayout from './components/layouts/AdminLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Routes with MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/for-sale" element={<ForSale />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            
            {/* User Type Selection (Protected) */}
            <Route 
              path="/user-type-selection" 
              element={
                <PrivateRoute>
                  <UserTypeSelection />
                </PrivateRoute>
              } 
            />
            
            {/* Homeowner Routes */}
            <Route path="/homeowner" element={<HomeownerLayout />}>
              <Route 
                path="dashboard" 
                element={
                  <RoleRoute requiredRole="homeowner">
                    <HomeownerDashboard />
                  </RoleRoute>
                } 
              />
              <Route 
                path="properties" 
                element={
                  <RoleRoute requiredRole="homeowner">
                    <HomeownerProperties />
                  </RoleRoute>
                } 
              />
              <Route 
                path="properties/:propertyId" 
                element={
                  <RoleRoute requiredRole="homeowner">
                    <HomeownerPropertyDetail />
                  </RoleRoute>
                } 
              />
              <Route 
                path="projects" 
                element={
                  <RoleRoute requiredRole="homeowner">
                    <HomeownerProjects />
                  </RoleRoute>
                } 
              />
              <Route 
                path="projects/:projectId" 
                element={
                  <RoleRoute requiredRole="homeowner">
                    <HomeownerProjectDetail />
                  </RoleRoute>
                } 
              />
              <Route 
                path="vision-board" 
                element={
                  <RoleRoute requiredRole="homeowner">
                    <HomeownerVisionBoard />
                  </RoleRoute>
                } 
              />
              <Route 
                path="providers" 
                element={
                  <RoleRoute requiredRole="homeowner">
                    <HomeownerProviders />
                  </RoleRoute>
                } 
              />
              <Route 
                path="settings" 
                element={
                  <RoleRoute requiredRole="homeowner">
                    <HomeownerSettings />
                  </RoleRoute>
                } 
              />
            </Route>
            
            {/* Provider Routes */}
            <Route path="/provider" element={<ProviderLayout />}>
              <Route 
                path="dashboard" 
                element={
                  <RoleRoute requiredRole="provider">
                    <ProviderDashboard />
                  </RoleRoute>
                } 
              />
              <Route 
                path="jobs" 
                element={
                  <RoleRoute requiredRole="provider">
                    <ProviderJobs />
                  </RoleRoute>
                } 
              />
              <Route 
                path="jobs/:jobId" 
                element={
                  <RoleRoute requiredRole="provider">
                    <ProviderJobDetail />
                  </RoleRoute>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <RoleRoute requiredRole="provider">
                    <ProviderProfile />
                  </RoleRoute>
                } 
              />
              <Route 
                path="settings" 
                element={
                  <RoleRoute requiredRole="provider">
                    <ProviderSettings />
                  </RoleRoute>
                } 
              />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route 
                path="dashboard" 
                element={
                  <RoleRoute requiredRole="admin">
                    <AdminDashboard />
                  </RoleRoute>
                } 
              />
              <Route 
                path="users" 
                element={
                  <RoleRoute requiredRole="admin">
                    <AdminUsers />
                  </RoleRoute>
                } 
              />
              <Route 
                path="properties" 
                element={
                  <RoleRoute requiredRole="admin">
                    <AdminProperties />
                  </RoleRoute>
                } 
              />
              <Route 
                path="projects" 
                element={
                  <RoleRoute requiredRole="admin">
                    <AdminProjects />
                  </RoleRoute>
                } 
              />
              <Route 
                path="providers" 
                element={
                  <RoleRoute requiredRole="admin">
                    <AdminProviders />
                  </RoleRoute>
                } 
              />
              <Route 
                path="settings" 
                element={
                  <RoleRoute requiredRole="admin">
                    <AdminSettings />
                  </RoleRoute>
                } 
              />
            </Route>
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
