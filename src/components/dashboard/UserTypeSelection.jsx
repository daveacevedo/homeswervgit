import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const UserTypeSelection = () => {
  const { userRoles, addUserRole, setActiveRole } = useApp();
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const roleOptions = [
    { id: 'homeowner', name: 'Homeowner', description: 'Find trusted professionals for your home projects', icon: '🏠' },
    { id: 'provider', name: 'Service Provider', description: 'Offer your services to homeowners', icon: '🔧' }
  ];

  // Filter out roles the user already has
  const availableRoles = roleOptions.filter(role => !userRoles.includes(role.id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError('Please select a role to continue');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Add the new role to the user
      await addUserRole(selectedRole);
      
      // Set the new role as active
      setActiveRole(selectedRole);
      
      // Redirect to the appropriate dashboard
      if (selectedRole === 'homeowner') {
        navigate('/homeowner/dashboard');
      } else if (selectedRole === 'provider') {
        navigate('/provider/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error adding role:', error);
    } finally {
      setLoading(false);
    }
  };

  // If user already has roles, show option to switch between them
  const handleSwitchRole = (role) => {
    setActiveRole(role);
    
    if (role === 'homeowner') {
      navigate('/homeowner/dashboard');
    } else if (role === 'provider') {
      navigate('/provider/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          {userRoles.length > 0 ? 'Choose Your Role' : 'Select Your Account Type'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {userRoles.length > 0 
            ? 'You can add a new role or switch to an existing one' 
            : 'Select how you want to use Home Swerv'}
        </p>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Existing roles section */}
      {userRoles.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Your Existing Roles</h3>
          <div className="mt-4 grid grid-cols-1 gap-4">
            {userRoles.map((role) => (
              <button
                key={role}
                onClick={() => handleSwitchRole(role)}
                className="relative block w-full rounded-lg border border-gray-300 bg-white p-6 text-left shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 text-2xl">
                    {role === 'homeowner' ? '🏠' : role === 'provider' ? '🔧' : role === 'admin' ? '👑' : '👤'}
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-medium text-gray-900">
                      {role === 'homeowner' ? 'Homeowner' : role === 'provider' ? 'Service Provider' : role === 'admin' ? 'Administrator' : role}
                    </p>
                    <p className="text-sm text-gray-500">
                      {role === 'homeowner' 
                        ? 'Find and hire service providers' 
                        : role === 'provider' 
                        ? 'Offer your services to homeowners' 
                        : role === 'admin' 
                        ? 'Manage the platform and users' 
                        : 'Access your account'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* New role selection section */}
      {availableRoles.length > 0 && (
        <form onSubmit={handleSubmit} className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">
            {userRoles.length > 0 ? 'Add a New Role' : 'Choose Your Role'}
          </h3>
          <div className="mt-4 space-y-4">
            {availableRoles.map((role) => (
              <div key={role.id} className="relative">
                <input
                  id={role.id}
                  name="role"
                  type="radio"
                  value={role.id}
                  checked={selectedRole === role.id}
                  onChange={() => setSelectedRole(role.id)}
                  className="sr-only"
                />
                <label
                  htmlFor={role.id}
                  className={`relative block rounded-lg border ${
                    selectedRole === role.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'
                  } bg-white p-6 text-left shadow-sm cursor-pointer hover:border-gray-400 focus:outline-none`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-2xl">{role.icon}</div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">{role.name}</p>
                      <p className="text-sm text-gray-500">{role.description}</p>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading || !selectedRole}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading || !selectedRole ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : userRoles.length > 0 ? (
                'Add Role'
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserTypeSelection;
