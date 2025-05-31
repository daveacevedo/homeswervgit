import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        setAdminRole(null);
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check if user is an admin
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*, admin_roles(*)')
          .eq('id', user.id)
          .single();
        
        if (adminError && adminError.code !== 'PGRST116') {
          throw adminError;
        }
        
        if (!adminUser) {
          setIsAdmin(false);
          setAdminRole(null);
          setPermissions([]);
          setLoading(false);
          return;
        }
        
        setIsAdmin(true);
        setAdminRole(adminUser.admin_roles);
        
        // Fetch permissions for this admin
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('admin_role_permissions')
          .select(`
            admin_permissions(
              id,
              resource,
              action,
              description
            )
          `)
          .eq('role_id', adminUser.role_id);
        
        if (permissionsError) {
          throw permissionsError;
        }
        
        // Extract permissions from the nested structure
        const extractedPermissions = permissionsData.map(item => item.admin_permissions);
        setPermissions(extractedPermissions);
        
      } catch (error) {
        console.error('Error checking admin status:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    checkAdminStatus();
  }, [user]);

  // Check if user has a specific permission
  const hasPermission = (resource, action) => {
    if (!isAdmin) return false;
    
    // Super admins have all permissions
    if (adminRole?.name === 'Super Admin') return true;
    
    // Check specific permission
    return permissions.some(
      permission => permission.resource === resource && permission.action === action
    );
  };

  // Log admin action for audit trail
  const logAdminAction = async (action, entityType, entityId, details = {}) => {
    if (!user || !isAdmin) return;
    
    try {
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action,
          entity_type: entityType,
          entity_id: entityId,
          details
        });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  const value = {
    isAdmin,
    adminRole,
    permissions,
    loading,
    error,
    hasPermission,
    logAdminAction
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
