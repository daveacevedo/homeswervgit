import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const HomeownerContext = createContext();

export function useHomeowner() {
  return useContext(HomeownerContext);
}

export function HomeownerProvider({ children }) {
  const { user } = useAuth();
  const [homeownerProfile, setHomeownerProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create homeowner profile
  const createHomeownerProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('homeowner_profiles')
        .insert([
          { 
            user_id: user.id,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: profileData.email,
            phone: profileData.phone || null,
            address: profileData.address || null,
            city: profileData.city || null,
            state: profileData.state || null,
            zip_code: profileData.zip_code || null,
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      setHomeownerProfile(data);
      return data;
    } catch (error) {
      console.error('Error creating homeowner profile:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get homeowner profile
  const getHomeownerProfile = async () => {
    if (!user) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('homeowner_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setHomeownerProfile(data || null);
      return data;
    } catch (error) {
      console.error('Error fetching homeowner profile:', error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update homeowner profile
  const updateHomeownerProfile = async (profileData) => {
    if (!user) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('homeowner_profiles')
        .update(profileData)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setHomeownerProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating homeowner profile:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    homeownerProfile,
    loading,
    error,
    createHomeownerProfile,
    getHomeownerProfile,
    updateHomeownerProfile,
  };

  return (
    <HomeownerContext.Provider value={value}>
      {children}
    </HomeownerContext.Provider>
  );
}
