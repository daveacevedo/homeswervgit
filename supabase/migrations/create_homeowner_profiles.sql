/*
  # Create Homeowner Profiles Table

  1. New Tables
    - `homeowner_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `first_name` (text)
      - `address` (text)
      - `phone` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on homeowner_profiles table
    - Add policies for authenticated users to manage their own data
*/

-- Create homeowner_profiles table
CREATE TABLE IF NOT EXISTS homeowner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  first_name text,
  address text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE homeowner_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for homeowner_profiles
CREATE POLICY "Users can view their own profile"
  ON homeowner_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
  ON homeowner_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON homeowner_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_homeowner_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on homeowner_profiles
CREATE TRIGGER update_homeowner_profiles_updated_at
BEFORE UPDATE ON homeowner_profiles
FOR EACH ROW
EXECUTE FUNCTION update_homeowner_profiles_updated_at();
