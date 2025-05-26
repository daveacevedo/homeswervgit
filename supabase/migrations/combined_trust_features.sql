/*
  # Combined Trust Features Schema

  1. New Tables
    - `project_milestones` - Stores project milestones and payment information
    - `provider_verifications` - Stores verification data for providers
    - `reviews` - Stores reviews for providers
    - `guarantees` - Stores satisfaction guarantee claims
    - `transactions` - Stores payment transactions
    - `escrow_payments` - Stores escrow payment information
  
  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate access
*/

-- First, create the project_milestones table
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

-- Provider Verifications Table
CREATE TABLE IF NOT EXISTS provider_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL,
  document_url TEXT,
  verification_date TIMESTAMPTZ,
  expiration_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  homeowner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  response_text TEXT,
  response_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Guarantees Table
CREATE TABLE IF NOT EXISTS guarantees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  homeowner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claim_reason TEXT NOT NULL,
  claim_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  resolution_notes TEXT,
  resolution_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  payer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  transaction_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Now create the escrow_payments table that references project_milestones
CREATE TABLE IF NOT EXISTS escrow_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  release_conditions TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'held',
  release_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for all tables
ALTER TABLE provider_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE guarantees ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Project Milestones
CREATE POLICY "Providers can view their project milestones"
  ON project_milestones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_milestones.project_id
      AND p.provider_id = auth.uid()
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
      WHERE p.id = project_milestones.project_id
      AND p.provider_id = auth.uid()
    )
  );

CREATE POLICY "Providers can update their project milestones"
  ON project_milestones
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_milestones.project_id
      AND p.provider_id = auth.uid()
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
  );

-- Provider Verifications Policies
CREATE POLICY "Providers can view their own verifications"
  ON provider_verifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = provider_id);

CREATE POLICY "Providers can create their own verifications"
  ON provider_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Admins can view all verifications"
  ON provider_verifications
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ));

CREATE POLICY "Admins can update verifications"
  ON provider_verifications
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ));

-- Reviews Policies
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Homeowners can create reviews for their projects"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = homeowner_id);

CREATE POLICY "Providers can update their responses"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = provider_id)
  WITH CHECK (
    -- Only allow updating response fields
    (OLD.provider_id = NEW.provider_id) AND
    (OLD.homeowner_id = NEW.homeowner_id) AND
    (OLD.project_id = NEW.project_id) AND
    (OLD.rating = NEW.rating) AND
    (OLD.review_text = NEW.review_text) AND
    (OLD.created_at = NEW.created_at)
  );

-- Guarantees Policies
CREATE POLICY "Homeowners can view their own guarantee claims"
  ON guarantees
  FOR SELECT
  TO authenticated
  USING (auth.uid() = homeowner_id);

CREATE POLICY "Providers can view guarantee claims against them"
  ON guarantees
  FOR SELECT
  TO authenticated
  USING (auth.uid() = provider_id);

CREATE POLICY "Homeowners can create guarantee claims"
  ON guarantees
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = homeowner_id);

CREATE POLICY "Admins can view all guarantee claims"
  ON guarantees
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ));

CREATE POLICY "Admins can update guarantee claims"
  ON guarantees
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ));

-- Transactions Policies
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = payer_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create transactions they are paying for"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = payer_id);

CREATE POLICY "Users can update transactions they created"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = payer_id);

-- Escrow Payments Policies
CREATE POLICY "Users can view escrow payments they are involved in"
  ON escrow_payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM transactions
      WHERE transactions.id = escrow_payments.transaction_id
      AND (transactions.payer_id = auth.uid() OR transactions.recipient_id = auth.uid())
    )
  );

CREATE POLICY "Users can create escrow payments for their transactions"
  ON escrow_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM transactions
      WHERE transactions.id = escrow_payments.transaction_id
      AND transactions.payer_id = auth.uid()
    )
  );

CREATE POLICY "Payers can update escrow payment status"
  ON escrow_payments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM transactions
      WHERE transactions.id = escrow_payments.transaction_id
      AND transactions.payer_id = auth.uid()
    )
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS project_milestones_project_id_idx ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS project_milestones_status_idx ON project_milestones(status);
CREATE INDEX IF NOT EXISTS provider_verifications_provider_id_idx ON provider_verifications(provider_id);
CREATE INDEX IF NOT EXISTS reviews_provider_id_idx ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS reviews_homeowner_id_idx ON reviews(homeowner_id);
CREATE INDEX IF NOT EXISTS guarantees_homeowner_id_idx ON guarantees(homeowner_id);
CREATE INDEX IF NOT EXISTS guarantees_provider_id_idx ON guarantees(provider_id);
CREATE INDEX IF NOT EXISTS transactions_payer_id_idx ON transactions(payer_id);
CREATE INDEX IF NOT EXISTS transactions_recipient_id_idx ON transactions(recipient_id);
CREATE INDEX IF NOT EXISTS escrow_payments_transaction_id_idx ON escrow_payments(transaction_id);
CREATE INDEX IF NOT EXISTS escrow_payments_project_id_idx ON escrow_payments(project_id);
