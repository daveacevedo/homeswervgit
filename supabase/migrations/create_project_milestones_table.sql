/*
  # Create project_milestones table

  1. New Tables
    - `project_milestones`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `title` (text, not null)
      - `description` (text)
      - `due_date` (date)
      - `status` (text, not null)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `project_milestones` table
    - Add policies for authenticated users to manage milestones for their own projects
*/

CREATE TABLE IF NOT EXISTS project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  due_date date,
  status text NOT NULL DEFAULT 'pending',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

-- Policy for project owners to read milestones for their projects
CREATE POLICY "Project owners can read milestones"
  ON project_milestones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Policy for project owners to insert milestones for their projects
CREATE POLICY "Project owners can insert milestones"
  ON project_milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Policy for project owners to update milestones for their projects
CREATE POLICY "Project owners can update milestones"
  ON project_milestones
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Policy for project owners to delete milestones for their projects
CREATE POLICY "Project owners can delete milestones"
  ON project_milestones
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_project_milestones_updated_at
BEFORE UPDATE ON project_milestones
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS project_milestones_project_id_idx ON project_milestones (project_id);
CREATE INDEX IF NOT EXISTS project_milestones_status_idx ON project_milestones (status);
