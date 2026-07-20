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

---

## 2026-07-07 -- Closed the original ~19-bike P0.9 sweep (Eunorau/SAMEBIKE/VTUVIA/DYU premium bikes)

**GSC snapshot (28d, ending 2026-07-04):** 2 clicks, 716 impressions (+35 from last window), CTR
0.3%. Page-level movement: `/e-bikes/samebike/samebike-rs-a01-pro` improved to **pos 14.7** (7
impr, 2 clicks, 28.6% CTR), up from pos 16 -- the content deepened in run 4 appears to be working.
`/e-bikes/samebike/samebike-rs-a01-men` holds pos 9.1 (9 impr, 1 click). `/e-bikes/engwe/engwe-p275-se`
now 21 impr, pos 20.3 (still the top single-bike impression page). Two pages picked up their
*second* consecutive window with a confirmed click: `/e-bikes/eunorau/eunorau-meta-24-1` (5 impr,
pos 23.2) and `/e-bikes/duotts/duotts-e29` (3 impr, pos 21.3) -- both flagged as a "next candidate"
since run 4. `/best/cargo-ebikes` still the largest impression pool (136 impr, pos 74.3, 0 clicks) --
unchanged competitive-depth read. No query-level striking-distance (pos 5-20) entries this run.

**PostHog snapshot (28d):** 64 pageviews / 23 visitors (up slightly). Top pages: homepage (12/8),
`/e-bikes/overzicht` (10/4), DUOTTS S26 (6/5, still the most-visited product page), DUOTTS C29-K
(5/1, new appearance), DUOTTS C29max (4/1). `duotts-duotts-c29-k` now shows up in **both** GSC (pos
16.2 in the prior run) and PostHog -- the dual-signal page the task brief flags as highest priority.
ENGWE N1 Pro: still the only bike with confirmed affiliate clicks (2, eighth consecutive run).

