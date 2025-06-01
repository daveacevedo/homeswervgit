import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const { user, supabase } = useAuth();
  const [activeRole, setActiveRole] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRoles() {
      if (!user) {
        setUserRoles([]);
        setActiveRole(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch user roles from the database
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;

        // Extract roles from the data
        const roles = data.map(item => item.role);
        setUserRoles(roles);

        // Set active role (use stored preference or first available role)
        const storedRole = localStorage.getItem('activeRole');
        if (storedRole && roles.includes(storedRole)) {
          setActiveRole(storedRole);
        } else if (roles.length > 0) {
          setActiveRole(roles[0]);
          localStorage.setItem('activeRole', roles[0]);
        } else {
          setActiveRole(null);
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setUserRoles([]);
        setActiveRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRoles();
  }, [user, supabase]);

  // Update active role and store in localStorage
  const updateActiveRole = (role) => {
    if (userRoles.includes(role)) {
      setActiveRole(role);
      localStorage.setItem('activeRole', role);
    }
  };

  const value = {
    activeRole,
    setActiveRole: updateActiveRole,
    userRoles,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
