/*
  # AI Concierge Tables

  1. New Tables
    - `ai_conversations` - Stores user conversations with the AI concierge
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to auth.users)
      - `project_id` (uuid, reference to projects, optional)
      - `title` (text, conversation title)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `ai_messages` - Stores individual messages in AI conversations
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, reference to ai_conversations)
      - `role` (text, message role: 'user', 'assistant', 'system')
      - `content` (text, message content)
      - `created_at` (timestamptz)

    - `ai_suggestions` - Stores AI-generated suggestions for projects
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to auth.users)
      - `project_id` (uuid, reference to projects, optional)
      - `conversation_id` (uuid, reference to ai_conversations, optional)
      - `suggestion_type` (text, type of suggestion: 'provider', 'material', 'timeline', etc.)
      - `content` (jsonb, suggestion content)
      - `is_applied` (boolean, whether the suggestion was applied)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- AI Conversations Table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- AI Messages Table
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- AI Suggestions Table
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID,
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE SET NULL,
  suggestion_type TEXT NOT NULL,
  content JSONB NOT NULL,
  is_applied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for AI Conversations
CREATE POLICY "Users can manage their own conversations"
  ON ai_conversations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for AI Messages
CREATE POLICY "Users can view messages in their conversations"
  ON ai_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
      AND ai_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON ai_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
      AND ai_conversations.user_id = auth.uid()
    )
  );

-- RLS Policies for AI Suggestions
CREATE POLICY "Users can manage their own suggestions"
  ON ai_suggestions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update conversation timestamp when messages are added
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ai_conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_timestamp_trigger
AFTER INSERT ON ai_messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();
