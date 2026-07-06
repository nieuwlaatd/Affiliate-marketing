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

---

## 2026-06-28 -- Fat-tire + long-range best-of pages (P2.4)

**GSC snapshot (28d, ending ~2026-06-25):** 3 clicks, 546 impressions, CTR 0.5%.
No change in totals. No striking-distance queries (pos 5-20) in the query-level
tool output. Page-level signals from the 90d window:
- `/e-bikes/samebike/samebike-rs-a01-men`: pos 16.9, 25% CTR, 2 clicks (best performer)
- `/e-bikes/walfisk/walfisk-walfisk-26-fat-tire-bafan`: pos 8.0, page 1
- `/e-bikes/duotts/duotts-duotts-c29-k`: pos 14.8, 5 impr, 0 clicks -- striking distance
- `/best/folding-ebikes`: pos 18.8 -- content expanded previous run
- `/best/cargo-ebikes`: 205 impr, pos 72 -- high demand, weak rank (thin cluster)

**Decision:** Advance ROADMAP P2.4. The ENGWE Dutch field fix last run unlocked 22+
ENGWE bikes across filters. Fat-tire and long-range are two high-demand clusters
that now have strong catalog coverage. Both also align with the site's existing
bike portfolio (30+ fat-tire bikes, strong ENGWE/Eunorau/DUOTTS long-range coverage).

**Action 1 -- `/best/fat-tire-ebikes` (new page, live):**
Filter: bikes where description or highlights contain "fat" (fat tire / fat-tire).
Covers 30+ bikes from ENGWE, DUOTTS, Eunorau, SAMEBIKE, VTUVIA, Walfisk, DYU.
Content:
- 3 buyer's guide sections (~900 words total):
  (1) What is a fat tire e-bike and who should buy one (beach, snow, heavy riders,
  rough pavement — wide tire at low PSI explained)
  (2) How fat tires affect range, speed and handling (~10-15% range penalty vs road
  tires, handling trade-offs, weight impact)
  (3) 20-inch vs 26-inch fat tire wheels: portability vs stability trade-offs
- 7 FAQs targeting: "are fat tire e-bikes good for beginners", "how far can they go",
  "can they ride on the beach / sand", "good in snow", "harder to pedal",
  "how much do they weigh", "3-inch vs 4-inch fat tires"
- lastUpdated: 2026-06-28. Added to sitemap.ts.

**Action 2 -- `/best/long-range-ebikes` (new page, live):**
Filter: `rangePractical >= 55` (practical range in the database).
Note: several ENGWE bikes have range_practical stored in km rather than miles
(e.g. LE20 at 255, P275 Pro at 195) -- these appear at top of the list but are
data quality issues inherited from previous catalog work; fixing them is a
separate P0 cleanup task added to ROADMAP.
Content:
- 3 buyer's guide sections (~900 words total):
  (1) What "long range" actually means (manufacturer vs practical range gap;
  defining 50+ mi practical as the true long-range bar)
  (2) What drives range: battery Wh, motor type (mid-drive vs hub efficiency
  gap on hills), rider weight and assist level impact
  (3) Long-range vs standard e-bikes: weight and cost trade-offs; who actually
  benefits from 60+ mi range
- 7 FAQs targeting: "how far can a long-range e-bike go", "what battery size
  for 50 miles", "does motor type affect range", "rider weight and range",
  "second battery to extend range", "how long to charge", "worth the extra cost"
- lastUpdated: 2026-06-28. Added to sitemap.ts.

**Verified:** tsc --noEmit clean, zero errors. Both pages return HTTP 200 in dev
server. No console errors. Bike cards, buyer's guide sections, FAQ accordion and
quiz CTA all render correctly on both pages.

**Expected impact:**
- `/best/fat-tire-ebikes` targets "best fat tire e-bikes", "fat tire electric bike",
  "best fat tire ebike 2026" -- queries the existing Walfisk WF26 (pos 8, page 1)
  likely already attracts. The category page gives Google a hub page to cluster
  all fat-tire queries around, which should improve overall visibility for the cluster.
- `/best/long-range-ebikes` targets "best long range e-bikes", "long range electric
  bike", "e-bike 50 miles range" -- a distinct demand cluster with buyers who have
  specific needs (rural routes, heavy riders, long commutes). This is a
  conversion-oriented cluster with motivated buyers.
- Both pages added to sitemap, so they'll be crawled on the next sitemap fetch.

**ROADMAP data quality issue flagged (new P0 task):**
Several ENGWE bikes have `range_practical` values stored in km (not miles) in
Supabase. This causes misleading display on the long-range page (e.g. ENGWE LE20
showing "~255 mi"). Added as a P0 cleanup task to ROADMAP.

**Next candidates:** (1) Fix ENGWE range_practical km-as-miles data in Supabase
(new P0 task). (2) P2.4 remaining -- add under-$2000, step-through, off-road/SUV
best-of categories. (3) P0.5 -- systematic internal linking audit (blogs linking
to bikes; best-of pages linking to related blogs). (4) P1.3 -- AggregateRating
schema on detail pages to enable star ratings in SERPs.

---

## 2026-06-29 -- ENGWE km-to-miles fix (P0.7) + AggregateRating schema (P1.3)

**GSC snapshot (28d, ending ~2026-06-26):** 3 clicks, 551 impressions (+5), CTR 0.5%.
Slow but steady impression growth as earlier content changes index. Key page signals:
- `/best/folding-ebikes`: pos 16.4, 5 impr, 0 clicks -- moved from 18.8 to 16.4 (content
  expansion last run is working; striking distance, but 0 CTR suggests weak title/meta)
- `/e-bikes/duotts/duotts-duotts-c29-k`: pos 16.4, 5 impr, 0 clicks -- striking distance,
  zero CTR (meta not compelling enough to click)
- `/e-bikes/engwe/engwe-p275-se`: pos 21.2, 19 impr, 5.3% CTR, 1 click
- `/e-bikes/samebike/samebike-rs-a01-men`: pos 8.2, 5 impr, 20% CTR (page 1, best performer)
- `/best/cargo-ebikes`: 179 impr, pos 72.5, 0 clicks -- highest demand, weakest rank

