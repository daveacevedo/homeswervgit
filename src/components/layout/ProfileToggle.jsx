import React from 'react';
import { useApp } from '../../contexts/AppContext';

const ProfileToggle = () => {
  const { activeRole, setActiveRole, userRoles } = useApp();

  // If user only has one role, don't show the toggle
  if (!userRoles || userRoles.length <= 1) {
    return null;
  }

  const handleRoleChange = (e) => {
    setActiveRole(e.target.value);
  };

  return (
    <div className="flex items-center">
      <label htmlFor="role-select" className="sr-only">
        Select role
      </label>
      <div className="relative">
        <select
          id="role-select"
          name="role"
          className="block w-full pl-3 pr-10 py-2 text-sm text-gray-700 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
          value={activeRole}
          onChange={handleRoleChange}
        >
          {userRoles.includes('homeowner') && (
            <option value="homeowner">Homeowner</option>
          )}
          {userRoles.includes('provider') && (
            <option value="provider">Service Provider</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default ProfileToggle;
