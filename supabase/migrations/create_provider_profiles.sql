/*
  # Create provider profiles table

  1. New Tables
    - `provider_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `business_name` (text)
      - `contact_name` (text)
      - `email` (text)
      - `phone` (text, nullable)
      - `address` (text, nullable)
      - `city` (text, nullable)
      - `state` (text, nullable)
      - `zip` (text, nullable)
      - `business_description` (text, nullable)
      - `services_offered` (text[], nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `provider_profiles` table
    - Add policies for authenticated users to read/write their own profiles
    - Add policy for homeowners to view provider profiles
*/

CREATE TABLE IF NOT EXISTS provider_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  business_description text,
  services_offered text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own provider profile"
  ON provider_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own provider profile"
  ON provider_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own provider profile"
  ON provider_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Homeowners need to be able to view provider profiles
CREATE POLICY "Homeowners can view provider profiles"
  ON provider_profiles
  FOR SELECT
  TO authenticated
  USING (true);
