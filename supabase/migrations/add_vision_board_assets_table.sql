/*
  # Add vision board assets table

  1. New Tables
    - `vision_board_assets`
      - `id` (uuid, primary key)
      - `vision_board_item_id` (uuid, references vision_board_items)
      - `type` (text, 'image' or 'link')
      - `url` (text)
      - `quantity` (integer, default 1)
      - `cost` (decimal, nullable)
      - `comments` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `vision_board_assets` table
    - Add policies for authenticated users to manage their own vision board assets
*/

CREATE TABLE IF NOT EXISTS vision_board_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vision_board_item_id uuid REFERENCES vision_board_items ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'link')),
  url text NOT NULL,
  quantity integer DEFAULT 1,
  cost decimal(10,2),
  comments text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE vision_board_assets ENABLE ROW LEVEL SECURITY;

-- Create policies that link through to the vision_board_items table's user_id
CREATE POLICY "Users can view their own vision board assets"
  ON vision_board_assets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vision_board_items
      WHERE vision_board_items.id = vision_board_assets.vision_board_item_id
      AND vision_board_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own vision board assets"
  ON vision_board_assets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vision_board_items
      WHERE vision_board_items.id = vision_board_assets.vision_board_item_id
      AND vision_board_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own vision board assets"
  ON vision_board_assets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vision_board_items
      WHERE vision_board_items.id = vision_board_assets.vision_board_item_id
      AND vision_board_items.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vision_board_items
      WHERE vision_board_items.id = vision_board_assets.vision_board_item_id
      AND vision_board_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own vision board assets"
  ON vision_board_assets
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vision_board_items
      WHERE vision_board_items.id = vision_board_assets.vision_board_item_id
      AND vision_board_items.user_id = auth.uid()
    )
  );

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_vision_board_assets_updated_at
BEFORE UPDATE ON vision_board_assets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
