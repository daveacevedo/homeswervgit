/*
  # Create content management tables

  1. New Tables
    - `content_pages` - Stores website pages and their content
    - `content_media` - Stores media files associated with pages
  
  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create content_pages table
CREATE TABLE IF NOT EXISTS content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,
  layout TEXT DEFAULT 'default',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  sections JSONB DEFAULT '[]'::jsonb,
  custom_css TEXT,
  custom_js TEXT,
  tracking_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create content_media table
CREATE TABLE IF NOT EXISTS content_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES content_pages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  public_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_media ENABLE ROW LEVEL SECURITY;

-- Create policies for content_pages
CREATE POLICY "Allow admin users to manage content_pages"
  ON content_pages
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create policies for content_media
CREATE POLICY "Allow admin users to manage content_media"
  ON content_media
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create policy for public access to published pages
CREATE POLICY "Allow public access to published pages"
  ON content_pages
  FOR SELECT
  USING (is_published = true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for content_pages
CREATE TRIGGER update_content_pages_updated_at
BEFORE UPDATE ON content_pages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