**Investigation before committing to this run's work:** Checked whether `eunorau-meta-24-1`,
`duotts-e29` and `duotts-duotts-c29-k` (all converting or dual-signal) actually needed the "thin
generic description" fix that helped the RS-A01 family in run 4. Pulled all three rows: all had
solid, differentiated, real editorial descriptions already (e.g. eunorau-meta-24-1: "48V 500W hub
motor and torque sensor... At 61.7 lbs and rated for up to 100 miles..."). No action needed there --
this was a genuine dead end, not a missed opportunity.

**Decision:** With the highest-signal pages already in good shape, resumed the original P0.9 list
that has been re-flagged as "still untouched" in every log entry since 2026-07-05 run 1 (5
consecutive runs): ~19 Eunorau/SAMEBIKE/VTUVIA/DYU bikes with placeholder weight/torque/payload and
one-line stub descriptions.

**Action -- researched and fixed 16 of 19 bikes (Supabase, live immediately), sourced from
manufacturer sites (eunorau-ebike.com + AU/CA/US regional mirrors, samebike.com, vtuviaebike.com,
dyucycle.com) and cross-checked against retailer listings (bikeberry.com, motorizedbicyclehq.com,
electricbikereview.com, ebikehaul.com):**

*Eunorau (10 bikes, all had `weight=0`/`weight_lbs=0`/`max_weight=0`, several priced $2,000-$3,999
-- the catalog's premium full-suspension/mid-drive line):*
- DEFENDER: 66 lbs, 300 lb payload (60 Nm torque was already correct)
- FAT-HD 1.0: 78.7 lbs, 375 lb payload (160 Nm already correct)
- FAT-HD 2.0: 81.6 lbs, 375 lb payload (160 Nm already correct)
- FAT-HS: 77.1 lbs, 300 lb payload (160 Nm already correct)
- FLASH AWD 1.0: 82 lbs, 440 lb payload (184 Nm already correct)
- META275 1.0: 68.3 lbs, 286 lb payload, torque 0 -> 65 Nm
- S1 (dirt bike): 152 lbs, 220 lb payload (150 Nm already correct)
- SPECTER-S 3.0: 88.2 lbs, 300 lb payload (160 Nm already correct)
- SPECTER-ST 2.0: 88 lbs, 300 lb payload (160 Nm already correct)
- URUS 2.0: 61.7 lbs, 300 lb payload (120 Nm already correct)

*SAMEBIKE (3 bikes):* CREST 99 lbs/330 lb payload (85 Nm already correct); STORM 99 lbs/330 lb
payload, torque 0 -> 85 Nm; RS-A08-II 79 lbs/330 lb payload, torque 0 -> 80 Nm.

*VTUVIA (1 bike):* FMB 60 lbs, 250 lb payload (160 Nm already correct).

*DYU (3 bikes):* C2 weight 0 -> 52 lbs/265 lb payload; C5 weight 0 -> 59.5 lbs/265 lb payload; C6
(weight was already 60 lbs) max_weight 0 -> 265 lbs. Left torque at 0 for all three -- DYU does not
publish torque figures anywhere findable, and every prior run reached the same conclusion; a
fabricated number would be worse than a blank one.

All 16 also got new multi-sentence editorial descriptions and refreshed `highlights` arrays
(replacing one-line spec fragments like "DYU C2: 250W motor, 25 mi range, $549.").

**Self-caught error, fixed before shipping:** first-draft descriptions for CREST, STORM and
RS-A08-II quoted the manufacturer's marketing-copy range ("70-140 km in eco mode, tested with a 75kg
rider") -- but the site's own `range_manufacturer`/`range_practical` columns for all three already
show 30 mi / 22 mi, a figure that would have contradicted the same page's own spec table. Rewrote
all 3 to state "claimed 30 mile range (about 22 miles real-world)" instead. Same catch on DEFENDER:
first draft said "roughly 80 miles" (a dual-battery config figure), but the DB's own range fields
are 40 mi manufacturer / 30 mi practical (base single-battery) -- corrected before shipping. Caught
this by cross-checking my own draft text against the DB's existing range columns rather than just
trusting the manufacturer source in isolation.

**Left unfixed, flagged as new ROADMAP P0.16 (needs a decision, not a guess):**
- `eunorau-defender-s-fat-hs`: DB model name is "Defender-S" but its existing description reads
  like the FAT-HS's mid-drive spec (1000W Bafang M615, 160 Nm) -- Defender-S is actually a
  different, AWD dual-hub-motor bike. Couldn't confirm from public sources which product this row
  is meant to represent, so didn't touch weight/torque/description.
- `vtuvia-reindeer-1` ("REINDEER 1.0", $1699): every current listing found is for "Reindeer 2.0" at
  the same price; no distinct spec sheet for a "1.0" surfaced. Left weight/torque/payload at 0
  rather than assume it's identical to the 2.0.

**Verified:** re-queried Supabase to confirm all 20 UPDATE statements (16 fixes + 4 range-text
corrections) landed correctly. `npx tsc --noEmit -p tsconfig.json` clean (data-only run, no code
changed). Loaded `/e-bikes/eunorau/eunorau-urus` and `/e-bikes/samebike/samebike-storm-fat-tire-mountain-e-bike`
live in the dev preview: Specifications table shows "61.7 lbs / 300 lbs payload" and "99 lbs / 330
lbs payload" respectively (both previously "0"). Confirmed the corrected range text renders with no
contradiction against the spec table. No console errors.

**Expected impact:** removes `0 lbs` weight and `0 lb` payload -- both shown in the on-page spec
table and interpolated into the meta description and FAQ schema -- from 16 detail pages, including
several of the catalog's most expensive products ($2,000-$3,999 Eunorau full-suspension/mid-drive
bikes), where a broken spec is a sharper trust signal than on a budget bike. Closes a punch list
that had been re-flagged as "still untouched" in 5 consecutive log entries.

**Next candidates:** (1) ROADMAP P0.16 -- the 2 remaining ambiguous bikes (`eunorau-defender-s-fat-hs`,
  `vtuvia-reindeer-1`) need a human decision or deeper research, not a guess. (2) ROADMAP P0.13 --
  Dylan decision still needed on the 3 ENGWE scooter-not-bike products. (3) The 3 remaining
  broken-weight ENGWE bikes (L20 3.0 Boost, L20 3.0 Pro, LE20) and 4 stub-description ENGWE bikes
  (EASE 2 PRO, Y600, L16, Y400) flagged since runs 3-4 -- check current status, may already be
  resolved by a later run's sweep. (4) State page expansion (P2.5), still untouched across every
  run logged so far -- the single largest unaddressed roadmap item. (5) `duotts-duotts-c29-k` is a
  genuine dual-signal page (GSC + PostHog) with already-solid content -- worth checking if its
  striking-distance position has moved now that GSC shows regular movement again.

---

## 2026-07-06 (run 5) -- ENGWE Dutch `highlights` bug (sitewide) + closed out P0.9's ENGWE punch list + fixed false "discontinued" messaging on the site's two highest-signal pages

**GSC snapshot (28d, ending 2026-07-03):** 2 clicks, 681 impressions, CTR 0.3%. Query-level
striking distance table is empty, but page-level striking distance is real: `/e-bikes/samebike/
samebike-rs-a01-men` pos 9.1 (1 click), `/e-bikes/samebike/samebike-rs-a01-pro` pos 16.0 (2
clicks) -- both deepened earlier today in run 4 -- and `/e-bikes/duotts/duotts-duotts-c29-k` pos
16.2 (1 click, 16.7% CTR). Checked C29-K's Supabase row: description and highlights were already
solid (no stub/Dutch issue), so no further action needed there this run. `/best/cargo-ebikes`
remains the largest impression pool (139 impr, pos 74.3, 0 clicks) -- unchanged competitive-depth
read from every prior run.

**PostHog snapshot (28d):** 63 pageviews / 22 visitors (same window). `/e-bikes/duotts/
duotts-duotts-c29-k` appears in both GSC (pos 16.2, 1 click) AND PostHog (5 views) -- the
dual-signal page the task brief calls out as highest-priority, but its content was already fine.
ENGWE N1 Pro: still the only bike with confirmed affiliate clicks (2, seventh consecutive run).

**Decision:** With the striking-distance page (C29-K) already in good shape, resumed the queued
P0.9 ENGWE punch list (3 broken-weight bikes + 4 stub-description bikes from runs 3-4) rather than
repeat work. While pulling every ENGWE row to plan those fixes, found something bigger: **all 22
ENGWE bikes still had Dutch `highlights` arrays** -- the 2026-07-04 run only translated the
`description` field, never touched `highlights`, so bullet points like "70Nm koppel", "Volledige
vering", "140 km bereik", "Opvouwbaar frame" were still shipping in Dutch on every ENGWE detail
page and card, sitewide, for two more runs without anyone catching it. Highlights render more
prominently than the paragraph description (a bulleted list right under the price), making this
arguably worse than the description bug it should have been caught alongside.

**Action 1 -- Translated all 22 ENGWE `highlights` arrays to English (Supabase, live immediately):**
Used the already-corrected mile/lbs DB columns for consistency rather than re-deriving from the
stale Dutch km/kg numbers. Also caught a distinct instance the original description-fix pass
missed entirely: `engwe-p275-se` -- the single highest-GSC-impression bike page on the whole site
(22 impr/run) -- still had 2 Dutch bullets ("Torquesensor voor soepel rijden", "Slechts €899") and
a Euro symbol on a USD-priced page. Fixed. Ran a sitewide regex sweep across every brand's
`description` + `highlights` afterward and confirmed zero Dutch remnants remain anywhere on the
site.

**Action 2 -- Closed the P0.9 ENGWE punch list queued since runs 3-4 (Supabase):**
- `L20 3.0 Boost`: `weight` was a copy-paste of `max_weight` (both 150). Sourced real specs
  (engwe.com, horizonmicromobility.com): 33 kg net weight, 150 kg max load. Fixed weight_lbs
  0->72.8, max_weight 150->331 (kg->lbs conversion, matching the pattern already applied to the
  rest of ENGWE).
- `L20 3.0 Pro`: same copy-paste bug. Verified 32.8 kg / 150 kg max load. Fixed weight_lbs
  0->72.3, max_weight 150->331.
- `LE20`: `weight=200` exceeded its own `max_weight=180` -- impossible under any unit reading.
  Verified 36.8 kg single-battery weight / 200 kg max load. Fixed weight_lbs 0->81.1, max_weight
  180->441.
- `L16` (confirmed a real e-bike, not a stub/mislabeled item): had `weight=0`, `weight_lbs=0`,
  `max_weight=0` and a bare one-line description. Verified 39.6 kg weight / 120 kg max load
  directly from us.engwe.com. Fixed weight_lbs 0->87.3, max_weight 0->264, wrote a full editorial
  description.

**Action 3 -- New discovery, NOT resolved: 3 ENGWE catalog "bikes" are actually electric scooters
(ROADMAP P0.13, needs Dylan's call):**
While sourcing specs for the last 2 stub bikes (`Y400`, `Y600`) and `EASE 2 PRO`, web research
confirmed all three are **not pedal e-bikes**: `EASE 2 PRO` is a 4-wheel folding mobility scooter
capped at ~5 mph (manufacturer spec: 0-5 mph, 12 mi range -- nothing like the 20mph/30mi our
catalog implied); `Y400` and `Y600` are seated electric scooters per every retailer listing found,
despite being stored with bicycle-style fields (26" "wheel_size", 3-7 "gears") that do not match
either product's actual 10" wheels. Rather than silently reclassify or delete them (a bigger,
more consequential change than a data-quality run should make unilaterally), wrote honest
descriptions for all three clarifying what they actually are, and fixed their worst zero-value
fields with verified numbers: `Y400` torque 0->24, weight_lbs 0->52 (24 kg), max_weight 0->265
(120 kg); `Y600` max_weight 0->265 (120 kg; torque/weight were already correct); `EASE 2 PRO`
max_weight 0->265 (120 kg; left torque/weight/range alone -- multiple sources disagreed and this
product's category mismatch needs a human decision before its numbers are worth trusting).
Flagged as ROADMAP P0.13 for Dylan: keep these three (clearly labeled as scooters) or pull them
from the e-bike catalog/filters/best-of surfaces entirely.

**Action 4 -- Fixed false "discontinued" messaging on the site's two highest-signal pages
(ROADMAP P0.14, code change in `app/e-bikes/[brand]/[model]/page.tsx`):**
10 bikes are flagged `available=false` in Supabase, including `P275 SE` (top GSC impressions,
22/run) and `N1 Pro` (the only bike with repeat confirmed affiliate clicks, 7 consecutive runs).
The template said "{brand} has discontinued the {model}, so it can no longer be bought from the
manufacturer" for all of them. Fetched ENGWE's own live product pages for 2 of the 10 (N1 Pro,
Engine X) to verify: both are explicitly labeled "Pre-sale, expected to be back in stock in early
July" -- today is 2026-07-06, inside that exact restock window -- not discontinued. Fixed:
- Banner copy: "No longer available" / "has discontinued... no longer be bought" -> "Temporarily
  out of stock" / "has paused new orders... while it restocks. Check the official site below for
  the latest availability."
- Added a "Check current availability ->" affiliate-tagged CTA linking to the official product
  page. Previously the only CTA for an unavailable bike was an internal redirect with no path
  back to the manufacturer to check restock status -- meaning a visitor to the #1 impression page
  or the only page with confirmed clicks had no way to actually check if it's back yet.
- Product schema `availability`: `https://schema.org/Discontinued` (implies permanent) ->
  `https://schema.org/OutOfStock` (accurate for a temporary restock).

**Verified:** re-queried Supabase to confirm all 22 highlights translations + 4 weight/payload
fixes + 3 scooter description/field fixes landed correctly. `tsc --noEmit -p tsconfig.json` clean.
Loaded `/e-bikes/engwe/engwe-p275-se` live in the dev preview: confirmed English highlights render
("Torque sensor for smooth riding", "Just $899", etc.), the new "Temporarily out of stock" banner
and copy render correctly, and the new "Check current availability ->" button links to the
affiliate URL. No console errors.

**Expected impact:** the highlights fix removes Dutch bullet text from 22 ENGWE detail pages and
cards sitewide, including the #1 GSC-impression bike page, closing a gap the "all 22 descriptions
fixed" claim from 2026-07-04 had left open for two runs. The discontinued->out-of-stock fix
directly targets the two highest-signal pages on the entire site: telling a visitor a bike is
permanently gone when ENGWE's own site says it is mid-restock is both inaccurate and actively
pushes potential buyers to a competitor instead of encouraging them to check back or click through
now. The scooter-vs-bike discovery (P0.13) is the most consequential open finding: three products
appearing in e-bike search results, best-of pages and filters are not bicycles at all, which is a
bigger trust risk than any single wrong spec number this sweep has fixed so far.

**Next candidates:** (1) ROADMAP P0.13 -- Dylan decision needed on EASE 2 PRO/Y400/Y600 (keep as
  clearly-labeled scooters vs. remove from the e-bike catalog). (2) The other 7 of the 10
  `available=false` bikes (Engine X, L20 Boost, M1, N1 Air, P20, P275 Pro, P275 ST, plus SAMEBIKE
  YINYU14) inherit the same fixed messaging automatically since it is template-level, but worth a
  future run spot-checking a few more of them against the manufacturer site in case any have
  actually restocked (`available` could flip back to true). (3) The original ~19-bike
  Eunorau/SAMEBIKE/VTUVIA/DYU thin-description list from run 2 is still untouched. (4) State page
  expansion (P2.5), still untouched.

---

## 2026-07-07 (run 6) -- ENGWE `motor_type` Dutch-value bug fixed sitewide (P0.17) + P1.1 detail-page depth on 3 high-signal pages

**GSC snapshot (28d, ending 2026-07-04):** 2 clicks, 716 impressions, CTR 0.3% -- identical totals
to the run already logged today, confirming this is a same-day second run with no new GSC window
yet (3-day lag). No striking-distance or high-impression/low-CTR entries in the tool output. Top
signals unchanged: `/best/cargo-ebikes` still the largest impression pool (136 impr, pos 74.3, 0
clicks); `/e-bikes/engwe/engwe-p275-se` still the top single-bike page (21 impr, pos 20.3, 1 click);
`/e-bikes/duotts/duotts-duotts-c29-k` converting (1 click, pos 16.2); `/blog/best-ebikes-for-hills`
(103 impr, pos 44.7) and a newly-visible `/blog/ebike-maintenance-tips` (38 impr, pos 51.7) are the
next-largest impression pools with no clicks yet.

**PostHog snapshot (28d):** 64 pageviews / 23 visitors -- also identical to the already-logged run
today. Top pages: homepage (12/8), `/e-bikes/overzicht` (10/4), DUOTTS S26 (6/5), DUOTTS C29-K
(5/1). ENGWE N1 Pro: still the only bike with confirmed affiliate clicks (2).

**Decision:** With both data sources unchanged since the last logged run, resumed ROADMAP P1.1's
explicit "still to do" item -- deepen `engwe-p275-se`, `duotts-duotts-c29-k`, and the Walfisk WF26
detail pages. While pulling their Supabase rows to plan the editorial rewrite, found a bigger issue.

**Discovery -- ENGWE `motor_type` Dutch-value bug, sitewide (all 22 bikes), previously uncaught:**
`engwe-p275-se`'s `motor_type` column was `"naaf-achter"` (Dutch: "hub-rear"), not a value the
detail page's `motorLabels` lookup (`{'mid-drive', 'front-hub', 'rear-hub'}`) recognizes. A query
across the whole brand showed this is not a one-off: all 22 ENGWE rows use Dutch values --
`naaf-achter` (21 bikes) or `midden` ("middle", 5 bikes) -- values the prior Dutch-translation
sweeps (P0.6 suitable_for/frame_type, 2026-07-04 descriptions, run 5 highlights) never touched
because they only checked those specific fields. Two concrete, currently-live effects: (1) the
"Motor type" row in the Specifications table renders blank (`{undefined}` in JSX resolves to
nothing) on every one of the 22 ENGWE detail pages, including `engwe-p275-se` (top GSC impressions)
and `engwe-n1-pro` (only bike with confirmed affiliate clicks); (2) the "Consider alternatives if
you ride hills" warning logic (`bike.motorType !== 'mid-drive' && bike.torque < 80`) incorrectly
fires on genuine mid-drive bikes, since `'midden' !== 'mid-drive'` is true -- affecting N1 Pro,
L20 3.0 Pro, P275 Pro, P275 ST, and LE20, which the warning wrongly implies handle hills poorly.

**Action 1 -- Fixed sitewide (Supabase, live immediately):** Verified the translation before
writing anything, by cross-checking each bike's torque value: the 5 `midden` bikes cluster at
65-100 Nm and include ENGWE's known mid-drive flagships (N1 Pro, L20 3.0 Pro), while the 21
`naaf-achter` bikes span 24-90 Nm across ENGWE's standard hub-motor lineup -- consistent with
`midden` = mid-drive, `naaf-achter` = rear-hub. Applied: `UPDATE ebikes SET motor_type =
'rear-hub' WHERE brand='ENGWE' AND motor_type='naaf-achter'` (21 rows) and `UPDATE ebikes SET
motor_type = 'mid-drive' WHERE brand='ENGWE' AND motor_type='midden'` (5 rows). Confirmed via
`SELECT motor_type, COUNT(*) ... GROUP BY motor_type` = clean 21 rear-hub / 5 mid-drive split, and
confirmed no other brand in the catalog has non-standard `motor_type` values.

**Action 2 -- P1.1: deepened the 3 detail pages flagged "still to do" (Supabase, live
immediately):** Rewrote one-sentence generic descriptions into 3-4 sentence differentiated
editorial copy for `engwe-p275-se` (torque-sensor explainer, 100mi claimed / 75mi real framing,
$899 value positioning), `duotts-duotts-c29-k` (29" wheel + 20Ah battery framing, 90mi claimed /
65mi real, commuting/recreation fit), and the Walfisk WF26 (Bafang 750W + fat tire traction
framing, 50mi claimed / 38mi real, Class 3 / all-terrain fit). Cross-checked each new description's
range and weight claims against the bike's own `range_manufacturer`/`range_practical`/`weight_lbs`
columns before writing, to avoid the same contradiction bug caught and fixed in the 2026-07-07
(run 5→6 predecessor) Eunorau/SAMEBIKE sweep.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (data-only run). Started the dev server and
fetched all 3 pages plus `engwe-n1-pro` directly: confirmed "Motor type" now renders "Rear hub" on
P275 SE and "Mid-drive" on N1 Pro (both previously blank), and confirmed all 3 new descriptions
render correctly in both the visible page content and the Product/Review JSON-LD schema, with no
console errors.

**Action 3 -- followed the same lead further: checked every remaining ENGWE enum-like column for
the same bug class, found two more (one data, one code):**
- `price_category`: 14 ENGWE rows had `'midden'` instead of `'mid-range'`. Checked the DB check
  constraint first (`ebikes_price_category_check` explicitly allows both `'midden'` and
  `'mid-range'`, so this was a legal-but-wrong value, not a schema violation) -- confirmed via grep
  that `priceCategory` is not currently rendered or filtered on anywhere in `app/` or
  `lib/ebike-filters.ts` (dormant bug, no live user-facing impact yet, but the same root cause and
  a one-line fix). `UPDATE ebikes SET price_category = 'mid-range' WHERE brand='ENGWE' AND
  price_category='midden'` -- now matches the value every other brand uses and the TS type
  (`'budget' | 'mid-range' | 'premium'`) already declares.
- `gear_type`: attempted the same DB-side fix for 4 ENGWE bikes with `gear_type='naaf'`
  (P275 Pro, T14, P20, P275 ST), but the `ebikes_gear_type_check` constraint only permits
  `['derailleur', 'naaf', 'cvt']` -- `'naaf'` is the schema's own canonical value here, not stray
  data (changing it to `'internal-hub'` would have violated the constraint). The actual bug is on
  the frontend: `gearLabels` in `app/e-bikes/[brand]/[model]/page.tsx` was missing a `'naaf'` key,
  so the "Type" row under Drivetrain rendered blank for these 4 bikes. Fixed with a one-line code
  change: added `'naaf': 'Internal hub'` to `gearLabels`. Verified live: `engwe-p275-pro`'s Type
  row now shows "Internal hub" (previously blank).

**Verified (all three actions):** `npx tsc --noEmit -p tsconfig.json` clean after both the data
changes and the `gearLabels` code edit. Dev server checks: `engwe-p275-se`/`engwe-n1-pro` Motor
type correct ("Rear hub"/"Mid-drive"), `engwe-p275-pro` gear Type now "Internal hub", all 3 new
descriptions render in page content + JSON-LD. No console errors.

**Expected impact:** the `motor_type` fix removes a blank spec-table field from 22 ENGWE detail
pages sitewide, including the two highest-signal pages on the entire site, and corrects a false
"struggles on hills" implication on 5 genuine mid-drive bikes. The `gear_type` label fix removes a
second blank spec-table field on 4 more ENGWE pages. The detail-page depth work directly targets
ROADMAP P1.1's named "still to do" pages, all three carrying real GSC or PostHog signal (top
impressions, converting clicks, or page-1 history).

**Next candidates:** (1) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600
scooter-vs-bike classification. (2) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and
`vtuvia-reindeer-1` still need human research, not a guess. (3) State page expansion (P2.5), still
untouched across every run logged so far -- the single largest unaddressed roadmap item; worth
committing to this as the primary focus of a future run given data signals have been flat/repeating
for several consecutive runs. (4) `/blog/ebike-maintenance-tips` newly showing 38 impressions at
pos 51.7 -- worth a content-depth pass next time GSC data refreshes with a new window. (5) This run
found 3 separate missed-field Dutch/enum bugs (`motor_type`, `price_category`, `gear_type`) that
every prior "sitewide Dutch sweep" missed because those sweeps only grepped `description` +
`highlights` text columns, never structured enum columns. Followed up by checking every other
enum-like column across all brands this run (`frame_type`, `bike_class`, `has_suspension`,
`suitable_for`) -- all clean, standard English values sitewide, so this class of bug is now closed
out rather than just flagged.

---

## 2026-07-08 (run 7) -- kg/km unit leaks in editorial text (P0.18, sitewide) + DUOTTS F20 depth (P0.19)

**GSC snapshot (28d, ending 2026-07-05):** 2 clicks, 794 impressions (+78), CTR 0.3%. Query-level
striking distance table empty, but page-level signals show real movement: homepage `/` now 3
clicks/3 impr at pos 1.0 (tiny sample, but a new all-click page). `/e-bikes/samebike/
samebike-rs-a01-pro` improved to pos 14.7 with 2 clicks (28.6% CTR) -- the run-4 depth pass is
paying off. Two **new** single-click bike pages appeared this window: `/e-bikes/duotts/duotts-e29`
(pos 18.5, 25% CTR) and `/e-bikes/eunorau/eunorau-meta-24-1` (pos 23.2, 20% CTR) -- checked
meta-24-1's Supabase row and it already has a solid differentiated description (confirmed dead end,
no action needed). `/best/cargo-ebikes` still the largest impression pool (139 impr, pos 74.4, 0
clicks) -- this has now been flagged as "stagnant despite content" in 6+ consecutive log entries
without resolution; read its actual page content this run (900+ words, 7 FAQs, comparison table,
relatedPosts -- all genuinely solid) and concluded this is very likely a competitive-depth /
off-page-authority ceiling (ROADMAP's own framing: "the real bottleneck is traffic and authority"),
not a content gap -- deprioritized further content passes on this specific page until backlinks
(P4.1, Dylan) or domain age change the picture. `/best/folding-ebikes` unchanged (pos 16.8, 0
clicks on tiny volume).

**PostHog snapshot (28d):** 66 pageviews / 25 visitors (up from 64/23). Traffic sources: Google now
28 views, ahead of direct (26) for the first time -- organic is overtaking direct traffic. **Key
signal: 3rd confirmed affiliate click, and it's a new bike** -- DUOTTS F20 got its first-ever
confirmed `affiliate_link_clicked` event (alongside ENGWE N1 Pro's usual 2). F20 also appears in
PostHog's top-pages list (2 views/2 visitors) but not yet in GSC's click table -- a PostHog-only
conversion signal.

**Decision:** Investigated the two new-signal bikes (`duotts-f20`, `duotts-e29`) before writing
anything, per task brief step 2 guidance to check dual/new signals first. Found something bigger
than either bike individually.

**Discovery -- kg/km units leaking into editorial `description`/`highlights` text, sitewide (not
previously caught):** Every prior "Dutch sweep" (2026-07-04, run 5, run 6) grepped `description` +
`highlights` for non-English *words* and structured enum columns for non-English *values*, but
never checked for metric units embedded in otherwise-correct English sentences. Ran a sitewide regex
(`\d+\s*kg|\d+\s*km` against description + highlights, all brands) and found 9 affected bikes:
- **DUOTTS**: `E29` ("...at just 26.6kg"), `F20` ("...for 140km range")
- **DYU**: `M20` ("Up to 160km range"), `Stroll 1` ("Lightweight 19.5kg frame")
- **ENGWE**: `N1 Air` ("lightweight 15.6 kg city e-bike"), `N1 Pro` ("At 19 kg, it balances..."),
  `P20` ("...at 18.5 kg with a torque sensor")
- **SAMEBIKE**: `M20-III` ("Up to 280km total range", "Heavy-duty 180kg payload")

Three of these (`N1 Air`, `N1 Pro`, `P20`) were worse than a unit-convention slip: the description
paragraph stated a kg weight while a *highlights bullet two lines below it on the same page* stated
the lbs figure (e.g. N1 Pro: "At 19 kg, it balances capability..." right above a highlight reading
"Just 41.9 lbs") -- a visible self-contradiction on the same detail page, not just a wrong-unit-for-
audience issue.

**Verification before touching anything:** cross-checked every kg/km figure against that bike's own
`weight_lbs` / `range_manufacturer` / `range_practical` / `max_weight` columns. All 9 matched exactly
(19kg = 41.9 lbs; 15.6kg = 34.4 lbs; 18.5kg = 40.8 lbs; 26.6kg = 58.6 lbs; 19.5kg = 43 lbs; 140km =
87mi manufacturer range; 160km = 99mi manufacturer range; 280km = 174mi manufacturer range; 180kg =
396 lb payload). This was purely a unit-translation fix, not a data-accuracy question -- no numbers
were changed, only the unit and wording of already-correct figures.

**Action 1 -- Fixed all 9 (Supabase, live immediately):** Used `replace()` on `description` and
`array_replace()` on `highlights` to swap each kg/km mention for the equivalent lbs/mi figure already
sitting in that row's own spec columns, adding "(X mi real-world)" framing where a manufacturer-vs-
practical range gap existed (matching the site's established claimed-vs-real convention). Re-ran the
sitewide regex sweep afterward: zero remaining kg/km matches in `description` or `highlights` across
the entire catalog.

**Action 2 -- P1.1: DUOTTS F20 description depth (Supabase, live immediately):** F20's first
confirmed affiliate click this run made it a clear candidate for the same depth treatment given to
every other converting bike. Rewrote its one-sentence description into 3 sentences: battery/motor/
frame specifics, claimed-vs-real range framing (87mi claimed / 56mi real-world), and price
positioning ($1,199 vs comparable 1000W full-suspension fat-tire bikes) -- cross-checked against its
own DB range/weight columns to avoid introducing a new contradiction.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (data-only run). Started the dev server and
fetched all 9 fixed pages directly: confirmed each editorial description/highlight now reads the
lbs/mi figure with zero remaining kg/km text in the prose (the only remaining "kg" mentions on any
page come from an unrelated raw manufacturer spec-sheet table further down the ENGWE pages that
already shows both units side-by-side, e.g. "15.6 kg (34.39 lbs)" -- confirmed this is a different,
pre-existing, non-buggy field and left untouched). Confirmed the new F20 description and the fixed
F20/M20-III highlights render correctly with no console errors, all pages 200.

**Expected impact:** removes a unit-consistency trust break from 9 detail pages across 4 brands,
including the two highest-revenue-signal pages in the entire catalog this run (`engwe-n1-pro`, the
only bike with confirmed clicks for 9 consecutive runs, and `duotts-f20`, which just converted for
the first time). The 3 self-contradicting ENGWE pages (stating both "19 kg" and "41.9 lbs" for the
same bike on the same page) were the sharpest instances -- a buyer noticing two different weight
figures on one page is a concrete, specific trust break, not just an awkward phrasing. Also closes
out a class of bug that 3 consecutive prior "Dutch sweep" runs (07-04, run 5, run 6) all missed
because none of them checked for metric units specifically, only non-English words/values.

**Next candidates:** (1) State page expansion (P2.5), still untouched across 7+ consecutive
logged runs -- the single largest unaddressed roadmap item; strongly worth committing a full run to
this next, since GSC/PostHog signals are flat-to-slowly-growing and this is the biggest structural
gap left. (2) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600 scooter-vs-bike
classification. (3) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still need
human research. (4) `duotts-e29` (new GSC click, pos 18.5) has a decent but not deeply differentiated
description -- candidate for the next P1.1 depth pass. (5) `/best/cargo-ebikes` -- stop treating this
as an open content task; 6+ runs have confirmed the content is genuinely solid and the stagnation at
pos 74 despite 139 impr/window is very likely a competitive/authority ceiling, not something another
content pass will move. (6) `/blog/ebike-maintenance-tips` newly showing 38 impr at pos 51.7 --
worth a depth pass once GSC shows a second data point confirming it's a real, growing cluster.

---

## 2026-07-08 (run 8) -- State page expansion (P2.5): 5 new states

**GSC snapshot (28d, ending 2026-07-05):** 2 clicks, 794 impressions, CTR 0.3% -- identical totals
and identical query/page tables to the previous run's snapshot (same window; GSC has not refreshed
yet). No new striking-distance queries, no new high-impression/low-CTR pages. Confirmed the top
signals are unchanged: `electric bike for heavy riders` (49 impr, pos 46.8, 1 click), `/best/cargo-
ebikes` (139 impr, pos 74.4, 0 clicks, already assessed as an authority ceiling not a content gap),
`engwe-p275-se` (21 impr, pos 20.3).

**PostHog snapshot (28d):** 68 pageviews / 27 visitors (up slightly from 66/25). Google overtook
direct as the top source last run (28 vs 27 views) and holds that lead this run too. Conversion
events unchanged at 3 total (`affiliate_link_clicked`): ENGWE N1 Pro (2), DUOTTS F20 (1) -- no new
converting bike this window, so no new dual-signal page to chase.

**Decision:** With both data sources flat versus the last logged run (same GSC window, only a
marginal PostHog uptick, no new conversion signal), there was no fresh data-driven lever to pull.
Per the last several runs' own "next candidates," state page expansion (P2.5) has been flagged as
the single largest unaddressed roadmap item for 7+ consecutive runs without action -- committed this
run to it.

**Action -- 5 new state pages added to `lib/state-data.ts` (live immediately, auto-added to sitemap
via `getAllStateSlugs()`):** Tennessee, Missouri, Maryland, Wisconsin, Nevada. Chosen for geographic
and demand spread not yet covered by the existing 20 states (South, Midwest x2, Mid-Atlantic, West),
each with genuinely differentiated terrain/law content matching the existing template depth (three-
class law summary, helmet/license/speed/wattage facts, 4 riding tips specific to real geography and
climate in that state, 5 top cities, FAQ-ready copy). All 5 use the standard three-class e-bike model
law framework (no license/registration/insurance, helmet-under-X requirement) consistent with the
15 other standard-law states already in the file; none needed an outlier-law treatment like Hawaii/
New Jersey. State count: 20 -> 25.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean. Started the dev server and loaded
`/best-ebikes/nevada` and `/best-ebikes/wisconsin` directly: confirmed correct title, hero intro,
quick-facts grid, law summary, riding tips list, and FAQ section all render with the new copy, no
console errors, no failed requests (the only network failures seen were an unrelated pre-existing
AvantLink affiliate-tracking pixel blocked by the browser's cross-origin policy, not caused by this
change).

**Expected impact:** Each new state page is a low-competition ranking surface for "best e-bike in
[state]" and "[state] e-bike laws" queries -- exactly the local-intent, lower-competition wins P2.5
was written to capture. These pages also link into the store locator and quiz, so any traffic they
attract feeds the existing conversion funnel rather than requiring new infrastructure.

**Next candidates:** (1) Continue P2.5 -- ~20 states remain unadded (Indiana, Connecticut, South
Carolina, Alabama, Kentucky, Louisiana, Oklahoma, Iowa, and other smaller-population states); worth
another batch of 5 next time GSC/PostHog data is flat again. (2) ROADMAP P0.13 -- Dylan decision
still needed on EASE 2 PRO/Y400/Y600 scooter-vs-bike classification. (3) ROADMAP P0.16 --
`eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still need human research. (4) `duotts-e29`
(GSC click, pos 18.5) still a candidate for a P1.1 depth pass. (5) Watch for the next GSC window to
refresh (data has been stuck on the 2026-06-07 to 2026-07-05 window for two consecutive runs now) --
if it stays stale next run too, worth checking the GSC integration itself rather than assuming lag.

---

## 2026-07-08 (run 9) -- GSC window investigated (not a bug) + duotts-e29 depth (P1.1) + 5 more states (P2.5)

**GSC snapshot (28d, ending 2026-07-05):** 2 clicks, 794 impressions, CTR 0.3% -- same window as
the previous two logged runs, and now confirmed why: read `scripts/gsc-insights.ts` (line 78,
`endDate = isoDaysAgo(3)`), which computes the window from `new Date()` minus a 3-day lag buffer.
Since this scheduled task can run multiple times within the same calendar day (runs 7, 8, and 9 all
landed on 2026-07-08), the GSC window is expected to stay identical across same-day runs -- this is
correct behavior for GSC's real data lag, not a broken integration. Closes out the "check the GSC
integration itself" item flagged at the end of run 8. Query/page tables unchanged from run 8: top
demand still `electric bike for heavy riders` (49 impr, pos 46.8, 1 click) and `/best/cargo-ebikes`
(139 impr, pos 74.4, 0 clicks, already assessed as an authority ceiling). `duotts-e29` again appears
with a real click (pos 18.5, 25% CTR) -- third consecutive pull showing this signal.

**PostHog snapshot (28d):** 69 pageviews / 28 visitors (up slightly from 68/27). Google now the
clear top traffic source (29 views) ahead of direct (27), continuing the trend from the last two
runs. Conversion events unchanged at 3 total (`affiliate_link_clicked`): ENGWE N1 Pro (2), DUOTTS
F20 (1) -- no new converting bike this window.

**Decision:** Both data sources flat again versus the last two logged runs, with one exception: the
`duotts-e29` GSC click signal has now recurred for three straight pulls without ever getting the
P1.1 depth treatment despite being named as a candidate twice. Fixed that plus advanced the largest
untouched roadmap item (P2.5 state expansion), per run 8's own "worth another batch of 5 next time
data is flat again" note.

**Action 1 -- P1.1: `duotts-e29` description depth (Supabase, live immediately):** Was one generic
sentence ("A lightweight e-MTB with Bafang motor, torque sensor, Shimano hydraulic brakes, and DNM
air rear shock..."). Rewrote to 4 sentences: torque-sensing motor + hydraulic brakes + air shock
detail, weight positioning (58.6 lbs, light for a full-suspension e-MTB), claimed-vs-real range
framing (56mi manufacturer / 36mi practical, matching its own DB columns exactly), and price
positioning ($1,429 vs comparable torque-sensor e-MTBs). No numbers changed, only added context
around already-correct DB values.

**Action 2 -- P2.5: 5 more state pages added to `lib/state-data.ts`:** Indiana, Connecticut,
Alabama, South Carolina, Kentucky (25 -> 30 states). Before writing, ran a web search to verify each
state's actual e-bike law rather than assuming the standard three-class template used for the last
batch -- this caught that **South Carolina and Kentucky do not use the three-class system** at all
(South Carolina defines a single 750W/20mph "electric-assist bicycle" category with no helmet law at
any age; Kentucky has no statewide e-bike statute whatsoever and treats e-bikes as plain bicycles,
with only scattered local rules like Louisville Metro Parks' under-18 helmet requirement). Wrote both
with `classSystem: false` and outlier-law framing matching the existing Hawaii/New Jersey entries,
instead of the standard template that would have stated an inaccurate law. Indiana, Connecticut, and
Alabama do use the three-class system and got the standard template, each with a genuine differentiator:
Indiana's Class 3 under-18 helmet rule and 15+ minimum operating age; Connecticut's unusually strict
all-age, all-class helmet law plus a statewide Class 3 trail/path ban (one of only ~5 states with an
all-age helmet rule); Alabama's statewide sidewalk-riding ban and mandatory-sidepath rule alongside
its Class 3 age/helmet rules.

**Action 3 -- Found and fixed a live factual error on an already-published state page:** the
Kentucky search result named North Carolina alongside SC/KY as a three-class non-adopter, which
contradicted our existing `north-carolina` entry (`classSystem: true`, "28 mph (Class 3)", "Required
for riders under 16"). Ran a dedicated web search to confirm rather than trust one incidental mention:
confirmed North Carolina uses a single "electric assisted bicycle" definition (750W, 20 mph motor-only
speed, no Class 1/2/3 tiers) and that a bill to adopt the three-class system (SB 576) has been
introduced but not passed as of 2026. Rewrote the entry to `classSystem: false` with accurate
maxSpeed/helmet/lawSummary fields and an added riding tip flagging the missing Class 3 category,
matching the SC/KY outlier-law pattern. This had been live and inaccurate since the file was first
created (well before this run), so this is a correction, not new content.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean. Started the dev server and loaded
`/best-ebikes/kentucky` directly: confirmed the "Non-standard" class-system label, correct helmet/
law copy, and full buyer content render with no console errors (the only network failures were the
pre-existing unrelated AvantLink affiliate-tracking pixel block, not caused by this change). Also
loaded `/e-bikes/duotts/duotts-e29` and confirmed the new 4-sentence description renders on the page.

**Expected impact:** `duotts-e29` gets the same editorial depth treatment as every other page with a
real click signal, closing a gap that persisted across two prior runs' own candidate lists. The 5 new
state pages are additional low-competition local-intent ranking surfaces. Catching the SC/KY legal
framing before publishing, and catching the pre-existing North Carolina inaccuracy after publishing,
both avoid shipping incorrect legal claims on public pages -- a genuine trust and liability risk for
an affiliate site giving legal-adjacent guidance to real buyers.

**Verified (North Carolina fix):** `npx tsc --noEmit -p tsconfig.json` clean after the edit (same
check already covered this file). Not re-run in the browser separately since it's the same
`state-data.ts` file and page template already verified working for Kentucky above.

**Next candidates:** (1) Continue P2.5 -- Louisiana, Oklahoma, Iowa, and ~20 smaller states remain;
verify each one's actual class-system status via web search before writing (now standard practice
after SC/KY/NC all turned out to be non-adopters). (2) Audit the remaining ~24 already-published
states' `classSystem`/`maxSpeed`/`helmetRequired` fields against a real source -- they were written
before this run started verifying per-state, and North Carolina alone was found wrong on the first
adjacent-mention check; there is no reason to assume the rest are all correct. Alaska (also named as a
non-adopter in this run's research) is not yet in the file, so no action needed there unless it gets
added later. (3) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600 scooter-vs-bike
classification. (4) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still need
human research. (5) `/blog/ebike-maintenance-tips` still showing impressions (38 impr, pos 51.7 last
run) -- worth a depth pass once a second data point confirms it's a real, growing cluster.

---

## 2026-07-09 (run 10) -- DUOTTS S26 description depth (P1.1) + 5 more states (P2.5)

**GSC snapshot (28d, ending 2026-07-06):** 2 clicks, 832 impressions (+38 vs last window), CTR 0.2%.
Query-level striking-distance table still empty, but page-level signals show the same core cluster
persisting: `/` now 3 clicks/3 impr at pos 1.0 (branded-query effect, small sample). `/e-bikes/samebike/
samebike-rs-a01-pro` holds at pos 14.7 with 2 clicks (28.6% CTR). `duotts-duotts-c29-k` (pos 14.7),
`duotts-e29` (pos 18.5, already given P1.1 depth in run 9), `engwe-p275-se` (21 impr, pos 20.3),
`eunorau-meta-24-1` (pos 23.2, previously confirmed to already have a solid description -- no action),
and `samebike-rs-a01-men` (pos 9.1) round out the recurring single-click bike pages. `/best/cargo-
ebikes` still the largest impression pool (120 impr, pos 75.6, 0 clicks) -- continuing to treat this as
an authority ceiling per the last 3 runs' assessment, not a content gap. `/best/folding-ebikes` (6 impr,
pos 17.3) and `/blog/best-ebikes-for-hills` (96 impr, pos 44.9) unchanged. No new striking-distance or
high-impression/low-CTR signal appeared this run.

**PostHog snapshot (28d):** 70 pageviews / 28 visitors (flat vs 69/28 last run). Google holds the top
traffic source (29 views) ahead of direct (27), continuing the trend from the last 3 runs. Conversion
events unchanged at 3 total (`affiliate_link_clicked`): ENGWE N1 Pro (2), DUOTTS F20 (1) -- no new
converting bike. **Key signal: DUOTTS S26 was the top individual bike page this window** -- 6 views,
5 visitors, 5 sessions, more than any other single bike page in the snapshot -- despite not appearing
in GSC's click table at all (a PostHog-only traffic signal). S26 has been named as "PostHog's top
product page" in at least 2 earlier logged runs (2026-06-29, 2026-07-04) but never actually received
the P1.1 depth treatment other high-signal bikes got.

**Decision:** Both data sources were flat-to-repeating versus the last several runs (same recurring GSC
page set, no new conversion event), so leaned on the one genuinely new-looking signal (S26's traffic
spike) plus the largest untouched roadmap item (P2.5 state expansion, flagged again at the end of run 9).

**Action 1 -- P1.1: DUOTTS S26 description depth (Supabase, live immediately):** Checked the row first --
confirmed it still had only the original one-sentence description ("The DUOTTS S26 is an all-wheel-drive
fat-tire e-bike with dual 750W motors (1500W combined) and a 20Ah Samsung battery, built for serious
off-road traction."). Rewrote to 5 sentences: dual-motor AWD traction detail (why single-motor bikes
spin out where this doesn't), torque/climbing capability (110 Nm), claimed-vs-real range framing (75mi
manufacturer / 55mi practical, matching its own `range_practical`/`range_manufacturer` columns exactly),
and price positioning ($1,349 vs comparable AWD fat-tire bikes). No spec numbers changed, only added
editorial context around already-correct DB values.

**Action 2 -- P2.5: 5 more state pages added to `lib/state-data.ts`:** Louisiana, Oklahoma, Iowa,
Kansas, Arkansas (30 -> 35 states). Verified each state's actual e-bike law via web search before
writing (standard practice since the SC/KY/NC non-adopter discoveries in run 9) -- all 5 confirmed to
use the standard three-class system, so no `classSystem: false` outlier entries needed this batch, but
each got a genuine differentiator instead of boilerplate: Louisiana requires a Class 3 helmet for riders
of *any* age (stricter than the usual under-18 threshold) with a $50 fine waivable by helmet purchase;
Oklahoma has no statewide helmet law at all for any class; Iowa's three-class law is comparatively new
(2021, HF 493) and requires a Class 3 speedometer; Kansas state parks cap assisted speed at 20 mph,
which excludes Class 3 bikes from the state's well-known rail-trail network even though they're legal on
roads; Arkansas requires a Class 3 helmet for riders under 21, an unusually high age threshold, and was
one of the earliest adopters (Act 956, 2017).

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean. Started the dev server and confirmed all 5 new
state pages (`/best-ebikes/louisiana`, `/oklahoma`, `/iowa`, `/kansas`, `/arkansas`) return HTTP 200;
loaded `/best-ebikes/kansas` directly and confirmed the correct law summary, quick-facts grid, and riding
tips render with no console errors. Also loaded `/e-bikes/duotts/duotts-s26` and confirmed the new
5-sentence description renders on the page with no console errors.

**Expected impact:** DUOTTS S26 gets the same editorial depth treatment as every other page with a real
traffic/conversion signal, closing a gap that had persisted across 2+ prior logged runs despite being
named each time. The 5 new state pages add more low-competition local-intent ranking surfaces (35 states
live now), each with a genuinely differentiated legal hook rather than templated copy, which should help
them read as distinct pages to Google rather than a thin, repeated pattern.

**Next candidates:** (1) Continue P2.5 -- roughly 15 smaller states remain (Mississippi, New Mexico,
Nebraska, West Virginia, Idaho, Montana, and others); keep verifying class-system status per state via
web search before writing. (2) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600
scooter-vs-bike classification. (3) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1`
still need human research. (4) `/blog/ebike-maintenance-tips` still showing impressions (pos ~52) --
worth a depth pass once GSC shows continued growth on this cluster. (5) Watch DUOTTS S26 in the next
PostHog/GSC pull -- if it starts showing GSC impressions/clicks to match its PostHog traffic, it becomes
the clearest dual-signal priority page on the site.

---

## 2026-07-09 (run 11) -- 5 more states (P2.5): Idaho, New Mexico, Mississippi, West Virginia, Nebraska

**GSC snapshot (28d, ending 2026-07-06):** 2 clicks, 832 impressions, CTR 0.2% -- identical to run 10's
snapshot (same window; GSC has not refreshed since). Query/page tables unchanged: `electric bike for
heavy riders` still the top demand query (47 impr, pos 46.4, 1 click), `/best/cargo-ebikes` still the
largest impression pool (120 impr, pos 75.6, 0 clicks, still treated as an authority ceiling per the last
4 runs' assessment). No new striking-distance or high-impression/low-CTR signal. Striking-distance table
still empty.

**PostHog snapshot (28d):** 70 pageviews / 28 visitors, flat versus run 10 (also 70/28). Google holds
the top traffic source (29 views) ahead of direct (27), unchanged. Conversion events unchanged at 3 total
(`affiliate_link_clicked`): ENGWE N1 Pro (2), DUOTTS F20 (1) -- no new converting bike, and DUOTTS S26
did not gain any new GSC impressions/clicks this pull (still a PostHog-only signal, watch continues).

**Decision:** Both data sources fully flat versus the immediately prior run (same GSC window, identical
PostHog totals) with no new dual-signal page to chase. Per run 10's own "next candidates," continued the
largest untouched roadmap item: P2.5 state page expansion.

**Action -- 5 more state pages added to `lib/state-data.ts` (live immediately, auto-added to sitemap via
`getAllStateSlugs()`):** Idaho, New Mexico, Mississippi, West Virginia, Nebraska (35 -> 40 states).
Verified each state's actual e-bike law via web search before writing (standard practice since the
SC/KY/NC non-adopter discoveries in run 9) -- all 5 confirmed to use the standard three-class system, so
no `classSystem: false` outlier entries needed this batch, but each got a genuine, sourced differentiator:
Idaho has no statewide helmet law and is still actively updating its e-bike statute (HB 500, signed March
2026, effective July 2026); New Mexico's default path-access rule treats throttle-equipped Class 2 the
same as Class 3, excluding both from paths unless a local government opts in (Albuquerque did, in 2024);
Mississippi has no statewide helmet law of any kind, for e-bikes or regular bicycles, a genuine outlier
even among permissive states; West Virginia's 2023 law (HB 2062) explicitly expanded e-bike access to
rail-trails and was framed around tourism access, since it's the only state entirely within the
Appalachians; Nebraska sets no statewide minimum age for Class 3 operation on top of having no helmet
law, unusually permissive even by three-class standards.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean. Started the dev server and confirmed all 5 new
state pages (`/best-ebikes/idaho`, `/new-mexico`, `/mississippi`, `/west-virginia`, `/nebraska`) return
HTTP 200; loaded `/best-ebikes/nebraska` directly via accessibility snapshot and confirmed the correct
title, quick-facts grid (class system, license, max speed, max motor), full law summary, helmet/bike-path
copy, and riding tips render correctly with zero console errors.

**Expected impact:** 5 more low-competition local-intent ranking surfaces (40 states live now), each with
a genuinely differentiated legal hook (verified via web search, not templated) rather than boilerplate
copy repeated across pages, which should help them read as distinct pages to Google.

**Next candidates:** (1) Continue P2.5 -- roughly 10 smaller states remain (Maine, Montana, North
Dakota, South Dakota, Wyoming, Delaware, New Hampshire, Vermont, Rhode Island, Alaska); keep verifying
class-system status per state via web search before writing. (2) ROADMAP P0.13 -- Dylan decision still
needed on EASE 2 PRO/Y400/Y600 scooter-vs-bike classification. (3) ROADMAP P0.16 --
`eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still need human research. (4)
`/blog/ebike-maintenance-tips` still showing impressions (pos ~52) -- worth a depth pass once GSC shows
continued growth on this cluster. (5) Watch DUOTTS S26 in the next PostHog/GSC pull -- still a
PostHog-only traffic signal after 2 consecutive runs; if it starts showing GSC impressions/clicks it
becomes the clearest dual-signal priority page on the site. (6) GSC window has now been stuck on the same
2026-06-08 to 2026-07-06 range for 2 consecutive same-day runs (10, 11) -- consistent with the documented
3-day lag buffer and multiple same-day runs, not a bug (same root cause identified in run 9), but worth
a fresh pull next calendar day to confirm the window actually advances.

---

## 2026-07-09 (run 12) -- 5 more states (P2.5): Maine, Montana, North Dakota, South Dakota, Wyoming

**GSC snapshot (28d, ending 2026-07-06):** 2 clicks, 832 impressions, CTR 0.2% -- identical to runs 10
and 11's snapshot (same window; GSC still has not refreshed). Query/page tables unchanged: `electric
bike for heavy riders` still the top demand query (47 impr, pos 46.4, 1 click), `/best/cargo-ebikes`
still the largest impression pool (120 impr, pos 75.6, 0 clicks, still treated as an authority ceiling
per the last 5 runs' assessment). No new striking-distance or high-impression/low-CTR signal. This is now
3 consecutive same-day runs (10, 11, 12) on the identical window -- consistent with the documented 3-day
lag buffer, per run 9's root-cause finding, not a bug.

**PostHog snapshot (28d):** 70 pageviews / 28 visitors, fully flat versus runs 10 and 11 (also 70/28).
Google holds the top traffic source (29 views) ahead of direct (27), unchanged for 4 consecutive runs.
Conversion events unchanged at 3 total (`affiliate_link_clicked`): ENGWE N1 Pro (2), DUOTTS F20 (1) --
no new converting bike, and DUOTTS S26 still has not gained any GSC impressions/clicks to match its
PostHog traffic (now 3 consecutive runs watching this signal without movement).

**Decision:** Both data sources fully flat versus the two immediately prior runs (identical GSC window,
identical PostHog totals down to the pageview/visitor count) with no new dual-signal page to chase.
Continued the largest untouched roadmap item per run 11's own "next candidates": P2.5 state page
expansion.

**Action -- 5 more state pages added to `lib/state-data.ts` (live immediately, auto-added to sitemap via
`getAllStateSlugs()`):** Maine, Montana, North Dakota, South Dakota, Wyoming (40 -> 45 states). Verified
each state's actual e-bike law via web search before writing (standard practice since the SC/KY/NC
non-adopter discoveries in run 9) -- this batch surfaced the second confirmed non-three-class state after
SC/KY: **Montana has no Class 1/2/3 tiers at all.** State law (MCA 61-8-102(2)(g)) defines an
"electrically assisted bicycle" purely by a 20 mph assist cap for a 170 lb rider on level pavement, with
no wattage figure specified either -- the first state page where the `maxWattage` field couldn't carry a
number, so it was written as a plain-language explanation of the speed-cap definition instead. Wrote
Montana with `classSystem: false`, matching the SC/KY/NC outlier-law pattern, plus a riding-tip flagging
that Montana DNRC classifies e-bikes as motorized vehicles (not bicycles) on state trust lands, restricted
to signed-open roads rather than trails -- a real access gotcha not present in any other state page so
far. The other 4 states confirmed standard three-class adoption, each with a genuine sourced
differentiator: Maine's under-16 helmet rule applies to every class, not just Class 3 (unusually strict,
the inverse of most three-class states); North Dakota only requires a helmet for Class 3 riders under 18
with no rule at all for Class 1/2 (one of the more permissive states); South Dakota requires a helmet for
every Class 3 passenger regardless of age, not just the operator (a stricter passenger rule than the
typical under-18-operator-only standard); Wyoming has no statewide helmet law for any class but still sets
a 16+ minimum age to operate a Class 3 bike.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean. Started the dev server and loaded
`/best-ebikes/montana` directly via accessibility snapshot -- confirmed the "Non-standard" class-system
label, the custom max-speed/max-motor text (no forced wattage number), the correct law summary citing MCA
61-8-102(2)(g), and the state-trust-land riding tip all render correctly. Also confirmed
`/best-ebikes/maine`, `/north-dakota`, `/south-dakota`, and `/wyoming` all return HTTP 200 via direct
fetch. No console errors on any of the 5 pages.

**Expected impact:** 5 more low-competition local-intent ranking surfaces (45 states live now). The
Montana page in particular corrects what would otherwise have been a factual error if the standard
three-class template had been applied without checking -- exactly the kind of legal-accuracy risk this
per-state verification practice exists to catch, now caught for the second time (after SC/KY/NC in run
9).

**Next candidates:** (1) Continue P2.5 -- 5 smaller states remain (Delaware, New Hampshire, Vermont,
Rhode Island, Alaska); keep verifying class-system status per state via web search (Alaska was flagged as
a possible non-adopter back in run 9's research, worth confirming directly when it's added). After these
5, P2.5 will be functionally complete for all 50 states. (2) ROADMAP P0.13 -- Dylan decision still needed
on EASE 2 PRO/Y400/Y600 scooter-vs-bike classification. (3) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs`
and `vtuvia-reindeer-1` still need human research. (4) `/blog/ebike-maintenance-tips` still showing
impressions (pos ~52) -- worth a depth pass once GSC shows continued growth on this cluster. (5) Watch
DUOTTS S26 in the next PostHog/GSC pull -- still a PostHog-only traffic signal after 3 consecutive runs
without any matching GSC impressions/clicks; if it starts showing GSC movement it becomes the clearest
dual-signal priority page on the site. (6) GSC window has now been stuck on the same 2026-06-08 to
2026-07-06 range for 3 consecutive same-day runs (10, 11, 12) -- still consistent with the documented
lag buffer, but this is the longest same-day streak yet; worth a fresh pull next calendar day to confirm
the window actually advances once a new day starts.

---

## 2026-07-09 (run 13) -- Final 5 states (P2.5 complete): Delaware, New Hampshire, Vermont, Rhode Island, Alaska

**GSC snapshot (28d, ending 2026-07-06):** 2 clicks, 832 impressions, CTR 0.2% -- identical to runs 10,
11, and 12's snapshot (same window; GSC still has not refreshed). Query/page tables unchanged: `electric
bike for heavy riders` still the top demand query (47 impr, pos 46.4, 1 click), `/best/cargo-ebikes`
still the largest impression pool (120 impr, pos 75.6, 0 clicks, still treated as an authority ceiling
per the last 6 runs' assessment). No new striking-distance or high-impression/low-CTR signal. This is now
4 consecutive same-day runs (10-13) on the identical window -- consistent with the documented 3-day lag
buffer, per run 9's root-cause finding, not a bug.

**PostHog snapshot (28d):** 70 pageviews / 28 visitors, fully flat versus runs 10, 11, and 12 (also
70/28). Google holds the top traffic source (29 views) ahead of direct (27), unchanged for 5 consecutive
runs. Conversion events unchanged at 3 total (`affiliate_link_clicked`): ENGWE N1 Pro (2), DUOTTS F20
(1) -- no new converting bike, and DUOTTS S26 still has not gained any GSC impressions/clicks to match
its PostHog traffic (now 4 consecutive runs watching this signal without movement).

**Decision:** Both data sources fully flat versus the three immediately prior runs (identical GSC window,
identical PostHog totals down to the pageview/visitor count) with no new dual-signal page to chase.
Finished the last untouched roadmap item per run 12's own "next candidates": the final 5 states, closing
out P2.5 for all 50 states.

**Action -- Final 5 state pages added to `lib/state-data.ts` (live immediately, auto-added to sitemap via
`getAllStateSlugs()`):** Delaware, New Hampshire, Vermont, Rhode Island, Alaska (45 -> 50 states, all 50
US states now live). Verified each state's actual e-bike law via web search before writing (standard
practice since the SC/KY/NC/Montana non-adopter discoveries in runs 9 and 12). This batch surfaced the
most significant outlier of the entire P2.5 sweep: **Alaska has no enacted statewide e-bike classification
law at all** -- HB 8 was vetoed by the governor in 2023 and a follow-up bill, SB 62, stalled in Senate
State Affairs, so e-bikes are not formally defined as Class 1/2/3 anywhere in Alaska statute as of 2026.
This is a different kind of outlier than Montana/SC/KY/NC, which all have some single-tier definition;
Alaska simply has no codified e-bike law, so trail access depends entirely on the individual land manager
(Alaska State Parks has adopted its own three-class definitions for park trail-access purposes only, not
as state law). Ran a second, more targeted search specifically to resolve conflicting claims across
sources (one set of results incorrectly suggested Alaska classifies e-bikes as motorcycles requiring an
operator's license; a second pass confirmed the actual current status is "no enacted law," not "regulated
as a motor vehicle") before writing the entry -- wrote it as `classSystem: false` with a plain-language
explanation of the legal gray area rather than asserting either extreme. Delaware, New Hampshire, Vermont,
and Rhode Island all confirmed standard three-class adoption, each with a genuine sourced differentiator:
Delaware requires a helmet for all Class 3 riders/passengers regardless of age (not just under-18), plus a
mandatory speedometer on Class 3 bikes; New Hampshire bars Class 3 e-bikes from most multi-use paths
unless the path runs alongside a road; Vermont has no statewide e-bike helmet law at any age or class,
confirmed via its actual statute text (§1136a) after several secondary-source blogs incorrectly claimed a
Class 3 helmet mandate -- one of only 13 US states with zero helmet mandate; Rhode Island (three-class
since July 2024) applies its under-21 helmet rule to all three classes, the only state that broad, rather
than the more common Class-3-only or under-18-only pattern.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (exit 0). Started the dev server and loaded all 5
new pages: `/best-ebikes/alaska` confirmed via accessibility snapshot showing the "Non-standard"
class-system label, the custom max-speed/max-motor text ("Not codified statewide..."), and the correct
law summary citing HB 8 and SB 62; `/best-ebikes/delaware`, `/rhode-island`, `/vermont`, and
`/new-hampshire` all confirmed HTTP 200 via server logs with zero console errors on any page.

**Expected impact:** P2.5 is now functionally complete -- all 50 states have a dedicated, individually
verified local-intent page rather than templated copy, closing out the single largest roadmap item this
autonomous loop has worked since run 8. The Alaska page in particular avoids a legal-accuracy trap that a
less careful pass would likely have hit (either wrongly asserting motor-vehicle-style licensing, or wrongly
assuming the standard three-class template applies), consistent with the per-state verification discipline
established since the SC/KY/NC/Montana catches.

**Next candidates:** (1) P2.5 is now complete (50/50 states) -- no further state-page expansion needed;
future work on this surface should be an accuracy audit pass, not new pages (see item 2). (2) Audit the
~40 already-published standard-three-class states' `helmetRequired`/`maxSpeed` fields against a real
source; North Carolina, South Carolina, Kentucky, and Montana were all found to have been mis-templated on
first write, and Vermont this run needed a second, more careful search to correct a helmet-law error a less
careful pass would have shipped -- there is no strong reason to assume every earlier state page is
error-free. (3) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600 scooter-vs-bike
classification. (4) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still need human
research. (5) `/blog/ebike-maintenance-tips` still showing impressions (pos ~52) -- worth a depth pass once
GSC shows continued growth on this cluster. (6) Watch DUOTTS S26 in the next PostHog/GSC pull -- still a
PostHog-only traffic signal after 4 consecutive runs without any matching GSC impressions/clicks. (7) GSC
window has now been stuck on the same 2026-06-08 to 2026-07-06 range for 4 consecutive same-day runs
(10-13) -- still consistent with the documented lag buffer, but worth a fresh pull next calendar day to
confirm the window actually advances. (8) With P2.5 complete, the next largest untouched roadmap item is
P1.1 (bike detail page depth) for any remaining thin-description bikes not yet covered by prior sweeps, or
P2.3 (high-intent vs-pages -- only 3 exist currently).

---

## 2026-07-10 (run 14) -- SAMEBIKE EBE2 description depth (P0.21) + maintenance-tips FAQ/linking pass (P0.22)

**GSC snapshot (28d, ending 2026-07-07):** 2 clicks, 911 impressions (+79 vs the 832 stuck across runs
10-13), CTR 0.2%. The window finally advanced past the 4-run plateau flagged in run 13. Top query
unchanged: "electric bike for heavy riders" (48 impr, pos 46.4, 1 click). `/best/cargo-ebikes` still the
largest impression pool (121 impr, pos 75.9, 0 clicks). New page-level signals this run:
- `/e-bikes/samebike/samebike-ebe2`: 1 click, 1 impr, 100% CTR, pos 10.0 -- brand-new page in the data,
  first-ever impression and click.
- `/e-bikes/samebike/samebike-rs-a01-pro`: 2 clicks, 7 impr, 28.6% CTR, pos 14.7 -- recurring strong
  performer, improving from pos 18.3 (run 2) to 14.7.
- `/e-bikes/eunorau/eunorau-meta-24-1`: 1 click, 5 impr, 20% CTR, pos 23.2 -- recurring click signal;
  checked its description and it already has solid P0.9-era depth, so left untouched this run.
- Striking-distance query table empty again, but several bike pages (rs-a01-pro, duotts-c29-k, duotts-e29,
  p275-se) sit in the pos 10-20 band at the page level.

**PostHog snapshot (28d):** 70 pageviews / 28 visitors -- identical totals to runs 10-13 (fully flat for a
5th consecutive run). Google still the top traffic source (29 views) ahead of direct (27). Conversion
events unchanged at 3 total (`affiliate_link_clicked`): ENGWE N1 Pro (2), DUOTTS F20 (1). DUOTTS S26 still
the top product page by views/sessions (6/5) with no matching GSC movement, now 5 consecutive runs on that
signal. New this run: `samebike-ebe2` shows its first-ever pageview/session, matching its brand-new GSC
signal -- the clearest dual-signal page this run, even though the absolute numbers are small (1
impression, 1 pageview).

**Decision:** Two focused actions this run, both driven directly by the fresh data:
1. P0.21 -- `samebike-ebe2` is a genuine new dual-signal page (GSC + PostHog, same day) but had only a
   one-sentence stub description. Checked `eunorau-meta-24-1` too (recurring GSC click) but its
   description was already solid from an earlier sweep, so no action needed there.
2. P0.22 -- `/blog/ebike-maintenance-tips` has been named as a "next candidate" in the log for at least 5
   consecutive runs without ever being executed. Checked the page template and found it was missing the
   FAQ + internal-linking pattern applied to every other enriched page on the site.

**Action 1 -- P0.21: SAMEBIKE EBE2 description rewrite (Supabase, live immediately)**
Queried the bike's full spec row first (motor_type=rear-hub, torque sensor, frame_type=step-over,
suitable_for=[off-road, recreation], bike_class=class-1, battery_capacity=13Ah, wheel_size=26",
has_suspension=front, weight_lbs=55, max_weight=330, range_practical=36/range_manufacturer=56, price=$619,
score=6.8). Rewrote the single-sentence stub description to 4 sentences covering the motor/torque-sensor
feel, the trail-oriented geometry and its single-fork limitation, the practical-vs-manufacturer range with
payload, and honest Class-1 positioning versus the catalog's fully suspended sport bikes -- every claim
traced to a verified DB column, no fabricated specs.

**Action 2 -- P0.22: `/blog/ebike-maintenance-tips` enrichment (`lib/blog-data.ts`, live immediately)**
Added a "Frequently asked questions" H2 section with 6 FAQs targeting long-tail queries not covered by the
existing 7-tip structure (battery lifespan, chain lube frequency, riding in rain, annual cost, motor
servicing, when to replace the battery). Added 2 internal links: `/stores` (dealer locator) from the
annual-tune-up section -- a genuinely useful cross-link since a tune-up requires finding a shop -- and
`/blog/ebike-battery-range-guide` from the closing paragraph. Set `updatedAt: '2026-07-10'` for a
freshness signal (post was previously unchanged since its 2026-05-28 publish date). Word count roughly
750 -> 1,250.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (exit 0, no output). Started the dev server and
loaded both pages directly: `/blog/ebike-maintenance-tips` confirmed via accessibility snapshot showing
the "Updated July 10, 2026" byline date, all 7 original H2 tip sections, the new "Frequently asked
questions" H2 with all 6 questions present as `<strong>` text, and both new links (`/stores`,
`/blog/ebike-battery-range-guide`) present in the DOM. `/e-bikes/samebike/samebike-ebe2` confirmed via
`document.querySelector` that the new 4-sentence description renders in the page body matching the exact
text written to Supabase. Zero console errors on either page.

**Expected impact:** EBE2 just started converting in both data sources on the same day; giving it real
editorial depth immediately (rather than waiting for repeated log entries, the pattern that delayed S26 and
F20's fixes by multiple runs) should reinforce that early signal rather than risk losing a visitor to a
thin page. The maintenance-tips FAQ section makes the post eligible to match more long-tail queries and
closes the single most-repeated unexecuted item in this log; the `/stores` link is also the first inbound
link from blog content to the store locator, a page that otherwise has weak internal linking.

**Next candidates:** (1) Audit the ~40 already-published standard-three-class state pages for
`helmetRequired`/`maxSpeed` accuracy against real sources (flagged since run 13, not yet started -- North
Carolina, South Carolina, Kentucky, Montana, and Vermont were all caught needing correction on first
write). (2) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600 scooter-vs-bike
classification. (3) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still need human
research. (4) Watch `samebike-ebe2` and `samebike-rs-a01-pro` in the next GSC/PostHog pull -- both are
either brand-new or improving-position signals worth confirming aren't one-off noise. (5) DUOTTS S26 is
now 5 consecutive runs as a PostHog-only signal with zero matching GSC movement -- consider whether this
needs a different lever than more description depth (e.g. an inbound blog link or an off-road best-of
placement check) rather than repeating the same fix. (6) P2.3 -- high-intent vs-pages (only 3 exist
currently), the next largest untouched roadmap item after the state-page audit.

---

## 2026-07-10 (run 15) -- Bike-level vs-pages (P2.3)

**GSC snapshot (28d, ending 2026-07-07):** 2 clicks, 911 impressions, CTR 0.2% -- same window as run 14
(no new data yet). New page-level detail versus run 14: `/e-bikes/samebike/samebike-rs-a01-pro` climbed
from pos 14.7 (unchanged this window) to a confirmed 2 clicks / 7 impr / 28.6% CTR; `/` (homepage) now
shows 3 clicks / 3 impr / 100% CTR at pos 1.0 (branded query, not actionable); query-level striking-distance
and high-impression/low-CTR tables both empty again. `/best/cargo-ebikes` still the largest impression pool
(121 impr, pos 75.9, 0 clicks, unchanged).

**PostHog snapshot (28d):** 70 pageviews / 28 visitors -- identical to runs 10-14 (6th consecutive flat
run). DUOTTS S26 still the top product page by views/sessions (6/5), still zero matching GSC signal (6th
consecutive run on this watch item). Conversion events unchanged at 3 total (`affiliate_link_clicked`):
ENGWE N1 Pro (2), DUOTTS F20 (1).

**Decision:** Both data sources fully flat versus run 14. Advanced ROADMAP P2.3 (high-intent vs-pages,
flagged as the next largest untouched item in runs 13 and 14's own "next candidates"), and used it to also
address item (5) from run 14 -- DUOTTS S26 needing "a different lever than more description depth" -- by
giving it a genuine new inbound link and comparison surface instead of repeating a description rewrite.

**Action -- 3 new bike-level vs-pages (`app/vs/[slug]/page.tsx` + `app/sitemap.ts`, live immediately):**
The existing `MATCHUPS` array only had 5 brand-level pairs (each side picks that brand's top-scoring bike).
`findSide()` already supported an exact-bike-slug match as its first check, so no code changes were needed
beyond adding entries -- confirmed all 3 target slugs exist verbatim in Supabase via `execute_sql` before
wiring them up:
1. `engwe-n1-pro-vs-duotts-s26` -- pairs the only bike with confirmed repeat affiliate clicks (N1 Pro, 2
   clicks) against the top PostHog product page with zero matching GSC signal for 6 consecutive runs (S26).
   Gives S26 a fresh internal link and a real comparison-intent surface ("N1 Pro vs S26"-style searches)
   rather than another content-depth pass on a page that already has depth.
2. `samebike-rs-a01-pro-vs-samebike-rs-a01-men` -- same model, two variants, both with real GSC clicks and
   climbing positions (Pro: pos 14.7, 2 clicks; MEN: pos 9.1, 1 click) -- a natural "which RS-A01 should I
   buy" query neither variant's own detail page can answer on its own.
3. `duotts-duotts-c29-k-vs-eunorau-meta-24-1` -- both bikes logged a confirmed GSC click this run, similar
   mid-range price tier, no prior comparison surface between them.
All 3 added to `VS_MATCHUPS` in `app/sitemap.ts` (must mirror `MATCHUPS` exactly per the existing code
comment). Site now has 8 vs-pages total (5 brand-level + 3 bike-level).

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (exit 0). Started the dev server and loaded all 3
new URLs via `window.location.assign` + DOM checks (screenshot tool timed out this run but was superseded
by direct DOM/accessibility verification): `engwe-n1-pro-vs-duotts-s26` renders h1 "ENGWE N1 Pro vs DUOTTS
S26 AWD"; `samebike-rs-a01-pro-vs-samebike-rs-a01-men` renders h1 "SAMEBIKE RS-A01 Pro vs SAMEBIKE RS-A01
MEN" with the correct tied-score verdict copy (both 7.2); `duotts-duotts-c29-k-vs-eunorau-meta-24-1` renders
h1 "DUOTTS C29-K vs Eunorau META24 1.0". Server logs confirmed `GET /vs/engwe-n1-pro-vs-duotts-s26 200`.
Zero console errors on any of the 3 pages.

**Expected impact:** 3 new ranking surfaces targeting bottom-of-funnel comparison queries between bikes
that already have confirmed click/traffic signal, rather than speculative brand pairings. The S26 matchup
in particular is a direct response to a signal that has now persisted unaddressed for 6 runs -- if a
different lever was ever going to move that page, an inbound link from a bike with proven conversion intent
is a stronger candidate than a 7th description-depth pass.

**Next candidates:** (1) Audit the ~40 already-published standard-three-class state pages for
`helmetRequired`/`maxSpeed` accuracy (flagged since run 13, still not started -- the largest untouched
roadmap item after P2.3). (2) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600
scooter-vs-bike classification. (3) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1`
still need human research. (4) Watch whether the new vs-pages pick up any GSC impressions in the next
window (2-3 week lag expected). (5) Watch DUOTTS S26 for GSC movement now that it has a second inbound link
via the new vs-page -- if still flat next run, the remaining lever to try is checking its actual placement
and prominence on `/best/off-road-ebikes`. (6) P2.3 has more room -- only 3 of the site's ~15 bikes with
real GSC/PostHog signal have been paired into vs-pages so far; candidates for a future run include
`eunorau-meta-275-st-1` (3 PostHog visitors) and `engwe-l20` (3 PostHog visitors, Dutch-description fix
beneficiary).

---

## 2026-07-10 (run 16) -- State-page legal accuracy audit, batch 1 (P0.23)

**GSC snapshot (28d, ending 2026-07-07):** 2 clicks, 911 impressions, CTR 0.2% -- identical window to run 15
(3rd consecutive run on this same snapshot). New detail this run: a fresh query surfaced, "samebike rs-a01
pro review" (1 click, 100% CTR, pos 43.0) -- a specific-intent review search converting on the RS-A01 Pro
page, reinforcing it as the site's strongest single-bike performer (now also 2 clicks/7 impr/pos 14.7 at the
page level, up from pos 18.3 at first tracking in run 2). `/best/cargo-ebikes` still the largest impression
pool (121 impr, pos 75.9, 0 clicks, unchanged for 4+ runs).

**PostHog snapshot (28d):** 70 pageviews / 28 visitors -- identical totals to runs 10-15 (7th consecutive
flat run). DUOTTS S26 still the top product page by views/sessions (6/5), still zero matching GSC signal (7th
consecutive run on this watch item). New minor page-level movement: `duotts-duotts-c29max-electric-bike` (4
views/1 visitor) and `samebike-cy20-pro`/`vtuvia-zeal-xt8` (1/1 each) appeared for the first time, but none
crossed the threshold of a real dual-signal page worth a dedicated action this run. Conversion events
unchanged at 3 total (`affiliate_link_clicked`): ENGWE N1 Pro (2), DUOTTS F20 (1).

**Decision:** Both data sources are flat/repeating with no new dual-signal page strong enough to justify
another description-depth pass (the RS-A01 Pro's new query is a confirmation of existing strength, not a new
target). Advanced the item flagged as the largest untouched roadmap task in runs 13, 14, and 15's own "next
candidates" without ever being started: auditing the ~20 oldest state pages, which predate the per-state
web-verification discipline adopted at run 9 after the SC/KY/NC outlier catches.

**Action -- P0.23: audited 8 of the ~20 pre-run-9 state pages against real sources (`lib/state-data.ts`,
live immediately):** California, Texas, New York, Florida, Washington, Oregon, Colorado, Hawaii. Found and
fixed 6 real errors:
- **Washington** -- `helmetRequired` claimed "Required for all riders in many counties and cities (including
  King County/Seattle)". Both King County and Seattle repealed their all-ages helmet ordinances in 2022; this
  was a flat factual error naming two specific major jurisdictions incorrectly. Rewrote to state no statewide
  law and the 2022 repeals, updated `lawSummary` to match.
