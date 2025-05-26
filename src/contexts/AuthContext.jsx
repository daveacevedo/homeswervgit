import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for active session on load
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data && data.session) {
          setUser(data.session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          
          // If this is a new sign up, create a profile record
          if (event === 'SIGNED_IN') {
            try {
              // Check if profile exists
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              // If no profile exists, create one
              if (!existingProfile) {
                await supabase.from('profiles').insert({
                  id: session.user.id,
                  email: session.user.email,
                  role: 'homeowner' // Default role
                });
                
                // Also create a homeowner profile
                await supabase.from('homeowner_profiles').insert({
                  user_id: session.user.id
                });
              }
            } catch (error) {
              console.error('Error creating profile:', error);
            }
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Register a new user
  const register = async (email, password, role = 'homeowner') => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      return { data };
    } catch (error) {
      console.error('Error in registration:', error);
      setError(error.message);
      return { error };
    }
  };

  // Login an existing user
  const login = async (email, password) => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      return { data };
    } catch (error) {
      console.error('Error in login:', error);
      setError(error.message);
      return { error };
    }
  };

  // Logout the current user
  const logout = async () => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error in logout:', error);
      setError(error.message);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error in reset password:', error);
      setError(error.message);
      return { error };
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.message);
      return { error };
    }
  };

  // Get user profile
  const getUserProfile = async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (!user) return { error: 'No user logged in' };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    resetPassword,
    updatePassword,
    getUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
