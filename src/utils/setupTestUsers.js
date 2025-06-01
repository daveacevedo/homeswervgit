import { supabase } from './supabaseClient';

// Function to create a test user with specific roles
export async function createTestUser(email, password, roles, isAdmin = false) {
  try {
    // 1. Check if user already exists in auth
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('user_id, email')
      .eq('email', email)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error(`Error checking if user ${email} exists:`, checkError);
      throw checkError;
    }

    let userId;

    // If user doesn't exist, create them
    if (!existingUsers) {
      // Create the user account
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (userError) {
        console.error(`Error creating user ${email}:`, userError);
        throw userError;
      }

      if (!userData.user) {
        console.error(`User creation failed for ${email} without error`);
        return;
      }

      userId = userData.user.id;

      // Create profile for the user with the first role as primary
      const primaryRole = Array.isArray(roles) ? roles[0] : roles;
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          email: email,
          role: primaryRole,
          first_name: primaryRole === 'admin' ? 'Admin' : (primaryRole === 'provider' ? 'Dave' : 'Dave'),
          last_name: primaryRole === 'admin' ? 'User' : 'Acevedo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error(`Error creating profile for ${email}:`, profileError);
        throw profileError;
      }

      // Add all roles to user_roles table
      if (Array.isArray(roles)) {
        for (let i = 0; i < roles.length; i++) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: roles[i],
              is_primary: i === 0 // First role is primary
            });

          if (roleError) {
            console.error(`Error adding role ${roles[i]} for ${email}:`, roleError);
            throw roleError;
          }
        }
      } else {
        // Single role case
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: roles,
            is_primary: true
          });

        if (roleError) {
          console.error(`Error adding role ${roles} for ${email}:`, roleError);
          throw roleError;
        }
      }

      // If user is an admin, add them to admin_users table
      if (isAdmin || (Array.isArray(roles) && roles.includes('admin'))) {
        // Get the Super Admin role ID
        const { data: roleData, error: roleError } = await supabase
          .from('admin_roles')
          .select('id')
          .eq('name', 'Super Admin')
          .single();

        if (roleError) {
          console.error('Error getting Super Admin role ID:', roleError);
          throw roleError;
        }

        // Add user to admin_users table
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert({
            id: userId,
            role_id: roleData.id,
            is_super_admin: true
          });

        if (adminError) {
          console.error(`Error adding ${email} to admin_users:`, adminError);
          throw adminError;
        }
      }

      console.log(`User ${email} created successfully with roles: ${Array.isArray(roles) ? roles.join(', ') : roles}`);
      return { userId, isNew: true };
    } else {
      console.log(`User ${email} already exists, updating roles`);
      userId = existingUsers.user_id;
      
      // Update existing user's roles
      if (Array.isArray(roles)) {
        // Clear existing roles first
        const { error: clearError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);
          
        if (clearError) {
          console.error(`Error clearing roles for ${email}:`, clearError);
          throw clearError;
        }
        
        // Add all new roles
        for (let i = 0; i < roles.length; i++) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: roles[i],
              is_primary: i === 0 // First role is primary
            });

          if (roleError) {
            console.error(`Error adding role ${roles[i]} for ${email}:`, roleError);
            throw roleError;
          }
        }
        
        // Update profile with primary role
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role: roles[0],
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error(`Error updating profile for ${email}:`, updateError);
          throw updateError;
        }
      } else {
        // Single role case - update profile and ensure role exists in user_roles
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role: roles,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error(`Error updating profile for ${email}:`, updateError);
          throw updateError;
        }
        
        // Ensure role exists in user_roles
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: roles,
            is_primary: true
          }, { onConflict: 'user_id, role' });

        if (roleError) {
          console.error(`Error adding role ${roles} for ${email}:`, roleError);
          throw roleError;
        }
      }

      // If user should be admin but isn't in admin_users table, add them
      if (isAdmin || (Array.isArray(roles) && roles.includes('admin'))) {
        // Check if user is already in admin_users
        const { data: adminData, error: adminCheckError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (adminCheckError && adminCheckError.code !== 'PGRST116') {
          console.error(`Error checking admin status for ${email}:`, adminCheckError);
          throw adminCheckError;
        }

        // If not already an admin, add to admin_users
        if (!adminData) {
          // Get the Super Admin role ID
          const { data: roleData, error: roleError } = await supabase
            .from('admin_roles')
            .select('id')
            .eq('name', 'Super Admin')
            .single();

          if (roleError) {
            console.error('Error getting Super Admin role ID:', roleError);
            throw roleError;
          }

          // Add user to admin_users table
          const { error: adminError } = await supabase
            .from('admin_users')
            .insert({
              id: userId,
              role_id: roleData.id,
              is_super_admin: true
            });

          if (adminError) {
            console.error(`Error adding ${email} to admin_users:`, adminError);
            throw adminError;
          }
        }
      }

      console.log(`User ${email} updated successfully with roles: ${Array.isArray(roles) ? roles.join(', ') : roles}`);
      return { userId, isNew: false };
    }
  } catch (error) {
    console.error(`Error setting up test user ${email}:`, error);
    throw error;
  }
}

// Function to set up all test users
export async function setupTestUsers() {
  try {
    console.log('Setting up test users...');
    
    // Create admin user
    await createTestUser('splave2000@gmail.com', 'abcd1234', 'admin', true);
    
    // Create business owner (provider) and homeowner user - using same email for testing
    await createTestUser('dave.b.acevedo@gmail.com', 'abcd1234', ['provider', 'homeowner'], false);
    
    console.log('Test users setup complete');
  } catch (error) {
    console.error('Test users setup failed:', error);
  }
}