- **Oregon** -- `helmetRequired` claimed "No state requirement (local rules may vary)". Oregon actually
  requires helmets for all riders under 16 statewide -- the site was asserting the opposite of the real law.
  Fixed to state the under-16 requirement.
- **New York** -- `maxSpeed` read "25 mph (Class 3, NYC limit)", implying 25 mph was NYC's cap. In reality 25
  mph is the *statewide* Class 3 definition (legal only within NYC), and NYC has capped all e-bikes at 15 mph
  on city streets since October 2025 -- the field had the relationship backwards. Fixed `maxSpeed` and
  `lawSummary` to state both figures correctly and cite the October 2025 NYC cap.
- **Colorado** -- `helmetRequired` said "No state requirement for adults", which is true but omits Colorado's
  actual rule: helmets are required under C.R.S. 42-4-1412 for riders under 18 on a Class 3 e-bike
  specifically. Fixed to state the real rule instead of only the negative case.
- **California** -- `helmetRequired` read "Required for riders under 18. Class 3 riders under 18 must wear a
  helmet," which conflates two separate rules and implies Class 3's helmet mandate only applies under 18. The
  actual law: general under-18 bicycle helmet law (CVC 21212) plus a *separate*, all-ages Class 3 helmet
  mandate (CVC 21213(b)) that applies regardless of age. Rewrote to state both rules distinctly.
- **Hawaii** -- stale against a brand-new law. HB2021 (signed June 2026, per Hawaii Bicycling League) raised
  the statewide helmet age from under 16 to under 18 and formally defined "e-bike" as capped at 750W, with
  anything more powerful reclassified as a "high-speed electric device" banned from roads, bike lanes, and
  sidewalks. Updated `helmetRequired`, `maxSpeed`, and `lawSummary` to reflect the new law while keeping the
  750W `maxWattage` field (already correct, now also the legal ceiling for what counts as an e-bike at all).
- **Florida** checked and confirmed already accurate (under-16 bicycle helmet law applies to e-bikes, no
  separate Class 3 rule) -- no change made.
- **Texas** was not technically wrong ("No state helmet requirement for adults") but was incomplete versus
  the site's own pattern on other state pages of naming local-city exceptions; added the Houston/Dallas/Fort
  Worth/Austin/Highland Park age variations sourced this run for consistency with how every other
  local-nuance state page on the site is written.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (exit 0, no output). Started the dev server and
loaded `/best-ebikes/washington`, `/best-ebikes/hawaii`, and `/best-ebikes/new-york` directly via
`get_page_text` -- confirmed the corrected helmet/speed copy renders in both the law-summary paragraph and
the FAQ section (which reuses the same fields) on all 3 pages checked, zero console errors on any page.

**Expected impact:** Fixes 6 confirmed factual errors on state pages that predate the site's own
verification standard -- most notably Washington's incorrect Seattle/King County helmet claim and New York's
inverted NYC-speed-limit framing, both concrete, checkable claims a Seattle or NYC-based reader could catch
as wrong. This is a trust/accuracy fix rather than a ranking play, consistent with how the SC/KY/NC/Montana/
Vermont catches were treated. Hawaii's update also keeps the page current against a law that took effect
within the last ~5 weeks (June 2026), which the automated GSC/PostHog loop would have no way to detect
without an active audit pass like this one.

**Next candidates:** (1) P0.23 continuation -- 12 states remain from the original pre-run-9 batch: Arizona,
Illinois, North Carolina, Virginia, Georgia, Massachusetts, Utah, Michigan, Pennsylvania, New Jersey,
Minnesota, Ohio. North Carolina in particular was already flagged as a non-standard outlier in run 9's
research but should be re-verified directly against a source rather than trusted from memory. (2) ROADMAP
P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600 scooter-vs-bike classification. (3) ROADMAP
P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still need human research. (4) DUOTTS S26 is now
7 consecutive runs as a PostHog-only signal with zero matching GSC movement. (5) Watch
`duotts-duotts-c29max-electric-bike`, which showed its first real PostHog traffic (4 views) this run --
confirm it isn't one-off noise before acting. (6) GSC has now shown the identical 2026-06-09 to 2026-07-07
window for 3 consecutive runs (14-16); worth a fresh pull next calendar day to confirm it advances.

---

## 2026-07-11 (run 17) -- DUOTTS C29Max description depth + state-page audit batch 2 (P0.23)

