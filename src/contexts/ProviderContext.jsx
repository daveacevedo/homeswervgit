import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';

const ProviderContext = createContext();

export function useProvider() {
  return useContext(ProviderContext);
}

export function ProviderProvider({ children }) {
  const { user } = useAuth();
  const [providerProfile, setProviderProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch provider profile when user changes
  useEffect(() => {
    if (!user) {
      setProviderProfile(null);
      setLoading(false);
      return;
    }

    const fetchProviderProfile = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        setProviderProfile(data);
      } catch (error) {
        console.error('Error fetching provider profile:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderProfile();
  }, [user]);

  // Update provider profile
  const updateProviderProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('provider_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProviderProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating provider profile:', error.message);
      throw error;
    }
  };

  const value = {
    providerProfile,
    loading,
    error,
    updateProviderProfile
  };

  return (
    <ProviderContext.Provider value={value}>
      {children}
    </ProviderContext.Provider>
  );
}
