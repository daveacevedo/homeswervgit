import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { HomeownerProvider } from './contexts/HomeownerContext';
import { ProviderProvider } from './contexts/ProviderContext';
import { AdminProvider } from './contexts/AdminContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import HomeownerLayout from './layouts/HomeownerLayout';
import ProviderLayout from './layouts/ProviderLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Features from './pages/public/Features';
import Pricing from './pages/public/Pricing';
import Testimonials from './pages/public/Testimonials';
import HomeownerFeatures from './pages/public/HomeownerFeatures';
import ProviderFeatures from './pages/public/ProviderFeatures';
import SiteMap from './pages/public/SiteMap';
import RealEstateMarketplace from './pages/public/RealEstateMarketplace';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import UserTypeSelection from './pages/auth/UserTypeSelection';
import HomeownerProfileSetup from './pages/auth/HomeownerProfileSetup';
import ProviderProfileSetup from './pages/auth/ProviderProfileSetup';

// Homeowner Pages
import HomeownerDashboard from './pages/homeowner/Dashboard';
import HomeownerProfile from './pages/homeowner/Profile';
import HomeownerProjects from './pages/homeowner/Projects';
import CreateProject from './pages/homeowner/CreateProject';
import HomeownerMessages from './pages/homeowner/Messages';
import HomeownerSettings from './pages/homeowner/Settings';

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
import AdminContent from './pages/admin/Content';
import AdminSettings from './pages/admin/Settings';

// Protected Route Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/admin/AdminRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <AppProvider>
            <HomeownerProvider>
              <ProviderProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/features/homeowners" element={<HomeownerFeatures />} />
                    <Route path="/features/providers" element={<ProviderFeatures />} />
                    <Route path="/features/testimonials" element={<Testimonials />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/site-map" element={<SiteMap />} />
                    <Route path="/real-estate" element={<RealEstateMarketplace />} />
                  </Route>

                  {/* Auth Routes */}
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route 
                      path="/user-type-selection" 
                      element={
                        <ProtectedRoute>
                          <UserTypeSelection />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/homeowner-profile-setup" 
                      element={
                        <ProtectedRoute>
                          <HomeownerProfileSetup />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/provider-profile-setup" 
                      element={
                        <ProtectedRoute>
                          <ProviderProfileSetup />
                        </ProtectedRoute>
                      } 
                    />
                  </Route>

                  {/* Homeowner Routes */}
                  <Route 
                    element={
                      <ProtectedRoute>
                        <HomeownerLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/homeowner/dashboard" element={<HomeownerDashboard />} />
                    <Route path="/homeowner/profile" element={<HomeownerProfile />} />
                    <Route path="/homeowner/projects" element={<HomeownerProjects />} />
                    <Route path="/homeowner/projects/new" element={<CreateProject />} />
                    <Route path="/homeowner/messages" element={<HomeownerMessages />} />
                    <Route path="/homeowner/settings" element={<HomeownerSettings />} />
                  </Route>

                  {/* Provider Routes */}
                  <Route 
                    element={
                      <ProtectedRoute>
                        <ProviderLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                    <Route path="/provider/profile" element={<ProviderProfile />} />
                    <Route path="/provider/jobs" element={<ProviderJobs />} />
                    <Route path="/provider/messages" element={<ProviderMessages />} />
                    <Route path="/provider/settings" element={<ProviderSettings />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route 
                    element={<AdminRoute />}
                  >
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/providers" element={<AdminProviders />} />
                    <Route path="/admin/content" element={<AdminContent />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Route>

                  {/* Catch-all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ProviderProvider>
            </HomeownerProvider>
          </AppProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
