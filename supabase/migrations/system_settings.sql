/*
  # System Settings Table

  1. New Tables
    - `system_settings` - Stores global system configuration

  2. Security
    - Enable RLS on the table
    - Add policies for admin access
*/

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read system settings"
  ON system_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage system settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role_id IN (
        SELECT id FROM admin_roles
        WHERE permissions->'system'->>'manage_settings' = 'true'
      )
    )
  );

-- Insert default settings
INSERT INTO system_settings (settings)
VALUES ('{
  "site_name": "ServiceConnect Pro",
  "contact_email": "support@serviceconnectpro.com",
  "enable_registration": true,
  "require_verification": true,
  "maintenance_mode": false,
  "default_currency": "USD",
  "booking_lead_time": 24,
  "max_file_size": 5,
  "allowed_file_types": ".jpg,.jpeg,.png,.pdf,.doc,.docx",
  "smtp_host": "",
  "smtp_port": "",
  "smtp_user": "",
  "smtp_password": "",
  "smtp_from_email": "",
  "smtp_from_name": ""
}');
