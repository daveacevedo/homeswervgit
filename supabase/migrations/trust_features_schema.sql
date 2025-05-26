/*
  # Trust Features Schema

  1. New Tables
    - `provider_verifications` - Stores verification data for providers
    - `reviews` - Stores reviews for providers
    - `guarantees` - Stores satisfaction guarantee claims
    - `transactions` - Stores payment transactions
    - `escrow_payments` - Stores escrow payment information
  
  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate access
*/

-- Provider Verifications Table
CREATE TABLE IF NOT EXISTS provider_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL, -- 'license', 'insurance', 'background_check', 'identity'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  document_url TEXT,
  verification_date TIMESTAMPTZ,
  expiration_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE provider_verifications ENABLE ROW LEVEL SECURITY;

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  response_text TEXT,
  response_date TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Guarantees Table
CREATE TABLE IF NOT EXISTS guarantees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  homeowner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  claim_reason TEXT NOT NULL,
  claim_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'resolved'
  resolution_notes TEXT,
  resolution_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE guarantees ENABLE ROW LEVEL SECURITY;

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  payer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'refunded', 'disputed'
  transaction_type TEXT NOT NULL, -- 'direct', 'escrow', 'refund'
  payment_method TEXT,
  transaction_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Escrow Payments Table
CREATE TABLE IF NOT EXISTS escrow_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES project_milestones(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'held', -- 'held', 'released', 'refunded'
  release_conditions TEXT,
  release_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE escrow_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Provider Verifications Policies
CREATE POLICY "Providers can view their own verifications"
  ON provider_verifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = provider_id);

CREATE POLICY "Providers can insert their own verifications"
  ON provider_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Admins can view all verifications"
  ON provider_verifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

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
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id AND projects.homeowner_id = auth.uid()
    )
  );

CREATE POLICY "Providers can respond to their reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid())
  WITH CHECK (provider_id = auth.uid() AND (
    -- Only allow updating the response fields
    (OLD.response_text IS NULL AND NEW.response_text IS NOT NULL) OR
    (OLD.response_text IS NOT NULL AND NEW.response_text IS NOT NULL AND OLD.response_text != NEW.response_text)
  ));

-- Guarantees Policies
CREATE POLICY "Homeowners can view their guarantees"
  ON guarantees
  FOR SELECT
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Providers can view guarantees against them"
  ON guarantees
  FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Homeowners can create guarantee claims"
  ON guarantees
  FOR INSERT
  TO authenticated
  WITH CHECK (homeowner_id = auth.uid());

CREATE POLICY "Admins can manage all guarantees"
  ON guarantees
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Transactions Policies
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (payer_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can create transactions they are paying for"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (payer_id = auth.uid());

CREATE POLICY "Admins can manage all transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Escrow Payments Policies
CREATE POLICY "Users can view escrow payments for their projects"
  ON escrow_payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id AND (projects.homeowner_id = auth.uid() OR projects.provider_id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage all escrow payments"
  ON escrow_payments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
