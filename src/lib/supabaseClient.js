import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zpnpsyiwguqwzldzptyp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbnBzeWl3Z3Vxd3psZHpwdHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODM1MDUsImV4cCI6MjA2MjY1OTUwNX0.M10chqsOxOa6F0XgwRIrjcLa1n3AUGKtbFKKXL5VAs8';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  return {
    error: {
      message: error.message || 'An unexpected error occurred',
      status: error.status || 500,
      details: error.details || null,
    },
  };
};

// Export a function to get user profile
export const getUserProfile = async (userId) => {
  try {
    if (!userId) return { data: null, error: { message: 'User ID is required' } };
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Export a function to update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    if (!userId) return { data: null, error: { message: 'User ID is required' } };
    if (!updates) return { data: null, error: { message: 'Update data is required' } };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return handleSupabaseError(error);
  }
};
