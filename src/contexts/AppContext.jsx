import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState([]);
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user roles when user changes
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
        
        // Check if user is an admin first
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (adminData) {
          // User is an admin
          setUserRoles(['admin']);
          setActiveRole('admin');
          setLoading(false);
          return;
        }
        
        // If not admin, check regular user roles
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data && data.length > 0) {
          const roles = data.map(role => role.role);
          setUserRoles(roles);
          
          // Find primary role or use the first one
          const primaryRole = data.find(role => role.is_primary);
          setActiveRole(primaryRole ? primaryRole.role : data[0].role);
        } else {
          setUserRoles([]);
          setActiveRole(null);
        }
      } catch (err) {
        console.error('Error fetching user roles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRoles();
  }, [user]);

  // Function to switch active role
  const switchRole = async (newRole) => {
    if (!user || !userRoles.includes(newRole)) {
      return false;
    }

    try {
      setActiveRole(newRole);
      
      // Update primary role in database if it's not admin
      // (admin is handled separately in admin_users table)
      if (newRole !== 'admin') {
        await supabase
          .from('user_roles')
          .update({ is_primary: false })
          .eq('user_id', user.id);
          
        await supabase
          .from('user_roles')
          .update({ is_primary: true })
          .eq('user_id', user.id)
          .eq('role', newRole);
      }
      
      return true;
    } catch (err) {
      console.error('Error switching role:', err);
      setError(err.message);
      return false;
    }
  };

  const value = {
    userRoles,
    activeRole,
    loading,
    error,
    switchRole
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