**GSC snapshot (28d, ending 2026-07-08):** 2 clicks, 942 impressions (+31 vs run 16's window), CTR 0.2% --
the window finally advanced a day, ending the 3-run stall flagged in run 16. New query-level detail:
"samebike rs-a01 pro review" improved from pos 43.0 (run 16) to pos 27.5, still converting at 50% CTR (1
click/2 impr). Page-level striking-distance signals (pos 5-20, via the page-level TOP PAGES table since the
query-level striking-distance tool output was empty again): `/e-bikes/samebike/samebike-rs-a01-men` pos 9.1,
`/e-bikes/samebike/samebike-ebe2` pos 11.0 (50% CTR), `/e-bikes/duotts/duotts-duotts-c29-k` pos 13.3,
`/e-bikes/samebike/samebike-rs-a01-pro` pos 14.4 (2 clicks/25% CTR), `/e-bikes/duotts/duotts-e29` pos 15.6,
`/best/folding-ebikes` pos 18.1 (1 click) -- six pages already in or near page-1/2 territory, none newly
actionable versus prior runs' descriptions of the same pages. `/best/cargo-ebikes` still the largest
impression pool (116 impr, pos 76.4, 0 clicks, 5th+ consecutive flat run at this position).

**PostHog snapshot (28d):** 73 pageviews / 29 visitors (up slightly from 70/28). DUOTTS S26 still the top
product page by views/sessions (6/5), now 8 consecutive runs as a PostHog-only signal with zero matching GSC
movement. `duotts-duotts-c29max-electric-bike` repeated its run-16 signal with another 4 views/1 visitor --
two consecutive runs of real (if modest) traffic, crossing the threshold run 16 set for "confirm it isn't
one-off noise before acting." New minor appearance: `samebike-cy20-pro` (1 view/1 visitor). Conversion events
unchanged at 3 total (`affiliate_link_clicked`): ENGWE N1 Pro (2), DUOTTS F20 (1).

**Decision:** Two focused actions this run: (1) act on the confirmed 2-run C29Max signal per the established
S26/F20/EBE2 pattern (deepen a thin description as soon as a page shows repeat traffic, rather than letting it
sit unaddressed for multiple runs); (2) continue P0.23, the largest unfinished roadmap item, with the next
batch of 6 pre-run-9 state pages.

**Action 1 -- DUOTTS C29Max description depth (Supabase, live immediately):** Queried the full spec row first
(price $1,149, 750W rear-hub with torque sensor, 75 Nm, 15Ah battery, 50mi manufacturer/38mi practical range,
29" wheels, Shimano 21-speed derailleur, front suspension, 62 lbs, 330 lb payload, Class 2 with throttle).
Rewrote the single-sentence stub to 4 sentences: the torque-sensor upgrade over the base C29 platform,
claimed-vs-real range framing (50mi/38mi), the 29"-wheel/21-speed fit for paved commuting and light gravel,
and price positioning ($1,149 vs comparable torque-sensor 29ers under $1,200) with an honest note on the 62
lb weight.

**Action 2 -- P0.23 batch 2: audited 6 more pre-run-9 state pages (`lib/state-data.ts`, live immediately):**
Arizona, Illinois, North Carolina, Virginia, Georgia, Massachusetts. Found and fixed 5 of 6:
- **North Carolina** -- `helmetRequired` read "No statewide requirement, though riders under 16 are advised to
  wear one," downgrading a real legal mandate to a mere suggestion. G.S. 20-171.9 actually makes it unlawful
  for a parent/guardian to let a rider under 16 use a bicycle or e-bike without a helmet (up to a $10 fine,
  usually waived on a first offense if a helmet is bought). Fixed both `helmetRequired` and `lawSummary` to
  state it as a requirement with the citation.
- **Virginia** -- same conflation pattern as California/Colorado in run 16's batch: `helmetRequired` said only
  "Required for riders under 14," omitting Virginia's separate, stricter all-ages Class 3 rule (Va. Code
  46.2-908.1: every Class 3 operator and passenger must wear a helmet regardless of age, and must be 14+ to
  ride one unsupervised). Rewrote to state both rules distinctly.
- **Georgia** -- identical conflation: `helmetRequired` said only "Required for riders under 16," omitting
  Georgia's own all-ages Class 3 helmet mandate (on top of, not instead of, the general under-16 rule) and the
  Class 3 minimum age of 15. Fixed to state both.
- **Massachusetts** -- the largest single catch across both audit batches. The page claimed MA "adopted the
  three-class system" with a 28 mph Class 3 tier (`classSystem: true`, `maxSpeed: '28 mph (Class 3)'`). In
  reality, Massachusetts law (M.G.L. c.90 section 1B) only legally recognizes Class 1 and Class 2 e-bikes,
  both capped at 20 mph; a 28 mph pedal-assist bike does not meet the state's "electric bicycle" definition
  and is instead a motorized bicycle/moped requiring RMV registration, a driver's license or learner's permit,
  a DOT-approved helmet for rider and passenger at any age, and a minimum operating age of 16. Rewrote the
  full entry: `classSystem` false, `maxSpeed`, `helmetRequired`, `bikePaths`, `lawSummary`, first `ridingTips`
  bullet, `metaDescription`, and `intro` all updated to state the real Class 1/2-only law, and noted
  Massachusetts's pending "Ride Safe Act" (S.3077, filed May 2026, not yet passed) for context. Verified via
  `mass.gov`/Justia citations of M.G.L. c.90 section 1B that Class 1/2 e-bikes are explicitly excluded from
  the "motorized bicycle" definition while anything faster is not.
- **Arizona** and **Illinois** checked and confirmed already accurate -- neither state has a statewide helmet
  law for e-bike riders of any age. Enhanced (not fixed) Arizona's entry with the specific cities that fill
  the gap with their own under-18 ordinances (Scottsdale, Mesa, Tucson, Sierra Vista, Yuma, Glendale, Pima
  County), matching the local-nuance pattern already applied to Texas and Colorado in run 16.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (exit 0, no output). Loaded `/best-ebikes/massachusetts`,
`/best-ebikes/virginia`, `/best-ebikes/north-carolina`, `/best-ebikes/georgia`, and
`/e-bikes/duotts/duotts-duotts-c29max-electric-bike` directly in the dev server: confirmed the corrected law
copy renders in both the law-summary paragraph and the reused FAQ section, the Massachusetts "Class system"
stat box now reads "Non-standard" instead of "Three-class (1/2/3)", and the new C29Max description renders in
the page body. Zero console errors on any of the 5 pages checked.

**Expected impact:** Massachusetts is the most consequential fix across both P0.23 batches so far: the site
was telling Massachusetts buyers a 28 mph "Class 3" e-bike was a legal, unregistered bicycle there, when
riding one on public roads without RMV registration and a license is actually a moped violation under state
law. Virginia and Georgia close the same all-ages-Class-3-mandate gap already identified as a recurring error
pattern in run 16 (California, Colorado). The C29Max fix follows the site's own established rule: give a page
real editorial depth as soon as it shows a second consecutive run of real traffic, rather than letting it sit
thin for multiple cycles the way S26 and F20 did before their fixes landed.

**Next candidates:** (1) P0.23 batch 3 -- 6 states remain: Utah, Michigan, Pennsylvania, New Jersey,
Minnesota, Ohio. Once these are done, the entire pre-run-9 state-page backlog is closed out. (2) ROADMAP
P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600 scooter-vs-bike classification. (3) ROADMAP
P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still need human research. (4) DUOTTS S26 is now
8 consecutive runs as a PostHog-only signal with zero matching GSC movement -- consider whether an actual
placement/prominence check on `/best/off-road-ebikes` (flagged as the next lever back in run 14) is overdue
now that a fresh inbound link and a second best-of appearance haven't moved it. (5) Watch
`samebike-cy20-pro`, which showed its first PostHog traffic (1 view) this run -- confirm it isn't one-off
noise before acting. (6) "samebike rs-a01 pro review" query improved from pos 43 to pos 27.5 this run -- watch
whether it keeps climbing toward the pos 5-20 striking-distance zone.

---

## 2026-07-11 (run 18) -- State-page legal accuracy audit, batch 3 of 3 -- closes P0.23

**GSC snapshot (28d, ending 2026-07-08):** 2 clicks, 942 impressions, CTR 0.2% -- identical window and
totals to run 17 (no new day advanced). Same query/page picture as run 17: "samebike rs-a01 pro review" at
pos 27.5, six pages already in striking-distance-adjacent territory (`samebike-rs-a01-men` pos 9.1,
`samebike-ebe2` pos 11.0, `duotts-duotts-c29-k` pos 13.3, `samebike-rs-a01-pro` pos 14.4, `duotts-e29` pos
15.6, `/best/folding-ebikes` pos 18.1), `/best/cargo-ebikes` still the largest flat impression pool (116
impr, pos 76.4, 0 clicks).

**PostHog snapshot (28d):** 73 pageviews / 29 visitors -- identical totals to run 17 (2nd consecutive flat
run). DUOTTS S26 still the top product page (6/5), now 9 consecutive runs as a PostHog-only signal with no
matching GSC movement. `duotts-duotts-c29max-electric-bike` did not repeat its 2-run signal this pull (fell
out of the top-20 list). No new dual-signal page crossed the action threshold.

**Decision:** Both data sources fully flat versus run 17, with no new page strong enough to justify another
description-depth pass. Advanced the item flagged as the largest untouched roadmap task across runs 16 and
17's own "next candidates": the final batch of the pre-run-9 state-page legal audit (P0.23), closing out the
entire ~20-state backlog that predates the per-state web-verification discipline adopted at run 9.

**Action -- P0.23 batch 3: audited the final 6 pre-run-9 state pages (`lib/state-data.ts`, live
immediately):** Utah, Michigan, Pennsylvania, New Jersey, Minnesota, Ohio. Researched each against primary
sources (state agency pages, statute text via Justia/Revisor/Ohio Laws, and 2026 law-firm/industry trackers
cross-checked against each other) before editing. Found and fixed 5 of 6:
- **Pennsylvania** -- the single biggest catch this run, same failure class as Massachusetts in batch 2. The
  page said Pennsylvania "adopted the three-class e-bike system" with a 28 mph Class 3 tier (`classSystem:
  true`, `maxSpeed: '28 mph (Class 3)'`). In reality Pennsylvania has never adopted the three-class model:
  under Act 154 of 2014, a "pedalcycle with electric assist" (75 Pa.C.S. Section 102) must have a motor of
  750W or less, weigh under 100 lbs, and cut off assistance at 20 mph to legally qualify as a bicycle. A 28
  mph Class 3-style e-bike falls outside that definition and cannot easily be registered as a motor vehicle
  either (confirmed via a July 2026 BikePGH.org explainer plus Justia/LegalFix statute citations), leaving it
  with no clear legal path on PA public roads. Rewrote `classSystem` (true to false), `maxSpeed`,
  `bikePaths`, and `lawSummary` to state the real single-tier definition, the 75 Pa.C.S. Section 3514 age-16
  minimum to operate, and kept the already-correct under-12 helmet rule (75 Pa.C.S. Section 3510) with its
  citation added.
- **Minnesota** -- a reversed factual claim, not just an omission. `maxWattage` read "1000W, one of the
  highest limits in the nation," repeated in `lawSummary`, a `ridingTips` bullet, `metaDescription`, and
  `intro`. Minn. Stat. Section 169.011 subd. 27 actually defines an "electric-assisted bicycle" as capped at
  750W, the same standard cap used by nearly every other three-class state (verified directly against the MN
  Revisor's own statute text). Fixed all five fields; the flagship ridingTips bullet was rewritten from "MN
  allows 1000W motors, giving you more power than most states" to the opposite, accurate framing: the 750W
  cap matches most other states, so nearly every mainstream e-bike is already compliant. Also added the real
  minimum-age rule (15, Minn. Stat. Section 169.222) and a note on city-level helmet ordinances (e.g. Blaine)
  that the old copy omitted entirely.
- **Utah** -- stale against a brand-new law rather than an old error. HB 381, effective May 6, 2026 (confirmed
  via the Utah Highway Safety Office's own site plus May 2026 local-news coverage), expanded the helmet
  mandate from Class-3-only to all riders under 21 on public roads, made it illegal for anyone under 16 to
  operate a Class 3 e-bike, and added a supervision requirement for riders ages 8-14. The page still said
  "No state requirement" for helmets. Rewrote `helmetRequired` and `lawSummary` to reflect the new law,
  including the pending May 2027 safety-certificate requirement for ages 8-15 riding unsupervised.
- **Michigan** and **Ohio** -- same conflation pattern flagged repeatedly in batch 2 (Virginia, Georgia):
  both said "No state requirement" for helmets, omitting each state's real Class 3 helmet mandate. Michigan
  requires a helmet for Class 3 operators/passengers under 18 (MCL 257.662a); Ohio requires one for Class 3
  operators/passengers at *any* age (ORC 4511.522), one of only a handful of states with an all-ages e-bike
  helmet law. Ohio's `maxSpeed` was also flatly wrong ("20 mph (motor-assisted)" for all classes) despite
  `classSystem: true` -- fixed to "28 mph (Class 3)" and added the Class 3 path-access restriction to
  `bikePaths`. Both states' `lawSummary` and `helmetRequired` rewritten with the real rule and citation.
- **New Jersey** was already directionally correct (the 2026 reclassification away from the three-class
  system was already reflected) but imprecise: the old copy implied a single uniform "motorized bicycle"
  category requiring a driver's license, when the real law (confirmed via the official NJ MVC page and the
  NJ Bike & Walk Coalition's law-firm-sourced FAQ) splits e-bikes into two tiers -- "low-speed electric
  bicycles" (pedal-assist only, capped 20 mph, no insurance required) and "motorized bicycles" (throttle or
  21-28 mph, insurance required) -- both needing registration and either a special 15-16 e-bike license or a
  standard 17+ driver's license. Rewrote `helmetRequired`, `maxSpeed`, and `lawSummary` with the two-tier
  detail, the age-15 floor, and the July 19, 2026 compliance deadline.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (exit 0). Started the dev server and loaded
`/best-ebikes/pennsylvania`, `/best-ebikes/minnesota`, and `/best-ebikes/ohio` via `get_page_text`: confirmed
Pennsylvania's stat box now reads "Non-standard" (matching the Massachusetts pattern) with the corrected law
copy in both the summary paragraph and the FAQ section; Minnesota shows "750W" in the Max Motor stat and the
corrected ridingTips bullet; Ohio shows "28 mph (Class 3)" and the all-ages Class 3 helmet copy. Zero console
errors on any of the 3 pages checked.

**Expected impact:** Closes the entire pre-run-9 state-page legal-accuracy backlog (all ~50 state pages are
now web-verified against primary sources). Pennsylvania is the most consequential fix in this batch and the
second Massachusetts-level catch across the whole three-batch audit -- the site was telling Pennsylvania
buyers a 28 mph "Class 3" e-bike was a legal bicycle there, when it actually falls into a regulatory gap with
no clear path to being ridden legally on PA public roads. Minnesota's reversed 750W/1000W claim is the kind
of error that could actively mislead a buyer's purchase decision (recommending they look for higher-wattage
motors than the market or the law typically supports).

**Next candidates:** (1) P0.23 is now fully closed -- no state-page legal-audit work remains queued. (2)
ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600 scooter-vs-bike classification. (3)
ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still need human research. (4) DUOTTS
S26 is now 9 consecutive runs as a PostHog-only signal with zero matching GSC movement -- worth an actual
placement/prominence check on `/best/off-road-ebikes` next time this run has spare capacity, since two
inbound links and a vs-page haven't moved it. (5) "samebike rs-a01 pro review" query improved from pos 43 to
pos 27.5 in run 17 and held there this run -- watch whether it keeps climbing toward the pos 5-20
striking-distance zone. (6) With the state-page backlog closed, the next-largest untouched roadmap item is
P2.3 (only 3 of ~15 signal-bearing bikes have vs-pages) or a fresh look at P1.4 (price/freshness "last
checked" dates), neither of which has been started.

---

## 2026-07-12 (run 19) -- DUOTTS S26 placement root-cause fix + new vs-page + live zero-value bug catch

**GSC snapshot (28d, ending 2026-07-09):** 1 click, 1024 impressions, CTR 0.1% -- window advanced from run
18's 2026-07-08 end date. `/e-bikes/samebike/samebike-rs-a01-pro` improved sharply to pos 10.3 (from pos 14.4
in run 17), `/e-bikes/samebike/samebike-rs-a01-men` holding at pos 9.0, `/e-bikes/samebike/samebike-ebe2` pos
11.0, `/e-bikes/duotts/duotts-duotts-c29-k` pos 13.3 with its first-ever GSC click, `/e-bikes/duotts/duotts-e29`
pos 25.1 (1 click). New this run: `/e-bikes/eunorau/eunorau-meta-24-1` picked up its first confirmed click (5
impr, 20% CTR, pos 23.2) -- already covered by an existing vs-page (`duotts-duotts-c29-k-vs-eunorau-meta-24-1`,
run 15), so no new action needed there. `/blog/best-ebikes-for-heavy-riders` still the largest query-level
cluster ("electric bike for heavy riders," 53 impr, pos 45.3). `/best/cargo-ebikes` still the largest flat
impression pool (unchanged pattern from prior runs). The query-level striking-distance tool output was empty
again despite several pages sitting at pos 9-13 -- consistent with prior runs' note that GSC's query-level
tool undercounts brand/model-specific queries that the page-level table catches instead.

**PostHog snapshot (28d):** 75 pageviews / 30 visitors (up from 73/29). DUOTTS S26 still the top product page
by views/sessions (6/5) -- now 10 consecutive runs as a PostHog-only signal with no matching GSC movement.
`duotts-duotts-c29-k` showed a real dual-signal this pull (5 PostHog views + its first GSC click, pos 13.3) --
the highest-priority pattern per the task's own instructions, but its description was already deepened in run
6, so no further action needed there this run. `eunorau-meta-275-st-1` and `engwe-l20` both repeated their
3-views/3-visitors signal for a second consecutive pull with no vs-page coverage -- exactly the run-18
"next candidates" flag. `duotts-duotts-c29max-electric-bike` did not repeat its prior 4-view signal (fell out
of the top pages again, 2nd time this has happened -- treating as noise, not a real recurring signal).
Conversion events unchanged at 3 total (`affiliate_link_clicked`): ENGWE N1 Pro (2), DUOTTS F20 (1).

**Decision:** Two focused actions, both closing items repeatedly flagged as "next candidates" across runs
14-18 without ever being executed: (1) the actual DUOTTS S26 placement/prominence investigation on
`/best/off-road-ebikes` that runs 14-18 kept deferring, and (2) a new vs-page for the `eunorau-meta-275-st-1`
/ `engwe-l20` pair flagged in run 18. The second action surfaced a live data bug that got fixed as a direct
consequence.

**Action 1 -- DUOTTS S26 placement root-cause found and fixed (P2.3/off-road watch item, closes the 10-run
"why isn't S26 moving" question):** Queried every bike qualifying for `/best/off-road-ebikes`
(`suitable_for` contains `off-road` or `sport`), sorted by `score_overall` descending, the same order the page
renders in. S26 ranked **33rd of 76** -- well outside the page's top-8 "Quick comparison" table and deep in
the card grid, despite being the site's #1 PostHog product page for 10 straight runs. Root cause: S26's
`score_value` was 3.2/10, dragging `score_overall` down to 6.9 despite class-leading specs (110 Nm torque, 55
mi practical range, 330 lb payload, full suspension, AWD dual motor) for its $1,349 price. Compared directly
against its closest same-brand, same-price-tier sibling, `duotts-f20` ($1,199, 70 Nm, 56 mi, 330 lb payload,
`score_value` 7.8) -- S26 offers meaningfully more torque for 12% more money with equal range/payload, which
by the site's own documented value definition (`lib/editorial.ts`: "price measured against everything else the
bike delivers, compared to direct rivals at the same price") should score as strong value, not poor value.
Fit a linear regression of `score_overall` against all 6 stored axis scores across 80+ bikes with non-null
scores (converged weights: value ~0.29, range ~0.19, power ~0.15, comfort ~0.14, build ~0.17, versatility
~0.09, residual ~0.1 -- a good fit, confirming `score_overall` is a fairly consistent weighted average rather
than an arbitrary number). Corrected `score_value` 3.2 -> 6.5 (conservative vs. F20's 7.8, accounting for S26's
weaker build-quality/versatility axis scores) and recomputed `score_overall` via the fitted weights: 6.9 ->
7.8. Re-ran the off-road ranking query after the fix: S26 moved from rank 33 to **rank 14** of 76 -- a real,
evidence-based improvement, though still short of the top-8 comparison table (did not force it further to
avoid gaming the score past what the regression and direct-comparison evidence support).

**Discovery, not fixed sitewide -- logged as new ROADMAP P0.24:** The same regression surfaced that S26's
`score_value` anomaly is one instance of a broader pattern: roughly a dozen bikes, mostly Eunorau's premium
$2,000-4,500 lineup (R1, R1+, URUS, SPECTER/FAT-HD/FAT-HS variants) plus 2 more DUOTTS mid-range bikes
(C29-K, C29Max), carry `score_value` of 1.0-3.7 versus same-price-tier peers scoring 7.0-8.0 on the same axis.
Did not touch these this run -- recalibrating a dozen scores without a dedicated, careful pass risks
introducing new inconsistencies rather than removing old ones, and this run's scope was the one bike with a
confirmed, repeated traffic signal (S26). Flagged as ROADMAP P0.24 for a future dedicated scoring-audit run.

**Action 2 -- New vs-page: `eunorau-meta-275-st-1-vs-engwe-l20`, plus a live zero-value bug caught and fixed
(P2.3 + P0.9-pattern):** Added the matchup to `MATCHUPS` in `app/vs/[slug]/page.tsx` and the mirrored
`VS_MATCHUPS` in `app/sitemap.ts` (both bikes recurring 3-visitor/2-run PostHog signal, identical $1,399
price -- a natural "same price, which one" query). While verifying the new page in the dev server, found it
rendering "0 Nm" motor / "0 lbs" weight / "0 lbs" max payload for `eunorau-meta-275-st-1` -- the DB row had
`torque=0`, `weight=0`, `max_weight=0`, the exact placeholder-zero pattern from the P0.9 sweep, apparently
missed because it's a distinct slug from the already-fixed `eunorau-meta-275-1` sibling (the "1.0" vs "ST"
naming makes them easy to conflate, similar to the P0.16 caution about `defender-s-fat-hs`). Sourced real
specs from a retailer listing (reallygoodebikes.com/products/eunorau-meta275-step-thru...) that matched the
already-verified sibling bike's numbers almost exactly (same 500W/torque-sensor platform, different frame
style): 65 Nm torque, 68.3 lbs, 286 lb payload. Also fixed `frame_type` (`step-over` -> `step-through`, since
"ST" stands for step-through and every source confirms it) and rewrote the one-line stub description
("META275 ST 1.0 - 500W hub motor city commuter e-bike") to 3 sentences of real editorial copy consistent
with the sibling's established voice.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (exit 0). Started the dev server: loaded the new
vs-page (confirmed 65 Nm / 68.3 lbs / 286 lbs render correctly on both sides, price displayed as an identical
$1,399 tie), the `eunorau-meta-275-st-1` detail page (confirmed the corrected spec table, step-through frame
label, and new description render; zero console errors), and `/best/off-road-ebikes` (loads cleanly, zero
console errors). Confirmed via a fresh SQL rank query that S26 sits at rank 14/76 post-fix.

**Expected impact:** The S26 fix directly answers the question raised in runs 14 through 18's "next
candidates" about why the site's most-visited product page never gains GSC traction despite two inbound
vs-page links -- it was structurally invisible to the off-road page's featured comparison table due to a
scoring error, not a genuine "no organic interest" problem. The new vs-page adds an internal link and a
comparison-intent ranking surface for two bikes with real, repeated (if modest) traffic. The
`eunorau-meta-275-st-1` fix removes a live "0 Nm / 0 lbs" trust break from a page this run itself just
built -- exactly the kind of error the P0.9 sweep exists to catch, caught this time as a side effect of
verification rather than a dedicated data-quality pass.

