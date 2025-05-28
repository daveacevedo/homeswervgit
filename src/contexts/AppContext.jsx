import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Fetch user profile when auth user changes
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Query the profiles table to get the user's profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [user]);

  // Fetch notifications when user profile changes
  useEffect(() => {
    async function fetchNotifications() {
      if (!user) {
        setNotifications([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }

    fetchNotifications();
  }, [user, userProfile]);

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
      return { data: null, error };
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      return { error: null };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { error };
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setNotifications(
        notifications.map((notification) => ({ ...notification, read: true }))
      );

      return { error: null };
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return { error };
    }
  };

  const value = {
    userProfile,
    loading,
    error,
    notifications,
    updateProfile,
    markNotificationAsRead,
    clearAllNotifications
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
