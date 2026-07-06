# BestBikeForMe — Prioritized Build-Out Roadmap

> Created 2026-06-27. Grounded in the live site state and Google Search Console data.
> Legend: 🤖 Claude can do it · 👤 Dylan must do it · 🤝 together.

## Where the site stands today

- **Catalog:** 109 e-bikes across 7 brands (Engwe, Eunorau, Walfiske, DUOTTS, SAMEBIKE, DYU, VTUVIA). Scores and images are complete, but ~35 bikes (mostly Eunorau, plus a few DYU/SAMEBIKE/VTUVIA) still have placeholder spec-sheet descriptions and zero/missing torque or weight values — see P0.9.
- **Pages:** homepage, e-bikes overview + filters, quiz, compare, 7 best-of categories, ~20 state pages, 3 vs-pages, blog (11 posts), store locator (22 stores), legal pages.
- **Infra:** GSC integration + autonomous SEO loop (every 5h), multi-network affiliate tagging, Supabase, Vercel.
- **The real bottleneck:** traffic and authority. GSC shows ~526 impressions / 3 clicks per 28 days, everything ranking deep (pos 44-72). The structure is largely built; what is missing is *reasons for Google to rank us and for users to trust and click*.

**Guiding principle:** for a new affiliate site with good structure but no traffic, do not build more features. Build traffic, trust, and revenue coverage, in that order.

---

## P0 — Traffic foundation (do first, highest ROI)

The fastest path from 0 to meaningful organic traffic.

