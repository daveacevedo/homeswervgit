/*
  # Verify homeowner_id field in projects table
  
  This migration verifies that the homeowner_id field in the projects table
  is properly coded with the correct data type and foreign key constraint.
  
  1. Verification
    - Checks that homeowner_id exists in projects table
    - Confirms it's a UUID type
    - Confirms it has a foreign key constraint to profiles(id)
    - Confirms it's NOT NULL
*/

-- Verify the homeowner_id field exists and has the correct properties
DO $$ 
BEGIN
  -- Check if homeowner_id exists in projects table
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'homeowner_id'
  ) THEN
    RAISE EXCEPTION 'homeowner_id column does not exist in projects table';
  END IF;
  
  -- Check if homeowner_id is UUID type
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'homeowner_id' AND data_type = 'uuid'
  ) THEN
    RAISE EXCEPTION 'homeowner_id column is not UUID type';
  END IF;
  
  -- Check if homeowner_id is NOT NULL
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'homeowner_id' AND is_nullable = 'YES'
  ) THEN
    RAISE EXCEPTION 'homeowner_id column should be NOT NULL';
  END IF;
  
  -- Check if homeowner_id has a foreign key constraint to profiles(id)
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND kcu.table_name = 'projects' 
      AND kcu.column_name = 'homeowner_id'
      AND ccu.table_name = 'profiles' 
      AND ccu.column_name = 'id'
  ) THEN
    RAISE EXCEPTION 'homeowner_id column does not have a proper foreign key constraint to profiles(id)';
  END IF;
  
  RAISE NOTICE 'Verification successful: homeowner_id field is properly coded';
END $$;

-- Insert a test record to verify the constraint works
-- This will only run if a profile exists
DO $$
DECLARE
  profile_id uuid;
BEGIN
  -- Get a profile ID if one exists
  SELECT id INTO profile_id FROM profiles LIMIT 1;
  
  -- If a profile exists, try to insert a test project
  IF profile_id IS NOT NULL THEN
    -- Insert a test project using the profile_id as homeowner_id
    INSERT INTO projects (
      title, 
      description, 
      homeowner_id, 
      status
    ) VALUES (
      'Test Project', 
      'This is a test project to verify the homeowner_id constraint', 
      profile_id, 
      'pending'
    );
    
    -- Delete the test project
    DELETE FROM projects WHERE title = 'Test Project' AND description = 'This is a test project to verify the homeowner_id constraint';
    
    RAISE NOTICE 'Test insertion successful: homeowner_id foreign key constraint is working properly';
  ELSE
    RAISE NOTICE 'No profiles found for test insertion';
  END IF;
END $$;