/*
  # Project Milestones and Financing Tables

  1. New Tables
    - `project_milestones` - Stores project milestones and payment information
      - `id` (uuid, primary key)
      - `project_id` (uuid, reference to projects)
      - `name` (text, milestone name)
      - `description` (text, milestone description)
      - `amount` (numeric, payment amount)
      - `due_date` (timestamptz, when the milestone is due)
      - `status` (text, milestone status: 'pending', 'completed', 'paid')
      - `payment_id` (text, reference to payment provider ID)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `project_financing` - Stores project financing options
      - `id` (uuid, primary key)
      - `project_id` (uuid, reference to projects)
      - `user_id` (uuid, reference to auth.users)
      - `provider` (text, financing provider name)
      - `amount` (numeric, financing amount)
      - `terms` (jsonb, financing terms)
      - `status` (text, application status: 'pending', 'approved', 'rejected')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Project Milestones Table
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  due_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

-- Project Financing Table
CREATE TABLE IF NOT EXISTS project_financing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  terms JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE project_financing ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Project Milestones
CREATE POLICY "Providers can view their project milestones"
  ON project_milestones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN provider_profiles pp ON p.provider_id = pp.id
      WHERE p.id = project_milestones.project_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Homeowners can view their project milestones"
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

CREATE POLICY "Providers can create milestones for their projects"
  ON project_milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN provider_profiles pp ON p.provider_id = pp.id
      WHERE p.id = project_milestones.project_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can update their project milestones"
  ON project_milestones
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN provider_profiles pp ON p.provider_id = pp.id
      WHERE p.id = project_milestones.project_id
      AND pp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN provider_profiles pp ON p.provider_id = pp.id
      WHERE p.id = project_milestones.project_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Homeowners can update milestone payment status"
  ON project_milestones
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.homeowner_id = auth.uid()
    )
    AND (
      NEW.status = 'paid'
      OR OLD.status = NEW.status
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.homeowner_id = auth.uid()
    )
    AND (
      NEW.status = 'paid'
      OR OLD.status = NEW.status
    )
  );

-- RLS Policies for Project Financing
CREATE POLICY "Users can view their financing applications"
  ON project_financing
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM projects p
      JOIN provider_profiles pp ON p.provider_id = pp.id
      WHERE p.id = project_financing.project_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create financing applications for their projects"
  ON project_financing
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_financing.project_id
      AND projects.homeowner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their financing applications"
  ON project_financing
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
  )
  WITH CHECK (
    user_id = auth.uid()
  );

-- Add function to update project status when all milestones are paid
CREATE OR REPLACE FUNCTION update_project_status_on_milestone_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- If the milestone status was changed to 'paid'
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    -- Check if all milestones for this project are paid
    IF NOT EXISTS (
      SELECT 1 FROM project_milestones
      WHERE project_id = NEW.project_id
      AND status != 'paid'
    ) THEN
      -- Update the project status to 'completed'
      UPDATE projects
      SET status = 'completed'
      WHERE id = NEW.project_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_status_on_milestone_payment_trigger
AFTER UPDATE ON project_milestones
FOR EACH ROW
WHEN (NEW.status = 'paid' AND OLD.status != 'paid')
EXECUTE FUNCTION update_project_status_on_milestone_payment();