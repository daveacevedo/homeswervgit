/*
  # Community Inspiration Hub Tables

  1. New Tables
    - `community_posts` - Stores user-generated project posts
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to auth.users)
      - `title` (text, post title)
      - `description` (text, post description)
      - `images` (jsonb, array of image URLs)
      - `tags` (jsonb, array of tags)
      - `project_type` (text, type of project)
      - `budget_range` (text, budget range)
      - `location` (text, location)
      - `is_public` (boolean, whether the post is public)
      - `likes_count` (integer, number of likes)
      - `comments_count` (integer, number of comments)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `community_post_likes` - Stores likes on community posts
      - `id` (uuid, primary key)
      - `post_id` (uuid, reference to community_posts)
      - `user_id` (uuid, reference to auth.users)
      - `created_at` (timestamptz)

    - `community_post_comments` - Stores comments on community posts
      - `id` (uuid, primary key)
      - `post_id` (uuid, reference to community_posts)
      - `user_id` (uuid, reference to auth.users)
      - `comment` (text, comment content)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  images JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  project_type TEXT,
  budget_range TEXT,
  location TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Community Post Likes Table
CREATE TABLE IF NOT EXISTS community_post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;

-- Community Post Comments Table
CREATE TABLE IF NOT EXISTS community_post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE community_post_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Community Posts
CREATE POLICY "Users can create their own posts"
  ON community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON community_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON community_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public posts are visible to everyone"
  ON community_posts
  FOR SELECT
  TO authenticated
  USING (is_public = true OR auth.uid() = user_id);

-- RLS Policies for Community Post Likes
CREATE POLICY "Users can like posts"
  ON community_post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE community_posts.id = post_id
      AND (community_posts.is_public = true OR community_posts.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can remove their likes"
  ON community_post_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view likes on posts they can see"
  ON community_post_likes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE community_posts.id = post_id
      AND (community_posts.is_public = true OR community_posts.user_id = auth.uid())
    )
  );

-- RLS Policies for Community Post Comments
CREATE POLICY "Users can comment on posts"
  ON community_post_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE community_posts.id = post_id
      AND (community_posts.is_public = true OR community_posts.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own comments"
  ON community_post_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON community_post_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view comments on posts they can see"
  ON community_post_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE community_posts.id = post_id
      AND (community_posts.is_public = true OR community_posts.user_id = auth.uid())
    )
  );

-- Triggers to update likes_count and comments_count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_likes_count_trigger
AFTER INSERT OR DELETE ON community_post_likes
FOR EACH ROW
EXECUTE FUNCTION update_post_likes_count();

CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts
    SET comments_count = comments_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comments_count_trigger
AFTER INSERT OR DELETE ON community_post_comments
FOR EACH ROW
EXECUTE FUNCTION update_post_comments_count();
