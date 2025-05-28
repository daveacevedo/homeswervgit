/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `homeowner_id` (uuid, references profiles)
      - `provider_id` (uuid, references profiles, nullable)
      - `status` (text)
      - `budget` (numeric)
      - `start_date` (date)
      - `end_date` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `projects` table
    - Add policies for homeowners to manage their own projects
    - Add policies for providers to view projects assigned to them
    - Add policy for admins to view all projects
*/

-- First, ensure the profiles table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles') THEN
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      full_name TEXT,
      email TEXT,
      avatar_url TEXT,
      role TEXT DEFAULT 'homeowner' CHECK (role IN ('homeowner', 'provider', 'admin')),
      phone TEXT,
      address TEXT,
      bio TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    -- Policy for users to read their own profile
    CREATE POLICY "Users can read own profile"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);

    -- Policy for users to update their own profile
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);

    -- Policy for admins to read all profiles
    CREATE POLICY "Admins can read all profiles"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
      ));
  END IF;
END $$;

-- Now create the projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  homeowner_id UUID REFERENCES profiles(id) NOT NULL,
  provider_id UUID REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  budget NUMERIC,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy for homeowners to read their own projects
CREATE POLICY "Homeowners can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = homeowner_id);

-- Policy for homeowners to insert their own projects
CREATE POLICY "Homeowners can insert own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = homeowner_id);

-- Policy for homeowners to update their own projects
CREATE POLICY "Homeowners can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = homeowner_id);

-- Policy for homeowners to delete their own projects
CREATE POLICY "Homeowners can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = homeowner_id);

-- Policy for providers to read projects assigned to them
CREATE POLICY "Providers can read assigned projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = provider_id);

-- Policy for admins to read all projects
CREATE POLICY "Admins can read all projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));