-- =============================================
-- FietsenHarkuhh - VEILIGE versie
-- Werkt naast bestaande Harkuhh tabellen
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- NIEUWE TABELLEN (alleen als ze nog niet bestaan)
-- =============================================

-- E-bikes product tabel
CREATE TABLE IF NOT EXISTS ebikes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id),
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT DEFAULT 2025,
  price DECIMAL(10,2) NOT NULL,
  price_category TEXT CHECK (price_category IN ('budget', 'midden', 'premium')),

  -- Motor
  motor_type TEXT CHECK (motor_type IN ('midden', 'naaf-voor', 'naaf-achter')),
  motor_brand TEXT,
  torque INT,
  support_levels INT,

  -- Accu
  battery_capacity INT,
  range_manufacturer INT,
  range_practical INT,
  charge_time DECIMAL(3,1),
  battery_removable BOOLEAN DEFAULT true,

  -- Frame
  frame_type TEXT CHECK (frame_type IN ('laag-instap', 'hoog-instap', 'sportief')),
  frame_material TEXT DEFAULT 'Aluminium',
  wheel_size DECIMAL(3,1),
  weight DECIMAL(4,1),
  max_weight INT,

  -- Versnellingen
  gear_type TEXT CHECK (gear_type IN ('derailleur', 'naaf', 'cvt')),
  gear_count INT,
  gear_brand TEXT,

  -- Geschikt voor
  suitable_for TEXT[] DEFAULT '{}',

  -- Scores (0-10)
  score_overall DECIMAL(2,1) CHECK (score_overall >= 0 AND score_overall <= 10),
  score_price_quality DECIMAL(2,1) CHECK (score_price_quality >= 0 AND score_price_quality <= 10),
  score_comfort DECIMAL(2,1) CHECK (score_comfort >= 0 AND score_comfort <= 10),
  score_range DECIMAL(2,1) CHECK (score_range >= 0 AND score_range <= 10),

  -- Content
  description TEXT,
  highlights TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',

  -- Affiliate
  affiliate_url TEXT,
  test_ride_url TEXT,

  -- Meta
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Opgeslagen fietsen (wishlist)
CREATE TABLE IF NOT EXISTS saved_bikes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ebike_id UUID NOT NULL REFERENCES ebikes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, ebike_id)
);

-- Keuzehulp sessies (analytics)
CREATE TABLE IF NOT EXISTS keuzehulp_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  kennis_niveau TEXT,
  gebruiks_doel TEXT[],
  budget_min INT,
  budget_max INT,
  frame_voorkeur TEXT,
  woon_werk_afstand INT,
  recommended_slugs TEXT[],
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Klik tracking (e-bike specifiek)
CREATE TABLE IF NOT EXISTS ebike_click_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ebike_id UUID REFERENCES ebikes(id) ON DELETE SET NULL,
  click_type TEXT CHECK (click_type IN ('affiliate', 'test_ride', 'compare', 'detail')),
  source_page TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT DEFAULT 'FietsenHarkuhh',
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_ebikes_brand ON ebikes(brand);
CREATE INDEX IF NOT EXISTS idx_ebikes_price ON ebikes(price);
CREATE INDEX IF NOT EXISTS idx_ebikes_price_category ON ebikes(price_category);
CREATE INDEX IF NOT EXISTS idx_ebikes_motor_type ON ebikes(motor_type);
CREATE INDEX IF NOT EXISTS idx_ebikes_frame_type ON ebikes(frame_type);
CREATE INDEX IF NOT EXISTS idx_ebikes_score_overall ON ebikes(score_overall DESC);
CREATE INDEX IF NOT EXISTS idx_ebikes_is_active ON ebikes(is_active);
CREATE INDEX IF NOT EXISTS idx_ebikes_slug ON ebikes(slug);

CREATE INDEX IF NOT EXISTS idx_saved_bikes_user ON saved_bikes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_bikes_ebike ON saved_bikes(ebike_id);