**PostHog snapshot (28d):** 15 pageviews, 5 unique visitors, 1 source: search.yahoo.com.
KEY SIGNAL: 2 affiliate clicks on ENGWE N1 Pro -- first confirmed revenue intent on the site.
The N1 Pro detail page is converting at ~100% (1 session → 2 clicks), meaning the product
page works when people arrive. Priority: get more people there (ranking) + fix data accuracy
(the N1 Pro's range data needs to be correct for those buyers making a $1k+ decision).

**Decision:** Fix the two highest-leverage issues this run:
1. P0.7 -- ENGWE range km-as-miles (data accuracy; directly affects the N1 Pro's
   sibling pages and the long-range best-of page)
2. P1.3 -- AggregateRating schema (enables star ratings in SERPs across all 88 bike
   pages; the DUOTTS C29-K and P275 SE at pos 16-21 are most likely to benefit first)

**Action 1 -- P0.7: ENGWE range_practical km-as-miles fixed in Supabase (live immediately)**
13 ENGWE bikes had range values stored in km, displayed as impossible "miles":
  - LE20: 255 mi→158 mi practical (340→211 manufacturer)
  - P275 Pro, P275 ST: 195→121 mi practical (260→162 manufacturer)
  - L20 3.0 Pro: 120→75 mi, L20/E26: 105→65 mi
  - L20 3.0 Boost: 101→63 mi, Engine Pro 3.0 Boost: 97→60 mi, L20 Boost: 94→58 mi
  - EP-2 Pro/3.0 Boost/Boost: 90→56 mi
  - Engine Pro 2.0: 82→51 mi
Applied: `UPDATE ebikes SET range_practical = ROUND(range_practical / 1.609),
range_manufacturer = ROUND(range_manufacturer / 1.609) WHERE brand = 'ENGWE'
AND range_practical > 80`
Note: the 75/100 group (N1 Pro, N1 Air, P275 SE, Engine X, P20) are left unchanged
pending manual verification -- 75 miles is borderline for larger-battery models.
The LE20 at 158 mi practical is still high (possible dual-battery), flagged for review.

**Action 2 -- P1.3: AggregateRating schema on all 88 bike detail pages**
Added `aggregateRating` block to the Product JSON-LD schema in
`app/e-bikes/[brand]/[model]/page.tsx`:
  - ratingValue = (scoreOverall / 2).toFixed(1)  [10-point → 5-star scale]
  - bestRating: '5', worstRating: '1', reviewCount: 1
  - Applied via spread operator on productSchema (only added when scoreOverall exists)
  - Also unified reviewRating inside the Review node to use the same ratingValue
  - Checked: no `undefined` values leak into JSON.stringify output
Star ratings in SERPs appear for Product pages with AggregateRating when Google
validates the schema. The C29-K (pos 16.4, 0 CTR) and P275 SE (pos 21.2, 5.3% CTR)
are the most likely to get their first star-rating impressions.

**Verified:** tsc --noEmit clean, zero type errors.

**Expected impact:**
- ENGWE data fix: detail pages for the 13 affected bikes now show accurate range figures,
  preventing trust-breaking "~255 mi" claims. Long-range best-of page still includes most
  of these bikes (EP-2 series at 56 mi still qualifies at the rangePractical >= 55 threshold).
- AggregateRating: all 88 bike pages are now eligible for Google star-rating rich results.
  At current positions (many at 15-25), star ratings can dramatically lift CTR without
  needing a ranking jump -- the most cost-effective CTR lever available.

**Next candidates:** (1) P2.4 -- add under-$2000 best-of category (clear demand cluster,
  no page yet). (2) P0.5 -- systematic internal linking: blogs should link to bike
  detail pages; best-of pages should link to related blog posts. (3) Verify the 75/100
  ENGWE group (N1 Pro, N1 Air, P275 SE, Engine X, P20) -- are those miles or km?
  (4) Investigate why `/best/cargo-ebikes` (179 impr, pos 72) is not climbing despite
  content expansion -- may need more specific query targeting.

---

## 2026-06-29 -- Under-$2000 best-of page (P2.4) + internal linking pass (P0.5)

**GSC snapshot (28d, ending ~2026-06-26):** 3 clicks, 551 impressions, CTR 0.5%.
Totals unchanged (same data as last run -- no new window yet). Page-level signals:
- `/best/folding-ebikes`: pos 16.4, 5 impr, 0 clicks -- striking distance, 0 CTR (title issue)
- `/e-bikes/duotts/duotts-duotts-c29-k`: pos 16.4, 5 impr, 0 clicks -- striking distance, 0 CTR
- `/e-bikes/engwe/engwe-p275-se`: pos 21.2, 19 impr, 5.3% CTR, 1 click
- `/e-bikes/samebike/samebike-rs-a01-men`: pos 8.2, 20% CTR, 1 click (page 1)
- `/best/cargo-ebikes`: 179 impr, pos 72.5, 0 clicks -- top demand, deep rank
- `/e-bikes/duotts/duotts-duotts-c29lite-electric-bik`: pos 21.8, 11 impr, 9.1% CTR, 1 click

**PostHog snapshot (28d):** 16 pageviews, 6 visitors. ENGWE N1 Pro: 2 affiliate
clicks again (second consecutive window). DUOTTS S26: 2 sessions. Traffic is 81%
direct -- organic is coming but slowly. No new conversion events yet.

**Decision:** Focus on two items that address both roadmap and data signals:
1. P2.4 -- add `/best/ebikes-under-2000` (missing ranking surface, clear demand)
2. P0.5 -- internal linking pass (best-of pages should link to blog posts + vice versa)

**Action 1 -- P2.4: `/best/ebikes-under-2000` (new page, live)**
New entry in the CATEGORIES array in `app/best/[category]/page.tsx`.
Filter: `b.price <= 2000` (all bikes up to $2,000 including the under-$1,000 range).
Content:
- 3 buyer's guide sections (~850 words total):
  (1) What the $1,000 to $2,000 range actually gets you (hydraulic brakes, 14-20Ah
      batteries, refined motor controllers, better build finishing)
  (2) Where the extra money goes: motors, brakes and build quality (hydraulic vs
      mechanical disc brakes explained; mid-range motor advantages)
  (3) How to choose by use case: commuter, cargo, fat tire or sport (payload,
      weight, tire type guidance at this price point)
- 7 FAQs targeting: "is $2,000 enough for a good e-bike", "best e-bike under
  $2,000 2026", "difference between $1,000 and $2,000 e-bike", "is $1,500 better
  than $1,000", "spend $1,500 or save for $2,500", "do more expensive e-bikes
  have better range", "are mid-range e-bikes worth it"
- lastUpdated: 2026-06-29. Added to sitemap.ts.
- relatedPosts linking to "How to Choose an Electric Bike" and "Best E-Bikes for
  Commuting 2026" guide posts.

**Action 2 -- P0.5: Internal linking pass (partial)**
Two-way linking now wired between best-of pages and blog posts:

(a) Added `relatedPosts` field to `CategoryDef` interface and a "Related reading"
    card grid section rendered between the buyer's guide and FAQ on every best-of page.
    Populated for 7 categories:
    - commuter-ebikes -> "Best E-Bikes for Commuting 2026", "E-Bike Classes Explained",
      "Best E-Bikes for Hills"
    - folding-ebikes -> "How to Choose an Electric Bike", "Best E-Bikes for Commuting 2026"
    - cargo-ebikes -> "Best E-Bikes for Heavy Riders", "Are E-Bikes Worth It?"
    - fat-tire-ebikes -> "Best E-Bikes for Heavy Riders", "Best E-Bikes for Hills"
    - long-range-ebikes -> "E-Bike Battery and Range Guide", "Best E-Bikes for Hills"
    - ebikes-under-1000 -> "How to Choose an Electric Bike", "Are E-Bikes Worth It?"
    - ebikes-under-2000 -> "How to Choose an Electric Bike", "Best E-Bikes for Commuting 2026"

(b) Updated `best-ebikes-for-heavy-riders` blog recommendation section to link
    forward to `/best/fat-tire-ebikes` and `/best/long-range-ebikes`.
(c) Updated `best-ebikes-for-hills` blog recommendation section to link forward
    to `/best/fat-tire-ebikes`.

**Verified:** tsc --noEmit clean, zero type errors.

**Expected impact:**
- `/best/ebikes-under-2000` targets "best e-bikes under $2,000", "best electric
  bike under $2000 2026" and the many mid-range budget queries that are distinct
  from the under-$1,000 cluster. It adds a new ranking surface to the site that
  will catch traffic the under-$1k and under-$1.5k pages can't.
- Internal linking: authority now flows in both directions between the blog and
  best-of cluster. The heavy-riders blog (123 impr / run) now feeds link equity
  to the fat-tire and long-range pages. The commuter, fat-tire and long-range
  best-of pages now surface related blog content, increasing time-on-site and
  crawl depth for Googlebot.

**Next candidates:** (1) P2.4 remaining -- add step-through and off-road/SUV
  best-of pages. (2) P1.2 -- comparison tables on best-of pages (sortable spec
  table above card grid). (3) Investigate cargo-ebikes rank stagnation at pos 72
  despite content -- may need to check for indexation issues or add more specific
  query targeting. (4) Folding-ebikes title/meta optimization (pos 16.4, 0 CTR --
  the current title may not be compelling enough versus what searchers expect).

---

## 2026-06-30 -- Step-through best-of page + step-through blog post (P2.4, unlogged run)

**Note:** This run completed but was not logged at the time. Reconstructed from code state.

**Changes shipped:**
- `/best/step-through-ebikes` (new page): 3-section buyer's guide covering who should choose
  step-through, what to look for (frame rigidity, standover height, motor/range considerations,
  fender/rack compatibility), and the real trade-offs vs step-over. 7 FAQs. relatedPosts linking
  to the new `step-through-vs-step-over-ebike` blog post + commuter guide + buyer's guide.
  lastUpdated 2026-06-30. Added to sitemap.
- `/blog/step-through-vs-step-over-ebike` (new blog post): Head-to-head comparison of frame
  styles, covering mounting ease, frame rigidity, weight, and use-case fit.

---

## 2026-07-04 (run 2) -- ENGWE Dutch descriptions fix + AWD blog post

**GSC snapshot (28d, ending 2026-07-01):** 3 clicks, 652 impressions, CTR 0.5%.
Same window as prior run. Key page signals:
- `/best/folding-ebikes`: pos 16.8, 6 impr, 0 clicks -- near page 1, zero CTR
- `/e-bikes/engwe/engwe-p275-se`: pos 19.3, 23 impr, 4.3% CTR -- highest single-bike impressions
- `/blog/best-ebikes-for-heavy-riders`: 139 impr, pos 47.1 -- top demand cluster
- `/best/cargo-ebikes`: 151 impr, pos 74.3 -- stubbornly deep despite content
- No queries in strict striking-distance (5-20) tool output

**PostHog snapshot (28d):** 22 visitors, 61 views, 22 sessions. Avg session 31.6 min.
64% bounce rate. Traffic sources: direct (15 visitors/26 views), Google (4 visitors/27 views
= 6.75 pages/visitor, highly engaged organic audience). Top pages: homepage (7 visitors),
DUOTTS S26 (5), /e-bikes/overzicht (4), ENGWE L20 (3), Eunorau Meta 275 ST-1 (3).
Only 2 affiliate clicks in 28 days total.

**Critical discovery: all 22 ENGWE bikes have Dutch descriptions in Supabase.**
The ENGWE L20 (3 PostHog visitors), P275 SE (pos 19.3, 23 GSC impressions) and
N1 Pro (recurring affiliate clicks) were all showing Dutch text ("De ENGWE L20 is een
step-through fat tire e-bike met 140 km bereik...") to US visitors. This is a direct
trust and conversion killer: buyers landing on these pages see foreign-language content.

**Action 1 -- Fix all 22 ENGWE Dutch descriptions (Supabase, live immediately):**
Translated descriptions to English for: E26, Engine Pro 2.0, Engine Pro 3.0 Boost,
Engine X, EP-2 3.0 Boost, EP-2 Boost, EP-2 Pro, L20, L20 3.0 Boost, L20 3.0 Pro,
L20 Boost, LE20, M1, M20, N1 Air, N1 Pro, P20, P275 Pro, P275 SE, P275 ST, T14,
X20/X24/X26. Each description now uses US English, references range in miles (using
the corrected range_practical values from P0.7), and highlights the key use case.
Verified via SELECT that the descriptions updated correctly.

**Action 2 -- New blog post: "AWD E-Bikes Explained: Do You Need All-Wheel Drive?"
(slug: awd-ebikes-explained, publishedAt: 2026-07-04):**
Targets "AWD e-bike", "dual motor e-bike", "all-wheel drive electric bike" queries.
DUOTTS S26 is the top PostHog product page (5 visitors) and an AWD model -- this post
feeds link equity directly to its detail page and to /best/off-road-ebikes.
Content structure: how dual-motor AWD works, AWD vs single-motor trade-offs, when AWD
is worth it (off-road, snow, heavy riders, steep hills), when to skip it, 3 AWD picks
(DUOTTS S26 $1,349, Eunorau FAT-AWD 3.0 $1,699, FAT-AWD 2.0 $1,699), 5 FAQs.
~1,300 words. relatedSlugs: best-ebikes-for-hills, best-ebikes-for-heavy-riders,
best-ebikes-for-commuting-2026. Auto-included in sitemap via getAllSlugs().

**Action 3 -- Off-road best-of page relatedPosts updated:**
Replaced "How to Choose an Electric Bike" with the new "AWD E-Bikes Explained" post
in the off-road page's relatedPosts. Creates two-way linking between /best/off-road-ebikes
and the new AWD blog post.

**Verified:** tsc --noEmit clean, zero type errors.

**Expected impact:**
- ENGWE descriptions: all 22 ENGWE detail pages now show English content to US visitors.
  The L20 (getting PostHog traffic), P275 SE (pos 19.3, highest-impression bike page in
  GSC) and N1 Pro (recurring affiliate clicks) are the most immediate beneficiaries.
  Eliminating the Dutch text removes a major trust barrier and should improve time-on-page
  and affiliate click rate.
- AWD blog post: creates a new organic entry point for "AWD e-bike" and "dual motor
  electric bike" queries. Links directly to DUOTTS S26 (top PostHog product page) and
  the off-road best-of page, building link equity for the highest-visited product cluster.
  The post also targets "is AWD worth it for hills" and heavy-rider overlap queries.
- Two-way internal linking: /best/off-road-ebikes now links to the AWD post and vice versa.

**Next candidates:** (1) P1.2 -- comparison tables on best-of pages (featured snippet
opportunity; especially cargo and folding which have high impressions). (2) Investigate
cargo-ebikes stagnation at pos 74 (151 impr, no movement for weeks -- may need query-
specific targeting or a different content structure). (3) Check if other brands have
Dutch or non-English descriptions in Supabase. (4) Fix ENGWE L20 3.0 Boost/Pro weight
values (150.0 in DB -- clearly wrong; actual weight is likely 34-40 lbs). (5) State
page expansion (P2.5) -- local intent queries, lower competition.

---

## 2026-07-04 -- Off-road best-of page (P2.4) completing the best-of expansion

**GSC snapshot (28d, ending 2026-07-01):** 3 clicks, 652 impressions (+101 from last window),
CTR 0.5%. Impressions are growing steadily as content from earlier runs indexes. Key signals:
- `/blog/best-ebikes-for-heavy-riders`: 139 impr, pos 47.1 (1 click, "electric bike for heavy riders")
  -- still the highest-demand non-homepage cluster outside of cargo
- `/best/cargo-ebikes`: 151 impr, pos 74.3, 0 clicks -- highest demand, stubbornly deep rank
- `/best/folding-ebikes`: pos 16.8, 0 clicks -- near page 1 but zero CTR (page 2 problem)
- `/e-bikes/samebike/samebike-rs-a01-pro`: pos 18.3, 2 clicks, 50% CTR -- striking distance
- `/e-bikes/samebike/samebike-rs-a01-men`: pos 8.8 (page 1, 1 click)
- Striking-distance query tool output: empty (all ranking pages still on page 2+)

**PostHog snapshot (28d):** 61 pageviews / 22 visitors (major jump from 15-16). 27 views from
Google (dominant source, up from ~10 last window). Top product page: DUOTTS S26 (6 views,
5 sessions) -- most-visited product page by far. ENGWE N1 Pro: 2 affiliate clicks (third
consecutive window -- consistent revenue intent). Conversion: 2 affiliate clicks total.

**Key cross-signal:** DUOTTS S26 is the most-visited product page in PostHog. It has
`suitable_for: off-road + sport` and `torque: 110 Nm`. The new off-road best-of page will
feature it prominently (high-torque AWD filter match), giving it an additional organic entry
point beyond the direct product page.

**Decision:** Complete P2.4 with the off-road/all-terrain best-of page. P2.4 is now fully done
with this run (step-through was added 2026-06-30 in an unlogged run).

**Action -- `/best/off-road-ebikes` (new page, live):**
Filter: `b.suitableFor.includes('sport') || b.suitableFor.includes('off-road')`
Covers 30+ bikes: ENGWE (N1 Pro, Engine Pro 3.0 Boost, L20 3.0 Pro, EP-2 series, X/M/E series),
DUOTTS (S26 AWD, F26 Lite, E26, F20), Eunorau (Defender-S mid-drive 160 Nm, FAT-AWD), VTUVIA, DYU.
Content:
- 3 buyer's guide sections (~1,000 words):
  (1) Who needs an off-road e-bike (gravel riders, rural routes, beach/sand, winter riding --
      with honest "overkill if pure pavement" caveat)
  (2) Specs that matter: torque (65 Nm light vs 90+ Nm demanding), tire width (3 vs 4 inch),
      motor type (hub vs mid-drive for sustained climbs)
  (3) AWD dual-motor vs single-motor (when the upgrade pays off, real trade-offs on weight/range)
- 7 FAQs targeting: "best off-road e-bike", "can e-bikes go off-road", "how much torque for
  off-road", "are fat tire e-bikes good for trails", "AWD vs single drive", "how heavy",
  "can off-road e-bikes handle hills"
- relatedPosts linking to best-ebikes-for-hills, best-ebikes-for-heavy-riders, buyer's guide
- lastUpdated 2026-07-04. Added to sitemap.

**Verified:** tsc --noEmit clean, zero type errors.

**Expected impact:**
- `/best/off-road-ebikes` creates a new ranking surface for "best off-road e-bike",
  "all-terrain electric bike", "fat tire off-road ebike 2026" queries -- a distinct demand
  cluster not addressed by any existing page. The AWD section specifically targets "AWD e-bike"
  and "dual motor electric bike" queries that map to the DUOTTS S26 (PostHog's top product page).
- ROADMAP P2.4 is now fully complete: fat-tire, long-range, under-$2000, step-through, off-road
  all live with buyer's guides, FAQs and internal links.

**Next candidates:** (1) P1.2 -- comparison tables on best-of pages (sortable spec table above
  card grid -- featured snippet opportunity). (2) Investigate cargo-ebikes rank stagnation
  (151 impr, pos 74.3 -- possibly competing with its own category filter on the listing page).
  (3) New blog post targeting "AWD e-bike" or "dual motor e-bike" queries to feed link equity
  to the new off-road page + DUOTTS S26 detail page. (4) State page expansion (P2.5) -- local
  intent queries, lower competition.

---

## 2026-07-05 -- Cargo-page data quality fixes + comparison tables (P0.9, P1.2)

**GSC snapshot (28d, ending 2026-07-02):** 2 clicks, 655 impressions, CTR 0.3%. Key signals:
- `/` (homepage): 3 clicks, 3 impr, pos 1.0 -- branded query, 100% CTR
- `/e-bikes/samebike/samebike-rs-a01-pro`: 2 clicks, 6 impr, pos 16.0, 33% CTR -- converting
- `/e-bikes/samebike/samebike-rs-a01-men`: 1 click, 9 impr, pos 9.1 -- page-1 rank
- `/blog/best-ebikes-for-heavy-riders`: 137 impr, pos 47.4, 1 click -- still the top demand cluster
- `/best/cargo-ebikes`: 141 impr, pos 74.3, 0 clicks -- still the highest-impression best-of page,
  no ranking movement despite the buyer's guide added 2026-06-27
- No queries in strict striking-distance (5-20) output this run

**PostHog snapshot (28d):** 61 pageviews, 22 visitors (same window as last run -- data lag).
Top pages unchanged: homepage, DUOTTS S26, /e-bikes/overzicht. 2 affiliate clicks total, both
on ENGWE N1 Pro (third consecutive run showing this bike converting).

**Investigation: why does cargo-ebikes stay stuck at pos 74 despite content?**
Checked the actual product data behind the page's filter (`suitableFor.includes('cargo') ||
(maxWeight>=350 && torque>=80)`). 11 bikes qualify, which is not thin -- but 3 of them had
real data bugs that would visibly break trust for anyone who clicked through:
- Eunorau FAT-AWD 2.0: `weight_lbs` was `375` -- someone had copy-pasted the payload/max-weight
  value into the weight field. The bike does not weigh 375 lbs.
- Eunorau MAX-CARGO 2.0 (the literal flagship "cargo" model): `torque=0`, `weight=0`,
  `max_weight=0`. All three specs the page's own buyer's guide says matter most for a cargo
  bike were blank on the one bike named "MAX-CARGO."
- Eunorau G30-CARGO: `torque=0`, `weight=0` (payload was already correct at 440 lbs).
- Also found SAMEBIKE M20-III (appears on this page via the torque/weight filter) at
  `weight_lbs=127.8`, implausible for any e-bike in this catalog.
A `torque=0` or `weight=0` bug is not cosmetic here: `generateMetadata` on the bike detail
page interpolates `torque` directly into the meta description ("X Nm motor"), so these bikes
were shipping a literal "0 Nm motor" line to Google and to anyone who saw the page in search
results. Conclusion: cargo-ebikes' stagnant rank is very likely mostly a competitive-difficulty
problem (a brand-new domain competing for one of the most commercial e-bike queries against
established authority sites), not a technical bug -- but the data bugs found are real, verified,
and worth fixing regardless of their effect on rank.

**Action 1 -- Fix verified data bugs (Supabase, live immediately), sourced from manufacturer/
retailer listings (electricbikereview.com, eunorau-ebike.com, bikeberry.com, energyebikes.com):**
- `eunorau-fat-awd-2`: weight/weight_lbs 375 -> 79.4 (matches the FAT-AWD 3.0's already-correct
  79.4, same platform). Rewrote description (was a bare spec fragment) to proper editorial copy.
- `eunorau-max-cargo`: weight/weight_lbs 0 -> 85, torque 0 -> 70, max_weight 0 -> 440. New
  editorial description covering payload, torque and the step-through frame.
- `eunorau-g30-cargo`: weight/weight_lbs 0 -> 78, torque 0 -> 65. New editorial description.
- `samebike-m20-iii`: weight/weight_lbs 127.8 -> 75 (verified: 34 kg = ~75 lbs per SAMEBIKE's
  own spec sheet). Description was already fine, left untouched.
- `eunorau-flash-lite-st`: description was a bare 66-character spec fragment despite having
  correct torque/weight data; rewrote to editorial copy for consistency (this bike also
  appears on the cargo-ebikes page via the torque/weight filter).
Did NOT touch DYU C2/C5/C6 (also flagged thin/zero-value) -- their torque is not published by
the manufacturer anywhere findable, and weight sources conflicted between listings for the
same model. Fabricating a plausible-looking number would be worse than leaving it blank.
Logged the full remaining list in ROADMAP P0.9 for a future run to work through carefully,
one verified model at a time.

**Action 2 -- P1.2: Comparison tables on best-of pages (`app/best/[category]/page.tsx`):**
New `components/SpecComparisonTable.tsx`, a server-rendered table (rank, bike, price, range,
torque, payload, score) inserted as a "Quick comparison" section above the card grid on every
`/best/[category]` page, showing the top 8 bikes by score. Static/SSR (no client JS, no
sortable-header complexity) so it is crawlable as-is and is a plain featured-snippet candidate
for "best cargo e-bike" / "best fat tire e-bike" style queries. Verified via preview: renders
correctly on `/best/cargo-ebikes` with real data (no stale "0 Nm" cells for the bikes fixed in
Action 1), degrades gracefully on categories with fewer matches, no console errors, `tsc
--noEmit` clean.

**Verified:** tsc --noEmit clean, zero type errors. Manually inspected rendered table via
preview snapshot on `/best/cargo-ebikes`.

**Expected impact:**
- The 5 data fixes remove visibly broken specs ("0 Nm motor" in meta descriptions, a 375 lb
  or 127.8 lb bike weight) from the highest-impression best-of page on the site (141 impr) and
  from SERPs directly (meta description is user-facing in search results).
- The comparison table gives every best-of page (7 categories) a structured, scannable summary
  that is a stronger featured-snippet candidate than a card grid, and keeps the "how do these
  bikes actually compare" question answered without leaving the page.
- Catalog count in ROADMAP corrected from stale "88" to the current 109 (grew via prior
  catalog-sync runs without the roadmap being updated).

**Next candidates:** (1) ROADMAP P0.9 -- work through the remaining ~30 bikes with thin
  descriptions / zero torque-weight (mostly Eunorau META/FAT-HD/SPECTER/FLASH/R1 lines, a few
  SAMEBIKE and VTUVIA models), one verified model at a time. (2) DYU C2/C5/C6 need a torque
  spec that isn't publicly documented -- consider omitting the torque line entirely from their
  detail-page copy rather than showing 0, or contacting DYU support for the number. (3) State
  page expansion (P2.5) -- local intent queries, lower competition. (4) samebike-rs-a01-pro/men
  are the only pages with real GSC clicks this run (pos 16 and pos 9.1) -- worth a closer look
  at whether their detail-page content can be strengthened further to defend/improve position.

---

## 2026-07-05 (run 2) -- Continuing the P0.9 data quality sweep + a new weight copy-paste bug class

**GSC snapshot (28d, ending 2026-07-02):** identical totals to the prior run this same day (2
clicks, 655 impressions, CTR 0.3%, cargo-ebikes still 141 impr / pos 74.3, heavy-riders blog post
still 137 impr / pos 47.4). GSC data had not refreshed since the last pull -- no new signal to
act on here, so this run leaned on the roadmap's own queued next-candidate instead.

**PostHog snapshot (28d):** 63 pageviews / 22 visitors (up slightly from 61/22). Top pages
unchanged (homepage, /e-bikes/overzicht, DUOTTS S26). 2 affiliate clicks total, both ENGWE N1
Pro (fourth consecutive run showing this bike converting -- consistently the strongest
revenue-intent signal in PostHog).

**Action -- ROADMAP P0.9 continued, next batch of verified fixes (Supabase):**
While auditing the remaining flagged bikes, found a second distinct bug pattern beyond simple
`0` placeholders: four Eunorau META bikes had `weight`/`weight_lbs` set equal to `max_weight`
(a straight copy-paste of the payload figure into the weight field), and one FLASH bike had
`weight_lbs` set to `1000` -- clearly copied from its "1000W" motor spec rather than an actual
weight. Both are the same class of bug as the FAT-AWD 2.0 "weight=375" bug fixed in run 1, just
not caught by a simple "torque=0" filter since these had nonzero (wrong) values. Verified real
weights via manufacturer pages (eunorau-ebike.com) and retailer listings, then fixed:
- `eunorau-meta-20-1`: weight_lbs 286 -> 63.4 (was a copy of max_weight=286)
- `eunorau-meta-24-1`: weight_lbs 286 -> 61.7 (same bug)
- `eunorau-meta-26-1`: weight_lbs 286 -> 68.4 (same bug)
- `eunorau-meta275-2`: weight_lbs 286 -> 60 (same bug)
- `eunorau-flash-2`: weight_lbs 1000 -> 85 (copied from "1000W" motor spec); also filled
  max_weight 0 -> 440 (was blank despite the bike having a real 440 lb payload rating)
- `eunorau-e-fat-mn`: weight 0 -> 55, torque 0 -> 80, max_weight 0 -> 330 (all three were blank)
- `vtuvia-giraffe-step-thru-city-commuter-electric-bike`: weight 0 -> 60, torque 0 -> 65,
  max_weight 0 -> 300
- `samebike-crest-fat-tire-mountain-e-bike`: torque 0 -> 85 (verified). Weight left as-is --
  not published on the manufacturer's site or any retailer listing found; fabricating one would
  repeat the mistake this sweep exists to fix.
All 7 fully-fixed bikes also got new editorial descriptions (were previously either a bare
spec-fragment sentence or the wrong-weight copy that read fine but stated a false number).
Sourced from eunorau-ebike.com and vtuviaebike.com manufacturer spec pages plus retailer
listings (motorizedbicyclehq.com, offgridlux.com, bikeberry.com) to cross-check each figure
before writing it.

**Verified:** re-queried Supabase to confirm all 8 updates landed correctly. Spot-checked
`/e-bikes/eunorau/eunorau-meta-24-1` in the dev preview -- Weight now shows "61.7 lbs" and Max
payload "286 lbs" as two distinct, correct numbers (previously both cells would have shown
"286"). No code changes this run (data-only), so `tsc --noEmit` was not re-run.

**Expected impact:** removes another class of visibly-false spec data (a "286 lb" 20-24-26-inch
city commuter bike, a "1000 lb" e-bike) from detail pages and their meta descriptions across 8
bikes. Same trust rationale as run 1: these numbers are user-facing in both the on-page spec
table and the SERP meta description.

**Next candidates:** (1) ROADMAP P0.9 -- roughly 19 bikes remain (Eunorau DEFENDER,
  DEFENDER-S, FAT-HD 1.0/2.0, FAT-HS, FLASH AWD 1.0, FLASH LITE 2.0, META275 ST 1.0, META275
  1.0, S1, SPECTER-S, SPECTER-ST, URUS; SAMEBIKE RS-A08-II, STORM, CREST-weight; VTUVIA FMB,
  REINDEER 1.0; DYU C2/C5/C6). Worth specifically re-checking whether any other Eunorau bikes
  have the weight-equals-max_weight or weight-equals-wattage copy-paste bug even where torque
  is nonzero -- this run only caught it while triaging the zero-value list, not via a targeted
  query. (2) GSC data has now shown the identical 655-impression snapshot across two consecutive
  runs -- worth checking Search Console directly (Dylan) for whether the connected property is
  still syncing, since real-world impressions should be moving even at this early stage. (3)
  State page expansion (P2.5) -- local intent queries, lower competition, still untouched.

---

## 2026-07-05 (run 3) -- ENGWE weight-unit bug (kg stored as lbs) on the two highest-signal bike pages (P0.9)

**GSC snapshot (28d, ending 2026-07-02):** identical totals to both earlier runs today (2
clicks, 655 impressions, CTR 0.3% -- GSC data has not refreshed today). Page-level detail worth
noting: `/e-bikes/engwe/engwe-p275-se` is the highest-impression individual bike page on the
site (22 impr, pos 19.9, 4.5% CTR, 1 click) and `/e-bikes/duotts/duotts-e29` appeared as a new
page with a click (1 click, 3 impr, pos 21.3, 33% CTR). `best cargo ebike` cluster remains
stuck deep (28+ impr on that exact query alone, pos ~55-78, 0 clicks) -- consistent with the
"competitive difficulty, not a technical bug" conclusion from earlier runs.

**PostHog snapshot (28d):** 63 pageviews / 22 visitors (same window, no new data). ENGWE N1
Pro: 2 affiliate clicks -- fifth consecutive run showing this exact bike as the only converting
product. DUOTTS S26 remains the most-visited product page (6 views / 5 visitors).

**Investigation: with GSC frozen for a third run in a row, picked the roadmap's own repeated
"next candidate" that had been queued and skipped since 2026-06-28 -- P1.1 "deepen the ENGWE
P275 SE / DUOTTS C29-K detail pages" -- and started by pulling their live Supabase rows to see
what "deepen" should actually mean for these two specific bikes.**

**Discovery:** ENGWE N1 Pro's row has `weight=19.0`, `weight_lbs=NULL`. Its own description
text says "At 19 kg, it balances capability..." -- so the raw `weight` column is kilograms, but
`mapRowToEBike()` (`lib/ebike-data.ts:199`) reads `Number(row.weight_lbs ?? row.weight)` with no
unit conversion. With `weight_lbs` null, the app displayed 19 as if it were already pounds. The
N1 Pro's real weight is ~42 lbs; the site showed "19 lbs" (lighter than an average adult
bicycle, for a mid-drive city e-bike -- an obviously implausible number to anyone who noticed).
The P275 SE had the identical bug (22 kg shown as "22 lbs"; real weight ~48.5 lbs). Checked the
whole ENGWE brand: 19 of 22 bikes had this exact pattern (`weight_lbs IS NULL`, `weight` holding
a plausible kg figure, several descriptions explicitly stating the kg number in text). `max_weight`
showed the same kg-into-an-unconverted-lbs-field pattern (e.g. T14 "100 lbs" payload for a
folding mini e-bike -- 100 kg / 220 lbs is the plausible reading, and matches sibling bikes'
already-lbs payload values of 265-441 once converted).

**Action -- fixed 19 of 22 ENGWE bikes (Supabase, live immediately):**
`UPDATE ebikes SET weight_lbs = ROUND(weight * 2.20462, 1), max_weight = ROUND(max_weight *
2.20462) WHERE brand='ENGWE' AND slug IN (...)` for E26, Engine Pro 2.0, Engine Pro 3.0 Boost,
Engine X, EP-2 3.0 Boost, EP-2 Boost, EP-2 Pro, L20, L20 Boost, M1, M20, N1 Air, N1 Pro, P20,
P275 Pro, P275 SE, P275 ST, T14, X20/X24/X26. Sample results: N1 Pro 19→41.9 lbs (payload
120→265 lbs), P275 SE 22→48.5 lbs (payload 120→265 lbs), L20 34→75 lbs (payload 120→265 lbs).
Left 3 ENGWE bikes untouched (flagged in ROADMAP P0.9 instead of guessing): L20 3.0 Boost and
L20 3.0 Pro both have `weight=150` which equals their own `max_weight=150` -- the same
copy-paste bug fixed on the Eunorau META bikes in the prior run, not a clean kg value, so a
blanket ×2.20462 conversion would be wrong. LE20 has `weight=200` exceeding its own
`max_weight=180`, which is impossible under any single unit interpretation and needs a real
source. Also discovered but NOT fixed this run (flagged for next run): 4 more ENGWE bikes with
bare one-line spec-fragment descriptions instead of editorial copy -- EASE 2 PRO and Y600 (both
already have correct-looking weight data) plus L16 and Y400 (`weight=0`/`weight_lbs=0`/
`max_weight=0`, the separate placeholder-zero bug this sweep has been fixing all along).

**Verified:** re-queried Supabase to confirm all 19 rows updated correctly (spot-checked the
RETURNING output). Started the dev server and loaded both `/e-bikes/engwe/engwe-n1-pro` and
`/e-bikes/engwe/engwe-p275-se` live: confirmed the Specifications table now renders "41.9 lbs"
/ "265 lbs" payload on N1 Pro and "48.5 lbs" / "265 lbs" payload on P275 SE (previously 19/120
and 22/120). `tsc --noEmit` clean (no code changed -- data-only fix).

**Expected impact:** removes a brand-wide, visibly-implausible weight figure from 19 ENGWE
detail pages, concentrated on the two bikes with the strongest existing signal on the site:
P275 SE (highest GSC bike-page impressions, 22/run) and N1 Pro (the only bike with repeat
confirmed affiliate clicks, 5 consecutive runs). A buyer checking whether a "city e-bike" really
weighs 19-22 lbs (implausible on its face) and bailing before clicking through is a plausible
explanation for some of the gap between P275 SE's 22 impressions and its low click count. Also
fixes the FAQ schema's dynamically-generated "How heavy is the [bike]?" answer, which
interpolates `weight`/`maxWeight` directly and was stating the wrong number in a structured-data
field Google may surface directly in search results.

**Next candidates:** (1) ROADMAP P0.9 -- fix the 3 remaining broken-weight ENGWE bikes (L20 3.0
  Boost, L20 3.0 Pro, LE20) by sourcing real weights from manufacturer/retailer listings rather
  than converting a corrupted value. (2) Write real editorial descriptions + fix `max_weight=0`
  for the 4 newly found ENGWE stub-description bikes (EASE 2 PRO, Y600, L16, Y400). (3) Resume
  the original P0.9 list of ~19 Eunorau/SAMEBIKE/VTUVIA/DYU bikes with placeholder descriptions.
  (4) GSC totals have now been frozen at 655 impressions across three consecutive runs today --
  worth Dylan checking Search Console directly for a sync issue. (5) State page expansion
  (P2.5), still untouched.

---

## 2026-07-06 (run 4) -- GSC data unfroze; deepened the site's two best-ranking bike pages (SAMEBIKE RS-A01 MEN/Pro/Plus) + a sitewide spelling fix (P1.1, P0.10)

**GSC snapshot (28d, ending 2026-07-03):** finally moved after being frozen at 655 impressions
for three consecutive runs -- now 681 impressions / 2 clicks / 0.3% CTR. New page-level detail:
`/e-bikes/samebike/samebike-rs-a01-men` is now the best-positioned individual page on the whole
site at **pos 9.1** (9 impr, 1 click, 11.1% CTR), and `/e-bikes/samebike/samebike-rs-a01-pro` at
pos 16 (6 impr, 2 clicks, 33.3% CTR). Also new: `/e-bikes/eunorau/eunorau-meta-24-1` picked up
its first click (5 impr, pos 23.2) and `/e-bikes/duotts/duotts-e29` got a click too (3 impr, pos
21.3, 33% CTR). `best cargo ebike` cluster (`/best/cargo-ebikes`) remains the single biggest
impression source (139 impr, pos 74.3, 0 clicks) but stays stuck deep -- a competitive-difficulty
problem, not a technical one, consistent with every prior run's read on this cluster.

**PostHog snapshot (28d):** 63 pageviews / 22 visitors (unchanged window). ENGWE N1 Pro still
the only bike with confirmed affiliate clicks (2, sixth consecutive run). DUOTTS S26 remains the
most-visited product page (6 views / 5 visitors).

**Decision:** with GSC finally showing fresh movement, followed the task's own priority order --
striking-distance pages (pos 5-20) are the fastest wins, and `/e-bikes/samebike/samebike-rs-a01-men`
(pos 9.1) and `/e-bikes/samebike/samebike-rs-a01-pro` (pos 16) are literally the two best-placed
individual pages on the entire site, already converting clicks. Pulled their Supabase rows to see
what "strengthen the page" should mean for these two specifically, and included the third variant
(RS-A01 Plus) for consistency since all three share the same weak content pattern.

**Action 1 -- deepened the RS-A01 family's editorial content (Supabase):**
All three variants (`samebike-rs-a01-pro`, `samebike-rs-a01-men`, `samebike-rs-a01-plus`) had
near-identical, generic one-sentence descriptions that did not differentiate the three bikes from
each other (e.g. Pro: "A comfortable step-through city e-bike with strong 55Nm torque..."; MEN:
"The step-over variant of the popular RS-A01, built for riders who prefer a traditional frame
geometry..."). Fetched the manufacturer's own product pages (samebike.com) for real specs and
wrote three distinct, accurate, multi-sentence descriptions plus refreshed `highlights` arrays:
- Pro: step-through, 26" wheels, 250W/55+Nm motor, front+seatpost suspension, positioned as the
  "easy step-through mount" of the family.
- MEN: step-over, 27.5" wheels (see bug below), same motor/battery as Pro, IP54-rated
  electronics, positioned as the classic-geometry alternative to the Pro.
- Plus: the higher-torque model (70+Nm, 48V 14Ah), 26x3" fat tires, positioned as the most
  powerful RS-A01 for hills and stop-and-go riding.

**Action 2 -- found and fixed 2 real data bugs while sourcing the copy (Supabase):**
Cross-checking the manufacturer spec sheet against the DB surfaced two more data-accuracy bugs
in the same P0.9 family as prior runs' weight/unit fixes:
- `samebike-rs-a01-men`: `wheel_size` was `26.0`, but samebike.com's own MEN product page
  specs 27.5" wheels (the Pro and Plus are genuinely 26"; MEN is the outlier). Fixed to `27.5`.
- `samebike-rs-a01-pro` and `samebike-rs-a01-men`: both had `has_suspension = 'front'`, but the
  manufacturer specs dual suspension (front fork + seatpost/seat-tube) for both. Fixed to
  `'full'`. Left `samebike-rs-a01-plus` at `'front'` -- its spec sheet only lists front-fork
  suspension, no seat-tube shock, so no change was warranted there.

**Action 3 -- sitewide `frame_material` spelling fix (Supabase, P0.10, new roadmap item):**
While in the data, ran a quick sitewide consistency check and found 60 of 108 bikes had
`frame_material = 'Aluminium'` (British spelling) against 47 with `'Aluminum'` (US spelling) --
a copy inconsistency across every spec table on a site whose stated convention is US English.
Normalized all 60 rows: `UPDATE ebikes SET frame_material = 'Aluminum' WHERE frame_material =
'Aluminium'`. Site now reads 107 Aluminum / 1 Steel / 1 Magnesium, zero British spelling left.

**Verified:** re-queried Supabase to confirm all updates (3 descriptions/highlights, 1 wheel_size,
2 has_suspension, 60 frame_material rows). Started the dev server and loaded
`/e-bikes/samebike/samebike-rs-a01-men` live: confirmed the new description text, "27.5"" wheel
size, "Full" suspension, and "Aluminum" material all render correctly in the Specifications
table. `tsc --noEmit -p tsconfig.json` clean (no code changed, data-only run).

**Expected impact:** strengthens on-page content on the two best-positioned bike pages on the
site at the exact moment GSC shows them converting real clicks (pos 9.1 and pos 16 respectively)
-- richer, accurate, differentiated copy is the direct lever the task brief calls out for
striking-distance pages. The wheel-size and suspension fixes remove two more instances of the
same "spec table states something false" trust problem this sweep has been chipping away at for
several runs. The spelling fix is smaller but touches every one of 60 bikes' spec tables at once.

**Next candidates:** (1) ROADMAP P0.9 -- the 3 remaining broken-weight ENGWE bikes (L20 3.0
  Boost, L20 3.0 Pro, LE20) and the 4 ENGWE stub-description bikes (EASE 2 PRO, Y600, L16, Y400)
  are still outstanding from run 3, plus the original ~19-bike Eunorau/SAMEBIKE/VTUVIA/DYU list.
  (2) `/e-bikes/eunorau/eunorau-meta-24-1` and `/e-bikes/duotts/duotts-e29` just picked up their
  first GSC clicks this run -- worth checking their descriptions for the same thin/generic
  pattern found on the RS-A01 family. (3) `best cargo ebike` (139 impr, pos 74.3) remains the
  single largest impression pool on the site with zero clicks -- still a competitive-depth
  problem rather than a quick technical fix, per every prior run's read. (4) State page expansion
  (P2.5), still untouched.
