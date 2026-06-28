-- Adds an `available` flag to ebikes, separate from `is_active`.
--
-- Why a separate column: the public RLS SELECT policy on `ebikes` is
-- `is_active = true`, so flipping is_active to false hides the row from the
-- site entirely (the product page would 404). When a vendor discontinues a
-- bike we instead set `available = false`: the row stays publicly visible, and
-- the product page renders a "No longer available" notice (and Product schema
-- availability = Discontinued) while preserving the page's SEO history.
--
-- Maintained automatically by the weekly catalog-sync routine.

alter table public.ebikes
  add column if not exists available boolean not null default true;
