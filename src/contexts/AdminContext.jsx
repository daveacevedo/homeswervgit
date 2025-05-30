import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';

const AdminContext = createContext();

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }) {
  const { user } = useAuth();
  const [adminRole, setAdminRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch admin role and permissions when user changes
  useEffect(() => {
    if (!user) {
      setAdminRole(null);
      setPermissions([]);
      setLoading(false);
      return;
    }

    const fetchAdminRole = async () => {
      try {
        setLoading(true);
        
        // Check if user has an admin role
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (adminError && adminError.code !== 'PGRST116') {
          throw adminError;
        }

        if (!adminData) {
          setAdminRole(null);
          setPermissions([]);
          return;
        }

        setAdminRole(adminData.role);
        
        // Fetch permissions for this role
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('admin_role_permissions')
          .select('permission_category, permission_name')
          .eq('role', adminData.role);
          
        if (permissionsError) throw permissionsError;
        
        setPermissions(permissionsData || []);
      } catch (error) {
        console.error('Error fetching admin data:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminRole();
  }, [user]);

  // Check if user has a specific permission
  const hasPermission = (category, name) => {
    if (!adminRole) return false;
    
    // Super admin has all permissions
    if (adminRole === 'super_admin') return true;
    
    return permissions.some(
      p => p.permission_category === category && p.permission_name === name
    );
  };

  const value = {
    adminRole,
    permissions,
    loading,
    error,
    hasPermission,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