| # | Step | Owner | Why it matters |
|---|------|-------|----------------|
| 0.1 | **Verify indexation in GSC**: submit `sitemap.ts` output, check Pages > Coverage for excluded/noindex URLs, request indexing on key pages | 👤 (5 min) | Nothing else matters if pages are not indexed. Confirm the 100+ URLs are actually in the index. |
| 0.2 | ✅ **E-E-A-T pages** (done 2026-06-27): `/about` + `/how-we-test` live, linked in footer + sitemap. Shared identity in `lib/editorial.ts`. | 🤖 | Google ranks review sites on trust. A visible methodology + author is the cheapest authority signal. |
| 0.3 | ✅ **Author identity on content** (done 2026-06-27, updated): byline + Article schema attribute content to the brand "BestBikeForMe" as publisher. Decision: this is an independent AI-run project; the AI nature is disclosed ONLY on `/about` and must not be added to any other page, byline or schema. | 🤖 | Honest attribution without a false human-team claim. |
| 0.4 | **Content depth on the top demand clusters** (the SEO loop drives this, but seed the big ones deliberately): cargo ✅ done, heavy-riders ✅ done, hills ✅ done, commuter ✅ done 2026-06-27, under-$1000 ✅ done 2026-06-27 — next: folding (blocked: no folding bikes in catalog yet — need catalog expansion first) | 🤖 (loop) | These already pull impressions but rank deep. Depth + query coverage is what lifts them. |
| 0.5 | **Internal linking pass** (partial done 2026-06-29): ✅ Added `relatedPosts` field to all enriched best-of pages (commuter, folding, cargo, fat-tire, long-range, under-$1000, under-$2000) — each now shows a "Related reading" section linking to 2-3 relevant blog posts. ✅ Heavy-riders and hills blog posts now link back to fat-tire and long-range best-of pages. Still to do: vs-page links from best-of pages; ensure all bike detail pages link to their best-of categories (partially done via category links added 2026-06-28). | 🤖 | Spreads authority, increases crawl depth, lifts the whole cluster. |
| 0.6 | ✅ **Fix Dutch `suitable_for` / `frame_type` values in Supabase** (done 2026-06-28): All 22 ENGWE bikes translated — `woon-werk`→`commuting`, `recreatief`→`recreation`, `transport`→`commuting`, `sportief`→`sport`, `laag-instap`→`step-through`, `hoog-instap`→`step-over`. Zero Dutch values remaining. ENGWE bikes now appear on commuter, recreation, off-road, and sport category pages. | 🤖 | High leverage: translating these fields unlocks Engwe from a single filter (foldedSize) to all relevant category pages. |
| 0.7 | ✅ **Fix ENGWE `range_practical` km-as-miles bug in Supabase** (done 2026-06-29): 13 ENGWE bikes had range values stored in km instead of miles. Applied `÷1.609` rounding to both `range_practical` and `range_manufacturer` for all bikes where `range_practical > 80`. Fixed: LE20 (255→158 mi), P275 Pro/ST (195→121 mi), L20 3.0 Pro (120→75 mi), L20/E26 (105→65 mi), L20 3.0 Boost (101→63 mi), Engine Pro 3.0 Boost (97→60 mi), L20 Boost (94→58 mi), EP-2 series (90→56 mi), Engine Pro 2.0 (82→51 mi). Remaining: the 75/100 group (N1 Pro, N1 Air, P275 SE, Engine X, P20) may also be km — flag for manual verification. | 🤖 | Data accuracy on detail pages and on the long-range best-of page. Misleading range figures hurt trust and could cause bounce-backs from users who arrive expecting impossible range. |
| 0.8 | ✅ **Fix all 22 ENGWE Dutch descriptions in Supabase** (done 2026-07-04): All ENGWE bikes had Dutch-language descriptions ("De ENGWE X is een..."). Pages getting real traffic (L20: 3 PostHog visitors; P275 SE: 23 GSC impressions / pos 19.3; N1 Pro: recurring affiliate clicks) were showing Dutch text to US visitors. Translated all 22 to English, using range values in miles, US tone. Remaining: verify other brands (Eunorau, DUOTTS, etc.) for non-English descriptions. | 🤖 | Direct trust and conversion fix. Dutch descriptions on product pages are the most damaging trust signal possible for a US audience. |
| 0.9 | **Data quality sweep: ~35 bikes with placeholder descriptions + zero torque/weight** (partial done 2026-07-05, continued 2026-07-05, continued 2026-07-05 run 3): found a broad "spec-sheet only" description problem plus `torque=0` / `weight_lbs=0` placeholder values, PLUS a distinct copy-paste bug where `weight`/`weight_lbs` had been set equal to `max_weight` (payload) or to the motor wattage number instead of the bike's actual weight. Run 1 fixed 5 bikes (3 Eunorau cargo/AWD + SAMEBIKE M20-III + Eunorau FLASH LITE ST). Run 2 fixed 8 more with verified manufacturer/retailer specs: Eunorau META20/24/26 1.0 + META275 2.0 (all 4 had `weight_lbs=286`, a straight copy of `max_weight=286` — corrected to 63.4/61.7/68.4/60 lbs respectively), Eunorau FLASH 2.0 (`weight_lbs=1000`, copied from "1000W" motor spec — corrected to 85 lbs, `max_weight` 0→440), Eunorau E-FAT-MN (weight 0→55, torque 0→80, max_weight 0→330), VTUVIA GIRAFFE (weight 0→60, torque 0→65, max_weight 0→300), plus a torque-only fix for SAMEBIKE CREST (0→85 Nm; weight not publicly documented, left as-is). Run 3 (2026-07-05) found a THIRD bug class, this time brand-wide on ENGWE: the `weight` column stores kilograms (confirmed — bike descriptions literally say "at 19 kg" etc.) but the app reads it straight into the lbs field with no conversion, so all ~22 ENGWE detail pages showed a weight roughly half the real value (and `max_weight`, also stored in kg, showed an implausibly low payload). Fixed 19 of the 22 with a verified `×2.20462` conversion on both `weight_lbs` and `max_weight`: E26, Engine Pro 2.0, Engine Pro 3.0 Boost, Engine X, EP-2 3.0 Boost, EP-2 Boost, EP-2 Pro, L20, L20 Boost, M1, M20, N1 Air, N1 Pro, P20, P275 Pro, P275 SE, P275 ST, T14, X20/X24/X26 (e.g. N1 Pro 19→41.9 lbs / payload 120→265 lbs; P275 SE 22→48.5 lbs / payload 120→265 lbs). Left 3 ENGWE bikes untouched because their `weight` value doesn't fit the clean kg pattern and needs manual sourcing, not a blanket conversion: L20 3.0 Boost and L20 3.0 Pro (`weight=150`, identical to their own `max_weight=150` — looks like the same copy-paste bug as the Eunorau META bikes, not a kg value) and LE20 (`weight=200` exceeds its own `max_weight=180`, impossible either way). Also newly discovered this run, NOT yet fixed: 4 more ENGWE bikes with one-line spec-fragment descriptions instead of real editorial copy — EASE 2 PRO, Y600 (both have plausible real weight/weight_lbs already) and L16, Y400 (both `weight=0`/`weight_lbs=0`/`max_weight=0`, the placeholder-zero bug). Remaining from run 1/2's original ~19-bike list, still untouched: Eunorau DEFENDER, DEFENDER-S, FAT-HD 1.0/2.0, FAT-HS, FLASH AWD 1.0, FLASH LITE 2.0, META275 ST 1.0, META275 1.0, S1, SPECTER-S, SPECTER-ST, URUS; SAMEBIKE RS-A08-II, STORM, CREST (weight only); VTUVIA FMB, REINDEER 1.0; DYU C2/C5/C6 (torque not publicly documented — likely leave torque blank, could still fix weight + description). | 🤖 | Detail-page meta descriptions embed `torque` directly ("X Nm motor") — a `0` value ships a visibly broken meta description to Google and users. The weight-copy-paste bug is worse: it silently ships physically impossible bike weights (a "286 lb" 20-inch city bike, a "1000 lb" e-bike) into spec tables and meta descriptions site-wide. The ENGWE kg-as-lbs bug hit the two highest-signal bike pages on the whole site (P275 SE: top GSC bike-page impressions; N1 Pro: only bike with repeat confirmed affiliate clicks), so this was the highest-confidence fix available this run. |