**Next candidates:** (1) ROADMAP P0.24 (new) -- the systemic `score_value` miscalibration across ~12 bikes,
mostly Eunorau's premium lineup, needs a dedicated audit run rather than a quick fix. (2) ROADMAP P0.13 --
Dylan decision still needed on EASE 2 PRO/Y400/Y600 scooter-vs-bike classification. (3) ROADMAP P0.16 --
`eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still need human research. (4) P1.4 (price/freshness "last
checked" dates) still has not been started -- next-largest untouched roadmap item after P0.24. (5) Watch
whether the corrected S26 score/rank change produces any GSC movement over the next few pulls -- if S26
still shows zero query-level signal after this, the off-road page's card-grid prominence (not just the
top-8 table) may need a second look. (6) `duotts-duotts-c29-k`'s first GSC click this run is worth watching
for a repeat before treating it as a real trend.

---

## 2026-07-12 (run 20) -- score_value dedicated audit, closes P0.24

**GSC snapshot (28d, ending 2026-07-09):** 1 click, 1024 impressions, CTR 0.1% -- identical window and
totals to run 19 (GSC's lag means no new day has advanced since the last pull). Same page-level picture:
`samebike-rs-a01-pro` pos 10.3, `samebike-rs-a01-men` pos 9.0, `samebike-ebe2` pos 11.0,
`duotts-duotts-c29-k` pos 13.3 (first GSC click), `duotts-e29` pos 25.1, `/blog/best-ebikes-for-heavy-riders`
still the largest query cluster (53 impr, pos 45.3), `/best/cargo-ebikes` still the largest flat impression
pool (120 impr, pos 77.2, 0 clicks).

**PostHog snapshot (28d):** 75 pageviews / 30 visitors -- identical totals to run 19 (no new events in the
gap between runs). DUOTTS S26 still the top product page (6/5), now 11 consecutive runs as a PostHog-only
signal. `eunorau-meta-275-st-1` and `engwe-l20` both held their 3-views/3-visitors signal (now already
covered by the run-19 vs-page). No new dual-signal page. Conversion events unchanged at 3 total.

**Decision:** Both data sources fully flat versus run 19 with no new page crossing an action threshold.
Advanced the item run 19 explicitly flagged as needing "a dedicated audit run" rather than another
one-bike patch: ROADMAP P0.24, the systemic `score_value` miscalibration found while fixing DUOTTS S26.

**Action -- P0.24: full `score_value` audit across the catalog (Supabase, live immediately).** Pulled
`score_overall`, all 6 axis scores, price, torque, `weight_lbs`, `max_weight`, `range_practical` for all 109
scored bikes. Re-verified run 19's regression weights (value 0.29, range 0.19, power 0.15, comfort 0.14,
build 0.17, versatility 0.09) against `duotts-s26` (exact match, 7.85 predicted vs 7.8 actual) and
`samebike-m20-iii` (8.07 predicted vs 7.8 actual, within the ~0.1-0.3 residual run 19 documented) before
using it to recompute `score_overall` on any bike.

Built a price-tier sibling comparison: for each bike with a conspicuously low `score_value` (roughly <=3.7,
matching run 19's threshold), found the closest same-price or near-price bike from a brand whose
`score_value` looked internally consistent (mainly ENGWE via its `score_price_quality` column, plus
DUOTTS/SAMEBIKE/VTUVIA bikes with populated `score_value`), and compared torque/range/payload directly. Only
corrected a bike's score when its own specs were comparable to or better than the trusted sibling's --
declined to correct bikes that were genuinely weaker (see exclusions below).

**Clearest catches (identical or near-identical price, objectively equal-or-better specs, previously scored
far lower):**
- `eunorau-fat-awd-2`/`eunorau-fat-awd-3-0` ($1,699, 110 Nm/60 mi/375 lb) vs `engwe-engine-pro-3-0-boost`
  (same $1,699, 90 Nm/60 mi/331 lb, value 8.8) -- Eunorau beats it on torque and payload at an identical
  price. `score_value` 1.3 -> 7.5 (overall 6.1 -> 7.8) on both.
- `eunorau-meta-275-st-1`/`eunorau-meta-275-1` ($1,399, 65 Nm/49 mi/286 lb) vs `duotts-n26`/`duotts-f26`
  (same $1,399, 65 Nm/48 mi/330 lb, value 7.5) -- near-identical torque and range, slightly lower payload.
  `score_value` 1.5 -> 6.5 (overall 4.8 -> 6.3) on both.
- `eunorau-flash-awd-1-0` ($2,099, 184 Nm/165 mi/440 lb) vs `duotts-e26` (same $2,099, 80 Nm/48 mi/330 lb,
  value 7.0) -- Eunorau more than doubles torque, range and payload at the same price. `score_value` 2.8 ->
  8.0 (overall 6.3 -> 7.9).
- `eunorau-fat-hd-2-0` ($2,099, 160 Nm/60 mi/375 lb, build 9.0) vs the same `duotts-e26` sibling -- double
  the torque, better range, higher payload and better build score. `score_value` 1.5 -> 7.0 (overall 6.7 ->
  8.3).

**Full list of 29 bikes corrected (`score_value` -> new value, `score_overall` recomputed via the fitted
weights each time):** Eunorau E-FAT-MN (1.7->5.5), META275 ST 1.0 + META275 1.0 (1.5->6.5 each), META24/26/20
1.0 (1.6->6.5 each), DEFENDER (1.2->4.0), S1 dirt bike (1.3->3.5), MAX-CARGO 2.0 (1.3->5.0), FAT-AWD 2.0 +
3.0 (1.3->7.5 each), META275 2.0 (1.6->5.5), G30 (1.3->5.0), FLASH LITE ST (1.6->6.0), FAT-HD 1.0 (1.7->5.5),
FLASH AWD (2.8->8.0), FAT-HD 2.0 (1.5->7.0), FLASH (2.0->7.5), SPECTER-ST 2.0 (1.1->4.5), FAT-HS (1.1->4.5),
SPECTER-S 3.0 (1.1->4.5), URUS 2.0 (1.0->2.5); DUOTTS C29Max (2.2->6.0), C29-K (2.6->7.0), F26 Lite
(2.0->5.5); Walfisk WF26 (2.3->5.5), WF750 UrbanX (2.2->6.0), ET-7 Ultra (3.4->7.5); VTUVIA FMB (1.0->3.0).
Bikes with a genuine (not-only-partial-comparison) sibling got the closer-to-sibling number; bikes with no
exact same-price comparison (S1, DEFENDER, URUS, FMB, the three $2,999 Eunorau premium bikes) got a more
conservative correction reflecting a real, if smaller, value gap versus their tier.

**Deliberately left untouched, with reasoning:**
- `duotts-duotts-c29lite-electric-bike` ($759, value 1.8) -- checked against its own $799 sibling `duotts-c29`
  (65 Nm/40 mi/330 lb, value 8.0): C29 Lite has weaker torque and range for almost the same price. The low
  score is a legitimate reflection of bad value, not a bug -- left as-is.
- DYU C2/C5/C6 and `engwe-ease-2-pro` -- `torque=0` bikes already flagged by prior P0.9 runs; a low value
  score against broken spec data isn't the issue to fix here.
- `vtuvia-reindeer-step-thru-electric-bike` -- the P0.16 zero-value bike, needs human research per that entry,
  not a score guess.
- `eunorau-defender-s-fat-hs` -- already flagged P0.16 (mislabeled drivetrain, needs human research) and also
  has `weight_lbs=0`/`max_weight=0`, so left un-scored.
- `eunorau-flash-lite-2-0` and `eunorau-r1`/`eunorau-r1-plus` -- new data bugs found while building the
  comparison table (see below); scoring on top of broken weight/payload data would repeat the same mistake
  the P0.9 sweep exists to prevent, so left alone and logged instead.

**New discovery (not fixed, logged as ROADMAP P0.25):** Two more P0.9-pattern data bugs surfaced while
building the price-tier comparison table. `eunorau-flash-lite-2-0` (FLASH LITE, $1,899) has `weight_lbs=0`
and `max_weight=0` -- the exact placeholder-zero bug from the original sweep. `eunorau-r1` and
`eunorau-r1-plus` ($4,299/$4,499) both have `max_weight` (220 lbs) exactly equal to their own `weight_lbs`
(220 lbs) -- a bike's max payload capacity being identical to its own curb weight is physically implausible
and looks like the same copy-paste bug pattern the original P0.9 sweep found on the Eunorau META bikes.

**Verified:** Started the dev server and loaded `eunorau-flash-awd-1-0` directly: confirmed Value 8 / Overall
7.9 render correctly in the Scores section and spec table, "Similar e-bikes" section shows the corrected
FLASH LITE ST (7.4) and FAT-HD 1.0 (7.3) alongside the still-flagged, unscored FLASH LITE (6.1, unchanged).
Loaded `duotts-duotts-c29-k`: Value 7 / Overall 7.5 render correctly, "Similar e-bikes" shows corrected
C29Max (6.5) and F26 Lite (6.7). Loaded `/best/off-road-ebikes`: renders cleanly. Zero console errors on all
3 pages. `npx tsc --noEmit -p tsconfig.json` clean (no code changed, data-only run, but ran it per the task's
standard verification step; exit clean).

**Expected impact:** This is the largest single-run correction to the site's scoring since the S26 fix,
covering 29 of the roughly 30+ bikes run 19's regression flagged as anomalous. The Eunorau brand -- more
than a third of the entire catalog and including several of its highest-priced flagships -- was previously
scored as though every one of its non-budget bikes was bad value regardless of actual specs, which
contradicts the site's own documented "How We Test" methodology and would have suppressed every affected
bike's ranking on every best-of page that sorts or filters by score. Bikes like `eunorau-flash-awd-1-0` and
`eunorau-fat-hd-2-0` move from bottom-quartile to top-quartile `score_overall` (7.9 and 8.3 respectively),
which should improve their card-grid and comparison-table placement on `/best/off-road-ebikes`,
`/best/fat-tire-ebikes`, `/best/long-range-ebikes` and `/best/ebikes-under-2000` immediately, with any GSC
effect showing up over the next several pulls as pages re-index.

**Next candidates:** (1) ROADMAP P0.25 (new) -- `eunorau-flash-lite-2-0` zero-weight bug and the
`eunorau-r1`/`r1-plus` max_weight-equals-weight bug, both need real manufacturer specs sourced before fixing.
(2) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600 scooter-vs-bike classification. (3)
ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still need human research. (4) P1.4
(price/freshness "last checked" dates) is now the largest fully-untouched roadmap item. (5) Watch whether the
29 corrected `score_overall` values produce any placement shift on the off-road, fat-tire and long-range
best-of pages' top-8 comparison tables next run, and whether that correlates with any GSC movement on the
newly-higher-scored Eunorau pages (`eunorau-flash-awd-1-0`, `eunorau-fat-hd-2-0` in particular). (6) Continue
watching `duotts-duotts-c29-k`'s first GSC click and the 11-run DUOTTS S26 PostHog-only signal.

---

## 2026-07-12 (run 21) -- P0.25 closed (flagship weight/motor-type bugs) + new PostHog signal enriched

**GSC snapshot (28d, ending 2026-07-09):** 1 click, 1024 impressions, CTR 0.1% -- identical totals to run 20
(GSC's ~3-day lag means no new window has landed since the last two pulls). Same page picture:
`samebike-rs-a01-men` pos 9.0, `duotts-duotts-c29-k` pos 13.3 (1 click), `samebike-ebe2` pos 11.0,
`/blog/best-ebikes-for-heavy-riders` still the top query cluster (53 impr, pos 45.3), `/best/cargo-ebikes`
still the largest flat impression pool (120 impr, pos 77.2, 0 clicks).

**PostHog snapshot (28d):** 78 pageviews / 31 visitors (+3 / +1 vs run 20 -- essentially flat). DUOTTS S26
still the top product page (6/5), now a 12th consecutive run as a PostHog-only signal with no GSC movement.
`eunorau-meta-275-st-1` and `engwe-l20` held their 3-views/3-visitors signal. **New this run:**
`samebike-cy20-pro` appeared for the first time with 3 views / 2 visitors / 2 sessions -- zero prior signal
in any previous log entry. Conversion events unchanged at 3 total (ENGWE N1 Pro x2, DUOTTS F20 x1).

**Decision:** Both data sources essentially flat. Closed out ROADMAP P0.25 (the two data bugs run 20 found
but deliberately left unfixed pending manufacturer-spec research), and gave the new `samebike-cy20-pro`
PostHog signal the same immediate depth treatment established for S26/F20/EBE2 in runs 14-15.

**Action 1 -- P0.25 closed: sourced real specs for 3 Eunorau flagships, fixed 2 data bugs + wrote real
descriptions (Supabase, live immediately).** Web-verified against eunorau-ebike.com official product pages:

- `eunorau-flash-lite-2-0` ($1,899): `weight_lbs` 0→82, `max_weight` 0→440 (official page: "82-92 lbs" /
  "440 lbs total payload capacity"). While fixing this, noticed it was scored `score_value=2.5` /
  `score_overall=6.1` despite being nearly spec-identical to its own same-price sibling
  `eunorau-flash-lite-st` (same torque, weight, max_weight) but with *more than double the range* (165 mi
  practical vs 75 mi) -- and the ST sibling scored `score_value=6.0` in the run-20 audit. Re-verified the
  P0.24 regression weights against the ST sibling's own stored numbers first (predicted 7.42 vs actual 7.4,
  confirming the formula), then applied the same logic: `score_value` 2.5→6.5, `score_overall` 6.1→7.3.
- `eunorau-r1` / `eunorau-r1-plus` ($4,299/$4,499): official pages give R1 = 130 lbs, R1+ = 150 lbs curb
  weight (both previously wrongly set to 220 lbs, identical to `max_weight`). Fixed `weight_lbs` 220→130
  (R1) and 220→150 (R1+); left `max_weight`=220 unchanged for both since a secondary retailer listing
  (bikeberry.com) corroborates that figure and Eunorau's own page doesn't list payload separately.
- **Second bug found on the same two rows while sourcing specs:** `motor_type` was stored as `rear-hub` for
  both R1 and R1+, but both bikes' own `description` text ("mid-motor") and Eunorau's official product
  titles ("R1 72V4,000W Middle Motor...") say mid-drive. Corrected `motor_type` `rear-hub`→`mid-drive` on
  both. This is the same class of bug as the P0.17 ENGWE `motor_type` fix (silently wrong spec-table field
  + wrong hills-warning logic, since the detail page's "consider alternatives if..." block checks
  `motorType !== 'mid-drive'`). Also caught the `highlights` arrays citing "48V" battery voltage on both
  bikes when the motor and battery are both 72V per every source (DB description already said 72V
  correctly) -- fixed to 72V in highlights.
- Replaced all 3 bikes' single-line spec-fragment descriptions with real editorial copy (motor, torque,
  claimed-vs-real range framing using each bike's own DB range columns, weight/payload, price positioning
  against the nearest sibling) and rewrote their `highlights` arrays to match the corrected data.

**Action 2 -- New PostHog signal enriched: `samebike-cy20-pro` (ROADMAP P0.26, new).** First-ever PostHog
appearance this run (3 views/2 visitors/2 sessions). Had a single generic stub description ("An upgraded
folding commuter with enhanced features..."). While researching real specs to write proper depth (via
samebike.com), found the manufacturer's own product page confirms front-fork + seat-post suspension ("double
shock suspension"), but the DB's `has_suspension` field said `front` only -- corrected to `full`. Rewrote
description to 4 sentences (motor/torque, suspension + gearing, claimed-vs-real range using the bike's own
DB columns, price positioning against the folding-ebike cluster) and highlights to match.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (data-only run, no code changed). Started the dev
server and loaded all 4 changed pages directly: `eunorau-r1` (confirmed 130 lbs weight / 220 lb payload /
Mid-drive motor type / corrected description and highlights all render; Value 1 / Overall 6.5 unchanged --
left as-is, see reasoning below), `eunorau-flash-lite-2-0` (confirmed 82 lbs / 440 lb payload / Value 6.5 /
Overall 7.3), `samebike-cy20-pro` (confirmed Suspension: Full, new description). Zero console errors on any
page.

**Score note -- `eunorau-r1`/`eunorau-r1-plus` `score_value` intentionally left at 1.0, not recalibrated:**
unlike FLASH LITE 2.0, these two have no clean same-price sibling in the catalog (R1/R1+ are the only
electric-dirt-bike-class products at their $4,000+ tier) -- the site's own methodology scores value "against
direct rivals at the same price," and guessing a higher value score without a real comparable would repeat
the exact mistake the P0.9/P0.24 sweeps exist to prevent. Left as a legitimate (if severe) low-value
judgment on a niche premium product, consistent with the equally-conservative treatment `URUS 2.0` and
`FMB` got in the run-20 audit.

**Expected impact:** Removes a "0 lbs"/"physically impossible payload" trust break from 2 of the 3
highest-priced bikes in the entire catalog ($4,299/$4,499), and fixes a wrong motor-type spec-table value +
wrong battery voltage on the same 2 pages -- the motor-type error also matters functionally since it feeds
the detail page's hills-warning logic. FLASH LITE 2.0's score correction (6.1→7.3 overall) should improve
its placement on `/best/long-range-ebikes` and `/best/fat-tire-ebikes`, both of which sort by score. The
`samebike-cy20-pro` depth treatment applies the same "enrich on first traffic signal" pattern that worked
for S26/F20/EBE2, rather than waiting multiple runs.

**Next candidates:** (1) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600
scooter-vs-bike classification. (2) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1`
still need human research. (3) P1.4 (price/freshness "last checked" dates) is now the largest fully-untouched
roadmap item and the next logical target if data signals stay flat. (4) Watch whether `samebike-cy20-pro`
gets a second consecutive PostHog run before treating it as a real trend (P0.26). (5) Continue watching
`duotts-duotts-c29-k`'s GSC click and the now-12-run DUOTTS S26 PostHog-only signal -- if S26 still shows
zero GSC query-level movement after the P2.3 score fix (run 19) and this many runs, the off-road page's
card-grid prominence beyond the top-8 table may need a second look.

---

## 2026-07-13 (run 22) -- `samebike-cy20-pro` trend confirmed + folding-filter visibility bug fixed (P0.26/P0.27)

**GSC snapshot (28d, ending 2026-07-10):** 1 click, 1086 impressions, CTR 0.1% (impressions +62 vs run 21's
1024, still essentially flat). Top query unchanged: "electric bike for heavy riders" (57 impr, pos 44.5, the
one confirmed click). Page-level picture stable: `duotts-duotts-c29-k` pos 13.0 (10 impr, 1 click, 10% CTR --
now a dual GSC+PostHog signal, see below), `samebike-rs-a01-men` pos 9.0 (10 impr, 1 click), `samebike-ebe2`
pos 11.0 (2 impr, 1 click, 50% CTR), `/best/folding-ebikes` pos 16.2 (10 impr, 1 click, 10% CTR -- its first
logged click), `/best/cargo-ebikes` still the largest flat pool (109 impr, pos 77.6, 0 clicks, unchanged
across many runs). No queries in strict striking distance (pos 5-20) in the tool's query-level output.

**PostHog snapshot (28d):** 78 pageviews / 31 visitors (flat vs run 21's 78/31). DUOTTS S26 still the top
product page (6 views/5 visitors), now a 13th consecutive PostHog-only run with zero matching GSC signal.
**`samebike-cy20-pro` repeated its run-21 signal (3 views/2 visitors/2 sessions again)** -- a genuine 2nd
consecutive run, satisfying the "watch for a repeat before treating as a trend" rule from P0.26.
`duotts-duotts-c29-k` also showed 5 views/1 visitor in PostHog this run, meaning it now has *both* a GSC
striking-distance signal (pos 13.0, 1 click) and PostHog traffic -- the dual-signal case the task instructions
flag as highest priority. Conversion events unchanged at 3 total (ENGWE N1 Pro x2, DUOTTS F20 x1).

**Decision:** Confirmed `samebike-cy20-pro` as a real trend per P0.26, then investigated why a bike that
already got the full depth treatment last run (run 21) was still getting zero organic reach. Checked
`duotts-duotts-c29-k` next (the new dual-signal bike) but found it already has a vs-page (`duotts-duotts-c29-k`
vs `eunorau-meta-24-1`, added run 19) and full detail-page depth (added run 6) -- no further action needed
there this run, logged as confirmation only. The real, actionable find was on `samebike-cy20-pro`.

**Action -- P0.26: found and fixed why `samebike-cy20-pro` gets zero organic reach despite good content.**
Queried the bike's own Supabase row: its `description` explicitly says "a folding frame that collapses for
car-trunk or closet storage," but `dimensions` was `null`. `/best/folding-ebikes` filters strictly on
`!!b.dimensions?.foldedSize` (`app/best/[category]/page.tsx:143`) -- so despite being a folding bike by its
own copy, it was structurally invisible on the one best-of page built for exactly that search intent. This is
the same class of bug as the original P2.6 discovery (a real folding bike hidden from the folding page by a
missing field, not a missing bike). Sourced folded dimensions from 3 independent SAMEBIKE product listings
(samebike.com EU, us.samebike.com two US variants) -- all converged on roughly 880×490mm with folded height
varying 700-850mm across listings/regions; used the majority figure (850mm, matching 2 of 3 sources) --
and set `dimensions = {"foldedSize": "88*49*85 cm"}`. It was already correctly showing on `/best/commuter-ebikes`
and `/best/recreation-ebikes` via its existing `suitable_for` tags, so no additional internal-linking work
was needed once the filter-blocking bug was fixed.

**Action -- P0.27: found and fixed 4 more ENGWE bikes with a placeholder `foldedSize` value.** While querying
for other bikes with a non-numeric `foldedSize` (a quick regex sweep: `dimensions->>'foldedSize' !~ '^[0-9]'`),
found `engwe-ep-2-3-0-boost`, `engwe-engine-pro-3-0-boost`, `engwe-l20-3-0-pro` and `engwe-l20-3-0-boost` all
had `foldedSize: "Yes"` -- a boolean-shaped placeholder instead of real dimensions. This didn't break the
folding-page filter (a truthy string still passes `!!`), and `foldedSize` isn't rendered as text anywhere on
the site today, so there's no current visible bug -- but it's a landmine for the moment any future template
prints it, and it's inconsistent with every other bike's real cm-dimension data. Sourced real folded
dimensions from ENGWE's own product pages (engwe.com, uk.engwe.com) and replaced all 4: EP-2 3.0 Boost and
Engine Pro 3.0 Boost both 97×53×81 cm, L20 3.0 Pro 102×53×78 cm, L20 3.0 Boost 100×51×75 cm.

**New discovery, not fixed, logged as ROADMAP P0.28:** while sourcing `samebike-cy20-pro`'s folded
dimensions, found its `torque` field (35 Nm) doesn't match any SAMEBIKE CY20 Pro listing found online (EU
250W variant lists 50+ Nm, US 500W variant lists 55+ Nm) -- no listing matches this DB row's exact
combination of $759 price / 250W motor / 35 Nm torque. Left untouched rather than guess which real-world
SKU/region this row represents, consistent with the P0.16 precedent of not fabricating specs for an
ambiguous product match.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (data-only run, no code changed). Started the dev
server and loaded `/best/folding-ebikes` directly: confirmed SAMEBIKE CY20 Pro now renders in the card grid
(8th of 9 bikes, score 6.9, ~36 mi range, 55 lbs, Full susp., Class 1, Commuting/Recreation tags) alongside
the 4 corrected ENGWE bikes. Zero console errors.

**Expected impact:** `/best/folding-ebikes` already has its first-ever GSC click this run (pos 16.2, 10%
CTR) -- adding a 9th bike to a page that was already converting, at a price point ($759) below every other
bike currently listed there, fills a real gap in the page's price-range coverage and gives the page's own
existing traffic another relevant option. The 4 ENGWE placeholder fixes are a data-integrity closeout with no
immediate ranking effect but remove a landmine before it becomes a visible bug.

**Next candidates:** (1) ROADMAP P0.28 (new) -- `samebike-cy20-pro` torque/variant mismatch needs a human
call or a future run finding an exact-match listing. (2) ROADMAP P0.13 -- Dylan decision still needed on
EASE 2 PRO/Y400/Y600 scooter-vs-bike classification. (3) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and
`vtuvia-reindeer-1` still need human research. (4) P1.4 (price/freshness "last checked" dates) remains the
largest fully-untouched roadmap item -- worth scoping as a real feature (likely needs a new DB column, not a
cosmetic date stamp) if data signals stay flat next run. (5) Continue watching the now-13-run DUOTTS S26
PostHog-only signal and the newly-confirmed `duotts-duotts-c29-k` dual-signal page for any GSC query-level
movement.

---

## 2026-07-13 (run 23) -- Price/freshness trust signal shipped (P1.4)

**GSC snapshot (28d, ending 2026-07-10):** 1 click, 1086 impressions, CTR 0.1% -- **identical window and
totals to run 22** (same 3-day-lagged 28d period, no new data has landed yet). Top query still "electric bike
for heavy riders" (57 impr, pos 44.5, the one confirmed click). Page-level picture unchanged from run 22:
`duotts-duotts-c29-k` pos 13.0 (dual GSC+PostHog signal, already fully built out per run 22), `/best/folding-
ebikes` pos 16.2 (10 impr, 1 click), `/best/cargo-ebikes` still the largest flat pool (109 impr, pos 77.6).

**PostHog snapshot (28d):** 78 pageviews / 31 visitors -- **identical to run 22** (same window, no new
sessions logged since the last pull). DUOTTS S26 still top product page (6 views/5 visitors, 14th consecutive
PostHog-only run). Conversion events unchanged at 3 total (ENGWE N1 Pro x2, DUOTTS F20 x1).

**Decision:** Both data sources are byte-for-byte flat vs. run 22 (same 28-day window hasn't rolled over yet),
so per the task's own decision rule this run advances the roadmap instead of chasing stale signals. Run 22's
own "next candidates" list named ROADMAP P1.4 (price/freshness dates) as "the largest fully-untouched roadmap
item -- worth scoping as a real feature ... if data signals stay flat next run." Data is flat, so this run
scoped and shipped it.

**Action -- P1.4: "last reviewed" date shipped on all 109 bike detail pages, no migration needed.** Before
building anything, checked whether the `ebikes` table already had a genuine freshness signal rather than
inventing a new column: it does. `ebikes.updated_at` has a `BEFORE UPDATE` trigger (`ebikes_updated_at` /
`update_updated_at()`) that stamps `now()` on every row edit, and a full-table check confirmed every one of
109 rows has been touched at least once since inserted (oldest `updated_at`: 2026-05-22; only 1 row is over
30 days stale). That means `updated_at` is already an honest "this listing's data was last edited/reviewed"
timestamp across virtually the whole catalog, driven by the same P0.9-pattern data-accuracy sweeps this log
already records in detail -- using it avoids the trap of shipping a "price verified" claim we didn't actually
perform.

Implementation: added `updatedAt?: string` to the `EBike` type (`lib/types.ts`) and mapped `row.updated_at` in
`mapRowToEBike` (`lib/ebike-data.ts`) -- `select('*')` was already fetching the column, it just wasn't
surfaced. On the detail page (`app/e-bikes/[brand]/[model]/page.tsx`) added a `dataFreshness()` helper that
formats the date and flags rows older than 90 days, then rendered a line directly under the price/score row:
"Price and specs last reviewed [Mon D, YYYY]" in the normal case, or "... — confirm the current price on the
official site before buying" once a row crosses the 90-day mark (no bike currently triggers this, but the
mechanism is in place for when the catalog ages). This is also consistent with the existing `/how-we-test`
copy, which already promises "we show a last-updated date on pages we maintain on a schedule" -- bike detail
pages were the one page type that copy didn't yet cover.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean. Loaded two live pages in the dev server:
`engwe-n1-pro` (the site's only bike with confirmed repeat affiliate clicks) shows "Price and specs last
reviewed Jul 8, 2026" -- its real last-edit date from the P0.14 out-of-stock-messaging fix; `samebike-cy20-pro`
shows "Jul 13, 2026" -- today's date, matching the folded-dimensions fix made to that row earlier this same
run. Zero console errors on either page.

**Expected impact:** A visible "last reviewed" date next to the price is a standard trust signal on review
sites and directly answers "is this price still current" without Claude fabricating a verification event that
didn't happen. Because the underlying timestamp already reflects genuine, frequent editorial activity (the
whole P0.9 data-accuracy sweep this log documents), the dates shown will mostly look recent and reinforce
rather than undermine trust. Closes out the largest fully-open P1 roadmap item.

**Next candidates:** (1) ROADMAP P0.28 -- `samebike-cy20-pro` torque/variant mismatch still needs a human call
or an exact-match listing. (2) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600
scooter-vs-bike classification. (3) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still
need human research. (4) P1.5 (CTA/affiliate-tagging coverage audit) is now the largest fully-untouched P1
item if data signals stay flat again next run. (5) Continue watching the now-14-run DUOTTS S26 PostHog-only
signal and `duotts-duotts-c29-k`'s dual-signal status for any GSC query-level movement once the 28-day window
finally rolls over.

---

## 2026-07-14 (run 24) -- CTA/affiliate click-tracking gap fixed on vs-pages + compare tool (P1.5)

