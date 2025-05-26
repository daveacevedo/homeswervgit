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
      async (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
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

  // Login with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.message);
      throw error;
    }
  };

  // Sign up with email and password
  const signup = async (email, password) => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error);
      setError(error.message);
      throw error;
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
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error.message);
      throw error;
    }
  };

  // Update password
  const updatePassword = async (password) => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    updatePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