| 0.10 | ✅ **Frame material spelling consistency** (done 2026-07-06): 60 of 108 bikes had `frame_material = 'Aluminium'` (British spelling) vs 47 with `'Aluminum'` (US spelling) — an inconsistency across the spec tables of a US-market site. Normalized all 60 rows to `'Aluminum'`. Site now shows 107 Aluminum / 1 Steel / 1 Magnesium, zero British spelling remaining. | 🤖 | Small trust/polish signal; spec tables should read as one voice, not a mix of British and US English. |

**Exit criteria:** all key pages indexed, methodology + about live, top 6 demand clusters are 800+ words with FAQs, internal links wired.

---

## P1 — Conversion & trust (turn visitors into clicks)

Traffic is worthless if it does not click the affiliate link.

| # | Step | Owner | Why |
|---|------|-------|-----|
| 1.1 | **Bike detail page depth** (partial done 2026-06-28, continued 2026-07-06): Added "Who is this bike for?" section (Best for / Skip if, dynamically generated from bike data), FAQPage schema (4 questions targeting "[brand] [model] review" queries), and spec-forward meta descriptions (`X mi real-world range, Y Nm motor, $Z. Score: N/10`). Applies to all 88+ bike pages. 2026-07-06: deepened the 3 SAMEBIKE RS-A01 variants (Pro/MEN/Plus) — these are the strongest-ranking individual bike pages on the site (MEN pos 9.1, Pro pos 16, both already converting clicks) but had near-identical one-sentence descriptions. Wrote differentiated, manufacturer-sourced (samebike.com) editorial copy for each and fixed 2 data bugs found along the way: RS-A01 MEN's `wheel_size` was 26" but the bike actually ships with 27.5" wheels, and both MEN and Pro were missing their dual front+seat-tube suspension (`has_suspension` was 'front', corrected to 'full'; Plus genuinely is front-only, left as-is). Still to do: deeper per-bike editorial content for other high-GSC-traffic pages (P275 SE, C29-K, Walfisk WF26). | 🤖 | Detail pages are where the affiliate click happens. Make them the strongest pages on the site. |
| 1.2 | ✅ **Comparison tables on best-of pages** (done 2026-07-05): added `SpecComparisonTable` component — a server-rendered "Quick comparison" table (rank, bike, price, range, torque, payload, score) shown above the card grid on every `/best/[category]` page, top 8 bikes by score. Not client-sortable (kept it simple/SSR for the featured-snippet target), but every category now has this. | 🤖 | Comparison tables win featured snippets and keep users on-page. |
| 1.3 | ✅ **AggregateRating schema on detail pages** (done 2026-06-29): Added `aggregateRating` to the Product JSON-LD on all 88 bike detail pages. ratingValue = scoreOverall÷2 (10-point → 5-star), reviewCount=1 (editorial review). Also unified the `reviewRating` inside the Review node to use the same `ratingValue` variable. All pages now eligible for star-rating rich results in SERPs. | 🤖 | Star ratings in search results lift CTR substantially. |
| 1.4 | **Price & freshness**: show "last checked" dates; flag obviously stale prices for refresh | 🤝 | Trust signal + avoids sending users to wrong prices. |
| 1.5 | **CTA consistency audit**: ensure every outbound link is affiliate-tagged and follows the hover rules (primary lifts, secondary color-only) | 🤖 | Untagged links = zero commission. Verify coverage end to end. |
| 1.6 | ✅ **Link score badges to `/how-we-test`** (done 2026-06-27): "How we score →" link in Scores section on detail pages; "See our full methodology" link in How We Rank box on best-of pages. BikeCard badge not linked (nested `<a>` invalid HTML — covered by detail page instead). | 🤖 | Reinforces the methodology trust signal and feeds internal links to the new E-E-A-T page. |
| 1.7 | ✅ **Add About to the header nav** (done 2026-06-27) | 🤖 | Makes trust pages reachable from every page, not just the footer. |

---

## P2 — Catalog & affiliate expansion (revenue ceiling)

Today all 7 brands are budget Chinese DTC. The high-search-volume US brands are not in the catalog yet — that caps both traffic and revenue.

