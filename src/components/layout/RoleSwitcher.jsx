import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const RoleSwitcher = ({ isMobile = false }) => {
  const { userRoles, activeRole, switchRole } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Don't render if user has only one role
  if (userRoles.length <= 1) {
    return null;
  }

  const handleRoleSwitch = async (role) => {
    if (role === activeRole) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const success = await switchRole(role);
    setIsLoading(false);
    setIsOpen(false);

    if (success) {
      // Redirect to appropriate dashboard
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'homeowner') {
        navigate('/homeowner/dashboard');
      } else if (role === 'provider') {
        navigate('/provider/dashboard');
      }
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'homeowner':
        return 'Homeowner';
      case 'provider':
        return 'Service Provider';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-1">
        {userRoles.map((role) => (
          <button
            key={role}
            onClick={() => handleRoleSwitch(role)}
            disabled={isLoading}
            className={`block w-full text-left px-4 py-2 text-base font-medium ${
              role === activeRole
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Switch to {getRoleName(role)}
            {role === activeRole && ' (Current)'}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="-ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
        {getRoleName(activeRole)}
        <svg className="-mr-1 ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {userRoles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  role === activeRole
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                role="menuitem"
              >
                Switch to {getRoleName(role)}
                {role === activeRole && ' (Current)'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
