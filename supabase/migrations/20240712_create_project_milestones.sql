/*
  # Create project milestones table

  1. New Tables
    - `project_milestones`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `name` (text)
      - `description` (text)
      - `amount` (numeric)
      - `due_date` (date)
      - `status` (text)
      - `payment_id` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `project_milestones` table
    - Add policies for homeowners to manage milestones for their projects
    - Add policies for providers to view milestones for their assigned projects
    - Add policy for admins to view all milestones
*/

-- Create the project_milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'paid', 'cancelled')),
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

-- Policy for homeowners to read milestones for their projects
CREATE POLICY "Homeowners can read milestones for their projects"
  ON project_milestones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.homeowner_id = auth.uid()
    )
  );

-- Policy for homeowners to insert milestones for their projects
CREATE POLICY "Homeowners can insert milestones for their projects"
  ON project_milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.homeowner_id = auth.uid()
    )
  );

-- Policy for homeowners to update milestones for their projects
CREATE POLICY "Homeowners can update milestones for their projects"
  ON project_milestones
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.homeowner_id = auth.uid()
    )
  );

-- Policy for homeowners to delete milestones for their projects
CREATE POLICY "Homeowners can delete milestones for their projects"
  ON project_milestones
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.homeowner_id = auth.uid()
    )
  );

-- Policy for providers to read milestones for their assigned projects
CREATE POLICY "Providers can read milestones for their assigned projects"
  ON project_milestones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.provider_id = auth.uid()
    )
  );

-- Policy for admins to read all milestones
CREATE POLICY "Admins can read all milestones"
  ON project_milestones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS project_milestones_project_id_idx ON project_milestones(project_id);
