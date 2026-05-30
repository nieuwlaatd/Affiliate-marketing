# BestBikeForMe (bestbikeforme.com)

US e-bike affiliate site. Users find bikes via filters, quiz, comparisons, blog. Revenue from affiliate links.

## Folder Mapping

The main codebase folder is called `harkuhh/` (legacy name, the site is BestBikeForMe). Ignore the folder name.

## Tech Stack

Next.js 16.2.1 (App Router), React 19, Tailwind CSS 4, Supabase, TypeScript. Dev server: `cd harkuhh && npm run dev`

## Critical: Next.js 16 Breaking Changes

Do NOT assume Next.js 14/15 APIs work. Check `harkuhh/node_modules/next/dist/docs/` before writing any Next.js-specific code.

## File Map (don't re-explore these)

```
harkuhh/app/
  page.tsx                    # Homepage
  layout.tsx                  # Root layout (metadata, fonts, Header/Footer)
  e-bikes/overzicht/          # Listing page with KeuzehulpBar + sidebar filters
  e-bikes/quiz/               # Find My E-Bike quiz
  e-bikes/vergelijk/          # Side-by-side comparison
  e-bikes/[brand]/[model]/    # Individual bike detail pages
  blog/ + blog/[slug]/        # Blog hub + individual posts
  best/[category]/            # "Best X for Y" pages
  best-ebikes/ + [state]/     # US state location pages
  vs/[slug]/                  # Head-to-head comparison pages
  stores/                     # Store locator with Leaflet map

harkuhh/components/
  BikeCard.tsx                # Bike card (used on listing, best, state pages)
  KeuzehulpBar.tsx            # 6 quick-filter blocks on overzicht page
  Header.tsx / Footer.tsx     # Site-wide nav and footer
  StoreMap.tsx                # Leaflet map component
  ShortlistBar.tsx            # Floating bar for saved/compared bikes
  Funnel/HomeFunnel.tsx       # Homepage CTA funnel

harkuhh/lib/
  types.ts                    # EBike interface, FilterState, enums
  ebike-data.ts               # Fetches bikes from Supabase + affiliate URL tagging
  ebike-filters.ts            # Filter/sort logic
  blog-data.ts                # All blog posts defined as array of BlogPost objects
  store-data.ts               # Dealer locations
  state-data.ts               # US state metadata for location pages
  supabase/server.ts          # Server-side Supabase client
  shortlist-context.tsx       # React context for bike shortlist

harkuhh/data/
  us-ebikes.json              # Static bike catalog (88+ bikes)
  curated-overrides.json      # Manual overrides for specific bikes
```

## EBike Interface (key fields)

brand, model, slug, price, priceCategory, motorType, frameType, suitableFor[], bikeClass, batteryCapacity, rangeManufacturer, rangePractical, weight, scoreOverall, affiliateUrl, affiliateNetwork, description, highlights[]

## Blog Posts

Defined in `lib/blog-data.ts` as a `POSTS` array. Each post has: slug, title, description, category, publishedAt, readingTime, content (markdown string), relatedSlugs[].

## Affiliate System

`ebike-data.ts` has a multi-affiliate URL tagging system. Networks: AvantLink, ShareASale, Impact, Rakuten, GoAffPro, direct. Affiliate IDs are inserted per brand via `appendParam`/`deepLink` helpers.

## Conventions

- Never use em-dashes in content
- Primary CTAs: lift on hover. Quiz options: brighten. Secondary buttons: color change only.
- Content in English (US market). Code comments/docs may be Dutch.
- "KeuzehulpBar" = 6 filter blocks on overzicht. "Quiz" = /e-bikes/quiz. "Sidebar filters" = left panel on overzicht. See AGENTS.md.
- Path alias: `@/` maps to `harkuhh/` root (e.g. `@/components/BikeCard`)

## When I Ask You To...

- **Add a blog post** -> edit `lib/blog-data.ts`, add to POSTS array
- **Add/edit a bike** -> edit `data/us-ebikes.json` or Supabase
- **Change styling** -> Tailwind classes in the component TSX
- **Add a new page** -> create in `app/` following App Router conventions (check Next 16 docs)
- **Fix a component** -> file is in `components/` or co-located in `app/` route folder

## Don't

- Don't glob/grep to find project structure (it's above)
- Don't ask clarifying questions about tech stack
- Don't generate em-dashes
- Don't assume Next.js 14/15 patterns work
- Don't read files you don't need to edit
