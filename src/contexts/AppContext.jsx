import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [activeRole, setActiveRole] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user roles when user changes
  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setUserRoles([]);
        setActiveRole(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch roles from the database
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Extract role names
          const roles = data.map(item => item.role);
          setUserRoles(roles);
          
          // Find primary role or use the first one
          const primaryRole = data.find(item => item.is_primary);
          if (primaryRole) {
            setActiveRole(primaryRole.role);
          } else {
            setActiveRole(roles[0]);
          }
        } else {
          // If no roles found, set default role
          setUserRoles(['homeowner']);
          setActiveRole('homeowner');
          
          // Create default role in database
          await supabase
            .from('user_roles')
            .insert([
              { user_id: user.id, role: 'homeowner', is_primary: true }
            ]);
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  // Update primary role when active role changes
  useEffect(() => {
    const updatePrimaryRole = async () => {
      if (!user || !activeRole) return;

      try {
        // First, set all roles to not primary
        await supabase
          .from('user_roles')
          .update({ is_primary: false })
          .eq('user_id', user.id);
        
        // Then set the active role as primary
        await supabase
          .from('user_roles')
          .update({ is_primary: true })
          .eq('user_id', user.id)
          .eq('role', activeRole);
      } catch (error) {
        console.error('Error updating primary role:', error);
      }
    };

    if (user && activeRole) {
      updatePrimaryRole();
    }
  }, [user, activeRole]);

  // Function to add a new role to the user
  const addUserRole = async (role) => {
    if (!user) return;

    try {
      // Check if role already exists
      if (userRoles.includes(role)) {
        return;
      }

      // Add role to database
      const { error } = await supabase
        .from('user_roles')
        .insert([
          { user_id: user.id, role, is_primary: userRoles.length === 0 }
        ]);
      
      if (error) {
        throw error;
      }

      // Update local state
      setUserRoles([...userRoles, role]);
      
      // If this is the first role, set it as active
      if (userRoles.length === 0) {
        setActiveRole(role);
      }
    } catch (error) {
      console.error('Error adding user role:', error);
    }
  };

  // Function to remove a role from the user
  const removeUserRole = async (role) => {
    if (!user) return;

    try {
      // Don't allow removing the last role
      if (userRoles.length <= 1) {
        return;
      }

      // Remove role from database
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id)
        .eq('role', role);
      
      if (error) {
        throw error;
      }

      // Update local state
      const updatedRoles = userRoles.filter(r => r !== role);
      setUserRoles(updatedRoles);
      
      // If active role was removed, set a new active role
      if (activeRole === role) {
        setActiveRole(updatedRoles[0]);
      }
    } catch (error) {
      console.error('Error removing user role:', error);
    }
  };

  const value = {
    activeRole,
    setActiveRole,
    userRoles,
    addUserRole,
    removeUserRole,
    loading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
