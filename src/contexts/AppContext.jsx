import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const { user } = useAuth() || { user: null };
  const [activeRole, setActiveRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  // Check what roles the user has
  useEffect(() => {
    if (!user) {
      setUserRoles([]);
      setLoading(false);
      return;
    }

    const fetchUserRoles = async () => {
      try {
        setLoading(true);
        
        // Check if user has a homeowner profile
        const { data: homeownerData, error: homeownerError } = await supabase
          .from('homeowner_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        // Check if user has a provider profile
        const { data: providerData, error: providerError } = await supabase
          .from('provider_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        const roles = [];
        if (homeownerData) roles.push('homeowner');
        if (providerData) roles.push('provider');
        
        setUserRoles(roles);
        
        // If user has only one role, set it as active
        if (roles.length === 1 && !activeRole) {
          setActiveRole(roles[0]);
        }
      } catch (error) {
        console.error('Error fetching user roles:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  // Determine active role based on URL path
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/homeowner')) {
      setActiveRole('homeowner');
    } else if (path.startsWith('/provider')) {
      setActiveRole('provider');
    } else if (userRoles.length === 1) {
      // Default to the only role if no specific path is matched
      setActiveRole(userRoles[0]);
    }
  }, [window.location.pathname, userRoles]);

  // Fetch user profile based on active role
  useEffect(() => {
    if (!user || !activeRole) {
      setUserProfile(null);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        let profileTable;
        
        if (activeRole === 'homeowner') {
          profileTable = 'homeowner_profiles';
        } else if (activeRole === 'provider') {
          profileTable = 'provider_profiles';
        } else {
          throw new Error('Invalid role');
        }

        const { data, error } = await supabase
          .from(profileTable)
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        setUserProfile(data);
      } catch (error) {
        console.error(`Error fetching ${activeRole} profile:`, error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, activeRole]);

  // Switch between roles
  const switchRole = (role) => {
    if (role !== 'homeowner' && role !== 'provider') {
      throw new Error('Invalid role');
    }
    
    setActiveRole(role);
    
    // Redirect to the appropriate dashboard
    if (role === 'homeowner') {
      window.location.href = '/homeowner/dashboard';
    } else {
      window.location.href = '/provider/dashboard';
    }
  };

  const value = {
    activeRole,
    userProfile,
    loading,
    error,
    switchRole,
    userRoles
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