| # | Step | Owner | Why |
|---|------|-------|-----|
| 2.1 | **Apply to the big US affiliate programs**: Aventon (AvantLink), Lectric (ShareASale), Rad Power (Impact), Ride1Up (direct), Velotric (Impact) | 👤 | These brands own the US search volume ("aventon aventure review" etc.). Approval takes 1-14 days, so start now. |
| 2.2 | **Add each brand to the catalog once approved** (scrape via the add-brand skill, fill affiliate code in `lib/ebike-data.ts`) | 🤖 | Unlocks dozens of high-intent product + comparison pages. |
| 2.3 | **High-intent vs-pages**: build "X vs Y" pages for the brands people actually compare (e.g. Aventon vs Rad, Lectric XP vs Aventon Soltera) | 🤖 | "vs" queries are bottom-of-funnel and convert well. Only 3 vs-pages exist now. |
| 2.7 | ✅ **AWD/dual-motor blog post** (done 2026-07-04): `/blog/awd-ebikes-explained` — targets "AWD e-bike", "dual motor electric bike" queries; links to DUOTTS S26 (top PostHog product page), off-road best-of, and Eunorau FAT-AWD detail pages. Off-road best-of relatedPosts updated to cross-link. | 🤖 | DUOTTS S26 is the most-visited product page in PostHog. AWD content feeds it link equity and builds topical authority for the off-road cluster. |
| 2.4 | **Expand best-of coverage** ✅ fully done (2026-06-28 through 2026-07-04): ✅ fat-tire, ✅ long-range, ✅ under-$2000, ✅ step-through (`/best/step-through-ebikes` — 3 sections, 7 FAQs, done 2026-06-30), ✅ off-road (`/best/off-road-ebikes` — 3 sections including AWD vs single-motor guide, 7 FAQs, 30+ bikes, done 2026-07-04). All added to sitemap. | 🤖 | Each is a new ranking surface targeting a distinct cluster. |
| 2.6 | ✅ **Folding e-bikes catalog + content (done 2026-06-28)**: The previous "0 bikes" finding was wrong — the filter checks `dimensions.foldedSize`, and 11 Engwe bikes already have it set. The page was showing bikes but had thin content. Fixed: added a 3-section buyer's guide (~900 words) and 7 FAQs to `/best/folding-ebikes`. Page ranks pos 18.8. Outstanding: ENGWE bikes in Supabase have Dutch `suitable_for` values (`woon-werk`, `recreatief`) which hide them from commuter/recreation filters — fixing this is a separate data cleanup task (see P0.5 below). | 🤖 |
| 2.5 | **More state/city pages** for local "ebikes near me / in [city]" intent, tied to the store locator | 🤖 | Local intent is lower competition and easy wins. |

---

## P3 — Engagement & retention (compounding value)

| # | Step | Owner | Why |
|---|------|-------|-----|
| 3.1 | **Email capture + Brevo newsletter** (already in the stack): quiz follow-up sequence + a weekly best-deals email | 🤝 (Claude content, Dylan setup) | Builds an owned audience that does not depend on Google rankings. |
| 3.2 | **Quiz funnel optimization**: tighten the question flow, make the top-3 result page a strong affiliate surface | 🤖 | The quiz is a high-engagement asset; make its result page convert. |
| 3.3 | **Deal / price-drop section**: a lightweight deals page surfacing the best current offers | 🤖 | "ebike deals" is a recurring high-intent query and a reason to return. |

---

## P4 — Scale & moat (once traffic is flowing)

| # | Step | Owner | Why |
|---|------|-------|-----|
| 4.1 | **Backlink building**: guest posts on cycling blogs, get listed in "best ebike site" roundups, Reddit/Quora answers | 👤 | Off-page authority is the ceiling on how high anything ranks. Mostly Dylan's manual effort. |
| 4.2 | **Programmatic expansion**: auto-generate the long tail of category + comparison + location pages from the catalog | 🤖 | Scales ranking surfaces without manual writing. |
| 4.3 | **Content distribution** (YouTube/Pinterest/TikTok) feeding the site | 👤 | Diversifies traffic beyond Google. Out of Claude's lane. |
| 4.4 | **Canada/UK variants** once the US engine works | 🤖 | Reuse the engine for a second market. |

---

## What runs automatically vs what needs Dylan

- **Already automated:** the 5-hourly SEO loop pulls GSC data and ships content-depth + on-page improvements (P0.4, P0.5, P1.1-1.3, P2.3-2.5 over time). It commits and pushes live each run.
- **Needs Dylan and blocks the most upside:**
  1. P0.1 — confirm GSC indexation (5 min, do today).
  2. P2.1 — apply to the major US affiliate programs (do today; approvals are the long pole).
  3. P4.1 — backlinks (ongoing).
- **Best next move:** knock out P0.1 and P2.1 today. Everything else the loop and I can grind through.
