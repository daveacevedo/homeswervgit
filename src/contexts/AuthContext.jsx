import { createContext, useContext, useState, useEffect } from 'react';
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
        
        if (data?.session) {
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
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );
    
    // Clean up subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign up with email and password
  const signup = async (email, password, metadata = {}) => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message);
      return { data: null, error };
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.message);
      return { data: null, error };
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Error logging out:', error);
      setError(error.message);
      return { error };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error.message);
      return { error };
    }
  };

  // Update user
  const updateUser = async (updates) => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.updateUser(updates);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message);
      return { data: null, error };
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
