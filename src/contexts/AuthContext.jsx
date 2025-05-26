import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create context
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [providerProfile, setProviderProfile] = useState(null);
  const [homeownerProfile, setHomeownerProfile] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user || null);
        
        if (initialSession?.user) {
          await fetchUserRole(initialSession.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      
      if (newSession?.user) {
        await fetchUserRole(newSession.user.id);
      } else {
        setUserRole(null);
        setProviderProfile(null);
        setHomeownerProfile(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      // First check if user is a provider
      const { data: providerData, error: providerError } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (providerData) {
        setUserRole('provider');
        setProviderProfile(providerData);
        return;
      }

      // Then check if user is a homeowner
      const { data: homeownerData, error: homeownerError } = await supabase
        .from('homeowner_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (homeownerData) {
        setUserRole('homeowner');
        setHomeownerProfile(homeownerData);
        return;
      }

      // Check if user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (adminData) {
        setUserRole('admin');
        return;
      }

      // Default to homeowner if no specific role found
      setUserRole('homeowner');
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const login = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const register = async (email, password, role = 'homeowner') => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (!error && data?.user) {
      // Create profile based on role
      if (role === 'provider') {
        await supabase.from('provider_profiles').insert([
          { user_id: data.user.id, email: email }
        ]);
      } else {
        await supabase.from('homeowner_profiles').insert([
          { user_id: data.user.id, email: email }
        ]);
      }
    }
    
    return { data, error };
  };

  const logout = async () => {
    return await supabase.auth.signOut();
  };

  const resetPassword = async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  const updatePassword = async (newPassword) => {
    return await supabase.auth.updateUser({ password: newPassword });
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    providerProfile,
    homeownerProfile,
    supabase,
    login,
    register,
    logout,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
