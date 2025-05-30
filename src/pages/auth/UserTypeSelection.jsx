import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [updating, setUpdating] = React.useState(false);
  const [error, setError] = React.useState('');

  // Check if user already has a profile type
  React.useEffect(() => {
    const checkUserProfile = async () => {
      if (!user) return;
      
      try {
        // Check if user has a homeowner profile
        const { data: homeownerData } = await supabase
          .from('homeowner_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        // Check if user has a provider profile
        const { data: providerData } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        // If user already has a profile, redirect to the appropriate dashboard
        if (homeownerData && !providerData) {
          navigate('/homeowner/dashboard');
        } else if (providerData && !homeownerData) {
          navigate('/provider/dashboard');
        }
        // If user has both profiles or no profile, stay on this page
      } catch (error) {
        console.error('Error checking user profile:', error);
      }
    };
    
    checkUserProfile();
  }, [user, navigate]);

  const handleRoleSelection = async (role) => {
    if (!user) return;
    
    setUpdating(true);
    setError('');
    
    try {
      // Update the user's profile in the profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('user_id', user.id);
        
      if (updateError) throw updateError;
      
      // Create a specific profile based on the role
      if (role === 'homeowner') {
        // Create homeowner profile
        const { error: homeownerError } = await supabase
          .from('homeowner_profiles')
          .insert([{ user_id: user.id }]);
          
        if (homeownerError) throw homeownerError;
        
        // Redirect to homeowner profile setup
        navigate('/homeowner-profile-setup');
      } else if (role === 'provider') {
        // Create provider profile
        const { error: providerError } = await supabase
          .from('provider_profiles')
          .insert([{ user_id: user.id }]);
          
        if (providerError) throw providerError;
        
        // Redirect to provider profile setup
        navigate('/provider-profile-setup');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      setError(error.message || 'Failed to update user role. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Home Swerv</h1>
        <p className="mt-2 text-lg text-gray-600">
          Please select how you'd like to use our platform
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Homeowner Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-blue-500 transition-all">
          <div className="p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">I'm a Homeowner</h2>
            <p className="text-gray-600 text-center mb-6">
              Find trusted service providers, manage home projects, and track maintenance schedules.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Find qualified service providers</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Manage home renovation projects</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Track maintenance schedules</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Earn rewards for completed projects</span>
              </li>
            </ul>
            <button
              onClick={() => handleRoleSelection('homeowner')}
              disabled={updating}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Continue as Homeowner'}
            </button>
          </div>
        </div>

        {/* Service Provider Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-green-500 transition-all">
          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">I'm a Service Provider</h2>
            <p className="text-gray-600 text-center mb-6">
              Connect with homeowners, manage jobs, and grow your business with our platform.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Find new clients and projects</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Manage your schedule and jobs</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Showcase your services and expertise</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Build your reputation with reviews</span>
              </li>
            </ul>
            <button
              onClick={() => handleRoleSelection('provider')}
              disabled={updating}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Continue as Service Provider'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Not sure which to choose? You can always switch between roles or create both profiles later.
        </p>
      </div>
    </div>
  );
};

export default UserTypeSelection;
