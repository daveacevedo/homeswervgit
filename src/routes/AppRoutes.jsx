import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import PrivateRoute from '../components/auth/PrivateRoute';
import AdminRoutes from './AdminRoutes';
import ContentPage from '../pages/ContentPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Dynamic Content Pages */}
        <Route path="content/:slug" element={<ContentPage />} />
        
        <Route path="*" element={<NotFound />} />
      </Route>
      
      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <PrivateRoute>
            <AdminRoutes />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}
