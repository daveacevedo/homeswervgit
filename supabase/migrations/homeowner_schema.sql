/*
  # Homeowner Features Schema

  1. New Tables
    - `homeowners` - Stores homeowner profiles and preferences
    - `properties` - Stores information about homeowner properties
    - `vision_boards` - Stores homeowner project vision boards
    - `vision_board_items` - Stores items within vision boards
    - `project_plans` - Stores homeowner project plans
    - `estimate_requests` - Stores homeowner requests for estimates
    - `provider_estimates` - Stores provider estimates for projects
    - `bookings` - Stores service bookings between homeowners and providers
    - `messages` - Stores communication between homeowners and providers
    - `payments` - Stores payment information for projects

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Homeowners Table
CREATE TABLE IF NOT EXISTS homeowners (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE homeowners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homeowners can read own data"
  ON homeowners
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Homeowners can update own data"
  ON homeowners
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homeowner_id UUID REFERENCES homeowners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  property_type TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  square_footage INTEGER,
  bedrooms INTEGER,
  bathrooms NUMERIC(3,1),
  year_built INTEGER,
  details JSONB,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homeowners can read own properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can insert own properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can update own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can delete own properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (homeowner_id = auth.uid());

-- Vision Boards Table
CREATE TABLE IF NOT EXISTS vision_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homeowner_id UUID REFERENCES homeowners(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  property_id UUID REFERENCES properties(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vision_boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homeowners can read own vision boards"
  ON vision_boards
  FOR SELECT
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can insert own vision boards"
  ON vision_boards
  FOR INSERT
  TO authenticated
  WITH CHECK (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can update own vision boards"
  ON vision_boards
  FOR UPDATE
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can delete own vision boards"
  ON vision_boards
  FOR DELETE
  TO authenticated
  USING (homeowner_id = auth.uid());

-- Vision Board Items Table
CREATE TABLE IF NOT EXISTS vision_board_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vision_board_id UUID REFERENCES vision_boards(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  image_url TEXT,
  source_url TEXT,
  tags TEXT[],
  position INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vision_board_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homeowners can read own vision board items"
  ON vision_board_items
  FOR SELECT
  TO authenticated
  USING (
    vision_board_id IN (
      SELECT id FROM vision_boards WHERE homeowner_id = auth.uid()
    )
  );

CREATE POLICY "Homeowners can insert own vision board items"
  ON vision_board_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    vision_board_id IN (
      SELECT id FROM vision_boards WHERE homeowner_id = auth.uid()
    )
  );

CREATE POLICY "Homeowners can update own vision board items"
  ON vision_board_items
  FOR UPDATE
  TO authenticated
  USING (
    vision_board_id IN (
      SELECT id FROM vision_boards WHERE homeowner_id = auth.uid()
    )
  );

CREATE POLICY "Homeowners can delete own vision board items"
  ON vision_board_items
  FOR DELETE
  TO authenticated
  USING (
    vision_board_id IN (
      SELECT id FROM vision_boards WHERE homeowner_id = auth.uid()
    )
  );

-- Project Plans Table
CREATE TABLE IF NOT EXISTS project_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homeowner_id UUID REFERENCES homeowners(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id),
  title TEXT NOT NULL,
  description TEXT,
  scope TEXT NOT NULL,
  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  timeline_start DATE,
  timeline_end DATE,
  materials_preferences TEXT[],
  vision_board_id UUID REFERENCES vision_boards(id),
  status TEXT DEFAULT 'planning',
  checklist JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE project_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homeowners can read own project plans"
  ON project_plans
  FOR SELECT
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can insert own project plans"
  ON project_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can update own project plans"
  ON project_plans
  FOR UPDATE
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can delete own project plans"
  ON project_plans
  FOR DELETE
  TO authenticated
  USING (homeowner_id = auth.uid());

-- Estimate Requests Table
CREATE TABLE IF NOT EXISTS estimate_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homeowner_id UUID REFERENCES homeowners(id) ON DELETE CASCADE,
  project_plan_id UUID REFERENCES project_plans(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  service_id UUID REFERENCES services(id),
  property_id UUID REFERENCES properties(id),
  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  timeline_start DATE,
  timeline_end DATE,
  attachments TEXT[],
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE estimate_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homeowners can read own estimate requests"
  ON estimate_requests
  FOR SELECT
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can insert own estimate requests"
  ON estimate_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can update own estimate requests"
  ON estimate_requests
  FOR UPDATE
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Providers can read estimate requests"
  ON estimate_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers WHERE id = auth.uid()
    )
  );

-- Provider Estimates Table
CREATE TABLE IF NOT EXISTS provider_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_request_id UUID REFERENCES estimate_requests(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  total_amount NUMERIC(10,2) NOT NULL,
  labor_cost NUMERIC(10,2),
  materials_cost NUMERIC(10,2),
  other_costs NUMERIC(10,2),
  description TEXT NOT NULL,
  timeline_days INTEGER,
  valid_until DATE,
  attachments TEXT[],
  terms_conditions TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE provider_estimates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own estimates"
  ON provider_estimates
  FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Providers can insert own estimates"
  ON provider_estimates
  FOR INSERT
  TO authenticated
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Providers can update own estimates"
  ON provider_estimates
  FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Homeowners can read estimates for their requests"
  ON provider_estimates
  FOR SELECT
  TO authenticated
  USING (
    estimate_request_id IN (
      SELECT id FROM estimate_requests WHERE homeowner_id = auth.uid()
    )
  );

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homeowner_id UUID REFERENCES homeowners(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  estimate_id UUID REFERENCES provider_estimates(id),
  project_plan_id UUID REFERENCES project_plans(id),
  service_id UUID REFERENCES services(id),
  property_id UUID REFERENCES properties(id),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled',
  total_amount NUMERIC(10,2),
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homeowners can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can insert own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (homeowner_id = auth.uid());

CREATE POLICY "Homeowners can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Providers can read bookings for their services"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Providers can update their bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid());

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES auth.users(id),
  receiver_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  attachments TEXT[],
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read messages they sent or received"
  ON messages
  FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can insert messages they send"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update messages they sent"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid());

-- Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homeowner_id UUID REFERENCES homeowners(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id),
  estimate_request_id UUID REFERENCES estimate_requests(id),
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read conversations they are part of"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (homeowner_id = auth.uid() OR provider_id = auth.uid());

CREATE POLICY "Users can insert conversations they are part of"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (homeowner_id = auth.uid() OR provider_id = auth.uid());

CREATE POLICY "Users can update conversations they are part of"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (homeowner_id = auth.uid() OR provider_id = auth.uid());

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  homeowner_id UUID REFERENCES homeowners(id),
  provider_id UUID REFERENCES service_providers(id),
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending',
  payment_date TIMESTAMPTZ,
  is_escrow BOOLEAN DEFAULT false,
  escrow_release_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homeowners can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Providers can read payments for their services"
  ON payments
  FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

-- Inspiration Gallery Table
CREATE TABLE IF NOT EXISTS inspiration_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  source TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE inspiration_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read inspiration gallery"
  ON inspiration_gallery
  FOR SELECT
  TO authenticated
  USING (true);

-- Project Showcases Table
CREATE TABLE IF NOT EXISTS project_showcases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homeowner_id UUID REFERENCES homeowners(id),
  provider_id UUID REFERENCES service_providers(id),
  booking_id UUID REFERENCES bookings(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  before_images TEXT[],
  after_images TEXT[],
  category TEXT NOT NULL,
  tags TEXT[],
  budget NUMERIC(10,2),
  timeline_days INTEGER,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE project_showcases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read project showcases"
  ON project_showcases
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Homeowners can insert own project showcases"
  ON project_showcases
  FOR INSERT
  TO authenticated
  WITH CHECK (homeowner_id = auth.uid());

CREATE POLICY "Providers can insert own project showcases"
  ON project_showcases
  FOR INSERT
  TO authenticated
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Homeowners can update own project showcases"
  ON project_showcases
  FOR UPDATE
  TO authenticated
  USING (homeowner_id = auth.uid());

CREATE POLICY "Providers can update own project showcases"
  ON project_showcases
  FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid());

-- Insert sample inspiration gallery items
INSERT INTO inspiration_gallery (title, description, image_url, category, tags, source)
VALUES
  ('Modern Kitchen Renovation', 'Clean lines and minimalist design with white cabinets and marble countertops', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', 'Kitchen', ARRAY['modern', 'minimalist', 'white', 'marble'], 'Pexels'),
  ('Cozy Living Room Design', 'Warm tones with comfortable seating and natural light', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'Living Room', ARRAY['cozy', 'warm', 'natural light'], 'Pexels'),
  ('Spa-Like Bathroom Retreat', 'Luxurious bathroom with freestanding tub and rainfall shower', 'https://images.pexels.com/photos/6585601/pexels-photo-6585601.jpeg', 'Bathroom', ARRAY['spa', 'luxury', 'freestanding tub'], 'Pexels'),
  ('Backyard Oasis', 'Landscaped garden with patio, fire pit, and outdoor seating', 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg', 'Landscaping', ARRAY['backyard', 'patio', 'garden'], 'Pexels'),
  ('Home Office Setup', 'Productive workspace with built-in shelving and ergonomic design', 'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg', 'Home Office', ARRAY['workspace', 'built-in', 'ergonomic'], 'Pexels'),
  ('Farmhouse Kitchen', 'Rustic kitchen with open shelving and farmhouse sink', 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg', 'Kitchen', ARRAY['farmhouse', 'rustic', 'open shelving'], 'Pexels'),
  ('Contemporary Bedroom', 'Sleek bedroom design with neutral colors and minimal decor', 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg', 'Bedroom', ARRAY['contemporary', 'neutral', 'minimal'], 'Pexels'),
  ('Outdoor Deck', 'Wooden deck with pergola and outdoor dining area', 'https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg', 'Outdoor', ARRAY['deck', 'pergola', 'dining'], 'Pexels');