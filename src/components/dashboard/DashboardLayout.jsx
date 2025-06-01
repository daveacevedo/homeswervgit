import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProfileToggle from '../layout/ProfileToggle';

const DashboardLayout = ({ children, userType }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto mr-2"
                src="https://tailwindui.com/img/logos/workflow-mark-blue-600.svg"
                alt="Home Swerv"
              />
              <span className="text-xl font-bold text-gray-900">Home Swerv</span>
            </Link>
            <span className="ml-4 text-sm text-gray-500">
              {userType === 'homeowner' ? 'Homeowner Dashboard' : 
               userType === 'provider' ? 'Service Provider Dashboard' : 
               'Admin Dashboard'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Role Toggle Component */}
            <ProfileToggle />
            
            <div className="relative">
              <button
                type="button"
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="ml-2 text-gray-700">{user?.email}</span>
              </button>
            </div>
            
            <button
              onClick={handleSignOut}
              className="ml-2 px-3 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      
      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
