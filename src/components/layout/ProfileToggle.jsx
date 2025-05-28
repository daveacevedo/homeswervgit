import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@headlessui/react';
import { useApp } from '../../contexts/AppContext';

function ProfileToggle() {
  const { activeRole, hasMultipleRoles, switchRole, loading } = useApp();
  const navigate = useNavigate();
  
  if (!hasMultipleRoles) {
    return null;
  }
  
  const isProvider = activeRole === 'provider';
  
  const handleToggle = async () => {
    const newRole = isProvider ? 'homeowner' : 'provider';
    await switchRole(newRole);
    
    // Navigate to the appropriate dashboard
    if (newRole === 'provider') {
      navigate('/provider/dashboard');
    } else {
      navigate('/homeowner/dashboard');
    }
  };
  
  return (
    <div className="flex items-center space-x-3">
      <span className={`text-sm ${!isProvider ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
        Homeowner
      </span>
      
      <Switch
        checked={isProvider}
        onChange={handleToggle}
        disabled={loading}
        className={`${
          isProvider ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span className="sr-only">Toggle user role</span>
        <span
          className={`${
            isProvider ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      
      <span className={`text-sm ${isProvider ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
        Provider
      </span>
    </div>
  );
}

export default ProfileToggle;
