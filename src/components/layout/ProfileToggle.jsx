import React from 'react';
import { useApp } from '../../contexts/AppContext';

function ProfileToggle() {
  const { activeRole, switchRole, userRoles } = useApp() || { 
    activeRole: null, 
    switchRole: () => {}, 
    userRoles: [] 
  };

  const handleRoleSwitch = (role) => {
    if (switchRole) {
      switchRole(role);
    }
  };

  // If user doesn't have multiple roles, don't show the toggle
  if (!userRoles || userRoles.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {userRoles.includes('homeowner') && (
        <button
          onClick={() => handleRoleSwitch('homeowner')}
          className={`px-3 py-1 text-sm rounded-full ${
            activeRole === 'homeowner'
              ? 'bg-blue-100 text-blue-800 font-medium'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Homeowner
        </button>
      )}
      {userRoles.includes('provider') && (
        <button
          onClick={() => handleRoleSwitch('provider')}
          className={`px-3 py-1 text-sm rounded-full ${
            activeRole === 'provider'
              ? 'bg-blue-100 text-blue-800 font-medium'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Provider
        </button>
      )}
    </div>
  );
}

export default ProfileToggle;
