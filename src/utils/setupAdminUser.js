import { supabase } from './supabaseClient';

// This function creates the admin user and assigns the Super Admin role
export async function createAdminUser() {
  try {
    // 1. Create the user account
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: 'splave2000@example.com',
      password: 'abcd1234',
    });

    if (userError) throw userError;

    if (!userData.user) {
      console.error('User creation failed without error');
      return;
    }

    const userId = userData.user.id;

    // 2. Get the Super Admin role ID
    const { data: roleData, error: roleError } = await supabase
      .from('admin_roles')
      .select('id')
      .eq('name', 'Super Admin')
      .single();

    if (roleError) throw roleError;

    // 3. Add user to admin_users table
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        id: userId,
        role_id: roleData.id,
        is_super_admin: true
      });

    if (adminError) throw adminError;

    console.log('Admin user created successfully');
    return userData.user;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// This function checks if the admin user already exists
export async function checkAdminUserExists() {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking admin user:', error);
    return false;
  }
}

// This function sets up the admin user if it doesn't exist
export async function setupAdminUser() {
  try {
    const adminExists = await checkAdminUserExists();
    
    if (!adminExists) {
      await createAdminUser();
      console.log('Admin user setup complete');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Admin user setup failed:', error);
  }
}
