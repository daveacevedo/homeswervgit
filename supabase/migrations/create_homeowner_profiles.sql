/*
  # Create homeowner profiles table

  1. New Tables
    - `homeowner_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text, nullable)
      - `address` (text, nullable)
      - `city` (text, nullable)
      - `state` (text, nullable)
      - `zip` (text, nullable)
      - `rewards_points` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `homeowner_profiles` table
    - Add policies for authenticated users to read/write their own profiles
*/

CREATE TABLE IF NOT EXISTS homeowner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  rewards_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE homeowner_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own homeowner profile"
  ON homeowner_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own homeowner profile"
  ON homeowner_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own homeowner profile"
  ON homeowner_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Service providers need to be able to view limited homeowner information
CREATE POLICY "Service providers can view limited homeowner information"
  ON homeowner_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_profiles
      WHERE provider_profiles.user_id = auth.uid()
    )
  );
