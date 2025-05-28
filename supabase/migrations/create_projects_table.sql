/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references auth.users)
      - `title` (text, not null)
      - `description` (text)
      - `budget` (numeric)
      - `status` (text, not null)
      - `start_date` (date)
      - `end_date` (date)
      - `location` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `projects` table
    - Add policies for authenticated users to manage their own projects
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  budget numeric,
  status text NOT NULL DEFAULT 'draft',
  start_date date,
  end_date date,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy for owners to read their own projects
CREATE POLICY "Owners can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

-- Policy for owners to insert their own projects
CREATE POLICY "Owners can insert own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Policy for owners to update their own projects
CREATE POLICY "Owners can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Policy for owners to delete their own projects
CREATE POLICY "Owners can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON projects (owner_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects (status);
