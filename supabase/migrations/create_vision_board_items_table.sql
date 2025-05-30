/*
  # Create vision board items table

  1. New Tables
    - `vision_board_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text, not null)
      - `description` (text)
      - `image_url` (text)
      - `category` (text)
      - `target_date` (date)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `vision_board_items` table
    - Add policies for authenticated users to manage their own vision board items
*/

CREATE TABLE IF NOT EXISTS vision_board_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  category text,
  target_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE vision_board_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own vision board items"
  ON vision_board_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vision board items"
  ON vision_board_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vision board items"
  ON vision_board_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vision board items"
  ON vision_board_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_vision_board_items_updated_at
BEFORE UPDATE ON vision_board_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();