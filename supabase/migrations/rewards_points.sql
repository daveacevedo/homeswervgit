/*
  # Rewards and Gamification Tables

  1. New Tables
    - `rewards_points` - Stores user reward points
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to auth.users)
      - `points` (integer, current points balance)
      - `lifetime_points` (integer, total points earned)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `rewards_transactions` - Stores point transactions
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to auth.users)
      - `points` (integer, points earned or spent)
      - `transaction_type` (text, type of transaction: 'earn', 'spend')
      - `source` (text, source of points: 'booking', 'review', 'deal', etc.)
      - `reference_id` (uuid, reference to the source entity)
      - `description` (text, transaction description)
      - `created_at` (timestamptz)

    - `rewards_deals` - Stores available deals for points redemption
      - `id` (uuid, primary key)
      - `business_id` (uuid, reference to local business)
      - `title` (text, deal title)
      - `description` (text, deal description)
      - `points_required` (integer, points needed to redeem)
      - `image_url` (text, deal image)
      - `terms` (text, terms and conditions)
      - `start_date` (date, when the deal starts)
      - `end_date` (date, when the deal ends)
      - `is_active` (boolean, whether the deal is active)
      - `redemption_limit` (integer, max number of redemptions)
      - `redemption_count` (integer, current redemption count)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `rewards_redemptions` - Stores user deal redemptions
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to auth.users)
      - `deal_id` (uuid, reference to rewards_deals)
      - `points_spent` (integer, points spent on redemption)
      - `redemption_code` (text, unique code for redemption)
      - `status` (text, redemption status: 'active', 'used', 'expired')
      - `redeemed_at` (timestamptz, when the deal was redeemed)
      - `expires_at` (timestamptz, when the redemption expires)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Rewards Points Table
CREATE TABLE IF NOT EXISTS rewards_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE rewards_points ENABLE ROW LEVEL SECURITY;

-- Rewards Transactions Table
CREATE TABLE IF NOT EXISTS rewards_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  source TEXT NOT NULL,
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE rewards_transactions ENABLE ROW LEVEL SECURITY;

-- Rewards Deals Table
CREATE TABLE IF NOT EXISTS rewards_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  image_url TEXT,
  terms TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  redemption_limit INTEGER,
  redemption_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE rewards_deals ENABLE ROW LEVEL SECURITY;

-- Rewards Redemptions Table
CREATE TABLE IF NOT EXISTS rewards_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES rewards_deals(id) ON DELETE CASCADE,
  points_spent INTEGER NOT NULL,
  redemption_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE rewards_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Rewards Points
CREATE POLICY "Users can view their own points"
  ON rewards_points
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for Rewards Transactions
CREATE POLICY "Users can view their own transactions"
  ON rewards_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for Rewards Deals
CREATE POLICY "Everyone can view active deals"
  ON rewards_deals
  FOR SELECT
  TO authenticated
  USING (is_active = true AND current_date BETWEEN start_date AND end_date);

-- RLS Policies for Rewards Redemptions
CREATE POLICY "Users can view their own redemptions"
  ON rewards_redemptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions"
  ON rewards_redemptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to generate a random redemption code
CREATE OR REPLACE FUNCTION generate_redemption_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
BEGIN
  code := upper(substring(encode(gen_random_bytes(6), 'hex') from 1 for 8));
  RETURN code;
END;
$$;

-- Function to update points balance when transactions occur
CREATE OR REPLACE FUNCTION update_points_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- For new transactions
  IF TG_OP = 'INSERT' THEN
    -- Create points record if it doesn't exist
    INSERT INTO rewards_points (user_id, points, lifetime_points)
    VALUES (NEW.user_id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Update points balance
    IF NEW.transaction_type = 'earn' THEN
      UPDATE rewards_points
      SET 
        points = points + NEW.points,
        lifetime_points = lifetime_points + NEW.points,
        updated_at = now()
      WHERE user_id = NEW.user_id;
    ELSIF NEW.transaction_type = 'spend' THEN
      UPDATE rewards_points
      SET 
        points = points - NEW.points,
        updated_at = now()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_points_balance_trigger
AFTER INSERT ON rewards_transactions
FOR EACH ROW
EXECUTE FUNCTION update_points_balance();

-- Function to update redemption count when redemptions occur
CREATE OR REPLACE FUNCTION update_deal_redemption_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment redemption count
  UPDATE rewards_deals
  SET 
    redemption_count = redemption_count + 1,
    updated_at = now()
  WHERE id = NEW.deal_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_deal_redemption_count_trigger
AFTER INSERT ON rewards_redemptions
FOR EACH ROW
EXECUTE FUNCTION update_deal_redemption_count();