CREATE INDEX IF NOT EXISTS idx_ebike_clicks_ebike ON ebike_click_tracking(ebike_id);
CREATE INDEX IF NOT EXISTS idx_ebike_clicks_created ON ebike_click_tracking(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ebike_clicks_type ON ebike_click_tracking(click_type);

CREATE INDEX IF NOT EXISTS idx_keuzehulp_created ON keuzehulp_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);

-- =============================================
-- TRIGGERS
-- =============================================

-- updated_at functie (bestaat mogelijk al, dus OR REPLACE)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers eerst als ze bestaan, dan opnieuw aanmaken
DROP TRIGGER IF EXISTS ebikes_updated_at ON ebikes;
CREATE TRIGGER ebikes_updated_at
  BEFORE UPDATE ON ebikes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE ebikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE keuzehulp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebike_click_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop bestaande policies als ze er al zijn
DROP POLICY IF EXISTS "ebikes_select" ON ebikes;
DROP POLICY IF EXISTS "saved_bikes_select" ON saved_bikes;
DROP POLICY IF EXISTS "saved_bikes_insert" ON saved_bikes;
DROP POLICY IF EXISTS "saved_bikes_delete" ON saved_bikes;
DROP POLICY IF EXISTS "keuzehulp_insert" ON keuzehulp_sessions;
DROP POLICY IF EXISTS "keuzehulp_select" ON keuzehulp_sessions;
DROP POLICY IF EXISTS "ebike_clicks_insert" ON ebike_click_tracking;
DROP POLICY IF EXISTS "blog_posts_select" ON blog_posts;

-- E-bikes: iedereen kan actieve bikes lezen
CREATE POLICY "ebikes_select" ON ebikes FOR SELECT USING (is_active = true);

-- Opgeslagen fietsen: gebruikers beheren hun eigen lijst
CREATE POLICY "saved_bikes_select" ON saved_bikes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_bikes_insert" ON saved_bikes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_bikes_delete" ON saved_bikes FOR DELETE USING (auth.uid() = user_id);

-- Keuzehulp: iedereen kan invullen, eigen sessies bekijken
CREATE POLICY "keuzehulp_insert" ON keuzehulp_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "keuzehulp_select" ON keuzehulp_sessions FOR SELECT USING (auth.uid() = user_id);

-- Klik tracking: iedereen kan inserten
CREATE POLICY "ebike_clicks_insert" ON ebike_click_tracking FOR INSERT WITH CHECK (true);

-- Blog posts: iedereen kan gepubliceerde posts lezen
CREATE POLICY "blog_posts_select" ON blog_posts FOR SELECT USING (is_published = true);

-- =============================================
-- SEED DATA: Categorieen toevoegen (skip als ze bestaan)
-- =============================================

INSERT INTO categories (name, slug, emoji) VALUES
  ('Elektrische fietsen', 'elektrische-fietsen', '🚲'),
  ('Verduurzaming', 'verduurzaming', '🌱'),
  ('Elektronica', 'elektronica', '💻')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SEED DATA: 20 E-bikes
-- =============================================

