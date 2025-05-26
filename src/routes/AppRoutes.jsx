import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Lazy-loaded components
// Auth pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

// Public pages
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const ServicesPage = lazy(() => import('../pages/Services'));
const Contact = lazy(() => import('../pages/public/Contact'));
const ProviderDirectory = lazy(() => import('../pages/homeowner/FindProviders'));
const ProviderProfile = lazy(() => import('../pages/homeowner/ProviderDetail'));

// Dashboard pages
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Projects = lazy(() => import('../pages/dashboard/Projects'));
const ProjectDetails = lazy(() => import('../pages/dashboard/ProjectDetails'));
const VisionBoard = lazy(() => import('../pages/dashboard/VisionBoard'));
const Messages = lazy(() => import('../pages/dashboard/Messages'));
const Notifications = lazy(() => import('../pages/dashboard/Notifications'));
const Settings = lazy(() => import('../pages/dashboard/Settings'));
const Profile = lazy(() => import('../pages/dashboard/Profile'));

// AI pages
const AIHub = lazy(() => import('../pages/ai/AIHub'));
const ConversationView = lazy(() => import('../components/ai/ConversationView'));
const ConversationsList = lazy(() => import('../components/ai/ConversationsList'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminProviders = lazy(() => import('../pages/admin/AdminProviders'));
const AdminProjects = lazy(() => import('../pages/admin/AdminProjects'));
const AdminReports = lazy(() => import('../pages/admin/AdminReports'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

// Provider pages
const ProviderDashboard = lazy(() => import('../pages/provider/ProviderDashboard'));
const ProviderJobs = lazy(() => import('../pages/provider/ProviderJobs'));
const ProviderClients = lazy(() => import('../pages/provider/ProviderClients'));
const ProviderSettings = lazy(() => import('../pages/provider/ProviderSettings'));
const ProviderServices = lazy(() => import('../pages/provider/Services'));

const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Show loading state while auth state is being determined
  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="contact" element={<Contact />} />
          <Route path="providers" element={<ProviderDirectory />} />
          <Route path="providers/:providerId" element={<ProviderProfile />} />
        </Route>

        {/* Auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={user ? <DashboardLayout /> : <Navigate to="/auth/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetails />} />
          <Route path="vision-board" element={<VisionBoard />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* AI Concierge routes */}
        <Route
          path="/ai"
          element={user ? <DashboardLayout /> : <Navigate to="/auth/login" replace />}
        >
          <Route index element={<AIHub />} />
          <Route path="conversations" element={<ConversationsList />} />
          <Route path="conversations/:conversationId" element={<ConversationView />} />
        </Route>

        {/* Provider routes */}
        <Route
          path="/provider"
          element={user ? <DashboardLayout /> : <Navigate to="/auth/login" replace />}
        >
          <Route index element={<ProviderDashboard />} />
          <Route path="jobs" element={<ProviderJobs />} />
          <Route path="clients" element={<ProviderClients />} />
          <Route path="settings" element={<ProviderSettings />} />
          <Route path="services" element={<ProviderServices />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={user ? <AdminLayout /> : <Navigate to="/auth/login" replace />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="providers" element={<AdminProviders />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
