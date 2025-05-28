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

-- Create the projects table
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