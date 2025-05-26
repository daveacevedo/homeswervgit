/*
  # Initial Schema Setup for Home Service Provider SaaS

  1. New Tables
    - `service_providers` - Stores business owner profiles and account information
    - `services` - Catalog of services offered by providers
    - `provider_services` - Junction table linking providers to their services
    - `projects` - Customer projects/leads
    - `bids` - Provider bids on projects
    - `portfolios` - Provider portfolio items
    - `reviews` - Customer reviews for providers
    - `appointments` - Scheduled appointments

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Service Providers Table
CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  description TEXT,
  license_number TEXT,
  insurance_info TEXT,
  is_verified BOOLEAN DEFAULT false,
  average_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own data"
  ON service_providers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Providers can update own data"
  ON service_providers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Services Table (Service Categories)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read services"
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

-- Provider Services Junction Table
CREATE TABLE IF NOT EXISTS provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  price_range_min NUMERIC(10,2),
  price_range_max NUMERIC(10,2),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider_id, service_id)
);

ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own services"
  ON provider_services
  FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Providers can insert own services"
  ON provider_services
  FOR INSERT
  TO authenticated
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Providers can update own services"
  ON provider_services
  FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Providers can delete own services"
  ON provider_services
  FOR DELETE
  TO authenticated
  USING (provider_id = auth.uid());

-- Projects Table (Customer Leads)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  customer_id UUID REFERENCES auth.users(id),
  service_id UUID REFERENCES services(id),
  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  location TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  status TEXT DEFAULT 'open',
  urgency TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Bids Table
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  estimated_days INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own bids"
  ON bids
  FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Providers can insert own bids"
  ON bids
  FOR INSERT
  TO authenticated
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Providers can update own bids"
  ON bids
  FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid());

-- Portfolio Items Table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  service_id UUID REFERENCES services(id),
  completed_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read portfolios"
  ON portfolios
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Providers can insert own portfolios"
  ON portfolios
  FOR INSERT
  TO authenticated
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Providers can update own portfolios"
  ON portfolios
  FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Providers can delete own portfolios"
  ON portfolios
  FOR DELETE
  TO authenticated
  USING (provider_id = auth.uid());

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled',
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Providers can insert own appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Providers can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Providers can delete own appointments"
  ON appointments
  FOR DELETE
  TO authenticated
  USING (provider_id = auth.uid());

-- Insert some initial service categories
INSERT INTO services (name, category, description) VALUES
('Plumbing Repair', 'Plumbing', 'General plumbing repair services'),
('Bathroom Remodeling', 'Plumbing', 'Complete bathroom renovation services'),
('Electrical Wiring', 'Electrical', 'Home electrical wiring and rewiring'),
('Lighting Installation', 'Electrical', 'Installation of light fixtures'),
('HVAC Installation', 'HVAC', 'Installation of heating and cooling systems'),
('HVAC Maintenance', 'HVAC', 'Regular maintenance of heating and cooling systems'),
('Interior Painting', 'Painting', 'Indoor painting services'),
('Exterior Painting', 'Painting', 'Outdoor painting services'),
('Flooring Installation', 'Flooring', 'Installation of various flooring types'),
('Carpet Cleaning', 'Cleaning', 'Deep cleaning of carpets and rugs'),
('Window Cleaning', 'Cleaning', 'Professional window cleaning services'),
('Lawn Mowing', 'Landscaping', 'Regular lawn maintenance'),
('Garden Design', 'Landscaping', 'Professional garden design and implementation'),
('Roof Repair', 'Roofing', 'Repair of damaged roofs'),
('Roof Replacement', 'Roofing', 'Complete roof replacement services');
