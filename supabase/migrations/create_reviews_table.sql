/*
  # Create reviews table

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `reviewer_id` (uuid, references auth.users)
      - `provider_id` (uuid, references auth.users)
      - `rating` (integer, not null)
      - `comment` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `reviews` table
    - Add policies for project owners to create reviews and for all users to read reviews
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES auth.users NOT NULL,
  provider_id uuid REFERENCES auth.users NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_project_reviewer_provider UNIQUE (project_id, reviewer_id, provider_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy for all authenticated users to read reviews
CREATE POLICY "All users can read reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for project owners to insert reviews
CREATE POLICY "Project owners can insert reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = reviews.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Policy for reviewers to update their own reviews
CREATE POLICY "Reviewers can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS reviews_project_id_idx ON reviews (project_id);
CREATE INDEX IF NOT EXISTS reviews_reviewer_id_idx ON reviews (reviewer_id);
CREATE INDEX IF NOT EXISTS reviews_provider_id_idx ON reviews (provider_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON reviews (rating);
