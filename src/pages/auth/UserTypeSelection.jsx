import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function UserTypeSelection() {
  const { user } = useAuth();
  const { userRoles, activeRole, switchRole, loading } = useApp();
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If user already has an active role, redirect to appropriate dashboard
    if (user && activeRole) {
      redirectBasedOnRole(activeRole);
    }
    
    // Set the first role as selected by default if available
    if (userRoles.length > 0 && !selectedRole) {
      setSelectedRole(userRoles[0]);
    }
  }, [user, activeRole, userRoles]);

  const redirectBasedOnRole = (role) => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'homeowner') {
      navigate('/homeowner/dashboard');
    } else if (role === 'provider') {
      navigate('/provider/dashboard');
    }
  };

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    const success = await switchRole(selectedRole);
    setIsSubmitting(false);
    
    if (success) {
      redirectBasedOnRole(selectedRole);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Select Your Role
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose how you want to use Home Swerv
          </p>
        </div>
        
        {userRoles.length === 0 ? (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  No roles assigned
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You don't have any roles assigned yet. Please contact support for assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {userRoles.includes('admin') && (
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="admin"
                      name="userType"
                      type="radio"
                      checked={selectedRole === 'admin'}
                      onChange={() => setSelectedRole('admin')}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="admin" className="font-medium text-gray-700">
                      Administrator
                    </label>
                    <p className="text-gray-500">Manage the platform and users</p>
                  </div>
                </div>
              )}
              
              {userRoles.includes('homeowner') && (
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="homeowner"
                      name="userType"
                      type="radio"
                      checked={selectedRole === 'homeowner'}
                      onChange={() => setSelectedRole('homeowner')}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="homeowner" className="font-medium text-gray-700">
                      Homeowner
                    </label>
                    <p className="text-gray-500">Find and hire service providers for your home</p>
                  </div>
                </div>
              )}
              
              {userRoles.includes('provider') && (
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="provider"
                      name="userType"
                      type="radio"
                      checked={selectedRole === 'provider'}
                      onChange={() => setSelectedRole('provider')}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="provider" className="font-medium text-gray-700">
                      Service Provider
                    </label>
                    <p className="text-gray-500">Offer your services to homeowners</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedRole || isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
