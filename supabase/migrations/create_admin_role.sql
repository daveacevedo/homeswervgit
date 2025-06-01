/*
  # Create admin role and permissions

  1. New Tables
    - `admin_roles` - Stores admin role definitions
    - `admin_permissions` - Stores available permissions
    - `admin_role_permissions` - Junction table for role-permission relationships
    - `admin_users` - Stores users with admin access

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create admin roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admin roles"
  ON admin_roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Create admin permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource text NOT NULL,
  action text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(resource, action)
);

ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admin permissions"
  ON admin_permissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create junction table for role permissions
CREATE TABLE IF NOT EXISTS admin_role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES admin_permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

ALTER TABLE admin_role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admin role permissions"
  ON admin_role_permissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES admin_roles(id),
  is_super_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin users can read all admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Insert default admin role
INSERT INTO admin_roles (name, description)
VALUES ('Super Admin', 'Has access to all admin features')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO admin_permissions (resource, action, description)
VALUES 
  ('access_management', 'view_users', 'View user accounts'),
  ('access_management', 'manage_users', 'Create, update, or delete user accounts'),
  ('access_management', 'view_audit_logs', 'View audit logs'),
  ('provider_management', 'view_providers', 'View service providers'),
  ('provider_management', 'manage_providers', 'Approve or reject service providers'),
  ('provider_management', 'manage_verifications', 'Manage provider verification requests'),
  ('content_management', 'view_pages', 'View content pages'),
  ('content_management', 'manage_pages', 'Create, update, or delete content pages'),
  ('integrations', 'view_integrations', 'View integration settings'),
  ('integrations', 'manage_integrations', 'Configure integration settings'),
  ('api_management', 'view_keys', 'View API keys'),
  ('api_management', 'manage_keys', 'Create, update, or delete API keys')
ON CONFLICT (resource, action) DO NOTHING;

-- Get the role ID for Super Admin
DO $$
DECLARE
  role_id uuid;
BEGIN
  SELECT id INTO role_id FROM admin_roles WHERE name = 'Super Admin' LIMIT 1;
  
  -- Assign all permissions to Super Admin role
  INSERT INTO admin_role_permissions (role_id, permission_id)
  SELECT role_id, id FROM admin_permissions
  ON CONFLICT (role_id, permission_id) DO NOTHING;
END $$;
