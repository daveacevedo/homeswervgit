import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const { user } = useAuth();
  const [adminRole, setAdminRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAdminData() {
      if (!user) {
        setAdminRole(null);
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*, admin_roles(*)')
          .eq('id', user.id)
          .single();
          
        if (adminError) {
          if (adminError.code !== 'PGRST116') { // Not found error
            throw adminError;
          }
          // User is not an admin
          setAdminRole(null);
          setPermissions([]);
          setLoading(false);
          return;
        }
        
        if (adminData) {
          // User is an admin
          setAdminRole(adminData.admin_roles);
          
          // Fetch permissions for this admin role
          const { data: permissionsData, error: permissionsError } = await supabase
            .from('admin_role_permissions')
            .select('*, admin_permissions(*)')
            .eq('role_id', adminData.role_id);
            
          if (permissionsError) throw permissionsError;
          
          if (permissionsData) {
            const formattedPermissions = permissionsData.map(p => ({
              id: p.admin_permissions.id,
              resource: p.admin_permissions.resource,
              action: p.admin_permissions.action
            }));
            
            setPermissions(formattedPermissions);
          }
        } else {
          setAdminRole(null);
          setPermissions([]);
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, [user]);

  // Function to check if admin has a specific permission
  const hasPermission = (resource, action) => {
    if (!adminRole) return false;
    
    return permissions.some(
      p => p.resource === resource && p.action === action
    );
  };

  const value = {
    adminRole,
    permissions,
    loading,
    error,
    hasPermission
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  return useContext(AdminContext);
}
