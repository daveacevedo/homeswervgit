/*
  # Admin Schema Setup

  1. New Tables
    - `admin_roles` - Defines roles and permissions for system users
    - `admin_users` - Links auth users to admin roles
    - `audit_logs` - Tracks admin actions for accountability
    - `provider_verifications` - Manages provider verification workflow
    - `content_pages` - Stores CMS content for website pages
    - `content_blocks` - Stores modular content blocks for pages
    - `integration_configs` - Stores configuration for third-party integrations
    - `api_keys` - Manages API access for external services

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Admin Roles Table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read roles"
  ON admin_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'access_management'->>'view_roles' = 'true'
      )
    )
  );

CREATE POLICY "Super admins can manage roles"
  ON admin_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'access_management'->>'manage_roles' = 'true'
      )
    )
  );

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES admin_roles(id) ON DELETE RESTRICT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'access_management'->>'view_users' = 'true'
      )
    )
  );

CREATE POLICY "Super admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'access_management'->>'manage_users' = 'true'
      )
    )
  );

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'access_management'->>'view_audit_logs' = 'true'
      )
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Provider Verifications Table
CREATE TABLE IF NOT EXISTS provider_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  verification_type TEXT NOT NULL,
  document_url TEXT,
  notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE provider_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can view their own verifications"
  ON provider_verifications
  FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Admins can manage provider verifications"
  ON provider_verifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'provider_management'->>'manage_verifications' = 'true'
      )
    )
  );

-- Content Pages Table
CREATE TABLE IF NOT EXISTS content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published content pages"
  ON content_pages
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage content pages"
  ON content_pages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'content_management'->>'manage_pages' = 'true'
      )
    )
  );

-- Content Blocks Table
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES content_pages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read content blocks for published pages"
  ON content_blocks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM content_pages
      WHERE content_pages.id = page_id
      AND content_pages.is_published = true
    )
  );

CREATE POLICY "Admins can manage content blocks"
  ON content_blocks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'content_management'->>'manage_blocks' = 'true'
      )
    )
  );

-- Integration Configs Table
CREATE TABLE IF NOT EXISTS integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE integration_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read integration configs"
  ON integration_configs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'integrations'->>'view_integrations' = 'true'
      )
    )
  );

CREATE POLICY "Super admins can manage integration configs"
  ON integration_configs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'integrations'->>'manage_integrations' = 'true'
      )
    )
  );

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key_value TEXT NOT NULL UNIQUE,
  permissions JSONB NOT NULL DEFAULT '{}',
  rate_limit INTEGER DEFAULT 1000,
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'api_management'->>'view_keys' = 'true'
      )
    )
  );

CREATE POLICY "Super admins can manage API keys"
  ON api_keys
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'api_management'->>'manage_keys' = 'true'
      )
    )
  );

-- Insert default admin role
INSERT INTO admin_roles (name, description, permissions, is_system)
VALUES (
  'Super Admin',
  'Full access to all system features',
  '{
    "access_management": {
      "view_roles": true,
      "manage_roles": true,
      "view_users": true,
      "manage_users": true,
      "view_audit_logs": true
    },
    "provider_management": {
      "view_providers": true,
      "manage_providers": true,
      "manage_verifications": true
    },
    "homeowner_management": {
      "view_homeowners": true,
      "manage_homeowners": true
    },
    "content_management": {
      "view_pages": true,
      "manage_pages": true,
      "view_blocks": true,
      "manage_blocks": true,
      "moderate_content": true
    },
    "integrations": {
      "view_integrations": true,
      "manage_integrations": true
    },
    "api_management": {
      "view_keys": true,
      "manage_keys": true
    },
    "analytics": {
      "view_reports": true,
      "export_data": true
    },
    "system": {
      "manage_settings": true,
      "manage_backups": true,
      "send_notifications": true
    }
  }',
  true
),
(
  'Content Manager',
  'Manage website content and moderation',
  '{
    "access_management": {
      "view_roles": true,
      "view_users": true
    },
    "provider_management": {
      "view_providers": true
    },
    "homeowner_management": {
      "view_homeowners": true
    },
    "content_management": {
      "view_pages": true,
      "manage_pages": true,
      "view_blocks": true,
      "manage_blocks": true,
      "moderate_content": true
    },
    "analytics": {
      "view_reports": true
    }
  }',
  true
),
(
  'Provider Manager',
  'Manage service providers and verifications',
  '{
    "access_management": {
      "view_roles": true,
      "view_users": true
    },
    "provider_management": {
      "view_providers": true,
      "manage_providers": true,
      "manage_verifications": true
    },
    "content_management": {
      "view_pages": true
    },
    "analytics": {
      "view_reports": true
    }
  }',
  true
);