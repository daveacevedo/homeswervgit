import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { AdminProvider } from "./contexts/AdminContext";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import HomeownerLayout from "./components/layout/HomeownerLayout";
import ProviderLayout from "./components/layout/ProviderLayout";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import UserTypeSelection from "./pages/auth/UserTypeSelection";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import ForSale from "./pages/ForSale";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminProperties from "./pages/admin/Properties";
import AdminSettings from "./pages/admin/Settings";

// Homeowner Pages
import HomeownerDashboard from "./pages/homeowner/Dashboard";
import HomeownerProperties from "./pages/homeowner/Properties";
import HomeownerSettings from "./pages/homeowner/Settings";
import HomeownerVisionBoard from "./pages/homeowner/VisionBoard";
import HomeownerProjects from "./pages/homeowner/Projects";
import CreateProject from "./pages/homeowner/CreateProject";
import ProjectDetail from "./pages/homeowner/ProjectDetail";

// Provider Pages
import ProviderDashboard from "./pages/provider/Dashboard";
import ProviderJobs from "./pages/provider/Jobs";
import ProviderSettings from "./pages/provider/Settings";

// Components
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AdminProvider>
            <Routes>
              {/* Public Routes */}
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
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <RoleProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </RoleProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="properties" element={<AdminProperties />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Homeowner Routes */}
              <Route
                path="/homeowner"
                element={
                  <RoleProtectedRoute requiredRole="homeowner">
                    <HomeownerLayout />
                  </RoleProtectedRoute>
                }
              >
                <Route path="dashboard" element={<HomeownerDashboard />} />
                <Route path="properties" element={<HomeownerProperties />} />
                <Route path="settings" element={<HomeownerSettings />} />
                <Route path="vision-board" element={<HomeownerVisionBoard />} />
                <Route path="projects" element={<HomeownerProjects />} />
                <Route path="projects/new" element={<CreateProject />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
              </Route>

              {/* Provider Routes */}
              <Route
                path="/provider"
                element={
                  <RoleProtectedRoute requiredRole="provider">
                    <ProviderLayout />
                  </RoleProtectedRoute>
                }
              >
                <Route path="dashboard" element={<ProviderDashboard />} />
                <Route path="jobs" element={<ProviderJobs />} />
                <Route path="settings" element={<ProviderSettings />} />
              </Route>
            </Routes>
          </AdminProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
