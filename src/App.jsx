import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';

// Import layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import HomeownerLayout from './components/layout/HomeownerLayout';
import ProviderLayout from './components/layout/ProviderLayout';

// Import pages
import Home from './pages/public/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/public/Pricing';
import Features from './pages/public/Features';
import ForSale from './pages/ForSale';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import UserTypeSelection from './components/dashboard/UserTypeSelection';

// Import admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';

// Import homeowner pages
import HomeownerDashboard from './pages/homeowner/Dashboard';
import HomeownerProfile from './pages/homeowner/Profile';
import HomeownerProjects from './pages/homeowner/Projects';

// Import provider pages
import ProviderDashboard from './pages/provider/Dashboard';
import ProviderProfile from './pages/provider/Profile';
import ProviderServices from './pages/provider/Services';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="features" element={<Features />} />
              <Route path="for-sale" element={<ForSale />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="user-type-selection" element={<UserTypeSelection />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </RoleProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Homeowner routes */}
            <Route
              path="/homeowner"
              element={
                <RoleProtectedRoute allowedRoles={['homeowner']}>
                  <HomeownerLayout />
                </RoleProtectedRoute>
              }
            >
              <Route path="dashboard" element={<HomeownerDashboard />} />
              <Route path="profile" element={<HomeownerProfile />} />
              <Route path="projects" element={<HomeownerProjects />} />
            </Route>

            {/* Provider routes */}
            <Route
              path="/provider"
              element={
                <RoleProtectedRoute allowedRoles={['provider']}>
                  <ProviderLayout />
                </RoleProtectedRoute>
              }
            >
              <Route path="dashboard" element={<ProviderDashboard />} />
              <Route path="profile" element={<ProviderProfile />} />
              <Route path="services" element={<ProviderServices />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
