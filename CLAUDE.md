# BestBikeForMe (bestbikeforme.com)

US e-bike affiliate site (filters, quiz, comparisons, blog; revenue from affiliate links). Code lives in `harkuhh/` (legacy folder name, ignore it). Next.js 16.2.1 (App Router), React 19, Tailwind CSS 4, Supabase, TypeScript. Dev: `cd harkuhh && npm run dev`. Path alias `@/` = `harkuhh/` root.

Next.js 16 has breaking changes vs 14/15. Check `harkuhh/node_modules/next/dist/docs/` before writing Next-specific code.

## File Map (don't re-explore)

- `harkuhh/app/`: page.tsx (home), layout.tsx (root layout: metadata, fonts, Header/Footer), e-bikes/overzicht (listing: KeuzehulpBar + sidebar filters), e-bikes/quiz, e-bikes/vergelijk (side-by-side), e-bikes/[brand]/[model] (bike detail), blog + blog/[slug], best/[category], best-ebikes/[state] (US state pages), vs/[slug] (head-to-head), stores (locator, Leaflet)
- `harkuhh/components/`: BikeCard, KeuzehulpBar (6 quick-filter blocks on overzicht), Header, Footer, StoreMap, ShortlistBar, Funnel/HomeFunnel
- `harkuhh/lib/`: types.ts (EBike, FilterState, enums), ebike-data.ts (Supabase fetch + affiliate URL tagging; networks AvantLink/ShareASale/Impact/Rakuten/GoAffPro/direct, per-brand IDs via appendParam/deepLink), ebike-filters.ts, blog-data.ts (POSTS array: slug, title, description, category, publishedAt, readingTime, content markdown, relatedSlugs), store-data.ts (dealers), state-data.ts, supabase/server.ts, shortlist-context.tsx
- `harkuhh/data/`: us-ebikes.json (static catalog, 88+ bikes), curated-overrides.json

EBike key fields: brand, model, slug, price, priceCategory, motorType, frameType, suitableFor[], bikeClass, batteryCapacity, rangeManufacturer, rangePractical, weight, scoreOverall, affiliateUrl, affiliateNetwork, description, highlights[]

## Task -> file

- Blog post -> `lib/blog-data.ts` POSTS array
- Add/edit bike -> `data/us-ebikes.json` or Supabase
- Styling -> Tailwind classes in the component TSX
- New page -> `app/` per App Router conventions (Next 16 docs)

## Rules

- Content in English (US market); code comments/docs may be Dutch
- Never use em-dashes in content (AI tell)
- Hover: primary CTAs lift (`cta-primary`), quiz options brighten (`quiz-option`; both classes in globals.css), secondary buttons color change only, no scale/pulse
- Don't glob/grep for project structure (map above), don't ask tech-stack questions, don't read files you don't need to edit
