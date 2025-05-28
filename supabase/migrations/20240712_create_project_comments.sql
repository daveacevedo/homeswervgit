/*
  # Create project comments table

  1. New Tables
    - `project_comments`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `user_id` (uuid, references auth.users)
      - `content` (text)
      - `attachment_url` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `project_comments` table
    - Add policies for homeowners and providers to manage comments on their projects
    - Add policy for admins to view all comments
*/

-- Create the project_comments table
CREATE TABLE IF NOT EXISTS project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;

-- Policy for homeowners to read comments on their projects
CREATE POLICY "Homeowners can read comments on their projects"
  ON project_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_comments.project_id
      AND projects.homeowner_id = auth.uid()
    )
  );

-- Policy for providers to read comments on their assigned projects
CREATE POLICY "Providers can read comments on their assigned projects"
  ON project_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_comments.project_id
      AND projects.provider_id = auth.uid()
    )
  );

-- Policy for users to insert their own comments
CREATE POLICY "Users can insert their own comments"
  ON project_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    (
      EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = project_comments.project_id
        AND (projects.homeowner_id = auth.uid() OR projects.provider_id = auth.uid())
      )
    )
  );

-- Policy for users to update their own comments
CREATE POLICY "Users can update their own comments"
  ON project_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON project_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for admins to read all comments
CREATE POLICY "Admins can read all comments"
  ON project_comments
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
CREATE INDEX IF NOT EXISTS project_comments_project_id_idx ON project_comments(project_id);
CREATE INDEX IF NOT EXISTS project_comments_user_id_idx ON project_comments(user_id);
CREATE INDEX IF NOT EXISTS project_comments_created_at_idx ON project_comments(created_at);
