import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          // Fetch user profile based on role
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          setUser(session?.user || null);
          
          if (session?.user) {
            // Fetch user profile based on role
            await fetchUserProfile(session.user.id);
          } else {
            setProviderProfile(null);
            setHomeownerProfile(null);
            setUserRole(null);
          }
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);
  
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await getUserProfile(userId);
      
      if (error) throw error;
      
      if (data) {
        setUserRole(data.role);
        
        if (data.role === 'provider') {
          setProviderProfile(data);
        } else if (data.role === 'homeowner') {
          setHomeownerProfile(data);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  const getUserProfile = async (userId) => {
    try {
      // First check if user is a provider
      const { data: providerData, error: providerError } = await supabase
        .from('providers')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!providerError && providerData) {
        return { data: { ...providerData, role: 'provider' }, error: null };
      }
      
      // If not a provider, check if user is a homeowner
      const { data: homeownerData, error: homeownerError } = await supabase
        .from('homeowners')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!homeownerError && homeownerData) {
        return { data: { ...homeownerData, role: 'homeowner' }, error: null };
      }
      
      // If not a homeowner, check if user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!adminError && adminData) {
        return { data: { ...adminData, role: 'admin' }, error: null };
      }
      
      return { data: null, error: new Error('User profile not found') };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return { data: null, error };
    }
  };
  
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };
  
  const register = async (email, password, role = 'homeowner', profileData = {}) => {
    try {
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Create profile based on role
      if (data.user) {
        const userId = data.user.id;
        const baseProfile = {
          id: userId,
          email: data.user.email,
          created_at: new Date().toISOString(),
          ...profileData
        };
        
        if (role === 'provider') {
          await supabase.from('providers').insert([baseProfile]);
        } else {
          await supabase.from('homeowners').insert([baseProfile]);
        }
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };
  
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };
  
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };
  
  const updateProfile = async (profileData, role = userRole) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    try {
      let table = '';
      
      if (role === 'provider') {
        table = 'providers';
      } else if (role === 'homeowner') {
        table = 'homeowners';
      } else if (role === 'admin') {
        table = 'admins';
      } else {
        throw new Error('Invalid role specified');
      }
      
      const { data, error } = await supabase
        .from(table)
        .update(profileData)
        .eq('id', user.id)
        .select();
      
      if (error) throw error;
      
      if (role === 'provider') {
        setProviderProfile(data[0]);
      } else if (role === 'homeowner') {
        setHomeownerProfile(data[0]);
      }
      
      return { data: data[0], error: null };
    } catch (error) {
      return { data: null, error };
    }
  };
  
  const value = {
    user,
    session,
    loading,
    userRole,
    providerProfile,
    homeownerProfile,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    getUserProfile,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
