import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const ProviderContext = createContext();

export function useProvider() {
  return useContext(ProviderContext);
}

export function ProviderProvider({ children }) {
  const { user } = useAuth();
  const [providerProfile, setProviderProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create provider profile
  const createProviderProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('provider_profiles')
        .insert([
          { 
            user_id: user.id,
            business_name: profileData.business_name,
            contact_name: profileData.contact_name,
            email: profileData.email,
            phone: profileData.phone || null,
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      setProviderProfile(data);
      return data;
    } catch (error) {
      console.error('Error creating provider profile:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get provider profile
  const getProviderProfile = async () => {
    if (!user) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setProviderProfile(data || null);
      return data;
    } catch (error) {
      console.error('Error fetching provider profile:', error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update provider profile
  const updateProviderProfile = async (profileData) => {
    if (!user) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('provider_profiles')
        .update(profileData)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setProviderProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating provider profile:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    providerProfile,
    loading,
    error,
    createProviderProfile,
    getProviderProfile,
    updateProviderProfile,
  };

  return (
    <ProviderContext.Provider value={value}>
      {children}
    </ProviderContext.Provider>
  );
}
