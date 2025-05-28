/*
  # Create provider_services table

  1. New Tables
    - `provider_services`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references auth.users)
      - `service_name` (text, not null)
      - `description` (text)
      - `price_type` (text, not null)
      - `price_min` (numeric)
      - `price_max` (numeric)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `provider_services` table
    - Add policies for providers to manage their services and for all users to view active services
*/

CREATE TABLE IF NOT EXISTS provider_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES auth.users NOT NULL,
  service_name text NOT NULL,
  description text,
  price_type text NOT NULL DEFAULT 'fixed', -- fixed, hourly, range
  price_min numeric NOT NULL,
  price_max numeric,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;

-- Policy for providers to read their own services
CREATE POLICY "Providers can read own services"
  ON provider_services
  FOR SELECT
  TO authenticated
  USING (auth.uid() = provider_id);

-- Policy for providers to insert their own services
CREATE POLICY "Providers can insert own services"
  ON provider_services
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = provider_id);

-- Policy for providers to update their own services
CREATE POLICY "Providers can update own services"
  ON provider_services
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = provider_id);

-- Policy for providers to delete their own services
CREATE POLICY "Providers can delete own services"
  ON provider_services
  FOR DELETE
  TO authenticated
  USING (auth.uid() = provider_id);

-- Policy for all users to view active services
CREATE POLICY "All users can view active services"
  ON provider_services
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_provider_services_updated_at
BEFORE UPDATE ON provider_services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS provider_services_provider_id_idx ON provider_services (provider_id);
CREATE INDEX IF NOT EXISTS provider_services_is_active_idx ON provider_services (is_active);
