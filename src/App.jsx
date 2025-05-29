import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

// Public pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Pricing from './pages/public/Pricing';
import Contact from './pages/public/Contact';
import NotFound from './pages/public/NotFound';

// Feature pages
import ForHomeowners from './pages/features/ForHomeowners';
import ForProviders from './pages/features/ForProviders';
import FeaturePricing from './pages/features/Pricing';
import Testimonials from './pages/features/Testimonials';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import UserTypeSelection from './components/dashboard/UserTypeSelection';

// Homeowner pages
import HomeownerDashboard from './pages/homeowner/Dashboard';
import HomeownerProjects from './pages/homeowner/Projects';
import HomeownerServices from './pages/homeowner/Services';
import HomeownerRewards from './pages/homeowner/Rewards';
import HomeownerProfile from './pages/homeowner/Profile';
import HomeownerSettings from './pages/homeowner/Settings';

// Provider pages
import ProviderDashboard from './pages/provider/Dashboard';
import ProviderJobs from './pages/provider/Jobs';
import ProviderClients from './pages/provider/Clients';
import ProviderCalendar from './pages/provider/Calendar';
import ProviderProfile from './pages/provider/Profile';
import ProviderSettings from './pages/provider/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Feature pages */}
        <Route path="/features/homeowners" element={<ForHomeowners />} />
        <Route path="/features/providers" element={<ForProviders />} />
        <Route path="/features/pricing" element={<FeaturePricing />} />
        <Route path="/features/testimonials" element={<Testimonials />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          {/* User type selection */}
          <Route path="/user-type-selection" element={<UserTypeSelection />} />
          
          {/* Homeowner routes */}
          <Route path="/homeowner/dashboard" element={<HomeownerDashboard />} />
          <Route path="/homeowner/projects" element={<HomeownerProjects />} />
          <Route path="/homeowner/services" element={<HomeownerServices />} />
          <Route path="/homeowner/rewards" element={<HomeownerRewards />} />
          <Route path="/homeowner/profile" element={<HomeownerProfile />} />
          <Route path="/homeowner/settings" element={<HomeownerSettings />} />
          
          {/* Provider routes */}
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/jobs" element={<ProviderJobs />} />
          <Route path="/provider/clients" element={<ProviderClients />} />
          <Route path="/provider/calendar" element={<ProviderCalendar />} />
          <Route path="/provider/profile" element={<ProviderProfile />} />
          <Route path="/provider/settings" element={<ProviderSettings />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
