/*
  # API Keys Table

  1. New Tables
    - `api_keys` - Stores API keys for external integrations
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to auth.users)
      - `name` (text, name of the API key)
      - `key_value` (text, hashed API key value)
      - `permissions` (jsonb, permissions for the API key)
      - `rate_limit` (integer, rate limit per hour)
      - `last_used_at` (timestamptz, when the key was last used)
      - `expires_at` (timestamptz, when the key expires)
      - `created_at` (timestamptz)
      - `revoked_at` (timestamptz, when the key was revoked)

  2. Security
    - Enable RLS on the table
    - Add policies for admin access
*/

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_value TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}',
  rate_limit INTEGER NOT NULL DEFAULT 1000,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all API keys"
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

CREATE POLICY "Admins can manage API keys"
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

-- Create function to generate API keys
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  key_value TEXT;
BEGIN
  key_value := encode(gen_random_bytes(24), 'hex');
  RETURN key_value;
END;
$$;