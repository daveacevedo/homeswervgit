/*
  # Create admin user

  1. Creates the admin user with email splave2000@example.com
  2. Assigns Super Admin role to this user
*/

-- This is a placeholder migration. The actual admin user creation
-- is handled by the setupAdminUser.js utility in the React application.
-- This is because we need to use Supabase Auth API to create the user
-- with proper authentication, which can't be done directly in SQL.

-- The migration serves as documentation of the admin user setup process.

-- Note: If you need to manually create the admin user in the database,
-- you would:
-- 1. Create the user in auth.users (via Supabase Auth API)
-- 2. Get the Super Admin role ID
-- 3. Insert a record in admin_users table linking the user ID to the role ID