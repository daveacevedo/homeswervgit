/*
  # Create user roles table

  1. New Tables
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role` (text, check constraint for valid roles)
      - `is_primary` (boolean)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on user_roles table
    - Add policies for authenticated users to read their own roles
    - Add policies for admin users to manage all roles
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

-- Users can update their own roles
CREATE POLICY "Users can update own roles"
  ON user_roles
  FOR UPDATE
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