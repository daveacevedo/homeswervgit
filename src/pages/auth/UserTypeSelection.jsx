import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  
  const selectHomeowner = async () => {
    try {
      // Update user profile with user type
      await updateUserProfile({
        userType: 'homeowner'
      });
      
      // Navigate to homeowner profile setup
      navigate('/homeowner-profile-setup');
    } catch (error) {
      console.error('Error setting user type:', error);
    }
  };
  
  const selectProvider = async () => {
    try {
      // Update user profile with user type
      await updateUserProfile({
        userType: 'provider'
      });
      
      // Navigate to provider profile setup
      navigate('/provider-profile-setup');
    } catch (error) {
      console.error('Error setting user type:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-blue-600.svg"
          alt="Home Swerv"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Choose your account type
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select how you want to use Home Swerv
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div 
              onClick={selectHomeowner}
              className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="mt-2 block text-lg font-medium text-gray-900">
                I'm a Homeowner
              </span>
              <p className="mt-1 text-sm text-gray-500">
                Find trusted service providers for your home projects and maintenance needs.
              </p>
            </div>
            
            <div 
              onClick={selectProvider}
              className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="mt-2 block text-lg font-medium text-gray-900">
                I'm a Service Provider
              </span>
              <p className="mt-1 text-sm text-gray-500">
                Connect with homeowners and grow your business with new clients.
              </p>
            </div>
            
            <div className="text-sm text-center mt-6">
              <p className="text-gray-500">
                You can always add another account type later from your profile settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
