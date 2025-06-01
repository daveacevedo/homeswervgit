import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

const RoleSwitcher = ({ isMobile = false }) => {
  const { user } = useAuth();
  const { activeRole, setActiveRole, userRoles } = useApp();
  const navigate = useNavigate();

  if (!user || !userRoles || userRoles.length <= 1) {
    return null;
  }

  const handleRoleChange = (role) => {
    setActiveRole(role);
    
    // Redirect to the appropriate dashboard based on the selected role
    if (role === 'homeowner') {
      navigate('/homeowner/dashboard');
    } else if (role === 'provider') {
      navigate('/provider/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  // Mobile version
  if (isMobile) {
    return (
      <div className="space-y-1">
        {userRoles.map((role) => (
          <button
            key={role}
            onClick={() => handleRoleChange(role)}
            className={`block w-full text-left px-4 py-2 text-base font-medium ${
              activeRole === role
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Switch to {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="relative inline-block text-left">
      <select
        value={activeRole}
        onChange={(e) => handleRoleChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
      >
        {userRoles.map((role) => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleSwitcher;
