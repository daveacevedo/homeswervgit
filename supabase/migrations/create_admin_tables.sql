/*
  # Create admin tables

  1. New Tables
    - `admin_users` - Stores admin user information
    - `admin_roles` - Defines different admin role types
    - `admin_permissions` - Defines available permissions
    - `admin_role_permissions` - Maps permissions to roles

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create admin roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
  id SERIAL PRIMARY KEY,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(resource, action)
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role_id INTEGER REFERENCES admin_roles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin role permissions table
CREATE TABLE IF NOT EXISTS admin_role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INTEGER REFERENCES admin_roles(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES admin_permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin users can read admin_roles"
  ON admin_roles
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

CREATE POLICY "Admin users can read admin_permissions"
  ON admin_permissions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

CREATE POLICY "Admin users can read admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

CREATE POLICY "Admin users can read admin_role_permissions"
  ON admin_role_permissions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

CREATE POLICY "Admin users can read audit_logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

-- Create function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = user_id AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create admin table (for initial setup)
CREATE OR REPLACE FUNCTION create_admin_table()
RETURNS VOID AS $$
BEGIN
  -- Insert default admin roles if they don't exist
  INSERT INTO admin_roles (id, name, description)
  VALUES 
    (1, 'Super Admin', 'Has access to all admin features'),
    (2, 'Content Admin', 'Can manage content only'),
    (3, 'User Admin', 'Can manage users only')
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert default permissions
  INSERT INTO admin_permissions (resource, action, description)
  VALUES
    ('users', 'read', 'View user information'),
    ('users', 'create', 'Create new users'),
    ('users', 'update', 'Update user information'),
    ('users', 'delete', 'Delete users'),
    ('providers', 'read', 'View provider information'),
    ('providers', 'verify', 'Verify providers'),
    ('providers', 'suspend', 'Suspend providers'),
    ('content', 'read', 'View content'),
    ('content', 'create', 'Create content'),
    ('content', 'update', 'Update content'),
    ('content', 'delete', 'Delete content'),
    ('settings', 'read', 'View settings'),
    ('settings', 'update', 'Update settings')
  ON CONFLICT (resource, action) DO NOTHING;
  
  -- Assign all permissions to Super Admin
  INSERT INTO admin_role_permissions (role_id, permission_id)
  SELECT 1, id FROM admin_permissions
  ON CONFLICT (role_id, permission_id) DO NOTHING;
  
  -- Assign content permissions to Content Admin
  INSERT INTO admin_role_permissions (role_id, permission_id)
  SELECT 2, id FROM admin_permissions WHERE resource = 'content'
  ON CONFLICT (role_id, permission_id) DO NOTHING;
  
  -- Assign user permissions to User Admin
  INSERT INTO admin_role_permissions (role_id, permission_id)
  SELECT 3, id FROM admin_permissions WHERE resource IN ('users', 'providers')
  ON CONFLICT (role_id, permission_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
