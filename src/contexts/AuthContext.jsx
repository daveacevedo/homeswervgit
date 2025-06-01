import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check active session and set the user
    const session = supabase.auth.getSession();
    setUser(session?.user || null);
    setLoading(false);

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update password function
  const updatePassword = async (password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create test users function (for development only)
  const createTestUsers = async () => {
    try {
      // Create admin user
      const adminEmail = 'admin@example.com';
      const adminPassword = 'password123';
      
      const { data: adminData, error: adminError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
      });
      
      if (adminError) throw adminError;
      
      // Add admin role
      if (adminData?.user) {
        await supabase
          .from('user_roles')
          .insert([
            { user_id: adminData.user.id, role: 'admin', is_primary: true }
          ]);
      }
      
      // Create homeowner user
      const homeownerEmail = 'homeowner@example.com';
      const homeownerPassword = 'password123';
      
      const { data: homeownerData, error: homeownerError } = await supabase.auth.signUp({
        email: homeownerEmail,
        password: homeownerPassword,
      });
      
      if (homeownerError) throw homeownerError;
      
      // Add homeowner role
      if (homeownerData?.user) {
        await supabase
          .from('user_roles')
          .insert([
            { user_id: homeownerData.user.id, role: 'homeowner', is_primary: true }
          ]);
      }
      
      // Create provider user
      const providerEmail = 'provider@example.com';
      const providerPassword = 'password123';
      
      const { data: providerData, error: providerError } = await supabase.auth.signUp({
        email: providerEmail,
        password: providerPassword,
      });
      
      if (providerError) throw providerError;
      
      // Add provider role
      if (providerData?.user) {
        await supabase
          .from('user_roles')
          .insert([
            { user_id: providerData.user.id, role: 'provider', is_primary: true }
          ]);
      }
      
      // Create multi-role user
      const multiRoleEmail = 'multirole@example.com';
      const multiRolePassword = 'password123';
      
      const { data: multiRoleData, error: multiRoleError } = await supabase.auth.signUp({
        email: multiRoleEmail,
        password: multiRolePassword,
      });
      
      if (multiRoleError) throw multiRoleError;
      
      // Add multiple roles
      if (multiRoleData?.user) {
        await supabase
          .from('user_roles')
          .insert([
            { user_id: multiRoleData.user.id, role: 'homeowner', is_primary: true },
            { user_id: multiRoleData.user.id, role: 'provider', is_primary: false }
          ]);
      }
      
      return {
        admin: { email: adminEmail, password: adminPassword },
        homeowner: { email: homeownerEmail, password: homeownerPassword },
        provider: { email: providerEmail, password: providerPassword },
        multiRole: { email: multiRoleEmail, password: multiRolePassword }
      };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    createTestUsers
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
