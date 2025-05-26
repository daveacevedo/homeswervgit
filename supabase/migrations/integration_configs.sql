/*
  # Integration Configurations Table

  1. New Tables
    - `integration_configs` - Stores configuration for third-party integrations
      - `id` (uuid, primary key)
      - `name` (text, name of the integration)
      - `provider` (text, provider name like 'Google', 'Stripe', etc.)
      - `config` (jsonb, configuration details)
      - `is_active` (boolean, whether the integration is active)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on the table
    - Add policies for admin access
*/

CREATE TABLE IF NOT EXISTS integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT false,
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

-- Insert default integrations
INSERT INTO integration_configs (name, provider, config, is_active)
VALUES 
  ('Google Business API', 'Google', '{"api_key": "", "client_id": "", "client_secret": ""}', false),
  ('Stripe Payments', 'Stripe', '{"api_key": "", "webhook_secret": ""}', false),
  ('Twilio SMS', 'Twilio', '{"account_sid": "", "auth_token": "", "phone_number": ""}', false),
  ('Pabbly Connect', 'Pabbly', '{"api_key": "", "webhook_url": ""}', false);