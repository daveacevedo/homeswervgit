/*
  # Create project financing table

  1. New Tables
    - `project_financing`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `user_id` (uuid, references auth.users)
      - `provider` (text)
      - `amount` (numeric)
      - `terms` (jsonb)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `project_financing` table
    - Add policies for users to manage their own financing applications
    - Add policy for admins to view all financing applications
*/

-- Create the project_financing table
CREATE TABLE IF NOT EXISTS project_financing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  terms JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE project_financing ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own financing applications
CREATE POLICY "Users can read own financing applications"
  ON project_financing
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own financing applications
CREATE POLICY "Users can insert own financing applications"
  ON project_financing
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own financing applications
CREATE POLICY "Users can update own financing applications"
  ON project_financing
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to delete their own financing applications
CREATE POLICY "Users can delete own financing applications"
  ON project_financing
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for homeowners to read financing applications for their projects
CREATE POLICY "Homeowners can read financing for their projects"
  ON project_financing
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_financing.project_id
      AND projects.homeowner_id = auth.uid()
    )
  );

-- Policy for admins to read all financing applications
CREATE POLICY "Admins can read all financing applications"
  ON project_financing
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS project_financing_project_id_idx ON project_financing(project_id);
CREATE INDEX IF NOT EXISTS project_financing_user_id_idx ON project_financing(user_id);
