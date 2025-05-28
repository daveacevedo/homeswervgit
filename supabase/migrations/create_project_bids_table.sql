/*
  # Create project_bids table

  1. New Tables
    - `project_bids`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `provider_id` (uuid, references auth.users)
      - `amount` (numeric, not null)
      - `description` (text)
      - `status` (text, not null)
      - `estimated_days` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `project_bids` table
    - Add policies for providers to manage their bids and project owners to view bids for their projects
*/

CREATE TABLE IF NOT EXISTS project_bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects ON DELETE CASCADE NOT NULL,
  provider_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending', -- pending, accepted, rejected, withdrawn
  estimated_days integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE project_bids ENABLE ROW LEVEL SECURITY;

-- Policy for providers to read their own bids
CREATE POLICY "Providers can read own bids"
  ON project_bids
  FOR SELECT
  TO authenticated
  USING (auth.uid() = provider_id);

-- Policy for providers to insert their own bids
CREATE POLICY "Providers can insert own bids"
  ON project_bids
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = provider_id);

-- Policy for providers to update their own bids
CREATE POLICY "Providers can update own bids"
  ON project_bids
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = provider_id);

-- Policy for project owners to read bids for their projects
CREATE POLICY "Project owners can read bids for their projects"
  ON project_bids
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_bids.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Policy for project owners to update bid status
CREATE POLICY "Project owners can update bid status"
  ON project_bids
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_bids.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_project_bids_updated_at
BEFORE UPDATE ON project_bids
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS project_bids_project_id_idx ON project_bids (project_id);
CREATE INDEX IF NOT EXISTS project_bids_provider_id_idx ON project_bids (provider_id);
CREATE INDEX IF NOT EXISTS project_bids_status_idx ON project_bids (status);
