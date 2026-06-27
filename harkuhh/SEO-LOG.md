# SEO Optimization Log

A running log of SEO changes driven by Google Search Console data. Each entry
records the date, the GSC signal acted on, what changed, and the expected impact.
The autonomous task `gsc-seo-optimizer` (runs every 5 hours) appends here so each
run has continuity, since runs have no memory of each other.

How to pull fresh data: `cd harkuhh && npm run gsc` (helper: `lib/gsc.ts`,
script: `scripts/gsc-insights.ts`, creds in `.env.local`).

---

## 2026-06-27 — GSC integration + cargo cluster expansion

**Setup:** Built the Google Search Console integration. Service-account auth via
`lib/gsc.ts`, insights script `scripts/gsc-insights.ts` (`npm run gsc`). Property
`sc-domain:bestbikeforme.com` confirmed accessible.

**GSC snapshot (28d, ending 2026-06-24):** 3 clicks, 526 impressions, CTR 0.6%.
Site is new; almost everything ranks deep (pos 44-72). No striking-distance
(pos 5-20) or low-CTR opportunities yet, so the lever this round was content
depth on the highest-demand cluster, not title/meta tweaks.

**Top demand clusters (impressions / avg position):**
- `/best/cargo-ebikes` — 187 impr / pos ~72. Many long-tail variants:
  "best cargo ebike", "best cargo e bike", "best cargo bicycle",
  "best cargo ebike 2025/2020", "best cargo bikes".
- `/blog/best-ebikes-for-heavy-riders` — 117 impr / pos ~47.
- `/blog/best-ebikes-for-hills` — 81 impr / pos ~44.

**Action taken — `/best/cargo-ebikes`:** Page was thin (3 cargo-tagged bikes, 1
FAQ, ~50 words). Two fixes:
1. Broadened the cargo filter in `app/best/[category]/page.tsx` to include
   genuine high-payload utility bikes (`maxWeight >= 350 && torque >= 80`), not
   just the `cargo` tag. List went from 3 to ~10 relevant bikes.
2. Added a buyer's-guide body (3 sections: what makes a good cargo e-bike,
   frame types, cost) and expanded FAQs from 1 to 7, targeting the exact
   long-tail query variants above. Added title/meta rewrite and a "Last updated"
   freshness signal. Extended the `CategoryDef` template with optional
   `sections` + `lastUpdated` so future runs can enrich other categories the
   same way. Page is now ~900 words with FAQPage + ItemList schema.

**Expected impact:** Move `/best/cargo-ebikes` up from pos ~72 by adding the
depth and query coverage Google expects for this competitive head term, and
capture the long-tail "best cargo ebike YEAR/bikes/bicycle" variants.

**Next candidates:** Expand `/blog/best-ebikes-for-heavy-riders` and
`/blog/best-ebikes-for-hills` (both 80-120 impr, pos ~44-47). Consider applying
the same `sections` enrichment to `/best/folding-ebikes` (folding queries seen
in data). Re-check GSC for any queries that have moved into striking distance.

---

## 2026-06-27 — E-E-A-T foundation (ROADMAP P0.2 + P0.3)

**Driver:** Roadmap, not a new GSC signal. The site is new and ranks deep
everywhere; trust/authority pages are a prerequisite for Google to rank a review
site. Built the cheapest, highest-leverage E-E-A-T signals.

**Changes shipped:**
- New `/about` page (mission, independence, how we make money, contact) with
  Organization schema.
- New `/how-we-test` page documenting the six-axis scoring method, real-world
  range stance, data sources and editorial independence.
- Shared editorial identity in `lib/editorial.ts` (SITE, AUTHOR, SCORING_AXES)
  so bylines and schema stay consistent.
- Blog posts now show an author byline linking to `/about`; Article schema
  `author` updated to a named entity with a URL (was bare Organization).
- Both pages added to `sitemap.ts` and linked from the footer (Learn column +
  bottom nav).

**Verified:** tsc clean; `/about` and `/how-we-test` return 200 with correct
headings and no stray characters; blog byline + schema author confirmed in HTML;
no console errors.

**Next candidates:** (1) Roadmap P1.6 — link score badges to `/how-we-test` on
bike cards / detail / best-of pages. (2) Roadmap P1.7 — add About + How We Test
to the header nav. (3) Resume GSC-driven content depth: expand
`/blog/best-ebikes-for-heavy-riders` and `/blog/best-ebikes-for-hills`.
(4) 👤 Dylan: replace the "Editorial Team" byline with a real named editor +
bio/photo in `lib/editorial.ts` for stronger E-E-A-T.

---

## 2026-06-27 — Reposition as an AI-run project (disclosure scoped to /about)

**Decision (owner):** No personal name. This is an independent project maintained
entirely by AI. The AI nature is disclosed ONLY on `/about`; it must never be
added to any other page, byline, schema or meta.

**Changes:**
- `/about` "Who we are" rewritten to "An independent, AI-run project": states the
  site is built and maintained entirely by AI, framed as a consistency/no-bias
  feature, with a corrections note. This is the only AI mention on the site.
- `lib/editorial.ts`: AUTHOR.name "BestBikeForMe Editorial Team" → "BestBikeForMe"
  (brand-as-publisher attribution; no human-team claim, no AI mention). Header
  comment now records the disclosure-scope rule for future runs.
- Blog bylines + Article schema now read "By BestBikeForMe".
- Superseded the earlier 👤 "real named editor" task.

**Verified:** tsc clean; AI disclosure present on /about and absent on home,
/how-we-test, blog, /e-bikes/overzicht and /best/cargo-ebikes; "editorial team"
removed sitewide; blog byline = "By BestBikeForMe".

**Constraint for future runs:** when adding pages or content, do NOT mention the
AI nature anywhere except /about. Attribute content to the brand.