INSERT INTO ebikes (slug, brand, model, year, price, price_category, motor_type, motor_brand, torque, support_levels, battery_capacity, range_manufacturer, range_practical, charge_time, battery_removable, frame_type, frame_material, wheel_size, weight, max_weight, gear_type, gear_count, gear_brand, suitable_for, score_overall, score_price_quality, score_comfort, score_range, description, highlights, affiliate_url, test_ride_url, category_id) VALUES
  ('gazelle-cityzen-c380', 'Gazelle', 'CityZen C380 HMB', 2025, 2799, 'midden', 'midden', 'Bosch', 75, 4, 500, 130, 85, 4.5, true, 'hoog-instap', 'Aluminium', 28, 23.5, 130, 'naaf', 8, 'Shimano Nexus', ARRAY['woon-werk','recreatief'], 8.7, 8.2, 9.0, 8.5, 'De Gazelle CityZen C380 HMB is een veelzijdige e-bike met krachtige Bosch middenmotor.', ARRAY['Krachtige Bosch Performance Line motor','Geïntegreerde 500Wh accu','Comfortabel en stabiel','Uitstekende remmen'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('gazelle-ultimate-c380', 'Gazelle', 'Ultimate C380+ HMB', 2025, 3499, 'premium', 'midden', 'Bosch', 85, 4, 625, 170, 110, 5.0, true, 'laag-instap', 'Aluminium', 28, 25.0, 140, 'naaf', 8, 'Shimano Nexus', ARRAY['woon-werk','recreatief','transport'], 9.1, 8.0, 9.5, 9.2, 'Het vlaggenschip van Gazelle met maximaal comfort.', ARRAY['Bosch Performance Line CX','Extra grote 625Wh accu','Laag instapframe','Premium afwerking'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('gazelle-medeo-t10', 'Gazelle', 'Medeo T10 HMB', 2025, 2499, 'midden', 'midden', 'Bosch', 65, 4, 400, 100, 65, 3.5, true, 'sportief', 'Aluminium', 28, 21.0, 130, 'derailleur', 10, 'Shimano Deore', ARRAY['woon-werk','sportief','recreatief'], 8.3, 8.5, 7.8, 7.5, 'Sportieve e-bike die licht aanvoelt en vlot rijdt.', ARRAY['Lichtgewicht sportief frame','Bosch Active Line Plus','10-versnellingen derailleur','Vlotte wegligging'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('batavus-finez-e-go-exclusive', 'Batavus', 'Finez E-go Exclusive', 2025, 2599, 'midden', 'midden', 'Bosch', 65, 4, 500, 130, 80, 4.5, true, 'laag-instap', 'Aluminium', 28, 24.0, 130, 'naaf', 7, 'Shimano Nexus', ARRAY['woon-werk','recreatief','transport'], 8.4, 8.6, 8.8, 8.0, 'Nederlands vakmanschap met Bosch technologie.', ARRAY['Laag instap','Bosch Active Line Plus','Geïntegreerde verlichting','Stabiel en comfortabel'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('batavus-altura-e-go-power', 'Batavus', 'Altura E-go Power', 2025, 3199, 'premium', 'midden', 'Bosch', 85, 4, 625, 160, 100, 5.0, true, 'hoog-instap', 'Aluminium', 28, 26.0, 150, 'naaf', 8, 'Shimano Nexus', ARRAY['woon-werk','recreatief','transport'], 8.8, 7.9, 9.2, 9.0, 'Krachtige toerfiets met groot bereik.', ARRAY['Bosch Performance Line CX','Grote 625Wh accu','Extra stevig frame','Geschikt voor zwaardere belasting'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('batavus-velder-e-go', 'Batavus', 'Velder E-go', 2025, 1799, 'budget', 'naaf-achter', 'Shimano', 40, 3, 400, 100, 60, 4.0, true, 'laag-instap', 'Aluminium', 28, 22.0, 120, 'naaf', 7, 'Shimano Nexus', ARRAY['recreatief','woon-werk'], 7.4, 8.8, 7.5, 7.0, 'Betaalbare instap e-bike.', ARRAY['Scherp geprijsd','Lichtgewicht','Eenvoudig in gebruik','Betrouwbare naafmotor'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('stella-livorno-superior', 'Stella', 'Livorno Superior', 2025, 1999, 'budget', 'midden', 'Bafang', 65, 5, 522, 140, 80, 5.0, true, 'laag-instap', 'Aluminium', 28, 24.5, 130, 'naaf', 7, 'Shimano Nexus', ARRAY['woon-werk','recreatief'], 7.8, 9.0, 8.0, 7.8, 'Middenmotor-kwaliteit voor scherpe prijs.', ARRAY['Uitstekende prijs-kwaliteit','Krachtige middenmotor','Grote accu voor de prijs','Direct van fabrikant'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('stella-vicenza-sport', 'Stella', 'Vicenza Sport', 2025, 2399, 'midden', 'midden', 'Bafang', 80, 5, 600, 160, 95, 5.5, true, 'sportief', 'Aluminium', 28, 23.0, 130, 'derailleur', 9, 'Shimano Alivio', ARRAY['woon-werk','sportief','recreatief'], 8.1, 8.8, 7.5, 8.5, 'Sportieve e-bike met groot bereik.', ARRAY['Sportief frame','Grote 600Wh accu','Krachtige 80Nm motor','Scherpe prijs'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('giant-dailytour-e-plus-1', 'Giant', 'DailyTour E+ 1', 2025, 2899, 'midden', 'midden', 'Giant SyncDrive', 70, 5, 500, 125, 80, 4.0, true, 'hoog-instap', 'Aluminium', 28, 22.5, 136, 'derailleur', 10, 'Shimano Deore', ARRAY['woon-werk','recreatief'], 8.5, 8.3, 8.5, 8.0, 'Giant''s eigen motorsysteem met lichtgewicht frame.', ARRAY['Giant SyncDrive motor','Lichtgewicht aluminium','EnergyPak accu','RideControl display'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('giant-explore-e-plus-2', 'Giant', 'Explore E+ 2 GTS', 2025, 3299, 'premium', 'midden', 'Giant SyncDrive', 80, 5, 625, 155, 100, 4.5, true, 'sportief', 'Aluminium', 28, 24.0, 150, 'derailleur', 11, 'Shimano Deore', ARRAY['sportief','recreatief','off-road'], 8.9, 8.1, 8.2, 9.0, 'Gebouwd voor avontuur op alle paden.', ARRAY['Geschikt voor off-road','Krachtige SyncDrive Sport','Grote accu','Brede banden voor grip'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('cube-touring-hybrid-one-500', 'Cube', 'Touring Hybrid ONE 500', 2025, 2399, 'midden', 'midden', 'Bosch', 65, 4, 500, 130, 80, 4.5, true, 'sportief', 'Aluminium', 28, 23.0, 130, 'derailleur', 10, 'Shimano Deore', ARRAY['woon-werk','recreatief','sportief'], 8.2, 8.5, 7.8, 8.0, 'Veelzijdige touring e-bike met sportieve uitstraling.', ARRAY['Duits design','Bosch Active Line Plus','Sportief maar comfortabel','Complete uitrusting'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('cube-supreme-hybrid-one-625', 'Cube', 'Supreme Hybrid ONE 625', 2025, 3099, 'premium', 'midden', 'Bosch', 85, 4, 625, 165, 105, 5.0, true, 'laag-instap', 'Aluminium', 28, 25.5, 140, 'naaf', 5, 'Shimano Nexus', ARRAY['woon-werk','recreatief','transport'], 8.6, 8.0, 9.0, 9.0, 'Premium stadsfiets met laag instap en grote accu.', ARRAY['Bosch Performance Line CX','Grote 625Wh accu','Laag instap comfort','Premium componenten'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('trek-verve-plus-3', 'Trek', 'Verve+ 3', 2025, 2799, 'midden', 'midden', 'Bosch', 65, 4, 500, 125, 80, 4.5, true, 'laag-instap', 'Aluminium', 28, 23.5, 136, 'naaf', 8, 'Shimano Nexus', ARRAY['woon-werk','recreatief'], 8.4, 8.1, 8.8, 8.0, 'Comfortabele stads e-bike met betrouwbare Bosch.', ARRAY['Ergonomisch ontwerp','Bosch Active Line Plus','IsoZone comfort systeem','Geïntegreerde verlichting'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('trek-powerfly-5', 'Trek', 'Powerfly 5', 2025, 3699, 'premium', 'midden', 'Bosch', 85, 4, 625, 120, 70, 5.0, true, 'sportief', 'Aluminium', 29, 24.0, 136, 'derailleur', 12, 'Shimano Deore', ARRAY['sportief','off-road'], 8.7, 7.8, 7.5, 8.0, 'Elektrische mountainbike voor serieuze off-road.', ARRAY['E-MTB voor off-road','Bosch Performance Line CX','29 inch wielen','Vering voorvork (120mm)'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('specialized-como-3-0', 'Specialized', 'Turbo Como 3.0', 2025, 3199, 'premium', 'midden', 'Specialized', 50, 3, 530, 130, 85, 4.0, false, 'laag-instap', 'Aluminium', 27.5, 21.5, 127, 'naaf', 8, 'Shimano Nexus', ARRAY['woon-werk','recreatief'], 8.5, 7.5, 9.0, 8.2, 'Voelt als een gewone fiets met superkrachten.', ARRAY['Eigen Specialized motor','Zeer stille aandrijving','Strak geïntegreerd design','Mission Control app'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('cortina-e-common-hub', 'Cortina', 'E-Common Hub', 2025, 1599, 'budget', 'naaf-voor', 'Cortina', 30, 3, 418, 90, 55, 4.0, true, 'laag-instap', 'Aluminium', 28, 21.0, 120, 'naaf', 7, 'Shimano Nexus', ARRAY['recreatief','woon-werk'], 7.0, 9.0, 7.2, 6.5, 'De perfecte instap e-bike.', ARRAY['Laagste instapprijs','Eenvoudig en betrouwbaar','Lichtgewicht','Ideaal als eerste e-bike'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('cortina-e-foss-pro', 'Cortina', 'E-Foss Pro', 2025, 2199, 'midden', 'midden', 'Bafang', 65, 4, 504, 120, 75, 5.0, true, 'hoog-instap', 'Aluminium', 28, 23.5, 130, 'naaf', 8, 'Shimano Nexus', ARRAY['woon-werk','recreatief'], 7.9, 8.5, 8.0, 7.5, 'Middenmotor-prestaties voor betaalbare prijs.', ARRAY['Middenmotor voor scherpe prijs','Stoer uiterlijk','Praktische uitrusting','Goede prijs-kwaliteit'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('sparta-m10ti', 'Sparta', 'M10Ti', 2025, 2699, 'midden', 'midden', 'Bosch', 65, 4, 500, 130, 82, 4.5, true, 'laag-instap', 'Aluminium', 28, 24.0, 130, 'naaf', 8, 'Shimano Nexus', ARRAY['woon-werk','recreatief','transport'], 8.3, 8.3, 8.5, 8.0, 'Robuuste Hollandse e-bike met Bosch technologie.', ARRAY['Betrouwbare Bosch motor','Hollands merk','Stabiel en robuust','Goed uitgerust'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('sparta-d-rule-m8tb', 'Sparta', 'D-Rule M8Tb', 2025, 2299, 'midden', 'midden', 'Bosch', 65, 4, 500, 130, 78, 4.5, true, 'hoog-instap', 'Aluminium', 28, 23.5, 130, 'naaf', 8, 'Shimano Nexus', ARRAY['woon-werk','recreatief'], 8.0, 8.6, 8.0, 7.8, 'Stoere herenfiets met Bosch middenmotor.', ARRAY['Sportieve herenfiets','Bosch Active Line Plus','Goede prijs-kwaliteit','Robuust frame'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen')),

  ('tenways-cgo600-pro', 'Tenways', 'CGO600 Pro', 2025, 1499, 'budget', 'naaf-achter', 'Mivice', 35, 4, 360, 100, 55, 3.5, false, 'sportief', 'Aluminium', 28, 16.0, 120, 'naaf', 1, 'Single speed', ARRAY['woon-werk','recreatief'], 7.6, 9.2, 6.8, 6.5, 'Ultralichte e-bike die eruitziet als een gewone fiets.', ARRAY['Slechts 16 kg','Strak minimalistisch design','Riemaandrijving (onderhoudsvrij)','Zeer betaalbaar'], '#', '#', (SELECT id FROM categories WHERE slug = 'elektrische-fietsen'))
ON CONFLICT (slug) DO NOTHING;
