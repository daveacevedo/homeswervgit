/*
  # Update profiles table for multiple roles

  1. Changes
    - Add support for users having multiple roles
    - Create a new user_roles table to track role assignments
  
  2. Security
    - Enable RLS on user_roles table
    - Add policies for authenticated users to read their own roles
*/

-- Create user_roles table to support multiple roles per user
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'provider', 'homeowner')),
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own roles
CREATE POLICY "Users can read own roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users with admin role can read all roles
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

-- Users with admin role can update all roles
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

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles (user_id);

-- Create index on role for filtering by role
CREATE INDEX IF NOT EXISTS user_roles_role_idx ON user_roles (role);

-- Function to migrate existing profiles to user_roles
DO $$
BEGIN
  -- Insert roles from profiles table into user_roles table
  INSERT INTO user_roles (user_id, role, is_primary)
  SELECT user_id, role, true
  FROM profiles
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;