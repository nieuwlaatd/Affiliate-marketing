# BestBikeForMe — Prioritized Build-Out Roadmap

> Created 2026-06-27. Grounded in the live site state and Google Search Console data.
> Legend: 🤖 Claude can do it · 👤 Dylan must do it · 🤝 together.

## Where the site stands today

- **Catalog:** 88 e-bikes across 7 brands (Engwe, Eunorau, Walfiske, DUOTTS, SAMEBIKE, DYU, VTUVIA). Data is complete (scores, descriptions, images all present).
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
| 0.4 | **Content depth on the top demand clusters** (the SEO loop drives this, but seed the big ones deliberately): cargo ✅ done, heavy-riders ✅ done, hills ✅ done — next: folding, commuter, under-$1000 | 🤖 (loop) | These already pull impressions but rank deep. Depth + query coverage is what lifts them. |
| 0.5 | **Internal linking pass**: every bike page links to its matching best-of pages; every best-of links to 2-3 related blogs and vs-pages; blogs link to bikes | 🤖 | Spreads authority, increases crawl depth, lifts the whole cluster. Currently weak. |

**Exit criteria:** all key pages indexed, methodology + about live, top 6 demand clusters are 800+ words with FAQs, internal links wired.

---

## P1 — Conversion & trust (turn visitors into clicks)

Traffic is worthless if it does not click the affiliate link.

| # | Step | Owner | Why |
|---|------|-------|-----|
| 1.1 | **Bike detail page depth**: full spec table, clear pros/cons, "best for / skip if", and a prominent tagged affiliate CTA | 🤖 | Detail pages are where the affiliate click happens. Make them the strongest pages on the site. |
| 1.2 | **Comparison tables on best-of pages**: a sortable spec table above the card grid (price, range, payload, torque, class) | 🤖 | Comparison tables win featured snippets and keep users on-page. |
| 1.3 | **Review/aggregateRating schema** where we have a defensible score, plus Product schema on bike pages | 🤖 | Star ratings in search results lift CTR substantially. |
| 1.4 | **Price & freshness**: show "last checked" dates; flag obviously stale prices for refresh | 🤝 | Trust signal + avoids sending users to wrong prices. |
| 1.5 | **CTA consistency audit**: ensure every outbound link is affiliate-tagged and follows the hover rules (primary lifts, secondary color-only) | 🤖 | Untagged links = zero commission. Verify coverage end to end. |
| 1.6 | **Link score badges to `/how-we-test`** on bike cards, bike detail and best-of pages (discovered 2026-06-27) | 🤖 | Reinforces the methodology trust signal and feeds internal links to the new E-E-A-T page. |
| 1.7 | ✅ **Add About to the header nav** (done 2026-06-27) | 🤖 | Makes trust pages reachable from every page, not just the footer. |

---

## P2 — Catalog & affiliate expansion (revenue ceiling)

Today all 7 brands are budget Chinese DTC. The high-search-volume US brands are not in the catalog yet — that caps both traffic and revenue.

| # | Step | Owner | Why |
|---|------|-------|-----|
| 2.1 | **Apply to the big US affiliate programs**: Aventon (AvantLink), Lectric (ShareASale), Rad Power (Impact), Ride1Up (direct), Velotric (Impact) | 👤 | These brands own the US search volume ("aventon aventure review" etc.). Approval takes 1-14 days, so start now. |
| 2.2 | **Add each brand to the catalog once approved** (scrape via the add-brand skill, fill affiliate code in `lib/ebike-data.ts`) | 🤖 | Unlocks dozens of high-intent product + comparison pages. |
| 2.3 | **High-intent vs-pages**: build "X vs Y" pages for the brands people actually compare (e.g. Aventon vs Rad, Lectric XP vs Aventon Soltera) | 🤖 | "vs" queries are bottom-of-funnel and convert well. Only 3 vs-pages exist now. |
| 2.4 | **Expand best-of coverage**: add categories with proven search volume (fat-tire, long-range, under-$2000, step-through, off-road/SUV ebikes) | 🤖 | Each is a new ranking surface targeting a distinct cluster. |
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
