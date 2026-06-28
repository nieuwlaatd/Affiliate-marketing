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

---

## 2026-06-28 -- Folding e-bikes content expansion + ENGWE data discovery

**GSC snapshot (28d, ending ~2026-06-25):** 3 clicks, 546 impressions, CTR 0.5%.
No change from previous window (expected lag). Key page signals:
- `/best/folding-ebikes`: pos 18.8, 4 impressions, 0 clicks -- NEAR page 1, thin content.
- `/e-bikes/engwe/engwe-p275-se`: pos 21.2, 19 impressions, 5.3% CTR, 1 click.
- `/e-bikes/samebike/samebike-rs-a01-men`: pos 8.2, 5 impr, 20% CTR, 1 click (page 1).
- `/e-bikes/duotts/duotts-duotts-c29-k`: pos 15.8, 4 impr, 0 clicks.
- `/blog/best-ebikes-for-heavy-riders`: 120 impr, pos 46.7, 0.8% CTR.
No queries in strict striking distance (pos 5-20) yet.

**Key discovery -- Engwe folding bikes ARE in catalog:**
Previous run's "P2.6: 0 bikes match folding filter" was wrong. The
`/best/folding-ebikes` filter checks `!!b.dimensions?.foldedSize`, NOT
`frame_type` or `suitable_for`. Querying Supabase revealed 11 Engwe bikes with
`dimensions.foldedSize` set (e.g. EP-2 Pro: "99*55*76 cm", Engine Pro 2.0:
"104*55*84 cm", etc.). The page was already showing bikes; it was just thin on
content, explaining why it ranks at pos 18.8 with near-zero engagement.

**Second discovery -- ENGWE Supabase data uses Dutch field values:**
All ~40+ ENGWE bikes in Supabase have Dutch `suitable_for` values (`woon-werk`,
`recreatief`, `transport`, `off-road`, `sportief`) and Dutch `frame_type` values
(`laag-instap`, `sportief`). This means Engwe bikes are invisible to the commuter,
recreation, cargo and other English-filter category pages. They only appear on the
folding page (dimension-based filter) and the direct detail pages. This is a major
data gap -- fixing it (P0.6 in ROADMAP) would unlock Engwe across all category pages.

**Action taken -- /best/folding-ebikes expanded:**
Added 3-section buyer's guide (~900 words) + expanded from 1 FAQ to 7 FAQs.
Sections cover: (1) who should buy a folding e-bike (apartments, multi-modal
commuters, RV/van travelers); (2) what to look for (folded dimensions, hinge
quality, wheel size, motor power); (3) how far can they go (range reality-check,
practical vs manufacturer figures). FAQs target: "are folding e-bikes worth it",
"best folding e-bike 2026", "how small do folding e-bikes get", "how heavy",
"can I take on transit", "are they as fast", "can they handle hills".
Also updated `lastUpdated` to 2026-06-28 for freshness signal.

**ROADMAP updates:**
- P2.6 updated: corrected the "0 bikes" misunderstanding; page has bikes, needed
  content depth (now done).
- P0.6 added: fix Dutch suitable_for/frame_type values across ENGWE Supabase rows
  (high-leverage data cleanup that unlocks Engwe on all category pages).

**Expected impact:** `/best/folding-ebikes` at pos 18.8 is the closest thing to a
striking-distance page on the site. Adding substantive content increases on-page
relevance for folding e-bike queries and signals to Google that the page answers
the search intent, which should push it into the top 10.

**Next candidates:** (1) P0.6 -- fix Dutch Supabase values for ENGWE bikes
(translate suitable_for, frame_type) to unlock them on commuter/recreation/etc.
pages. (2) P1.1 -- deepen the Engwe P275 SE detail page (pos 21.2, 19 impr) and
DUOTTS C29-K (pos 15.8) to push them toward page 1. (3) P0.5 -- internal linking
pass (still undone, high authority value).

---

## 2026-06-28 -- ENGWE data fix (P0.6) + detail page template enrichment (P1.1)

**GSC snapshot (28d, ending ~2026-06-25):** 3 clicks, 546 impressions, CTR 0.5%.
Total impressions up 20 from previous window (526 → 546). No meaningful rank
movements yet -- content changes from earlier runs are still being indexed.
Key page signals (90d window for more stability):
- `/e-bikes/samebike/samebike-rs-a01-men`: pos 16.9, 8 impr, 25% CTR, 2 clicks (best performer)
- `/e-bikes/walfisk/walfisk-walfisk-26-fat-tire-bafan`: pos 8.0, 15 impr, 6.7% CTR, 1 click
- `/e-bikes/duotts/duotts-duotts-c29-k`: pos 14.8, 5 impr, 0 clicks -- striking distance, no CTR
- `/e-bikes/engwe/engwe-p275-se`: pos 21.2, 19 impr -- near page 1
- `/best/folding-ebikes`: pos 18.8, 4 impr -- content expanded last run
- `/e-bikes`: pos 5.6, 14 impr, 0 clicks (redirect to /e-bikes/overzicht)
No queries in strict striking-distance (pos 5-20) in 28d window.

