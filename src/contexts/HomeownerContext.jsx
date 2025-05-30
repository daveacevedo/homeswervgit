import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';

const HomeownerContext = createContext();

export function useHomeowner() {
  return useContext(HomeownerContext);
}

export function HomeownerProvider({ children }) {
  const { user } = useAuth();
  const [homeownerProfile, setHomeownerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch homeowner profile when user changes
  useEffect(() => {
    if (!user) {
      setHomeownerProfile(null);
      setLoading(false);
      return;
    }

    const fetchHomeownerProfile = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('homeowner_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        setHomeownerProfile(data);
      } catch (error) {
        console.error('Error fetching homeowner profile:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeownerProfile();
  }, [user]);

  // Update homeowner profile
  const updateHomeownerProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('homeowner_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setHomeownerProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating homeowner profile:', error.message);
      throw error;
    }
  };

  const value = {
    homeownerProfile,
    loading,
    error,
    updateHomeownerProfile
  };

  return (
    <HomeownerContext.Provider value={value}>
      {children}
    </HomeownerContext.Provider>
  );
}
