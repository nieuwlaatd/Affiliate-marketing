-- ============================================
-- HARKUHH DATABASE SCHEMA
-- ============================================

-- Categorieën
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  emoji text,
  sort_order int default 0
);

-- Deals (kortingscodes en aanbiedingen)
create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  product text not null,
  slug text not null unique,
  category text not null,
  code text,
  discount text not null,
  affiliate_link text not null,
  commission_pct decimal,
  cookie_duration text,
  emoji text,
  notes text,
  is_active boolean default true,
  verified_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Opgeslagen deals door gebruikers
create table if not exists saved_deals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid not null references deals(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, deal_id)
);

-- Gebruikersprofielen (extends Supabase Auth)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email_notifications boolean default true,
  created_at timestamp with time zone default now()
);

-- Nieuwsbrief abonnees
create table if not exists email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_verified boolean default false,
  subscribed_at timestamp with time zone default now(),
  unsubscribed_at timestamp with time zone
);

-- Code validatie log
create table if not exists deal_checks (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  checked_at timestamp with time zone default now(),
  is_valid boolean not null,
  error_message text
);

-- Klik tracking (analytics)
create table if not exists deal_clicks (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  clicked_at timestamp with time zone default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_deals_category on deals(category);
create index if not exists idx_deals_brand on deals(brand);
create index if not exists idx_deals_is_active on deals(is_active);
create index if not exists idx_deals_slug on deals(slug);
create index if not exists idx_saved_deals_user on saved_deals(user_id);
create index if not exists idx_deal_clicks_deal on deal_clicks(deal_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Zet RLS aan op alle tabellen
alter table deals enable row level security;
alter table categories enable row level security;
alter table saved_deals enable row level security;
alter table profiles enable row level security;
alter table email_subscribers enable row level security;
alter table deal_checks enable row level security;
alter table deal_clicks enable row level security;

-- DEALS: iedereen mag lezen, alleen service_role mag schrijven
create policy "Deals zijn publiek leesbaar"
  on deals for select
  to anon, authenticated
  using (true);

create policy "Alleen admin mag deals beheren"
  on deals for all
  using (auth.role() = 'service_role');

-- CATEGORIES: iedereen mag lezen
create policy "Categorieën zijn publiek leesbaar"
  on categories for select
  to anon, authenticated
  using (true);

create policy "Alleen admin mag categorieën beheren"
  on categories for all
  using (auth.role() = 'service_role');

-- SAVED_DEALS: gebruikers mogen alleen hun eigen opgeslagen deals zien
create policy "Gebruikers lezen eigen saved_deals"
  on saved_deals for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Gebruikers maken eigen saved_deals"
  on saved_deals for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Gebruikers verwijderen eigen saved_deals"
  on saved_deals for delete
  to authenticated
  using (auth.uid() = user_id);

-- PROFILES: iedereen mag lezen, alleen eigenaar mag updaten
create policy "Profielen zijn publiek leesbaar"
  on profiles for select
  to anon, authenticated
  using (true);

create policy "Gebruikers updaten eigen profiel"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- EMAIL_SUBSCRIBERS: iedereen mag zich inschrijven
create policy "Iedereen mag zich abonneren"
  on email_subscribers for insert
  to anon, authenticated
  with check (true);

-- DEAL_CHECKS: alleen leesbaar via service_role
create policy "Deal checks via service role"
  on deal_checks for all
  using (auth.role() = 'service_role');

-- DEAL_CLICKS: iedereen mag inserten (klik tracken)
create policy "Iedereen mag kliks loggen"
  on deal_clicks for insert
  to anon, authenticated
  with check (true);

-- ============================================
-- TRIGGER: automatisch profiel aanmaken bij registratie
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- TRIGGER: updated_at automatisch bijwerken
-- ============================================
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists deals_updated_at on deals;
create trigger deals_updated_at
  before update on deals
  for each row execute procedure public.update_updated_at();

-- ============================================
-- SEED DATA: Categorieën
-- ============================================
insert into categories (name, slug, emoji, sort_order) values
  ('Elektronica', 'elektronica', '📱', 1),
  ('Mode', 'mode', '👗', 2),
  ('Sport & Outdoor', 'sport-outdoor', '⚽', 3),
  ('Huis & Tuin', 'huis-tuin', '🏡', 4),
  ('Beauty & Gezondheid', 'beauty-gezondheid', '💄', 5),
  ('Eten & Drinken', 'eten-drinken', '🍕', 6),
  ('Reizen', 'reizen', '✈️', 7),
  ('Software & Apps', 'software-apps', '💻', 8),
  ('Boeken & Media', 'boeken-media', '📚', 9),
  ('Overig', 'overig', '🎁', 10)
on conflict (slug) do nothing;
