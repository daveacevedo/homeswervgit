/*
  # Fix user roles policies

  1. Changes
    - Add conditional checks before creating policies to prevent errors when policies already exist
    - Use DO blocks to safely check for existing policies before creating them
  
  2. Security
    - Maintains the same security model with RLS policies
    - No changes to the security rules, just safer implementation
*/

-- Create policies with safety checks
DO $$
BEGIN
    -- Check if "Users can read own roles" policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_roles' AND policyname = 'Users can read own roles'
    ) THEN
        -- Create policy if it doesn't exist
        CREATE POLICY "Users can read own roles"
          ON user_roles
          FOR SELECT
          TO authenticated
          USING (auth.uid() = user_id);
    END IF;

    -- Check if "Users can update own roles" policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_roles' AND policyname = 'Users can update own roles'
    ) THEN
        -- Create policy if it doesn't exist
        CREATE POLICY "Users can update own roles"
          ON user_roles
          FOR UPDATE
          TO authenticated
          USING (auth.uid() = user_id);
    END IF;

    -- Check if "Admin role users can read all roles" policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_roles' AND policyname = 'Admin role users can read all roles'
    ) THEN
        -- Create policy if it doesn't exist
        CREATE POLICY "Admin role users can read all roles"
          ON user_roles
          FOR SELECT
          TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM user_roles
              WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
            )
          );
    END IF;

    -- Check if "Admin role users can update all roles" policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_roles' AND policyname = 'Admin role users can update all roles'
    ) THEN
        -- Create policy if it doesn't exist
        CREATE POLICY "Admin role users can update all roles"
          ON user_roles
          FOR ALL
          TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM user_roles
              WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
            )
          );
    END IF;
END
$$;