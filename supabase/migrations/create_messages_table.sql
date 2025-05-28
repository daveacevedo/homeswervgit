/*
  # Create messages table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references auth.users)
      - `recipient_id` (uuid, references auth.users)
      - `project_id` (uuid, references projects, nullable)
      - `content` (text, not null)
      - `read` (boolean, default false)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `messages` table
    - Add policies for users to manage their messages
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users NOT NULL,
  recipient_id uuid REFERENCES auth.users NOT NULL,
  project_id uuid REFERENCES projects ON DELETE SET NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy for users to read messages they sent or received
CREATE POLICY "Users can read their messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Policy for users to insert messages they send
CREATE POLICY "Users can insert messages they send"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Policy for recipients to update messages (mark as read)
CREATE POLICY "Recipients can update messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON messages (sender_id);
CREATE INDEX IF NOT EXISTS messages_recipient_id_idx ON messages (recipient_id);
CREATE INDEX IF NOT EXISTS messages_project_id_idx ON messages (project_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at);