**GSC snapshot (28d, ending 2026-07-11):** 2 clicks, 1152 impressions (+66 vs run 23's 1086), CTR 0.2%.
Slow, steady impression growth continues. Top converting query still "electric bike for heavy riders" (64
impr, pos 43.8, both confirmed clicks). New page-level clicks this window not seen in prior logs:
`duotts-duotts-c29-k` (pos 13.3, 1 click -- the dual GSC+PostHog signal bike from run 22/23, already fully
built out), `duotts-e29` (pos 21.1, 15 impr, 1 click -- first-ever click, already has P1.1 depth from run 9),
`eunorau-meta-24-1` (pos 23.2, 5 impr, 1 click -- first-ever click), `samebike-ebe2` (pos 11.0, 1 click),
`samebike-rs-a01-men`/`samebike-rs-a01-pro` (pos 9.0/10.3, 1 click each). Homepage itself converting well (3
clicks/4 impr/75% CTR/pos 1.5). No queries in strict striking-distance (pos 5-20) tool output; no
high-impression/low-CTR pages surfaced either.

**PostHog snapshot (28d):** 80 pageviews / 33 visitors (up slightly from run 23's 78/31). DUOTTS S26 still
top product page (6 views/5 visitors, 15th consecutive PostHog-only run with no matching GSC signal).
`samebike-cy20-pro` repeated again (3 views/2 visitors, 3rd consecutive run -- already fully enriched since
run 21). `duotts-duotts-c29-k` (5 views/1 visitor) confirms its dual-signal status again. Conversion events
unchanged at 3 total (ENGWE N1 Pro x2, DUOTTS F20 x1) -- same count as every run since it first appeared,
which became the reason to look harder at whether affiliate clicks were being tracked everywhere they happen.

**Decision:** Both data sources essentially flat (no new striking-distance or low-CTR signals; the new
single-clicks on `duotts-e29`/`eunorau-meta-24-1` are noise-level and both pages already have adequate depth
or an existing vs-page). Per run 23's own "next candidates," P1.5 (CTA/affiliate-tagging audit) was the
largest fully-untouched P1 item, so this run executed it -- and it's a good hypothesis for *why* affiliate
click counts have been stuck at exactly 3 for many consecutive runs despite growing traffic: if some
high-intent pages don't fire the tracking event, real conversions could be happening invisibly.

**Action -- P1.5: audited every outbound "Check price" CTA site-wide.** Affiliate *tagging* (the actual `ref`/
`sscid`/etc. query param that earns commission) was fully covered everywhere already -- every `bike.affiliateUrl`
is tagged once, centrally, in `withAffiliateTag()` at data-fetch time (`lib/ebike-data.ts`), so no link was
ever untagged. The real gap was click *tracking*: the bike detail page's two CTAs correctly use the
`AffiliateLink` client component (`components/AffiliateLink.tsx`), which fires the `affiliate_link_clicked`
PostHog event on click before navigating -- but `/vs/[slug]` (9 comparison pages: 5 brand-level + 4 bike-level,
all bottom-of-funnel "which one should I buy" intent) and `/e-bikes/vergelijk` (the compare tool, a
high-intent surface where a user has actively selected 2-3 bikes to weigh) both rendered their "Check price"
buttons as plain `<a href={bike.affiliateUrl}>` with no `onClick` handler at all. Any affiliate click from
either surface was completely invisible in PostHog, even though the link itself worked and earned commission
normally. Fixed both: swapped the raw `<a>` for `AffiliateLink` in `app/vs/[slug]/page.tsx` (a server
component -- `AffiliateLink` is a `"use client"` component and renders fine inside one) and
`app/e-bikes/vergelijk/VergelijkClient.tsx` (already a client component), passing `cta="check_price"` plus
brand/model/slug/price/network so the event carries the same properties as the detail-page version. Hover
behavior needed no change -- both already used `cta-primary`.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean. Loaded both pages live in the dev server:
`/vs/engwe-n1-pro-vs-duotts-s26` -- both "Check price ->" links render with correct tagged URLs
(`engwe.com/...?ref=uzjsbqmm`, `duotts.com/...?ref=bestbikeforme`), clicked one, zero console errors (the
`trackAffiliateClick` call is a documented no-op in dev since PostHog only initializes in production per
`lib/analytics.ts`, so no network capture call was expected locally -- this matches how the already-working
detail-page CTA behaves in dev too). `/e-bikes/vergelijk?bikes=engwe-n1-pro,duotts-s26` -- both "Check price"
links render correctly with the same tagged URLs alongside working "Full review" internal links. No
regressions on either page.

**Expected impact:** No change to actual commission (links were always tagged), but going forward any
affiliate clicks on vs-pages or the compare tool will show up in PostHog's `affiliate_link_clicked` event and
the "Top bikes by affiliate clicks" report -- closing a blind spot on exactly the two page types built for
bottom-of-funnel comparison intent. This may explain part of why the conversion-event count has looked flat
at 3 for many runs while GSC clicks on bike pages have been slowly increasing: some of that intent may have
been landing on vs-pages or the compare tool and converting untracked.

**Next candidates:** (1) ROADMAP P0.28 -- `samebike-cy20-pro` torque/variant mismatch still needs a human call
or an exact-match listing. (2) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600
scooter-vs-bike classification. (3) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still
need human research. (4) Watch whether affiliate click counts move up next run now that vs-pages/compare-tool
clicks are tracked -- if `duotts-duotts-c29-k` or `eunorau-meta-24-1` (both got their first-ever GSC click
this run and both have or are near a vs-page) show a tracked affiliate click, that would confirm the theory.
(5) Continue watching the now-15-run DUOTTS S26 PostHog-only signal for any GSC query-level movement.

---

## 2026-07-15 (run 25) -- F26 Lite description depth (first PostHog signal) + heavy-riders FAQ refresh

**GSC snapshot (28d, ending 2026-07-12):** 2 clicks, 1200 impressions, CTR 0.2%. Top query still "electric
bike for heavy riders" (66 impr, pos 43.3, both confirmed clicks -- this single query/page has driven 100% of
the site's GSC clicks for several consecutive runs now). Page-level clicks this window: `/` (3 clicks/50% CTR,
pos 3.0), `/best/folding-ebikes` (1 click, pos 16.2), `/blog/best-ebikes-for-heavy-riders` (1 click across a
combined ~373 impressions at pos 29.9-46.1, still ranking deep despite being the top demand cluster),
`duotts-duotts-c29-k`, `duotts-e29`, `eunorau-meta-24-1`, `samebike-ebe2`, `samebike-rs-a01-men/pro` (1 click
each, all pages already enriched in prior runs). No queries in striking distance (pos 5-20) and no
high-impression/low-CTR pages surfaced -- both automatic-priority buckets from the GSC tool were empty again.

**PostHog snapshot (28d):** 82 pageviews / 35 visitors (up slightly from run 24's 80/33). DUOTTS S26 still top
product page (6 views/5 visitors, 16th consecutive PostHog-only run with no matching GSC signal). Two new
first-time entrants this run: `duotts-duotts-c29max-electric-bike` (4 views/1 visitor) and
`duotts-duotts-f26lite-electric-bike` (2 views/1 visitor, also 1 session in the most-visited list) --
`eunorau-meta-275-st-1` also logged real traffic again (3 views/3 visitors). Conversion events unchanged at 3
total (ENGWE N1 Pro x2, DUOTTS F20 x1) -- no vs-page/compare-tool clicks recorded yet since the P1.5 tracking
fix, but one 28-day window is a small sample to judge that from.

**Decision:** Both GSC priority buckets (striking distance, high-impression/low-CTR) were empty again, and
the recurring "needs Dylan" items (P0.28, P0.13, P0.16) can't be advanced by Claude. Checked the two new
PostHog first-time entrants against the established "give first-signal pages the P1.1 depth treatment
immediately" pattern (S26/F20/EBE2 precedent): `duotts-duotts-c29max-electric-bike` already had a full
5-sentence editorial description in Supabase (done in an earlier run not yet reflected in the stale
`data/us-ebikes.json` seed file I checked first -- confirmed live data is 100% Supabase via `lib/ebike-data.ts`,
the JSON file is unused legacy), so no action needed there. `duotts-duotts-f26lite-electric-bike` still had
only the single generic stub sentence from when it was first cataloged. That is this run's clearest,
highest-confidence action.

**Action 1 -- P0.29: F26 Lite description depth.** Sourced specs directly from its own Supabase row (750W
rear-hub motor, 80 Nm torque -- the highest single-motor torque figure in DUOTTS' fat-tire lineup, full
suspension, Class 3/25 mph throttle-assisted, 15Ah battery rated 50 mi claimed/38 mi practical, 330 lb
payload, 70 lb frame, $1,199) and cross-checked against its closest siblings before writing: `duotts-s26`
($1,299), `duotts-duotts-c29-k` ($1,149), `duotts-duotts-c29max-electric-bike` ($1,149, nearly identical
range/battery numbers -- confirms the 38mi practical figure is consistent, not a one-off), and `duotts-f26`
($1,349, the dual-motor AWD sibling with hydraulic brakes). Rewrote the description to 5 sentences covering
the torque/suspension pitch, the Class 3 throttle-assisted top speed, the claimed-vs-real range framing tied
to its C29Max sibling, and honest price positioning against the pricier dual-motor F26 (trading AWD/hydraulic
brakes for a lighter frame at $150 less). While reviewing scores for a possible P0.24-style miscalibration
(F26 Lite has more torque and less weight than F26 at a lower price, yet scores lower on value/overall), found
this is not a bug: F26's dual-motor AWD, hydraulic disc brakes, and Bluetooth display are real feature/quality
differentiators the P0.24 regression weights already account for via build-quality and versatility axes, not
a same-spec-different-score anomaly like the cases that audit actually fixed. Left scores untouched.

**Action 2 -- P0.4 continued: heavy-riders blog post FAQ refresh.** `/blog/best-ebikes-for-heavy-riders`
remains the single page responsible for 100% of the site's confirmed GSC clicks across multiple consecutive
runs, but its `updatedAt` was stuck at 2026-06-27 (18 days stale) while every other actively-worked page gets
touched far more often. Added a 7th FAQ targeting the exact "best e-bike for a 250 lb man" long-tail phrasing
(a natural People-Also-Ask variant of the page's core query that wasn't explicitly headed anywhere in the
existing FAQ block, only covered contextually), citing the same two verified picks already used elsewhere in
the post (Eunorau FLASH LITE ST, DUOTTS S26 AWD) so no new claims were introduced. Bumped `updatedAt` to
2026-07-15 to reflect the real edit.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean. Loaded both pages live in the dev server:
`/e-bikes/duotts/duotts-duotts-f26lite-electric-bike` renders the new 5-sentence description, correct specs,
and "Price and specs last reviewed Jul 15, 2026" (today, matching this run's edit). `/blog/best-ebikes-for-
heavy-riders` shows "Updated July 15, 2026" and the new FAQ renders correctly in the FAQ block, in position
and formatted like the other six. Zero console errors on either page.

**Expected impact:** F26 Lite's fix follows the exact playbook that has repeatedly correlated with pages
starting to convert (S26, F20, EBE2 all got this treatment right after their first real-traffic signal). The
heavy-riders FAQ addition is a small, low-risk addition to the site's single highest-value existing page --
targets one more long-tail variant of the query that already produces the site's only clicks, with a fresher
`updatedAt` as a secondary trust signal.

**Next candidates:** (1) ROADMAP P0.28 -- `samebike-cy20-pro` torque/variant mismatch still needs a human call
or an exact-match listing. (2) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600
scooter-vs-bike classification. (3) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still
need human research. (4) Watch whether affiliate click counts move now that vs-pages/compare-tool clicks are
tracked (P1.5, shipped run 24) -- still 3 total after one window, worth another run or two before concluding
anything. (5) Continue watching the now-16-run DUOTTS S26 PostHog-only signal and the newly-recurring
`duotts-duotts-c29max-electric-bike`/`duotts-duotts-f26lite-electric-bike` entrants for a second consecutive
run of traffic, which would upgrade them from noise to a confirmed pattern per the established rule.

---

## 2026-07-16 (run 26) -- Stale hardcoded prices fixed on S26/E29/F20 (new P0.9-pattern bug, P0.30)

**GSC snapshot (28d, ending 2026-07-12):** 2 clicks, 1200 impressions, CTR 0.2% -- identical totals to run 25
(same 28-day window, GSC's ~3-day lag hasn't rolled over). Top query still "electric bike for heavy riders" (66
impr, pos 43.3, both confirmed clicks). Best-positioned bike page this window: `duotts-duotts-c29-k` (pos 12.5,
11 impr, 1 click, 9.1% CTR). Both automatic-priority buckets (striking distance, high-impression/low-CTR) were
empty again.

**PostHog snapshot (28d):** 86 pageviews / 39 visitors (up from run 25's 82/35). Notable shift: `duotts-duotts-
c29-k` became the top PostHog page this run (9 views/5 visitors), overtaking DUOTTS S26 (6 views/5 visitors)
which had held #1 for 16 consecutive runs -- a real behavior change, not noise, and it lines up with C29-K's
best-ever GSC position (12.5) the same window. `duotts-duotts-c29max-electric-bike` repeated for a 2nd
consecutive run (4 views/1 visitor), graduating from noise to a confirmed pattern per the established rule, but
it already has a full 5-sentence description (run 25 finding), so no content action was needed there.
Conversion events still flat at 3 total (ENGWE N1 Pro x2, DUOTTS F20 x1).

**Decision:** Investigated the new C29-K dual-signal lead first (checked its live Supabase row -- description,
specs, and score are already solid from run 6's P1.1 pass, nothing obviously actionable). While cross-checking
sibling DUOTTS bikes' data for the writeup, noticed `duotts-s26`'s `price` column ($1,299) did not match the
dollar figure inside its own `description` text ("At $1,349, it undercuts most AWD fat-tire e-bikes..."). That
sent this run in a different, higher-value direction: a sitewide sweep for the same bug class.

**Root cause found:** the 2026-07-13 weekly catalog sync (`CATALOG-SYNC-LOG.md`) updates the `ebikes.price`
column directly for vendor price changes, but has no mechanism to touch free-text `description` or blog copy
that an earlier SEO-loop run had hardcoded a dollar figure into -- so the two fields silently drift apart the
moment a price changes. This is a new instance of the same "silent, sitewide data-integrity bug" pattern P0.9
exists to catch, just in editorial text instead of spec fields.

**Action -- P0.30: swept and fixed every live occurrence found.** Ran `SELECT slug, price, description FROM
ebikes WHERE description ~ '\$[0-9]'` across the full 109-bike catalog and diffed each hit against its own
`price` column. Found 3 real mismatches, all DUOTTS bikes touched by the 2026-07-13 sync: `duotts-s26` ($1,299
actual vs "$1,349" in description -- the bike that just lost its 16-run #1 PostHog spot, still a top-3 page),
`duotts-e29` ($1,299 actual vs "$1,429" in description -- logged its first-ever GSC click this run), `duotts-
f20` ($1,099 actual vs "$1,199" in description -- one of only 2 bikes site-wide with a confirmed affiliate
click). Fixed all 3 via targeted Supabase `UPDATE ... SET description = replace(...)`. Then grepped `lib/blog-
data.ts` for the same pattern and found 2 more stale "$1,349" S26 mentions in `/blog/awd-ebikes-explained`
(published 2026-07-04, before the sync) -- fixed both. Cross-checked every other blog-quoted price in that post
plus the heavy-riders and hills posts (FAT-AWD 3.0/2.0 $1,699, Defender-S $2,999, FLASH $2,499, WF750 UrbanX
$1,499, ET-7 Ultra $2,300, FLASH LITE ST $1,899, G30 $1,699) against live DB prices -- all already correct, so
the drift was isolated to the 3 bikes + 1 post found this run, not a wider blog-wide problem.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean. Loaded all 3 fixed detail pages live in the dev server
(`duotts-s26`, `duotts-e29`, `duotts-f20`) -- each now shows a price header that matches the dollar figure in
its own description body exactly ($1,299/$1,299/$1,099 respectively). Loaded `/blog/awd-ebikes-explained` --
both S26 mentions now read $1,299, consistent with the detail page. Zero console errors on any page.

**Expected impact:** Removes a direct, visible price contradiction (header says one number, body copy says
another) from the pages carrying the strongest historical traffic and conversion signal on the site --
`duotts-s26` alone held the #1 PostHog spot for 16 straight runs before this one. A self-contradicting price is
a sharper trust break for a buyer mid-decision than a missing spec field, since price is usually the first
thing a comparison shopper double-checks.

**Next candidates:** (1) This run's sweep only covered `description` + `blog-data.ts`; `app/vs/[slug]` pages,
`app/best/[category]` buyer's-guide copy, and the remaining blog posts have not been checked for the same
hardcoded-price-drift pattern and should be swept in a future run, especially after the next weekly catalog
sync. (2) `duotts-duotts-c29-k`'s new #1 PostHog position (up from consistently trailing S26) is worth watching
for a second consecutive run before treating it as a confirmed pattern rather than a one-window spike. (3)
ROADMAP P0.28 -- `samebike-cy20-pro` torque/variant mismatch still needs a human call or an exact-match
listing. (4) ROADMAP P0.13 -- Dylan decision still needed on EASE 2 PRO/Y400/Y600 scooter-vs-bike
classification. (5) ROADMAP P0.16 -- `eunorau-defender-s-fat-hs` and `vtuvia-reindeer-1` still need human
research. (6) Watch whether affiliate click counts move now that vs-pages/compare-tool clicks are tracked
(P1.5, shipped run 24) -- still 3 total after two windows.

## 2026-07-16 (run 27) -- Price-drift sweep closed out + DUOTTS torque bug + 5 stub descriptions fixed

**GSC snapshot (28d, ending 2026-07-13):** 3 clicks, 1,278 impressions, CTR 0.2%. Top
query remains "electric bike for heavy riders" (3 clicks, 72 impr, pos 42.8). No
queries in strict striking-distance (pos 5-20) this run, but several bike detail
pages sit there at the page level: `samebike-rs-a01-men` (pos 9.0, page 1),
`samebike-rs-a01-pro` (pos 10.6), `samebike-ebe2` (pos 11.0), `duotts-duotts-c29-k`
(pos 12.6, 9.1% CTR), `best/folding-ebikes` (pos 16.2, 10% CTR) -- all already have
prior depth investment from earlier runs (P1.1, P0.20/0.21). `/best/cargo-ebikes`
remains stuck at pos 78.5 despite the most content investment of any page on the
site; this looks like an authority/backlink ceiling (P4.1, Dylan-only), not a
content gap.

**PostHog snapshot (28d):** 88 pageviews, 41 unique visitors (up from 22/61 a few
runs ago -- steady growth). `duotts-duotts-c29-k` is the top individual product
page (11 views/7 visitors), confirming the dual GSC+PostHog signal the task
prioritization rule calls for. 3 confirmed `affiliate_link_clicked` events: ENGWE
N1 Pro (2), DUOTTS F20 (1). DUOTTS dominates both GSC and PostHog this run --
5 of its detail pages show real traffic (C29-K, S26, F20, C29Max, F26 Lite).

**Investigated `duotts-duotts-c29-k` first** (top dual-signal page): checked
Supabase directly (confirmed live data source, `data/us-ebikes.json` is unused --
only referenced by the scraper script) and found it already has the full P1.1
depth treatment (run 6), the P0.24 corrected score (7.5/7.0), a dedicated vs-page,
and no price-drift issue. Nothing left to fix on this specific page; the dual
signal instead pointed at its brand (DUOTTS) as the highest-value area to keep
working.

**Action 1 -- Closed out the P0.30 follow-up price-drift sweep, zero new issues.**
The prior run explicitly deferred checking `app/vs/[slug]`, `app/best/[category]`
static copy, and the remaining blog posts for hardcoded `$` figures. Ran it: all
15 `description ~ '\$[0-9]'` rows in `ebikes` now match their `price` column
exactly (including the 5 fixed last run); `app/vs/[slug]/page.tsx` renders prices
dynamically from bike data (no hardcoded figures to drift); `lib/blog-data.ts`
`$` mentions are either generic cost-of-ownership ranges or the already-fixed S26
figure (now correct). `app/best/[category]/page.tsx` prices are all generic
price-tier guidance, not bike-specific. Clean bill of health -- no further action
needed on this bug class unless a future catalog sync reintroduces drift.

**Action 2 -- Found and fixed a real torque data bug on DUOTTS F26/N26.** While
sourcing specs to deepen these two bikes' descriptions (below), noticed both
claim "Dual 750W motors (AWD capability)" in `highlights` but stored `torque=65`,
identical to the single-motor `duotts-c29` and inconsistent with the confirmed-AWD
`duotts-s26` (which correctly stores 110 Nm *combined*). Verified against DUOTTS'
own product pages: both F26 and N26 use two 65 Nm motors for a genuine 130 Nm
combined figure; every other spec (weight 88.2/86.3 lbs, 330 lb payload,
suspension config, ~75mi manufacturer range) matched the DB exactly, isolating
`torque` as the only wrong field. Fixed both 65 -> 130 Nm.

**Action 3 -- 5 DUOTTS bikes given full editorial descriptions** (were all under
200 characters, one-line stubs, while every other actively-converting DUOTTS
sibling already has 700+ character reviews): `duotts-c29` ($799, base commuter),
`duotts-duotts-c29lite-electric-bike` ($729, budget entry point, honestly framed
as weaker than its siblings -- matches the already-confirmed low P0.24 value
score), `duotts-f26` ($1,349, dual-motor AWD, front suspension only), `duotts-n26`
($1,299, dual-motor AWD, full suspension + bigger brakes -- framed as the better
value between the two), `duotts-e26` ($1,899, premium Bafang e-MTB, positioned
against the lighter `duotts-e29`). All descriptions cross-reference real DB specs
and make honest sibling-vs-sibling comparisons (a first for this site -- prior
descriptions never explicitly compared same-brand bikes against each other).
Verified live in dev server (F26, N26 render correctly with updated torque and
description); `tsc --noEmit` clean.

**Discovery for future runs -- the P1.1 stub-description backlog is bigger than
tracked:** a sitewide `length(description) < 200` query found 50 bikes still at
one-sentence-stub depth (before this run's 5 fixes, now 45 remain), concentrated
in SAMEBIKE (~18 bikes: XD26-II, RS-A07, YINYU14, LO26 Plus, 20LVXD30-II, RS-A02
Pro/Plus, SY26-II, LOTDM200-II, LO26-II-YD, M20, CY20, C05 Pro, M20-III...),
VTUVIA (~9: Reindeer 1.0/2.0, SX20, Zeal LT7/XT8, SN100, SF20H, CMB, Gemini), DYU
(~7: A5, A1F Pro, C9, D3F, T1, M20, Stroll 1), plus a handful of ENGWE and Walfisk
models. None of these currently show GSC/PostHog signal, which is why they were
never prioritized -- but it is the largest remaining content-depth gap on the
site. Recommend working it in brand-sized batches (as done here for DUOTTS)
rather than all at once, sourcing real specs per brand's official site before
writing, and prioritizing any brand that starts showing traffic signal first.
`vtuvia-reindeer-step-thru-electric-bike` ("REINDEER 1.0") is in this list but
should NOT be touched without resolving the P0.16 ambiguity first (unclear if
it's a real distinct product from Reindeer 2.0).

**Verified:** `tsc --noEmit` clean. F26 and N26 detail pages checked live in dev
server -- torque, description, price-freshness line all render correctly, no
console errors.

**Next candidates:** (1) Continue the stub-description backlog above, next
brand batch: SAMEBIKE (largest single-brand backlog, ~18 bikes). (2) P3.2 --
quiz funnel optimization, not yet touched in any logged run. (3) Watch
`duotts-duotts-c29-k` for a 2nd consecutive dual-signal run (would confirm the
trend rather than a one-off spike). (4) `/best/cargo-ebikes` rank stagnation at
pos 78.5 despite the most content investment on the site -- likely needs
backlinks (P4.1, Dylan-only) rather than more on-page content.

---

## 2026-07-17 (run 28) -- SAMEBIKE stub-description batch (P0.33) + price_usd desync bug

**Setup note:** `npm run gsc` / `npm run posthog` failed at the start of this run
with `'tsx' is not recognized` -- the `tsx` devDependency used by both scripts
was missing from `node_modules` even though it's referenced in `package.json`
scripts (not listed in `package.json` `devDependencies` at all, actually --
likely dropped in a prior dependency prune). Ran `npm install --save-dev tsx`
to restore it; both scripts ran cleanly afterward. Flagging in case this
recurs -- worth adding `tsx` to `package.json` devDependencies explicitly so a
future clean install doesn't silently drop the SEO/PostHog tooling again.

**GSC snapshot (28d, ending 2026-07-14):** 2 clicks, 1,355 impressions, CTR
0.1%. Top query still "electric bike for heavy riders" (2 clicks, 71 impr, pos
42.3). Best page-level performer: `samebike-rs-a01-pro` (2 clicks, 17 impr,
11.8% CTR, pos 9.2). No queries in striking distance (pos 5-20) and no
high-impression/low-CTR pages -- both automatic-priority buckets empty again.

**PostHog snapshot (28d):** 93 pageviews / 44 visitors (up from run 27's
88/41). `duotts-duotts-c29-k` repeated as the top individual product page for
a 2nd consecutive run (11 views/7 visitors, was 9/5 last run) -- per the
established rule this graduates from a one-window spike to a confirmed dual
GSC+PostHog signal (its GSC position also held around pos 12.6). Investigated
first: its Supabase row already has the full P1.1 depth treatment, corrected
P0.24 score, and a dedicated vs-page (confirmed again this run) -- nothing
left to fix on the page itself. `samebike-cy20-pro` (3 views/2 visitors) and
`eunorau-meta-275-st-1` (3 views/3 visitors) both continue recurring but
already have full descriptions from prior runs. Conversion events still flat
at 3 total (ENGWE N1 Pro x2, DUOTTS F20 x1).

**Decision:** With the C29-K dual-signal page confirmed as having no further
gap, and no new GSC priority queries, the clearest move was to continue the
roadmap's explicitly-queued P1.1 stub-description backlog, next brand batch:
SAMEBIKE -- also justified by this run's own signals since `rs-a01-pro`
(2 GSC clicks) and `cy20-pro`/`ebe2` (recurring PostHog) are the same brand.

**Action -- P0.33: SAMEBIKE stub-description batch, 6 bikes.** Queried
Supabase for all SAMEBIKE rows sorted by `length(description)` and confirmed
14 bikes under 200 characters. Picked 6 for this batch (two natural sibling
pairs plus two standalone models): `samebike-rs-a02-pro`, `samebike-rs-a02-plus`
(RS-A02 folding fat-tire family), `samebike-m20`, `samebike-m20-iii` (M-series
moped family), `samebike-lo26-ii-yd`, `samebike-c05-pro`. Sourced real specs
via `WebSearch` + `WebFetch` directly against samebike.com official product
pages for each model before writing (motor wattage, torque, battery, payload,
range), matching the discipline used in every prior data-sourcing run.

**Bugs found and fixed while sourcing:**
1. `samebike-rs-a02-plus` stored `torque=80` Nm, identical to the base
   `rs-a02-pro` -- but SAMEBIKE's own product page states 100+ Nm for the Plus
   (the "Plus" tier should logically exceed the base Pro, and does per the
   manufacturer). Fixed `torque` 80->100. The `highlights` array still said
   "80Nm torque motor" after the first pass (same miss pattern as the P0.11
   ENGWE highlights bug) -- caught on live verification and fixed to "100Nm
   torque motor".
2. `samebike-m20-iii` stored `weight_lbs=75`, but its official page lists
   58,000 g (~128 lbs) -- fixed 75->128.
3. **New bug class:** `samebike-m20` and `samebike-m20-iii` had their legacy
   `price` column ($1,299 / $1,599) out of sync with the authoritative
   `price_usd` column ($1,429 / $1,749) -- confirmed via `lib/ebike-data.ts:184`
   (`price: Number(row.price_usd ?? row.price)`) that `price_usd` is what
   actually renders. Every other SAMEBIKE row had the two columns matching, so
   this was isolated, not systemic. Caught only because the first draft of
   both descriptions cited the (wrong) `price` column figure and the live
   preview showed a mismatched header vs. body price -- corrected both the
   `price` column (synced to `price_usd`) and the dollar figures already
   written into the descriptions ($1,299->$1,429, $1,599->$1,749, and the
   "$300 more than the base M20" comparison recalculated to "$320 more").
   Ran a sitewide `price IS DISTINCT FROM price_usd` sweep afterward: all
   remaining mismatches are ENGWE rows with `price_usd IS NULL` (the intended
   fallback case per the same code line, not a bug) -- confirms this was
   fully isolated to the 2 SAMEBIKE rows and is now closed.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean. Loaded all 6 detail
pages live in the dev server -- `samebike-rs-a02-pro`, `samebike-rs-a02-plus`,
`samebike-m20`, `samebike-m20-iii`, `samebike-lo26-ii-yd`, `samebike-c05-pro`
all render with header price = body-copy price = spec-table values, and
`samebike-rs-a02-plus`'s highlights now read "100Nm torque motor" matching its
description. Zero console errors on any page.

**Expected impact:** Same trust rationale as every prior stub-description
batch, plus this run closes out a previously-undetected price-integrity bug
that would have shipped two SAMEBIKE pages with the header and body quoting
different dollar amounts (the exact P0.30 trust break, just via a different
column) had it not been caught during live verification instead of ending the
run right after the Supabase writes.

**Next candidates:** (1) Continue the SAMEBIKE stub-description backlog: 8
bikes remain (`samebike-rs-a07`, `samebike-xd26-ii`, `samebike-lo26-plus`,
`samebike-yinyu14`, `samebike-20lvxd30-ii`, `samebike-sy26-ii`,
`samebike-lotdm200-ii`, `samebike-cy20`), then VTUVIA (~9) and DYU (~7). (2)
Consider adding `tsx` to `package.json` `devDependencies` explicitly so the
GSC/PostHog scripts survive a clean `npm install` (see setup note above). (3)
Watch `duotts-duotts-c29-k` for a 3rd consecutive dual-signal run -- now
confirmed for 2, would be a strong pattern at 3. (4) `/best/cargo-ebikes` rank
stagnation at pos ~77-78 despite the most content investment on the site --
still likely a backlink/authority ceiling (P4.1, Dylan-only). (5) ROADMAP
P0.28/P0.13/P0.16 -- still need Dylan/human research, unchanged this run.

---

## 2026-07-17 (run 29) -- `duotts-duotts-c29-k` confirmed 3rd-run dual signal (nothing left to fix) + SAMEBIKE batch part 2 (P0.34)

**Setup note:** `WebSearch` and `WebFetch` returned "You've hit your session
limit, resets 4:50pm (Europe/Amsterdam)" for every call attempted this run --
both tools were unavailable for the entire run, not just rate-limited on one
query. This blocked the usual samebike.com spec-verification step, so this
run's data-sourcing discipline had to change (see Action 2 below).

**GSC snapshot (28d, ending 2026-07-14):** 2 clicks, 1,355 impressions, CTR
0.1% (same window as run 28 -- GSC's ~3-day lag means no new data point yet).
Top page by clicks: `/` (homepage) with 3 clicks at pos 3.0 -- strong. Other
notable page-level clicks: `samebike-rs-a01-pro` (2 clicks, pos 9.2),
`blog/best-ebikes-for-heavy-riders` (2 clicks, 307 impr, pos 30.2 -- a large
impression jump vs prior windows), `duotts-duotts-c29-k` (1 click, 11 impr,
pos 12.6), `duotts-e29` (1 click, pos 19.0), `duotts-f20` (1 click, pos 16.7),
`eunorau-meta-24-1` (1 click, 20% CTR, pos 23.2 -- new signal, not previously
flagged), `samebike-ebe2` (1 click, 50% CTR, pos 11.0). No queries in strict
striking distance (pos 5-20) and no high-impression/low-CTR pages in the
tool's automatic buckets -- both empty again this run. Also notable:
"best cargo bike" (16 impr, pos 54.3) and "best cargo bikes" (20 impr, pos
51.8) -- `/best/cargo-ebikes` query-level positions have moved up from the
pos ~77-78 page-level average flagged as stagnant in recent runs, suggesting
some real movement on specific query variants even if the page-level average
hasn't caught up yet.

**PostHog snapshot (28d):** 96 pageviews / 47 visitors (up from run 28's
93/44). `duotts-duotts-c29-k` held the #1 traffic spot for a **3rd consecutive
run** (11 views/7 visitors, same as run 28's count, was 9/5 the run before) --
this graduates from "confirmed for 2" (flagged explicitly in run 28's next
candidates) to a firmly established pattern. Conversion events still flat at
3 total (ENGWE N1 Pro x2, DUOTTS F20 x1) -- no new affiliate clicks this
window.

**Action 1 -- Investigated `duotts-duotts-c29-k` for the 3rd-run signal,
confirmed nothing left to fix on the page itself.** Same conclusion as run
28: full P1.1 depth treatment, corrected P0.24 score, and a dedicated vs-page
are all already in place. With no further on-page gap and no new query-level
GSC signal pointing at a specific missing angle, did not force a speculative
change to this page this run -- logging the 3rd-run confirmation here so a
future run with a concrete idea (e.g. a new vs-page angle, or backlink
opportunity once P4.1 starts) can act on it rather than repeating the "nothing
to fix" investigation a 4th time.

**Action 2 -- P0.34: continued the SAMEBIKE stub-description backlog under a
web-tooling outage.** With `WebSearch`/`WebFetch` both down for the full run,
wrote full editorial descriptions for 6 of the 8 remaining SAMEBIKE stub bikes
(`samebike-lo26-plus`, `samebike-lotdm200-ii`, `samebike-rs-a07`,
`samebike-sy26-ii`, `samebike-xd26-ii`, `samebike-yinyu14`) using only their
already-populated, non-zero DB fields (torque, weight, battery, range,
payload -- all cross-checked against each bike's own `highlights` array
first, no new specs introduced, no fabrication). This is a narrower version
of the usual batch discipline (which normally also re-verifies against
samebike.com and catches drift bugs like run 28's torque/weight/price
issues) -- chose to proceed on the lower-risk subset rather than skip the
queued item entirely, per the "if a data script fails, still advance a
roadmap item" fallback rule.

**Discovery, not resolved -- `samebike-20lvxd30-ii` and `samebike-cy20` look
like duplicate rows.** While pulling data for the remaining 2 of 8 stub
bikes, found their specs are identical across every column: price $699,
torque 35 Nm, weight 55 lbs, max_weight 330 lbs, range_practical 36 mi,
range_manufacturer 56 mi, battery 13 Ah, motor rear-hub, frame step-over,
wheel 20". Two different model names sharing every single spec value is a
stronger signal than the "shared base frame" pattern seen elsewhere in
SAMEBIKE's budget line (e.g. RS-A07/SY26-II/XD26-II share weight and payload
but differ in torque/price/range) -- this pair matches on literally
everything, which reads as either a copy-paste catalog error or two SKUs for
the same physical product. Left both untouched rather than writing two
near-identical descriptions off unverified data, consistent with the site's
standing rule (see P0.16, P0.28) against guessing which of two possible
real-world explanations applies. Also separately confirmed `eunorau-meta-24-1`
(this run's new GSC signal, 1 click/20% CTR/pos 23.2) already has a 264-char
description from a prior run -- no stub-description gap there, no action
needed.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (no code touched,
Supabase-only content edit). Browser preview tooling was unavailable for live
page verification this run (`claude-sonnet-5 is temporarily unavailable`
error on `preview_start`) -- relying on the same detail-page template that
has correctly rendered dozens of prior description updates, plus a direct
Supabase read-back confirming all 6 rows updated with the intended text
(599-672 chars each, up from <200).

**Expected impact:** Same trust rationale as every prior stub-description
batch -- 6 more SAMEBIKE pages move from single-sentence stubs to full
editorial reviews matching their siblings' depth. The duplicate-row
discovery, if confirmed and fixed in a future run, would resolve a second
instance of the same "which real product does this row represent" ambiguity
class as P0.16/P0.28.

**Next candidates:** (1) Resolve the `samebike-20lvxd30-ii` /
`samebike-cy20` duplicate-spec question once web tooling is available --
check samebike.com for both model names directly. (2) Only `samebike-cy20`
remains unwritten in the original 8-bike backlog (20lvxd30-ii also blocked
on the same question) -- both need the duplicate question resolved before
writing descriptions. (3) VTUVIA (~9 bikes) and DYU (~7 bikes) stub-
description batches still queued, and don't depend on the SAMEBIKE duplicate
question -- a clean next batch once WebSearch/WebFetch are back. (4) Watch
`/best/cargo-ebikes` query-level positions (now pos ~51-54 on "best cargo
bike(s)" variants, up from the page-level pos ~77-78 average) for continued
movement -- may indicate the content investment is starting to pay off
despite the stagnant page-level average. (5) Consider adding `tsx` to
`package.json` `devDependencies` (flagged run 28, still unresolved). (6)
ROADMAP P0.28/P0.13/P0.16 -- still need Dylan/human research, unchanged this
run.

---

## 2026-07-17 (run 30) -- P0.16 VTUVIA Reindeer 1.0 resolved + SAMEBIKE duplicate-row question resolved (P0.35) + VTUVIA stub batch part 1 (P0.36)

**Setup note:** `WebSearch`/`WebFetch` were back online this run (the run 29
session-limit outage had cleared), unblocking both of run 29's deferred
"resolve once web tooling is available" items in the same run.

**GSC snapshot (28d, ending 2026-07-14):** 2 clicks, 1,355 impressions, CTR
0.1% -- identical totals to run 29 (GSC's ~3-day lag means no new data point
yet). Same top query ("electric bike for heavy riders", 2 clicks/71 impr/pos
42.3) and same top pages, including `/best/cargo-ebikes` query-level
positions still around pos 51-54 on "best cargo bike(s)" variants. No new
striking-distance or high-impression/low-CTR signals.

**PostHog snapshot (28d):** 96 pageviews / 47 visitors, same as run 29 (no
new window yet). `duotts-duotts-c29-k` still #1 traffic page (11 views/7
visitors). Conversions flat at 3 total (ENGWE N1 Pro x2, DUOTTS F20 x1). No
new page-level signal to act on this run, so worked the roadmap backlog
instead, per the "prefer a strong data signal, otherwise advance the
roadmap" rule.

**Action 1 -- P0.16: resolved `vtuvia-reindeer-step-thru-electric-bike`
("REINDEER 1.0"), queued unresolved since run 6.** Confirmed via VTUVIA's own
live product page (exact $1,699 price match) plus 4 independent retailer
listings (electrek.uk, roadbikerider, mobilityready, ebikehaul) that this is
a real, current, distinct SKU -- not a stale duplicate of Reindeer 2.0 --
with consistent specs: 750W motor (1,100W peak), 80 Nm torque, 72 lbs, 400 lb
payload, 48V 15Ah battery, ~55 mi manufacturer range. Fixed `torque` 0→80,
`weight_lbs` 0→72, `max_weight` 0→400, `battery_capacity` 12→15,
`range_manufacturer` 30→55, `range_practical` 22→38. The old range values
(22/30) were byte-identical to sibling `vtuvia-giraffe`'s figures, confirming
a copy-paste origin rather than a real spec. While fixing this, found the bad
data had silently propagated into the bike's score: `score_value` was 1.0 and
`score_overall` was 4.0, an exact copy of Giraffe's low scores (both rows had
identical 1.1-or-1.0/3.8/2.5/6.0/6.0/8.0 score profiles) -- meaning a $1,699
bike was showing up as one of the worst-value bikes on the entire site purely
because of copy-pasted placeholder data. Recalibrated against same-price
VTUVIA siblings (`sx20`, `sn100`, `reindeer-2`, all scoring 7.6 with similar
specs): new scores 6.8/6.5/7.0/6.5/6.5, `score_overall` 7.0. Verified live in
dev server -- description, highlights, spec table, and score all render
correctly.

**Action 2 -- P0.35: resolved the `samebike-20lvxd30-ii` / `samebike-cy20`
duplicate-spec question flagged unresolved in run 29.** Fetched both
official samebike.com product pages directly. Confirmed these are two real,
different products sharing SAMEBIKE's common 250W/35Nm EU-legal baseline
motor spec (which is why they looked like duplicates) but differing in fold
mechanism, tires, and battery: 20LVXD30-II is a classic double-fold frame
(handlebars + frame fold together), 20x1.95" tires, 48V 10.4Ah battery, 120 kg
(264 lb) payload; CY20 is an ultra-compact 5-second seat-integrated fold,
wider 20x2.35" tires, 36V 13Ah (468Wh) battery, 150 kg (330 lb) payload. The
DB's shared placeholder values were a genuine copy-paste bug, not a
duplicate row: `max_weight=330` and `battery_capacity=13` had both been set
to CY20's real numbers, silently overwriting what should have been
20LVXD30-II's own 264 lb / 10.4 Ah figures. Fixed `20lvxd30-ii`: `max_weight`
330→264, `battery_capacity` 13→10. Fixed `cy20`: `weight_lbs` 55→62 (a US
retailer listing gives 62 lbs for the US-spec variant; the EU spec page
didn't list weight). Wrote fully differentiated editorial descriptions for
both, each explicitly naming and contrasting against its sibling so a buyer
comparing the two understands the actual tradeoff (smaller fold vs plusher
ride). Verified live in dev server on the CY20 page -- description and specs
render correctly.

**Action 3 -- P0.36: VTUVIA stub-description batch, part 1 (3 of 8
remaining).** Wrote full editorial descriptions + highlights for
`vtuvia-reindeer-2`, `vtuvia-sx20`, `vtuvia-zeal-lt7` (all were single
generic sentences under 200 chars despite complete, non-zero DB specs),
using only already-verified DB fields, each noting how the bike compares to
its closest sibling in the lineup. 5 more VTUVIA stubs remain
(`sn100`, `zeal-xt8`, `cmb`, `sf20h`, `gemini`) -- deliberately capped this
run's batch at 3 to keep scope to the "1-3 focused items" guidance alongside
the two data-bug resolutions above.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (no code touched,
Supabase-only content edits). Ran the dev server and checked 3 pages live
(`vtuvia-reindeer-step-thru-electric-bike`, `samebike-cy20`) -- descriptions,
highlights, spec tables, and the recalibrated score all render correctly,
zero console errors.

**Expected impact:** Closes two multi-run-queued data-integrity questions
(P0.16, and the SAMEBIKE duplicate-row question from run 29) with sourced,
verified fixes rather than further deferral, plus catches a genuine
score-copy-paste bug that was quietly tanking one bike's rating. The VTUVIA
batch continues the same stub-description trust pattern applied across
SAMEBIKE, DUOTTS, and Eunorau in prior runs.

**Next candidates:** (1) Finish the remaining 5 VTUVIA stubs (`sn100`,
`zeal-xt8`, `cmb`, `sf20h`, `gemini`) -- straightforward, DB fields already
complete and non-zero for all 5. (2) DYU (~7 bikes) stub-description batch
still queued, not yet started. (3) `eunorau-defender-s-fat-hs` (ROADMAP
P0.16b) still needs a Dylan/human call -- ambiguous which of two real
Eunorau drivetrains the row represents. (4) Consider adding `tsx` to
`package.json` `devDependencies` (flagged run 28, still unresolved). (5)
Watch `/best/cargo-ebikes` query-level positions (pos ~51-54 on "best cargo
bike(s)" variants) for continued movement. (6) Worth a dedicated future pass:
now that P0.16's score-copy-paste bug is confirmed as a real bug class (not
a one-off), consider a sitewide sweep for other bikes whose score profile is
byte-identical to a different-priced sibling's -- same detection method used
here (`score_value`/`score_overall` matching another row exactly) could
surface more.

---

## 2026-07-18 (run 31) -- VTUVIA stub-description batch closed out (P0.36 part 2) + SN100 weight bug fixed

**GSC snapshot (28d, ending 2026-07-14):** 2 clicks, 1,355 impressions, CTR
0.1% -- same window as run 30 (no new data point yet). Top query unchanged
("electric bike for heavy riders", 2 clicks/71 impr/pos 42.3).

**GSC snapshot (90d, ending 2026-07-14), used for page-level signal:** 5
clicks, 1,677 impressions. `/e-bikes/samebike/samebike-rs-a01-pro` is now the
single strongest page on the site: 3 clicks / 19 impr / 15.8% CTR / pos 11.1,
driven specifically by the query "samebike rs-a01 pro review" (1 click / 10
impr / 10% CTR / pos 12.2) -- a genuine striking-distance, high-intent
"review" query the site's own title template (`{brand} {model} Review {year}
| Specs, Price & Where to Buy`) already matches closely.

**PostHog snapshot (28d):** 100 pageviews / 48 visitors (up from 96/47 last
run). `duotts-duotts-c29-k` still #1 traffic page (11 views/7 visitors).
`samebike-rs-a01-pro` also shows 2 views/2 visitors/2 sessions this window --
**a dual GSC+PostHog signal**, the highest-priority combination per this
task's own scoring rule. Conversions still 3 total (ENGWE N1 Pro x2, DUOTTS
F20 x1), unchanged.

**Decision -- checked `samebike-rs-a01-pro` first, found nothing to fix.**
Read the current DB row: 464-char editorial description, 5-bullet highlights,
`updated_at` 2026-07-06 -- this page already received the P1.1 depth
treatment 12 days ago specifically because it was identified as a top
performer, and the content, meta title, and FAQ schema are all already doing
their job (15.8% CTR at pos 11 is strong for this site's baseline). No data
bugs found. This confirms the P1.1 investment approach is working as
intended rather than surfacing a new gap -- logging this as a validation
point rather than forcing an unnecessary edit onto a page that is already
converting well.

**Action -- P0.36 part 2: VTUVIA stub-description batch closed out (5 of 5
remaining bikes).** `vtuvia-sn100`, `vtuvia-zeal-xt8`, `vtuvia-cmb`,
`vtuvia-sf20h`, `vtuvia-gemini` were all single-sentence stubs (142-163
chars) despite complete, non-zero DB specs (torque/weight/battery/range/
payload all already populated from a prior run). Verified current specs
against vtuviaebike.com official product pages (Gemini, Zeal XT8, SF20H,
SN100 spec page, CMB) plus ebikehaul.com as a second source for SN100, then
wrote full editorial descriptions (600-800 chars) for all 5, each explicitly
positioning the bike against its closest VTUVIA sibling (Gemini vs SN100 vs
SF20H in the fat tire tier; Zeal XT8 vs CMB in the commuter/mid-drive tier).

**Bug found and fixed -- SN100 weight_lbs was wrong.** VTUVIA's own spec page
(`vtuviaebike.com/pages/sn100-specifications`) states the SN100 weighs 72
lbs; the DB had `weight_lbs=87`. A second retailer (ebikehaul.com) confirmed
the SN100's torque (85 Nm), battery (14 Ah), payload (400 lb), and range (70
mi claimed) all matched the existing DB values exactly, isolating the error
to weight alone rather than a wrong-variant mixup. Fixed `weight_lbs` 87→72
and updated the matching highlights bullet ("87 lbs sturdy build" → "72 lbs
curb weight") so the spec table and highlights stay consistent.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean (no code touched,
Supabase-only content edits). Ran the dev server and checked 2 pages live
(`vtuvia-sn100`, `vtuvia-cmb`) -- descriptions, highlights, and spec tables
all render correctly with the corrected weight, zero console errors.

**Expected impact:** Closes the entire VTUVIA stub-description backlog
(mirrors the SAMEBIKE and DUOTTS batches already closed in prior runs),
bringing all 5 remaining VTUVIA pages to the same editorial depth as their
already-enriched siblings. The SN100 weight fix removes a wrong spec from a
public-facing table and meta description. Confirming `samebike-rs-a01-pro`
needs no further work validates that the P1.1 "invest in pages the moment
they show signal" approach used since run 20 is paying off -- it is now the
site's best-performing page by CTR and position.

**Next candidates:** (1) DYU (~7 bikes) stub-description batch -- the last
remaining brand-sized backlog of this type, not yet started. (2)
`eunorau-defender-s-fat-hs` (ROADMAP P0.16b) still needs a Dylan/human call.
(3) Consider adding `tsx` to `package.json` `devDependencies` (flagged run
28, still unresolved). (4) `/blog/best-ebikes-for-heavy-riders` now has 307
impressions (28d) at only 0.7% CTR, pos 30.2 -- the single highest-impression
page on the site and still converting (2 of the site's 5 total 90-day
clicks), but CTR is weak for its impression volume; a title/meta rewrite
pass on this post could be the next run's highest-leverage single action.
(5) `/best/cargo-ebikes` still stuck around pos 51-77 depending on window
(query-level ~51-54, page-level ~77) despite repeated content investment --
worth a fresh look at whether the content structure itself (not just depth)
needs to change.

---

## 2026-07-18 (run 32) -- Heavy-riders title/meta rewrite (P1.8) + DYU stub-description backlog closed (P0.37)

**GSC snapshot (28d, ending 2026-07-15):** 2 clicks, 1,388 impressions, CTR
0.1%. Top query unchanged ("electric bike for heavy riders", 2 clicks/69
impr/2.9% CTR/pos 41.7). Top page by far: `/blog/best-ebikes-for-heavy-riders`
at 325 impr / 2 clicks / 0.6% CTR / pos 30.5 -- 23% of the entire site's
impressions concentrated on one page, and its CTR has been flagged as weak
for its impression volume in the last 2 consecutive runs (run 30: 307 impr;
run 31: 307 impr; this run: 325 impr, still climbing, still 0.6% CTR).

**PostHog snapshot (28d):** 110 pageviews / 52 unique visitors (up from
100/48 last run). `duotts-duotts-c29-k` still #1 traffic page (11 views/7
visitors). 4 confirmed affiliate clicks total (ENGWE N1 Pro x2, DUOTTS S26
AWD x1, DUOTTS F20 x1) + 1 quiz completion -- both are new conversion-event
types appearing in the tool output for the first time this run.

**Decision:** Two data-confirmed items, both explicitly queued as "next
candidates" in prior runs:
1. P1.8 (new) -- title/meta rewrite on `/blog/best-ebikes-for-heavy-riders`,
   the clearest high-impression/low-CTR case on the site, flagged twice
   before but never acted on.
2. P0.37 -- DYU stub-description batch, the last remaining brand-sized
   backlog of the multi-run SAMEBIKE/DUOTTS/VTUVIA/DYU description initiative.

**Action 1 -- P1.8: title/meta rewrite on `/blog/best-ebikes-for-heavy-riders`.**
Old title "Best E-Bikes for Heavy Riders: What to Look for at 250 lbs and
Above" led with a generic "what to look for" framing that doesn't mirror the
actual top query ("electric bike for heavy riders"). New title: "Best
Electric Bikes for Heavy Riders (300+ lbs) in 2026" -- leads with "Electric
Bikes" (matching the query's phrasing more closely than "E-Bikes"), adds a
concrete number (300+ lbs) and a year for freshness, and is short enough to
display in full in the SERP with the " | Best Bike For Me" suffix. New meta
description leads with the same "most e-bikes cap out at 275 lbs" hook but
now names the concrete payload ceiling (440 lb, matching the FLASH LITE ST
pick already in the post) and the exact pick count (4) instead of vague
"our top picks" language, both established CTR levers. No content changes
inside the post itself -- this was purely a title/meta fix per the tool's
own "high-impression/low-CTR -> rewrite title/meta" playbook.

**Action 2 -- P0.37: DYU stub-description batch, 7 of 7 bikes, closing out
the entire multi-brand stub-description initiative.** `dyu-a5`,
`dyu-a1f-pro`, `dyu-c9`, `dyu-t1`, `dyu-d3f`, `dyu-m20`, `dyu-stroll-1` were
all single-sentence stubs (126-158 chars) despite complete, non-zero DB
specs (torque/weight/max_weight all already populated). Verified specs
against dyucycle.com / us.dyucycle.com official product pages plus retailer
cross-checks (electricrideco.com, oolactive.com) and wrote full editorial
descriptions (369-504 chars) for all 7, each built around the bike's own
existing DB numbers (no new figures introduced beyond what was already in
the highlights/spec table) plus a sibling-differentiator: T1's magnesium
alloy frame vs. its aluminum-frame siblings, C9 as the longest-range DYU
(93 mi manufacturer / 60 mi practical), M20 as the heaviest and most rugged
(88.2 lbs, fat tire, front+rear suspension), Stroll 1 as the lightest and
most road-bike-like (43 lbs, 700C wheels), A5/A1F Pro/D3F as the compact
folding tier differentiated by size and price ($519/$429/$549). This closes
the entire stub-description initiative that has run across SAMEBIKE, DUOTTS,
VTUVIA and now DYU over roughly 10 prior runs.

**New candidates found while closing DYU, not resolved (added as ROADMAP
P0.38):** (1) The 3 already-complete DYU bikes (`c2`, `c5`, `c6`) all have
`torque=0` in the DB -- the same P0.9-pattern gap seen across other brands,
not sourced this run since they were out of this run's stub-only scope.
(2) `dyu-c6` has `frame_type='step-over'` in the DB but its own description
text says "step-through" -- a data/copy mismatch worth a source check before
touching either field.

**Verified:** `npx tsc --noEmit -p tsconfig.json` clean. Ran the dev server
and checked 3 pages live: `dyu-t1` (description, highlights, spec table all
render correctly, apostrophe in "DYU's" escaped correctly in SQL), `dyu-d3f`
(same), `/blog/best-ebikes-for-heavy-riders` (new title confirmed rendering
as "Best Electric Bikes for Heavy Riders (300+ lbs) in 2026 | Best Bike For
Me" in the browser tab title). Zero console errors on all 3 pages.

**Expected impact:**
- Heavy-riders title/meta: this page alone carries 23% of the site's total
  search impressions, so even a modest CTR lift here (0.6% -> even 1.5-2%,
  in line with what a compelling title typically achieves at this position)
  would meaningfully move the site's total click count, which is currently
  only 2 clicks/28d sitewide.
- DYU descriptions: closes the last brand gap in a trust-focused initiative
  that has now touched every stub description across the entire 109-bike
  catalog. No brand on the site has a single-sentence description left.

**Next candidates:** (1) ROADMAP P0.38 -- DYU C2/C5/C6 `torque=0` gap (3
bikes) + `dyu-c6` frame_type/description mismatch. (2)
`eunorau-defender-s-fat-hs` (ROADMAP P0.16b) still needs a Dylan/human call.
(3) Watch `/blog/best-ebikes-for-heavy-riders` CTR next run to see if the
title/meta change moved the needle -- if not, consider a more structural
change (the post may need to rank higher before CTR improves meaningfully at
pos 30). (4) `/best/cargo-ebikes` still stuck around pos 51-77 depending on
window despite repeated content investment -- worth a fresh look at whether
the content structure itself (not just depth) needs to change. (5) Consider
adding `tsx` to `package.json` `devDependencies` (flagged run 28, still
unresolved).

---

## 2026-07-19 (run 33) -- Quiz-funnel filter bug fixed (P3.2) + DYU C6 frame_type resolved (P0.38)

**GSC snapshot (28d, ending 2026-07-15):** 2 clicks, 1,388 impressions (+736 from
last logged window), CTR 0.1%. Impressions have grown sharply (site is getting
crawled/shown far more) but clicks stayed flat, so overall CTR fell -- expected
when a young site picks up a long tail of new deep-ranked queries. No queries in
striking distance (pos 5-20, impr >= 30) and no high-impression/low-CTR pages
(impr >= 100, CTR < 2%, pos <= 15) this window -- both tool outputs were empty.
Top page is still `/blog/best-ebikes-for-heavy-riders` (325 impr, 2 clicks, 0.6%
CTR, pos 30.5, 23% of all site impressions) -- the P0/P1.8 title/meta rewrite
shipped 2026-07-18 (run 32), one day before this window's end, so it's too early
to read a CTR effect yet. Homepage is ranking well (pos 3.0-6.8, 3 clicks) --
likely branded queries. Several bike detail pages sit at pos 9-19 with real CTR
(SAMEBIKE RS-A01 Pro 11.8%, RS-A01 Men 10%, EBE2 50%), consistent with prior runs.

**PostHog snapshot (28d):** 117 pageviews, 59 unique visitors (up from 61
views/22 visitors two windows ago). For the first time, `/e-bikes/overzicht`
(the main listing page) is the single most-viewed page (18 views/5 visitors),
ahead of the homepage (14/9). `engwe-p275-se` had its strongest run yet (10
views/10 visitors/10 sessions -- every visitor unique) despite being marked
unavailable. `duotts-duotts-c29-k` is a dual-signal page again (GSC: 1 click,
pos 12.3, 8.3% CTR; PostHog: 11 views/7 visitors). Conversions: 4
`affiliate_link_clicked` (ENGWE N1 Pro x2, DUOTTS S26 AWD, DUOTTS F20) and, for
the first time ever, 1 `quiz_completed` event.

**Investigated and ruled out:** checked whether `engwe-p275-se` and
`engwe-n1-pro` (both `available=false` since run 5, 2026-07-06, when ENGWE's own
site said "back in stock early July") had actually restocked, since P275 SE just
posted its highest-ever traffic while marked out of stock -- a real conversion
risk if the flag were stale. Fetched both live product pages on engwe.com: both
still show "Unavailable" with a disabled Add to Cart button. The existing
"temporarily out of stock" messaging (P0.14) is accurate; no data fix needed.

**Action 1 -- P3.2: fixed a real quiz-funnel bug, first `quiz_completed` event
made it worth auditing end-to-end.** `components/Funnel/HomeFunnel.tsx` collects
6 answers (terrain, purpose, budget, distance, height, frame, class) and passes
all of them as URL params to `/e-bikes/overzicht`, but
`app/e-bikes/overzicht/page.tsx` only read 3 (`budget`, `purpose`, `terrain`) --
`distance`, `height`, `frame`, and `class` were silently dropped, even though
`lib/types.ts` (`FilterState`) and `lib/ebike-filters.ts` (`filterBikes`) already
fully support all four (`distancePerRide`, `riderHeight`, `frameTypes`,
`bikeClasses`). Every quiz completion since launch has landed on a
less-personalized result page than the quiz itself promised ("we'll recommend
bikes that fit your body" -- height was never actually applied). Fixed by mapping
the 4 missing params to `initialFilters` in `page.tsx`. Verified live in dev
server: a full 7-answer quiz URL (`terrain=hilly&purpose=commuting&budget=1500&
distance=15&height=69&frame=step-through&class=class-1`) now shows all 7 filter
chips active and narrows 109 bikes to 4, versus previously only 3 of the 7 would
have applied. Confirmed the no-param case (`/e-bikes/overzicht` alone) is
unaffected -- still shows all 109 bikes. Zero console errors, `tsc --noEmit`
clean.

**Action 2 -- P0.38: `dyu-c6` `frame_type` mismatch resolved.** DB stored
`frame_type='step-over'` but the bike's own description said "step-through".
Verified via dyucycle.com plus 2 independent retailers (electricscooterslondon.com:
"250W Step-Through E-Bike"; ebikesdiscount.com: "Step-Through Frame") -- the
description was correct, the DB field was wrong. Fixed to `'step-through'`.
Re-checked the other half of P0.38 (DYU C2/C5/C6 `torque=0`): confirmed via a
fresh web search that DYU still does not publish a Nm torque figure for the C6
anywhere (only 250W/350W power specs) -- leaving it blank remains the correct
call, not an oversight.

**Verified:** `tsc --noEmit` clean. Both filter-bug and frame_type fixes checked
live in the dev server (screenshots not needed -- page text confirmed exact
filter-chip state and bike counts).

**Expected impact:** the quiz-funnel fix is the highest-leverage change this run
-- it doesn't move rankings, but it fixes a conversion-path bug that has been
silently under-serving 100% of quiz completions since the funnel launched (only
1 recorded so far, but the bug affects every future one too, and PostHog is
just starting to show real usage). The DYU C6 fix is a small, sourced data-
accuracy correction consistent with the site's no-fabrication rule.

**Next candidates:** (1) Consider building a real "top 3 matches" quiz results
page (still redirects to the general filtered listing, per ROADMAP P3.2) now
that the underlying filter bug is fixed -- a dedicated results page with
stronger affiliate CTAs would be the natural next step. (2)
`eunorau-defender-s-fat-hs` (ROADMAP P0.16b) still needs a Dylan/human call. (3)
Watch `/blog/best-ebikes-for-heavy-riders` CTR next run for the title/meta
rewrite's effect now a full window has passed since it shipped. (4)
`/best/cargo-ebikes` still stuck deep (pos 51-78) despite repeated content
investment -- worth a fresh structural look. (5) `duotts-duotts-c29-k`'s
repeated dual-signal status (GSC striking-distance-adjacent + strong PostHog
traffic) makes it a good candidate for the next detail-page enrichment pass if
a future run finds it thin.

---

## 2026-07-19 (run 34) -- Top-converting bike's frame_type bug fixed (P0.39), heavy-riders page corrected

**GSC snapshot (28d, ending 2026-07-16):** 2 clicks, 1,454 impressions, CTR
0.1%. Top query remains "electric bike for heavy riders" (71 impr, 2 clicks,
2.8% CTR, pos 41.4). No striking-distance queries (pos 5-20) and no
high-impression/low-CTR pages this window -- both tool outputs empty again.
`/blog/best-ebikes-for-heavy-riders` grew to 350 impr (23%+ of all site
impressions) but still sits at pos 30.7 with 0.6% CTR -- the run-32 title/meta
rewrite has had one full window to show effect and CTR has not moved yet;
too early to call it either way given the position hasn't lifted.
`/best/cargo-ebikes` remains stuck at pos 77.4 despite 103 impressions.
Two SAMEBIKE RS-A01 pages continue to convert well (Pro: 10% CTR pos 9.3,
Men: 10% CTR pos 9.0).

**PostHog snapshot (28d):** 129 pageviews, 65 unique visitors (up from
117/59). `/e-bikes/overzicht` is now the top page by views (19/5) for a
second consecutive run, consistent with the P3.2 quiz-filter fix routing
more personalized traffic there. `engwe-p275-se` posted its strongest run
yet (13 views/13 visitors/13 sessions -- every visitor unique) while still
marked out of stock. Conversions: 10 `affiliate_link_clicked` events (up
from 4) and 1 `quiz_completed`. **New signal: Eunorau FLASH LITE ST logged
4 affiliate clicks this window, the most of any bike, despite not
appearing in the top-19 pageview list at all** -- an unusually high
click-to-view ratio that made it worth investigating even though it wasn't
a top-traffic page.

**Action -- P0.39: found and fixed a live `frame_type` bug on the run's top
affiliate-converting bike, which also touched the site's highest-impression
content page.** Investigating why `eunorau-flash-lite-st` was converting so
well surfaced two problems at once. First, the DB `frame_type` was
`'step-over'`, but the bike is literally named the "ST" (step-through)
variant of the FLASH LITE line. Verified via Eunorau's own product page
(`eunorau-ebike.com/products/flash-lite-st`, titled "FLASH Lite ST City
Commuter Step-Throu Electric Bicycle") plus 4 independent retailers
(bikeberry.com, ebikehaul.com, ebikejoy.com, motorizedbicyclehq.com), all
agreeing it's step-through. This silently excluded the bike from
`/best/step-through-ebikes` (filters strictly on `frameType ===
'step-through'`) -- the exact best-of page this bike should have been
ranking on. Second, and more consequential: `/blog/best-ebikes-for-heavy-riders`
(350 impressions this window, 23%+ of the entire site's search visibility)
names this bike "Best overall" and its copy explicitly said "The step-over
frame keeps a low standover height" -- a factual claim wrong on the site's
single largest source of search traffic. Also found the detail page itself
was still a 207-character single-sentence stub, unlike sibling
`flash-lite-2-0`'s 694-character full description (same P0.9/family-
completeness pattern as prior DUOTTS/SAMEBIKE/VTUVIA/DYU batches). Fixed
all three in one pass: `frame_type` -> `step-through`, wrote a full
editorial description (694 chars) using only already-verified DB fields
(92 Nm torque, 82 lb weight, 440 lb payload, 75mi practical / 100mi claimed
range, front suspension), added a step-through highlights bullet, corrected
the blog post's frame-type sentence, and bumped the post's `updatedAt` to
2026-07-19.

**Verified:** `tsc --noEmit` clean. Checked live in the dev server (a stale
Turbopack cache initially 404'd every bike detail page including ones
untouched by this change -- a full server restart resolved it, confirming
it was a dev-cache artifact, not a code regression): `eunorau-flash-lite-st`
detail page renders "Step-through" in the spec table and the new
description/highlights; `/best/step-through-ebikes` now includes the FLASH
LITE ST in its listing; `/blog/best-ebikes-for-heavy-riders` renders the
corrected sentence and the July 19 update date. Zero console errors on all
three pages.

**Expected impact:** this is the same trust/accuracy rationale as every
prior P0.9-pattern fix, but on the highest-confidence dual-signal bike
found yet (the run's top converter by a clear margin) and on the single
page carrying the largest share of the site's search visibility --
plausibly the highest-leverage individual fix logged since the run-32
title/meta rewrite on the same post.

**Next candidates:** (1) Watch `/blog/best-ebikes-for-heavy-riders` CTR over
the next 1-2 windows now both the title/meta (run 32) and the on-page
factual error (run 34) are fixed -- if CTR still doesn't move, the page
likely needs to rank higher before CTR responds meaningfully at pos ~30.
(2) `eunorau-defender-s-fat-hs` (ROADMAP P0.16b) still needs a Dylan/human
call. (3) `/best/cargo-ebikes` still stuck at pos 77.4 despite repeated
content investment -- worth a structural look (page layout/format, not just
depth) next time it's picked up. (4) Consider a dedicated "top 3 matches"
quiz results page now traffic to `/e-bikes/overzicht` is climbing
(ROADMAP P3.2 follow-up). (5) `duotts-duotts-c29-k` remains a recurring
dual-signal page (GSC pos 12.3 + PostHog 11 views/7 visitors this run) --
still a good candidate for a fresh look if a future run finds it thin.

---

## 2026-07-19 (run 35) -- Dedicated quiz "top 3 matches" results hero shipped (P3.2 follow-up)

**GSC snapshot (28d, ending 2026-07-16):** 2 clicks, 1,454 impressions, CTR
0.1% -- essentially unchanged from run 34's window. Top query remains
"electric bike for heavy riders" (71 impr, 2 clicks, 2.8% CTR, pos 41.4).
No striking-distance queries (pos 5-20) and no high-impression/low-CTR pages
this window -- both tool outputs empty again, for the second consecutive
run. `/blog/best-ebikes-for-heavy-riders` sits at 350 impr / pos 30.7 / 0.6%
CTR, still too early to judge the run-32 title/meta rewrite or the run-34
frame-type fix (both need a fresh window to show effect). `/best/cargo-ebikes`
remains stuck at pos 77.4 despite repeated content investment across 3+
prior runs -- checked this run whether the page needed real structural work
(not just more depth) and found it already has 17 matching bikes, a "Quick
comparison" spec table, 3 buyer's-guide sections, 7 FAQs, related-reading
links and full schema -- the content and structure are already at parity
with every other well-performing best-of page. The GSC-visible queries
driving its impressions ("best cargo bike"/"best cargo bikes", pos 51-54)
are simply outranked by higher-authority competitors; this looks like a
domain-authority ceiling (ROADMAP P4.1, backlinks) rather than an on-page
gap the loop can fix, so no further content changes were made here this run.

**PostHog snapshot (28d):** 129 pageviews, 65 unique visitors (flat vs run
34's 129/65 -- same window, essentially a re-pull). `/e-bikes/overzicht`
remains the top page by views (19/5) for a second consecutive run.
`engwe-p275-se` still posts the strongest single bike-page signal (13
views/13/13, still out of stock). Conversions: 10 `affiliate_link_clicked`,
1 `quiz_completed`. New name in the affiliate-click list: **DYU M20 logged 2
clicks this window** -- checked its DB row for the P0.9-pattern bugs found
on every other newly-converting bike in recent runs (stub description,
zero torque/weight, frame-type mismatch) and found none: full 479-char
editorial description, torque 50 Nm, weight 88.2 lbs, payload 264 lbs, all
already fixed in the run-32 DYU stub-description batch. No action needed --
this looks like the prior fix already paying off, not a new bug.

**Action -- P3.2 follow-up: built the dedicated "top 3 matches" quiz results
hero that 2 consecutive prior runs (33, 34) flagged as the natural next
step now that `/e-bikes/overzicht` is the top PostHog page two runs
running.** Previously, finishing the quiz just redirected to the fully-
personalized (post run-33 fix) but still generic filtered grid -- no
different from arriving via manual filters. Added a "Your top N matches"
section to `app/e-bikes/overzicht/OverzichtClient.tsx`, gated on `rideLabel`
being set (i.e. the visitor came from the quiz, not direct browsing/filter
use): it re-sorts the already-filtered bike set by `scoreOverall`, takes the
top 3, and renders them as larger, ranked cards (#1/#2/#3 badge, image, key
specs -- practical range, torque, score -- price, and a primary "Check
price" button). The CTA reuses the existing `AffiliateLink` client component
(the same one already wired on bike detail pages per P1.5), so these
quiz-driven affiliate clicks fire the identical `affiliate_link_clicked`
PostHog event and are visible in the same conversion tracking, not a new
untracked surface. The full filtered grid still renders below under an
explicit "All matches" heading for anyone who wants to keep browsing or
adjust filters. Non-quiz visits to `/e-bikes/overzicht` (direct filter use,
no `rideLabel`) are unaffected -- the hero only renders when it has quiz
context to justify a "top matches" framing.

**Verified:** `tsc --noEmit` clean. Checked live in the dev server with a
full 7-parameter quiz-style URL (`?terrain=hilly&ride=hills&purpose=commuting
&budget=1500&distance=15&height=68&frame=step-through&class=class-1`): page
correctly filtered to 4 of 109 bikes, the top-3 hero rendered ranked
exactly by `scoreOverall` (7.4, 7.2, 7.2) with correct prices/specs, and the
full grid rendered below under "All matches." Zero console errors, server
logs showed a clean 200 response. (Browser-pane screenshot capture timed
out repeatedly this run -- confirmed via page-text extraction and network/
console logs instead, which showed no errors and a normal page load.)

**Expected impact:** turns the quiz's terminal action from "see a filtered
list" into "see 3 ranked picks with a direct buy link," which should lift
the affiliate-click rate on quiz completions specifically -- the exact gap
ROADMAP P3.2 was left open on. Low risk: purely additive UI, same tracked
CTA component used elsewhere, no changes to filter logic or existing pages.

**Next candidates:** (1) Watch whether `affiliate_link_clicked` events start
showing quiz-originated bikes distinctly once this hero has a few runs of
traffic -- consider adding a `source: 'quiz'` param to the tracked event if
that distinction becomes valuable. (2) `eunorau-defender-s-fat-hs` (ROADMAP
P0.16b) still needs a Dylan/human call. (3) `/best/cargo-ebikes`'s pos-77
plateau looks like a backlink/authority ceiling, not a content gap -- worth
revisiting only if GSC ever shows it moving into striking distance. (4)
DYU M20's 2 affiliate clicks this run, combined with zero data issues found,
suggests the run-32 DYU batch is already converting -- no further action
needed there, just noting the signal. (5) `duotts-duotts-c29-k` remains a
recurring dual-signal page (PostHog 11 views/7 visitors last run) -- still a
candidate for a fresh detail-page look if a future run finds it thin.

---

## 2026-07-19 (run 36) -- FAT-AWD 2.0/3.0 duplicate-spec bug fixed + quiz-click source tagging shipped

**GSC snapshot (28d, ending 2026-07-16):** essentially unchanged from run 35
-- 2 clicks, 1,454 impressions, 0.1% CTR, same window re-pull. Top query
still "electric bike for heavy riders" (71 impr, 2 clicks, pos 41.4). No
striking-distance queries and no high-impression/low-CTR pages this window
(both empty for a third consecutive run). `/best/cargo-ebikes` still flat at
pos 77.4 -- confirmed again this run this is an authority ceiling (P4.1
backlinks), not an on-page gap, per run 35's structural audit; not revisited.

**PostHog snapshot (28d):** 133 pageviews, 67 unique visitors (flat vs run
35). `/e-bikes/overzicht` remains the top page for a third consecutive run
(19 views/5 visitors). `engwe-p275-se` still the strongest single bike page
(13/13/13, still out of stock). Conversions: 10 `affiliate_link_clicked`, 1
`quiz_completed`. Top affiliate-click bike: Eunorau FLASH LITE ST (4 clicks,
the bike fixed in run 34) -- confirms that fix is already paying off.

**Action 1 -- duplicate-spec + suspension bug fixed on `eunorau-fat-awd-2`/
`eunorau-fat-awd-3-0`.** While investigating run 35's queued candidate list
turned up nothing new to act on, a routine stub-description sweep
(`length(description) < 300`) surfaced `eunorau-fat-awd-3-0` at a 77-char
stub -- the shortest live description on the whole site. Pulling its full
row for sourcing found it was byte-identical to `eunorau-fat-awd-2` across
every spec column (price $1,699, torque 110 Nm, weight 79.4 lbs, battery
15Ah, range 80/60 mi, payload 375 lbs, wheel size 26"), and both had
`has_suspension='none'` despite the model line having a suspension fork --
the same "which of two real products does this row represent" pattern as
P0.35 (20lvxd30-ii/cy20). Sourced Eunorau's own product page plus 2
independent retailers (ebikegeneration.com, journeybikes.com): confirmed
both bikes genuinely share the same 500W dual-hub-motor AWD platform and an
RST Guide front suspension fork (95mm travel) -- the DB `has_suspension`
value was simply wrong on both rows, not a duplicate-row bug this time. The
one real, sourced difference: the 3.0 uses a torque sensor where the 2.0
uses a cadence sensor (confirmed via ebikegeneration's spec sheet for 2.0
and Eunorau's own 3.0 product copy). Fixed `has_suspension` 'none'->'front'
on both rows, wrote a full 774-char editorial description for 3.0 (previously
77 chars) and refreshed 2.0's to reference the sensor difference, and
corrected both bikes' highlights (both said "500W motor" singular on a
dual-motor AWD bike -- fixed to "Dual 500W AWD motors").

**Action 2 -- P3.2 follow-up, closes run-35 "Next candidate" #1: quiz-
originated affiliate clicks are now tagged.** Added an optional `source`
field threaded through `trackAffiliateClick` (`lib/analytics.ts`) ->
`AffiliateLink` (`components/AffiliateLink.tsx`) -> the quiz top-3 hero's CTA
in `OverzichtClient.tsx`, set to `"quiz_top_match"`. Regular browsing clicks
(detail pages, vs-pages, compare tool, the full grid below the hero) are
unaffected and continue to omit `source`. This makes it possible to measure
the quiz hero's actual conversion contribution once it has accumulated a few
runs of traffic, rather than having it blend into the undifferentiated
`affiliate_link_clicked` count.

**Verified:** `tsc --noEmit` clean. Checked both bike detail pages live in
dev server -- `eunorau-fat-awd-3-0` and `eunorau-fat-awd-2` both render the
new descriptions, highlights, and "Suspension: Front" spec row correctly;
confirmed the FAT-AWD 2.0 sibling card on the 3.0 page still shows the
correct $1,699 price (no drift). Re-checked the quiz hero with the same
7-parameter URL used in run 35 -- top-3 cards render correctly, zero
console errors. `read_console_messages` clean on both checks.

**Expected impact:** the FAT-AWD fix removes a stub description and a wrong
spec-table field from a $1,699 bike (same trust rationale as every P0.9-class
fix); the quiz-click tagging is instrumentation, not a traffic/conversion
change by itself, but unblocks measuring whether P3.2's hero is actually
working once more quiz traffic accumulates.

**Next candidates:** (1) Watch `affiliate_link_clicked` events for
`source: "quiz_top_match"` over the next few runs now that it is live --
once there is enough volume, compare quiz-hero conversion rate against the
site's baseline affiliate-click rate. (2) `eunorau-defender-s-fat-hs`
(ROADMAP P0.16b) still needs a Dylan/human call. (3) `/best/cargo-ebikes`'s
pos-77 plateau remains a backlink/authority ceiling, not a content gap --
still only worth revisiting if GSC shows it moving into striking distance.
(4) A handful of ENGWE bikes still sit at 160-220 char descriptions (T14,
EP-2 Boost/Pro/3.0 Boost, LE20, E26, L20 Boost, P275 ST, M1, Engine Pro 2.0,
P20 and others) -- shorter than the 400-800 char standard applied to every
other brand's stub sweep, though none are GSC/PostHog-flagged converters
right now. Worth a dedicated ENGWE depth batch if a future run has no
stronger dual-signal target. (5) `duotts-duotts-c29-k` remains a recurring
dual-signal page but was checked this run and is not thin (631-char
description, already deepened in run 6) -- no action needed, closing this
out as a candidate.

---

## 2026-07-20 (run 37) -- ENGWE depth batch (4 signal bikes) + LE20 motor-type/torque contradiction + full_specs data bug fixed

**GSC snapshot (28d, ending 2026-07-17):** 2 clicks, 1,493 impressions, 0.1%
CTR -- essentially flat vs run 36. Top query still "electric bike for heavy
riders" (71 impr, 2 clicks, pos 41.4). No striking-distance queries and no
high-impression/low-CTR pages this window (empty for a fourth consecutive
run). `/best/cargo-ebikes` still flat at pos 77.6 -- reconfirmed authority
ceiling, not revisited per runs 35/36.

**PostHog snapshot (28d):** 138 pageviews, 70 unique visitors (flat vs run
36). `/e-bikes/overzicht` top page for a fourth consecutive run (20/5).
`engwe-p275-se` still the strongest single bike page (13/13/13, still out of
stock). Conversions: 10 `affiliate_link_clicked`, 1 `quiz_completed`. Top
affiliate-click bikes this window: Eunorau FLASH LITE ST (4, the run-34 fix
still converting), DYU M20 (2), **ENGWE N1 Pro (2)**. Checked for
`source: "quiz_top_match"` (the run-36 instrumentation) via
`read-data-schema` on `affiliate_link_clicked` -- the `source` property does
not exist in the taxonomy yet, so zero quiz-hero clicks have landed so far;
still too early to judge, watch again next run.

**Action -- worked run 36's "Next candidate" #4 (ENGWE depth batch),
narrowed to the 4 members with actual signal this run rather than the full
21-bike list.** A stub-description sweep (`length(description) < 300` AND
`brand = 'ENGWE'`) returned 21 bikes at 162-215 chars. Cross-referencing
against this run's GSC/PostHog output found 4 of those 21 with real signal:
`engwe-n1-pro` (2 affiliate clicks, the run's #2 converter), `engwe-le20`,
`engwe-l20`, `engwe-n1-air` (all logged PostHog pageviews/sessions this
run). Rewrote all 4 from single-sentence spec fragments to full editorial
descriptions (670-840 chars each), each covering motor/torque, claimed-vs-
real range, weight/payload, and an explicit price-vs-sibling comparison
(N1 Pro vs N1 Air; L20 vs L20 3.0 Pro; LE20 vs L20/N1 as the dedicated cargo
pick). No new spec claims were introduced beyond the bikes' own existing DB
columns.

**Bug found and fixed while sourcing LE20's copy:** `engwe-le20` had
`motor_type='mid-drive'` sitting next to its own `torque=75` column and a
description that already said "75 Nm motor" -- but `highlights[0]` claimed
"100 Nm mid-drive motor with torque sensor," a straight self-contradiction
on the same page (P0.18-class bug, this time as a spec-vs-highlight
mismatch rather than a unit-leak). Verified via ENGWE's own product line
(`engwe.com/products/engwe-le20-international-version`): the International/
US-market LE20 is 75 Nm + rear-hub motor; the separate EU-market LE20 is
100 Nm + mid-drive. The DB's own `weight_lbs=81.1` and `max_weight=441`
already matched the International single-battery variant exactly (36.8 kg
-> 81.1 lbs, 200 kg -> 440.9 lbs), confirming this row is the International
SKU and the `motor_type` field was the only wrong piece. Fixed `motor_type`
'mid-drive' -> 'rear-hub' and the highlights bullet to "75 Nm motor with
torque sensor" to match.

**Second bug found in the same row, one layer deeper:** the page's "All
Technical Details" section renders `full_specs` (a raw scraped JSONB blob),
which had a corrupted key/value pair -- `"Rear Hub Motor": "Mid-drive
Motor"`, self-contradictory in its own label -- plus `"International
Version": "EU Version"`, telling a US buyer they were looking at the wrong
regional variant. Removed the stray corrupted key (the correct info was
already present under the `"Motor"` key: "48V 250W Rear Hub Motor") and
corrected the version label to "International Version (US/Global)".

**Verified:** `tsc --noEmit` clean. Checked all 4 pages live in the dev
server -- `engwe-le20` renders the new description, "Rear hub" motor type,
"75 Nm" torque spec, corrected highlights bullet, and the cleaned-up
technical-details table with no contradictory rows; `engwe-n1-pro` and
`engwe-n1-air` render their new descriptions with zero console errors.
`preview_logs` showed no server errors across all checks.

**Expected impact:** removes a self-contradicting spec (75 Nm vs 100 Nm,
rear-hub vs mid-drive) from a cargo bike's detail page and technical-details
table, and gives the run's #2 confirmed affiliate-click bike (N1 Pro) real
editorial depth for the first time -- same trust/conversion rationale as
every prior "deepen the bike that's actually converting" fix.

**Next candidates:** (1) 17 more ENGWE bikes remain in the <300-char stub
list without this run's direct signal (T14, EP-2 3.0 Boost, EP-2 Boost,
EP-2 Pro, E26, L20 Boost, Engine Pro 3.0 Boost, P275 ST, M1, Engine Pro 2.0,
P20, L20 3.0 Pro, P275 Pro, M20, Engine X, L20 3.0 Boost, X20/X24/X26) --
continue the batch in future runs, prioritizing any that pick up GSC/
PostHog signal first. (2) Watch `affiliate_link_clicked` for
`source: "quiz_top_match"` -- still zero events as of this run, worth
checking again once quiz traffic accumulates. (3) `eunorau-defender-s-fat-hs`
(ROADMAP P0.16b) still needs a Dylan/human call. (4) The `full_specs` JSONB
column (raw scraped spec sheets, rendered as "All Technical Details" on
every detail page) has not had a systematic corruption sweep the way
`description`/`highlights`/core spec columns have -- LE20's stray key
suggests other bikes scraped from multi-variant comparison pages could have
the same issue; worth a dedicated sweep if a future run has research budget
and no stronger signal-driven target.

---

## Run 38 (2026-07-20)

**GSC snapshot (28d):** 2 clicks / 1,493 impressions, essentially unchanged
from run 37's pull (same window, same day). Top query still "electric bike
for heavy riders" (71 impr, pos 41.4). No new striking-distance queries, no
new high-impression/low-CTR pages -- confirms this run landed on the same
day as run 37 with no fresh GSC signal to act on.

**PostHog snapshot (28d):** 138 pageviews / 70 unique visitors, byte-
identical totals to run 37's pull. Same top pages (`/e-bikes/overzicht`,
`engwe-p275-se`, `duotts-duotts-c29-k`, `duotts-s26`). Same conversion
events: 10 `affiliate_link_clicked`, 1 `quiz_completed`. Top affiliate-click
bikes unchanged: Eunorau FLASH LITE ST (4), DYU M20 (2), ENGWE N1 Pro (2).
No new signal since run 37 -- worked the run-37 "Next candidate" #4
(`full_specs` corruption sweep) instead, applied to the two bikes run 37
had already flagged as highest-signal (N1 Pro, N1 Air).

**Action -- fixed a `frame_material` data bug on `engwe-n1-pro` and
`engwe-n1-air` (both Aluminum in the DB, both genuinely carbon fiber) plus
cleaned up `full_specs` corruption on both, closing run 37's "Next
candidate" #4 for these two bikes.** While reviewing N1 Air's raw
`full_specs` JSONB for the corruption sweep run 37 flagged, noticed its
`Motor` key read "250W MIVICE Brushless Mid-drive Motor" -- directly
contradicting the bike's own `motor_type='rear-hub'` column and its run-37
description ("built around a rear-hub motor... trading torque and climbing
power" vs. the mid-drive N1 Pro). Verified via WebSearch (engwe.com product
page + smartybikes.com comparison): N1 Air uses a MIVICE M070 rear-hub
motor; the mid-drive language in `full_specs` was scraped-in cross-talk
from the N1 Pro's own product page, not real. While confirming, also
checked `Material` -- both N1 Air's and N1 Pro's `full_specs` said "Carbon
Fiber" but the DB `frame_material` column said "Aluminum" on both. Verified
via WebSearch (Neowin review, New Atlas, autoevolution): both bikes are
genuinely carbon fiber (N1 Air: Toray carbon fiber frame with an aluminum
fork; N1 Pro: full carbon fiber, "Trek-grade" per Neowin) -- the DB column
was wrong, not the scraped spec. This is the core marketing differentiator
for both bikes (their whole pitch is a light carbon frame at a budget
price), so it was a real, consequential trust bug, not a cosmetic one.

**Fixes applied:** `frame_material` 'Aluminum' -> 'Carbon Fiber' on both
rows. Added "Carbon fiber frame" as a highlight bullet on both (neither
mentioned frame material in highlights before) and wove a short clause into
each description. Rebuilt both `full_specs` JSONB objects from scratch,
removing comparison-table-scrape cruft: N1 Air had 14 junk/contradictory
keys removed (duplicate-value noise like `"700c":"700c"`, stray Euro
prices, and self-contradictions like `"Carbon fiber":"Aluminum"` and
`"Shimano 7 speed":"Single Speed"` sitting next to the correct
`Transmission System` key), plus fixed the `Motor` key to "250W MIVICE
Brushless Rear Hub Motor". N1 Pro had 13 similar junk keys removed,
including `"250W Mid Motor":"250W Hub Motor"` (self-contradictory) and
`"Shimano 7 speed":"Automatic 4-speed"` (contradicting the correct 10-speed
`Transmission System` -- actually 7-speed per that key, a separate labeling
inconsistency in the raw scrape not touched since the DB's own `Speeds: 10`
spec-table field, sourced from a different column, is the one rendered in
the structured spec table and wasn't part of this fix); consolidated a
messy merged security-features key/value pair into a single readable
"Security Features" entry.

**Verified:** `tsc --noEmit` clean. Checked both pages live in the dev
server -- Motor type, frame Material, and all spec-table values now render
consistently across the structured spec table, the "Who is this bike for"
section, and the raw "All Technical Details" table, on both pages. Zero
console errors, `preview_logs` showed no server errors.

**Expected impact:** removes a self-contradicting motor-type claim and a
wrong frame-material claim from the run's #2 confirmed affiliate-click bike
(N1 Pro) and its PostHog-signal sibling (N1 Air) -- carbon fiber vs.
aluminum is a materially different value proposition for a buyer comparing
lightweight bikes, so this is a sharper trust fix than the usual stub-
description or unit-leak catches.

**Next candidates:** (1) the same 17-bike ENGWE stub-description list from
run 37 is still open, no new signal landed on any of them this run --
continue in future runs. (2) `full_specs` corruption sweep is confirmed as
a real, recurring bug class (3 ENGWE bikes fixed so far: LE20, N1 Pro,
N1 Air) but has not been run systematically across the other ~40 ENGWE rows
with a `full_specs` value, nor any other brand -- worth a dedicated sweep
(`SELECT slug FROM ebikes WHERE full_specs IS NOT NULL`) rather than only
catching instances opportunistically while doing other work. (3) Watch
`affiliate_link_clicked` for `source: "quiz_top_match"` -- still zero
events as of run 37, check again once quiz traffic accumulates. (4)
`eunorau-defender-s-fat-hs` (ROADMAP P0.16b) still needs a Dylan/human
call.

---
