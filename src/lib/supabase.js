import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your .env file.');
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  realtime: {
    timeout: 60000
  },
  global: {
    fetch: (...args) => fetch(...args)
  }
});

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  return {
    message: error.message || 'An unexpected error occurred',
    status: error.status || 500,
    details: error.details || null
  };
};

// Helper function to check if a table exists
export const tableExists = async (tableName) => {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .single();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};
