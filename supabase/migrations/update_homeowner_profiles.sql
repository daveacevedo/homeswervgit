/*
  # Update Homeowner Profiles Table

  1. Changes
    - Add `first_name` column to homeowner_profiles
    - Add `address` column to homeowner_profiles
    - Add `phone` column to homeowner_profiles
  
  2. Notes
    - These fields are needed for the AI Concierge onboarding flow
*/

-- Add new columns to homeowner_profiles if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'homeowner_profiles' AND column_name = 'first_name') THEN
    ALTER TABLE homeowner_profiles ADD COLUMN first_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'homeowner_profiles' AND column_name = 'address') THEN
    ALTER TABLE homeowner_profiles ADD COLUMN address text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'homeowner_profiles' AND column_name = 'phone') THEN
    ALTER TABLE homeowner_profiles ADD COLUMN phone text;
  END IF;
END $$;
