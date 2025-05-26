import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ApiKeyService } from '../lib/integrations';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [adminRole, setAdminRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        setError(null);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Check if the user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select(`
            *,
            role:role_id (
              id,
              name,
              permissions
            )
          `)
          .eq('user_id', user.id)
          .single();
        
        if (adminError && adminError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw adminError;
        }
        
        if (adminData) {
          setAdminUser(adminData);
          setAdminRole(adminData.role);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        setError('Failed to load admin data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    loadAdminData();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadAdminData();
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Check if the admin has a specific permission
  const hasPermission = (category, permission) => {
    if (!adminRole || !adminRole.permissions) return false;
    
    const categoryPermissions = adminRole.permissions[category];
    if (!categoryPermissions) return false;
    
    return categoryPermissions[permission] === true;
  };

  // Create a new API key
  const createApiKey = async (keyData) => {
    if (!hasPermission('api_management', 'manage_keys')) {
      throw new Error('You do not have permission to create API keys');
    }
    
    return ApiKeyService.createApiKey(keyData);
  };

  // Revoke an API key
  const revokeApiKey = async (id) => {
    if (!hasPermission('api_management', 'manage_keys')) {
      throw new Error('You do not have permission to revoke API keys');
    }
    
    return ApiKeyService.revokeApiKey(id);
  };

  const value = {
    adminUser,
    adminRole,
    loading,
    error,
    isAdmin: !!adminUser,
    hasPermission,
    createApiKey,
    revokeApiKey
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
