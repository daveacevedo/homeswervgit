import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if a table exists
export async function tableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);
    
    if (error) {
      console.error('Error checking if table exists:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error in tableExists function:', error);
    return false;
  }
}

// Helper function to create admin_users table if it doesn't exist
export async function setupAdminTable() {
  try {
    // Check if admin_users table exists
    const adminTableExists = await tableExists('admin_users');
    
    if (!adminTableExists) {
      console.log('Creating admin_users table...');
      
      // Create admin_users table
      const { error: createTableError } = await supabase.rpc('create_admin_table');
      
      if (createTableError) {
        console.error('Error creating admin_users table:', createTableError);
        return false;
      }
      
      // Add test admin user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (userId) {
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert([
            { 
              id: userId,
              email: 'admin@example.com',
              role_id: 1, // Super Admin
              is_active: true
            }
          ]);
        
        if (insertError) {
          console.error('Error adding test admin user:', insertError);
          return false;
        }
      } else {
        console.error('No user ID available for admin user creation');
      }
      
      console.log('Admin table setup complete');
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error in setupAdminTable function:', error);
    return false;
  }
}
