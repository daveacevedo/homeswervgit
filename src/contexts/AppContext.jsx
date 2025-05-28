import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useHomeowner } from './HomeownerContext';
import { useProvider } from './ProviderContext';
import { supabase } from '../lib/supabaseClient';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const { user } = useAuth();
  const homeownerContext = useHomeowner();
  const providerContext = useProvider();
  
  // Safely destructure the context values
  const homeownerProfile = homeownerContext?.homeownerProfile;
  const getHomeownerProfile = homeownerContext?.getHomeownerProfile;
  const providerProfile = providerContext?.providerProfile;
  const getProviderProfile = providerContext?.getProviderProfile;
  
  const [activeRole, setActiveRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMultipleRoles, setHasMultipleRoles] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);

  // Load user profiles and determine roles
  useEffect(() => {
    const loadUserProfiles = async () => {
      if (!user || !getHomeownerProfile || !getProviderProfile) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch both profiles
        const [homeowner, provider] = await Promise.all([
          getHomeownerProfile(),
          getProviderProfile()
        ]);
        
        // Fetch user preferences
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setUserPreferences(preferences);
        
        // Determine if user has multiple roles
        const hasHomeowner = !!homeowner;
        const hasProvider = !!provider;
        const multipleRoles = hasHomeowner && hasProvider;
        
        setHasMultipleRoles(multipleRoles);
        
        // Set active role based on preferences or default to available role
        let role = null;
        
        if (multipleRoles) {
          // If user has preferences, use default_role
          if (preferences?.default_role) {
            role = preferences.default_role;
          } else {
            // Default to homeowner if both roles exist
            role = 'homeowner';
          }
        } else if (hasHomeowner) {
          role = 'homeowner';
        } else if (hasProvider) {
          role = 'provider';
        }
        
        setActiveRole(role);
        
        // Set the active profile based on role
        if (role === 'homeowner') {
          setUserProfile(homeowner);
        } else if (role === 'provider') {
          setUserProfile(provider);
        }
      } catch (error) {
        console.error('Error loading user profiles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfiles();
  }, [user, getHomeownerProfile, getProviderProfile]);

  // Switch between roles
  const switchRole = async (newRole) => {
    if (!user || !hasMultipleRoles) return;
    
    try {
      setLoading(true);
      
      // Update active role
      setActiveRole(newRole);
      
      // Update user profile based on new role
      if (newRole === 'homeowner') {
        setUserProfile(homeownerProfile);
      } else if (newRole === 'provider') {
        setUserProfile(providerProfile);
      }
      
      // Save preference to database
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          default_role: newRole,
          updated_at: new Date()
        });
      
      if (error) throw error;
      
      // Update local preferences
      setUserPreferences({
        ...userPreferences,
        default_role: newRole
      });
    } catch (error) {
      console.error('Error switching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    activeRole,
    userProfile,
    hasMultipleRoles,
    userPreferences,
    loading,
    switchRole
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
