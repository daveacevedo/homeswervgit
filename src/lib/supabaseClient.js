import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  
  // Return a user-friendly error message
  if (error.code === 'PGRST116') {
    return 'No data found.';
  } else if (error.code === '23505') {
    return 'This record already exists.';
  } else if (error.code === '23503') {
    return 'This operation would violate referential integrity.';
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred. Please try again later.';
  }
};
