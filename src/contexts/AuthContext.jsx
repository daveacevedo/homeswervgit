import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getInitialSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email, password) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  // Sign out
  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  // Reset password
  const resetPassword = async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  // Update password
  const updatePassword = async (newPassword) => {
    return await supabase.auth.updateUser({
      password: newPassword,
    });
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
