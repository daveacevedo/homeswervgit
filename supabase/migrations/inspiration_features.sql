/*
  # Inspiration Features Schema

  1. New Tables
    - `vision_boards` - Stores user vision boards
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to auth.users)
      - `title` (text, board title)
      - `description` (text, board description)
      - `category` (text, board category)
      - `cover_image_url` (text, optional cover image)
      - `is_public` (boolean, whether board is public)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `vision_board_items` - Stores items in vision boards
      - `id` (uuid, primary key)
      - `vision_board_id` (uuid, reference to vision_boards)
      - `title` (text, item title)
      - `description` (text, item description)
      - `image_url` (text, image URL)
      - `source_url` (text, original source URL)
      - `position_x` (integer, x-coordinate for drag-and-drop)
      - `position_y` (integer, y-coordinate for drag-and-drop)
      - `width` (integer, item width)
      - `height` (integer, item height)
      - `tags` (text[], array of tags)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `inspiration_gallery` - Stores curated inspiration items
      - `id` (uuid, primary key)
      - `title` (text, item title)
      - `description` (text, item description)
      - `image_url` (text, image URL)
      - `source_url` (text, original source URL)
      - `category` (text, item category)
      - `style` (text, design style)
      - `budget_range` (text, budget range)
      - `project_type` (text, type of project)
      - `tags` (text[], array of tags)
      - `is_featured` (boolean, whether item is featured)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `ai_conversations` - Stores AI assistant conversations
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to auth.users)
      - `project_id` (uuid, reference to projects, optional)
      - `title` (text, conversation title)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `ai_messages` - Stores messages in AI conversations
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, reference to ai_conversations)
      - `role` (text, 'user' or 'assistant')
      - `content` (text, message content)
      - `created_at` (timestamptz)

    - `ai_suggestions` - Stores AI-generated suggestions
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to auth.users)
      - `conversation_id` (uuid, reference to ai_conversations, optional)
      - `project_id` (uuid, reference to projects, optional)
      - `suggestion_type` (text, type of suggestion)
      - `content` (jsonb, suggestion content)
      - `is_applied` (boolean, whether suggestion was applied)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Vision Boards Table
CREATE TABLE IF NOT EXISTS vision_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE vision_boards ENABLE ROW LEVEL SECURITY;

-- Vision Board Items Table
CREATE TABLE IF NOT EXISTS vision_board_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vision_board_id UUID NOT NULL REFERENCES vision_boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  source_url TEXT,
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  width INTEGER NOT NULL DEFAULT 300,
  height INTEGER NOT NULL DEFAULT 300,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE vision_board_items ENABLE ROW LEVEL SECURITY;

-- Inspiration Gallery Table
CREATE TABLE IF NOT EXISTS inspiration_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  source_url TEXT,
  category TEXT NOT NULL,
  style TEXT,
  budget_range TEXT,
  project_type TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE inspiration_gallery ENABLE ROW LEVEL SECURITY;

-- AI Conversations Table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- AI Messages Table
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- AI Suggestions Table
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  suggestion_type TEXT NOT NULL,
  content JSONB NOT NULL,
  is_applied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Vision Boards
CREATE POLICY "Users can view their own vision boards"
  ON vision_boards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public vision boards"
  ON vision_boards
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can create their own vision boards"
  ON vision_boards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vision boards"
  ON vision_boards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vision boards"
  ON vision_boards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for Vision Board Items
CREATE POLICY "Users can view items in their own vision boards"
  ON vision_board_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vision_boards
      WHERE vision_boards.id = vision_board_items.vision_board_id
      AND vision_boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view items in public vision boards"
  ON vision_board_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vision_boards
      WHERE vision_boards.id = vision_board_items.vision_board_id
      AND vision_boards.is_public = true
    )
  );

CREATE POLICY "Users can create items in their own vision boards"
  ON vision_board_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vision_boards
      WHERE vision_boards.id = vision_board_items.vision_board_id
      AND vision_boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in their own vision boards"
  ON vision_board_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vision_boards
      WHERE vision_boards.id = vision_board_items.vision_board_id
      AND vision_boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items in their own vision boards"
  ON vision_board_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vision_boards
      WHERE vision_boards.id = vision_board_items.vision_board_id
      AND vision_boards.user_id = auth.uid()
    )
  );

-- RLS Policies for Inspiration Gallery
CREATE POLICY "Anyone can view inspiration gallery items"
  ON inspiration_gallery
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for AI Conversations
CREATE POLICY "Users can view their own AI conversations"
  ON ai_conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI conversations"
  ON ai_conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI conversations"
  ON ai_conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI conversations"
  ON ai_conversations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for AI Messages
CREATE POLICY "Users can view messages in their own conversations"
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

CREATE POLICY "Users can create messages in their own conversations"
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
CREATE POLICY "Users can view their own AI suggestions"
  ON ai_suggestions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI suggestions"
  ON ai_suggestions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS vision_boards_user_id_idx ON vision_boards(user_id);
CREATE INDEX IF NOT EXISTS vision_boards_category_idx ON vision_boards(category);
CREATE INDEX IF NOT EXISTS vision_board_items_vision_board_id_idx ON vision_board_items(vision_board_id);
CREATE INDEX IF NOT EXISTS inspiration_gallery_category_idx ON inspiration_gallery(category);
CREATE INDEX IF NOT EXISTS inspiration_gallery_style_idx ON inspiration_gallery(style);
CREATE INDEX IF NOT EXISTS inspiration_gallery_project_type_idx ON inspiration_gallery(project_type);
CREATE INDEX IF NOT EXISTS ai_conversations_user_id_idx ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS ai_conversations_project_id_idx ON ai_conversations(project_id);
CREATE INDEX IF NOT EXISTS ai_messages_conversation_id_idx ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS ai_suggestions_user_id_idx ON ai_suggestions(user_id);
CREATE INDEX IF NOT EXISTS ai_suggestions_conversation_id_idx ON ai_suggestions(conversation_id);
CREATE INDEX IF NOT EXISTS ai_suggestions_project_id_idx ON ai_suggestions(project_id);