**Action 1 -- P0.6: ENGWE Dutch field values fixed in Supabase (live immediately)**
All 22 ENGWE bikes had Dutch `suitable_for` and `frame_type` values:
- suitable_for: `woon-werk`→`commuting`, `recreatief`→`recreation`,
  `transport`→`commuting`, `sportief`→`sport`, `off-road` unchanged.
  Used CASE + DISTINCT in a single SQL UPDATE to handle deduplication
  (bikes with both `woon-werk` + `transport` correctly merged to one `commuting`).
- frame_type: `laag-instap`→`step-through`, `hoog-instap`→`step-over`,
  `sportief`→`sport`.
Verified: `SELECT COUNT(*) ... WHERE remaining_dutch` = 0. ENGWE bikes now appear
on commuter, recreation, off-road, and sport category pages. The commuter-ebikes
page gains ~22 new Engwe listings; recreation likewise. This significantly
increases the depth and selection on the two highest-traffic best-of pages.

**Action 2 -- P1.1: Detail page template enrichment (88 bike pages upgraded)**
Three improvements to `app/e-bikes/[brand]/[model]/page.tsx`:

1. **Meta description** now leads with specific specs:
   Previously: "Is the X worth $Y? Compare specs, read our analysis and find the best price."
   Now: "X review: Z mi real-world range, N Nm motor, $Y. Score: S/10. Full specs and where to buy."
   This surfaces the numbers a buyer is actually searching for, improving CTR for
   brand-model review queries (the exact type ranking at pos 14-21 in GSC).

2. **FAQPage schema** added (4 questions per bike, dynamically generated):
   - "Is the [brand] [model] worth it?" -- answer includes score + description
   - "How far can the [brand] [model] go?" -- real-world vs claimed range
   - "What class is the [brand] [model]?" -- class label + throttle status
   - "How heavy is the [brand] [model]?" -- weight + max payload
   FAQ schema triggers Google's People Also Ask boxes for review queries, which
   appear above the main results and significantly boost CTR.

3. **"Who is this bike for?" section** (new JSX block after the Specifications table):
   - "Best for" column: suitableFor tags, heavy-rider callout (if maxWeight >= 300),
     long-range callout (if rangePractical >= 50), budget callout (if price <= 1000).
   - "Consider alternatives if you..." column (if any apply): heavy bike warning
     (weight > 55 lbs), hills warning (rear-hub + torque < 80 Nm), build quality
     caveat (scoreOverall < 7), no-throttle warning.
   Column hidden if no skip-if items apply (clean for premium bikes).

4. **Category links** (new section before Similar bikes): dynamic links to the
   relevant best-of page(s) based on suitableFor + bikeClass + price tier.
   Covers: commuter-ebikes, cargo-ebikes, class-3-ebikes, under-$1000, under-$1500.
   Creates internal links from every detail page into the best-of cluster --
   partially addressing ROADMAP P0.5 (internal linking).

**Verified:** tsc --noEmit clean, zero type errors.

**Expected impact:**
- ENGWE fix: commuter + recreation best-of pages now surface 22 more bikes
  immediately, increasing listing depth. ENGWE detail pages gain relevant
  category page internal links pointing back to them (via the suitableFor-based
  links added to the detail page template).
- Detail page meta: CTR improvement for high-intent "[brand] [model] review"
  queries that are already ranking at pos 14-22. The C29-K (pos 14.8, 0 clicks)
  and P275 SE (pos 21.2) are the most likely to benefit first.
- FAQPage schema: eligible for PAA boxes, which show above the fold even for
  rankings at pos 10-20. This is the fastest path to first-page visibility for
  these brand-specific queries.
- Category links: internal authority flows from detail pages to best-of pages,
  helping the cargo, commuter, and class-3 category pages rank better.

**Next candidates:** (1) P0.5 -- systematic internal linking audit (blogs linking
to bikes, best-of pages linking to related blogs/vs-pages -- still largely undone).
(2) P2.4 -- add more best-of categories (fat-tire, long-range, step-through,
off-road/SUV) now that ENGWE bikes have correct tags. (3) P1.3 -- AggregateRating
schema on detail pages (Review schema exists but no aggregate; adding it enables
star ratings in SERPs). (4) Watch for ENGWE commuter/recreation pages to gain
impressions in the next GSC window (2-3 week lag).
