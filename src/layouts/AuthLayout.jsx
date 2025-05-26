import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthLayout = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col min-h-screen">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <a href="/" className="text-2xl font-bold text-blue-600">HomeServiceHub</a>
              </div>
              <nav className="flex space-x-4">
                <a href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                <a href="/about" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">About</a>
                <a href="/contact" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
                <a href="/pricing" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="flex-grow">
          <Outlet />
        </main>
        
        <footer className="bg-white">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-200 pt-6">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} HomeServiceHub. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
