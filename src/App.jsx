import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HomeownerProvider } from './contexts/HomeownerContext';
import { ProviderProfileProvider } from './contexts/ProviderContext';
import { AdminProvider } from './contexts/AdminContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import ProviderLayout from './layouts/ProviderLayout';
import HomeownerLayout from './layouts/HomeownerLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Pricing from './pages/public/Pricing';
import NotFound from './pages/public/NotFound';
import AIConcierge from './pages/public/AIConcierge';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Homeowner Pages
import HomeownerDashboard from './pages/homeowner/Dashboard';
import HomeownerProfile from './pages/homeowner/Profile';
import HomeownerProjects from './pages/homeowner/Projects';
import HomeownerProjectDetail from './pages/homeowner/ProjectDetail';
import HomeownerProviders from './pages/homeowner/Providers';
import HomeownerMessages from './pages/homeowner/Messages';
import HomeownerSettings from './pages/homeowner/Settings';
import VisionBoards from './pages/homeowner/VisionBoards';
import VisionBoardDetail from './pages/homeowner/VisionBoardDetail';

// Provider Pages
import ProviderDashboard from './pages/provider/Dashboard';
import ProviderProfile from './pages/provider/Profile';
import ProviderJobs from './pages/provider/Jobs';
import ProviderMessages from './pages/provider/Messages';
import ProviderSettings from './pages/provider/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProviders from './pages/admin/Providers';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

// Community Pages
import CommunityHub from './pages/community/CommunityHub';
import ProjectDetails from './pages/community/ProjectDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="ai-concierge" element={<AIConcierge />} />
            <Route path="community" element={<CommunityHub />} />
            <Route path="community/project/:id" element={<ProjectDetails />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>

          {/* Homeowner Routes */}
          <Route path="/homeowner" element={<HomeownerLayout />}>
            <Route element={<HomeownerProvider />}>
              <Route path="dashboard" element={<HomeownerDashboard />} />
              <Route path="profile" element={<HomeownerProfile />} />
              <Route path="projects" element={<HomeownerProjects />} />
              <Route path="projects/:id" element={<HomeownerProjectDetail />} />
              <Route path="providers" element={<HomeownerProviders />} />
              <Route path="messages" element={<HomeownerMessages />} />
              <Route path="settings" element={<HomeownerSettings />} />
              <Route path="vision-boards" element={<VisionBoards />} />
              <Route path="vision-boards/:id" element={<VisionBoardDetail />} />
            </Route>
          </Route>

          {/* Provider Routes */}
          <Route path="/provider" element={<ProviderLayout />}>
            <Route element={<ProviderProfileProvider />}>
              <Route path="dashboard" element={<ProviderDashboard />} />
              <Route path="profile" element={<ProviderProfile />} />
              <Route path="jobs" element={<ProviderJobs />} />
              <Route path="messages" element={<ProviderMessages />} />
              <Route path="settings" element={<ProviderSettings />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route element={<AdminProvider />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="providers" element={<AdminProviders />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
