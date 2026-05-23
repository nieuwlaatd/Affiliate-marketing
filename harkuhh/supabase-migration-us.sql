-- =====================================================================
-- US E-BIKE PIVOT — Supabase migration
-- Run this in the Supabase Dashboard → SQL Editor (one block at a time
-- is fine). Safe to re-run: every statement uses IF NOT EXISTS guards.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Extend the `ebikes` table with US-market columns
-- ---------------------------------------------------------------------
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS bike_class TEXT;            -- 'class-1' | 'class-2' | 'class-3'
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS has_throttle BOOLEAN;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS has_suspension TEXT;        -- 'none' | 'front' | 'full'
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS max_speed_mph INTEGER;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS range_miles INTEGER;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS price_usd NUMERIC;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS weight_lbs NUMERIC;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS affiliate_network TEXT;     -- 'shareasale'|'impact'|'avantlink'|'rakuten'|'goaffpro'|'direct'
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS affiliate_program_id TEXT;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS commission_pct NUMERIC;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS cookie_days INTEGER;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS brand_country TEXT;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS ships_to_us BOOLEAN DEFAULT TRUE;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS warranty_years INTEGER;

-- New scoring columns (US model). Old NL score columns are left in place
-- so nothing breaks; the app reads the new ones with a fallback.
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS score_value NUMERIC;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS score_power NUMERIC;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS score_build_quality NUMERIC;
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS score_versatility NUMERIC;

-- ---------------------------------------------------------------------
-- 2. quiz_leads — captured emails from the E-Bike Finder quiz
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quiz_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  quiz_answers JSONB NOT NULL,
  recommended_bikes TEXT[] NOT NULL DEFAULT '{}',
  source TEXT DEFAULT 'quiz',                 -- 'quiz' | 'comparison' | 'newsletter' | 'guide'
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  converted BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_leads_email ON quiz_leads(email);
CREATE INDEX IF NOT EXISTS idx_quiz_leads_created ON quiz_leads(created_at);

-- ---------------------------------------------------------------------
-- 3. email_sequences — tracks automated email progress per lead
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES quiz_leads(id) ON DELETE CASCADE,
  sequence_name TEXT NOT NULL,                -- 'quiz_followup' | 'weekly_digest' | 'price_alert'
  step_number INTEGER NOT NULL,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_sequences_lead ON email_sequences(lead_id);

-- ---------------------------------------------------------------------
-- 4. Row Level Security
--    quiz_leads / email_sequences are written ONLY by the server (service
--    role bypasses RLS). We add a locked-down policy so the anon key can
--    INSERT a lead (from the quiz form) but cannot read other people's data.
-- ---------------------------------------------------------------------
ALTER TABLE quiz_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon can insert quiz leads" ON quiz_leads;
CREATE POLICY "anon can insert quiz leads"
  ON quiz_leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policy for anon => those are denied by default.
-- The server (service role key) can still do everything.

-- =====================================================================
-- DONE. Verify with:
--   SELECT column_name FROM information_schema.columns WHERE table_name='ebikes';
--   SELECT * FROM quiz_leads LIMIT 1;
-- =====================================================================
