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

---

## 2026-06-27 — Heavy-riders + hills content depth + header nav (P0.4 + P1.7)

**GSC snapshot (28d, ending 2026-06-24):** unchanged from previous run: 3 clicks,
526 impressions, CTR 0.6%. No striking-distance queries yet. Site is still new;
rankings take weeks to move after content changes. GSC script confirmed working.

**Top demand signals this run:**
- `/blog/best-ebikes-for-heavy-riders`: 117 impr, pos 47.4 -- top non-cargo impression
  page and the one query that already converted (1 click, "electric bike for heavy riders").
- `/blog/best-ebikes-for-hills`: 81 impr, pos 44.2 -- second highest non-cargo cluster.
- Both were explicitly flagged as "next candidates" in the previous log entry.

**Actions taken:**

1. **`/blog/best-ebikes-for-heavy-riders` expanded** (~600 words -> ~1,350 words):
   - Added a "top picks" section with 5 specific bikes from our catalog (Eunorau FLASH
     LITE ST, G30, FAT-AWD 3.0, DUOTTS S26 AWD, Walfisk ET-7 Ultra) with links to
     their detail pages and affiliate context.
   - Added a payload-by-weight-range table showing realistic range expectations.
   - Added 6 FAQ entries targeting exact query variants: "electric bike for heavy riders",
     "e-bike 300 lbs", "fat tire e-bike for heavy riders", etc.
   - Set `updatedAt: '2026-06-27'` for freshness signal.

2. **`/blog/best-ebikes-for-hills` expanded** (~650 words -> ~1,400 words):
   - Expanded torque table to 5 tiers (added 90-130 Nm and 130+ Nm rows).
   - Added "Our top picks" section: Eunorau Defender-S (mid-drive, 160 Nm), DUOTTS
     S26 AWD (dual motor, value), Eunorau FLASH (220 Nm single hub), Eunorau FAT-AWD
     3.0 (AWD fat tire), Walfisk WF750 UrbanX (budget).
   - Added 6 FAQs targeting "are electric bikes good for hills", "what torque for hills",
     "do e-bikes slow down on hills", "battery on hills", etc.
   - Set `updatedAt: '2026-06-27'` for freshness signal.

3. **Header nav (P1.7):** Added "About" link to the `NAV` array in `Header.tsx`.
   The About page (and its link to How We Test) is now reachable from every page's
   top navigation, not just the footer. Mobile menu inherits the same array.

**Verified:** tsc clean. No type errors introduced.

**Expected impact:** Both blog posts should gain relevance signals for their target
clusters as the richer content indexes. Specific bike links create internal links
to detail pages that are themselves approaching striking distance (Eunorau, Walfisk,
DUOTTS detail pages showing pos 15-24 in GSC). Header About link increases internal
linking to the E-E-A-T page, reinforcing trust signals.

**Next candidates:** (1) Roadmap P1.6 -- link score badges to `/how-we-test` on bike
cards / detail / best-of pages. (2) Expand `/best/folding-ebikes` (pos 21.3 in GSC,
low impression but already near page 1 -- a thin page could tip over with enrichment).
(3) P1.1 -- deepen individual bike detail pages (Engwe P275 SE at pos 23.8 is the
closest to a real click opportunity in the catalog).

---

## 2026-06-27 — Commuter + under-$1000 buyer's guides + P1.6 score links

**GSC snapshot (28d):** 3 clicks, 526 impressions, CTR 0.6% (same window -- no new
data yet; GSC has a ~3-day lag and the site is only weeks old). No striking-distance
queries in the tool output, but page-level data shows several catalog bike pages
creeping toward page 1:
- `/e-bikes/duotts/duotts-duotts-c29-k`: pos 14.8 (90-day)
- `/e-bikes/samebike/samebike-rs-a01-men`: pos 16.9, 25% CTR
- `/e-bikes/walfisk/walfisk-26-fat-tire-bafang...`: pos 8.1 -- already on page 1!
- `/best/folding-ebikes`: pos 21.3 -- BLOCKED: 0 bikes match the folding filter.
  No bike in Supabase or the JSON has frame_type=folding or suitable_for=folding.
  Added as P2.6 in ROADMAP (catalog gap, high priority).

**Decision:** Skip folding (no catalog bikes). Focus on two demand clusters named
in ROADMAP P0.4 that are now addressable: commuter and under-$1000.

**Actions taken:**

1. **/best/commuter-ebikes expanded** (1 FAQ -> 3 buyer's guide sections + 6 FAQs,
   ~900 words added, lastUpdated 2026-06-27):
   - Sections: "What makes a great commuter e-bike" (range reality-check, weight,
     fenders/racks); "Class 1 vs 2 vs 3 for commuting" (when to use each); "How far
     can you realistically commute?" (range math, weather/load factors).
   - FAQs target: "are e-bikes good for commuting", "how far can you commute",
     "what class e-bike for commuting", "what to look for", "license", "cost in 2026".
   - 15 bikes qualify for this category from the catalog (strong list).

2. **/best/ebikes-under-1000 expanded** (2 FAQs -> 3 buyer's guide sections + 6 FAQs,
   ~700 words added, lastUpdated 2026-06-27):
   - Sections: "What can you really get for under $1,000?" (honest expectations);
     "Step-through vs step-over under $1,000"; "What to watch for when buying a
     budget e-bike" (battery quality, removability, return policy).
   - FAQs target: "are e-bikes under $1,000 any good", "best e-bike under $1,000
     2026", "are budget e-bikes safe", "how long does battery last", "do I need license".

3. **P1.6 -- Score links to /how-we-test (done):**
   - Detail page: "How we score ->" link added next to the Scores section heading.
   - Best-of pages: "See our full methodology." link woven into the existing
     "How we rank" disclosure box on every best-of page.
   - BikeCard not linked (nested <a> invalid HTML; covered by detail page).

**Verified:** tsc clean. No type errors.

**Expected impact:** Commuter and under-$1000 are two of the top demand clusters
for new e-bike buyers; the buyer's guides increase on-page relevance for long-tail
commuter queries. Score links increase internal links to /how-we-test, reinforcing
E-E-A-T signals. The folding catalog gap is now documented.

**Next candidates:** (1) ROADMAP P2.6 -- add folding e-bikes to catalog (e.g.
Engwe EP-2 Pro, DYU D3F) so /best/folding-ebikes becomes a real page. (2) P1.1 --
deepen DUOTTS C29-K detail page (pos 14.8, closest to page 1 in catalog). (3) Watch
Walfisk WF26 at pos 8.1 (already page 1!) -- strengthen the detail page to push
CTR up from 9%.
