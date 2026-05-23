# Skill: Add New E-Bike Brand

When the user provides a brand name, website URL, and optionally an affiliate code, execute this full pipeline to onboard the brand into Harkuhh.

## Input Format

The user will provide one or more of:
- **Brand name** (e.g. "Himiway")
- **Website URL** (e.g. "https://himiway.com")
- **Affiliate ref code** (e.g. "abc123") — optional, can be added later

## Pipeline Steps

### Step 1: Scrape All E-Bikes from the Brand Website

#### 1a. Discover the product catalog

1. Use `WebFetch` to load the brand's main page and find the products/collections/shop page.
2. Navigate the product catalog — look for links like `/collections/`, `/products/`, `/e-bikes/`, `/shop/`, `/all-bikes/`.

#### 1b. Get REAL image URLs from the collection page

**CRITICAL:** Fetch the collection/catalog page FIRST to extract the real product image URLs. These URLs contain UUIDs and version parameters — you CANNOT guess them.

Typical Shopify CDN format:
```
https://domain.com/cdn/shop/files/FILENAME_UUID.webp?v=TIMESTAMP
```

Use this WebFetch prompt on the collection page:
> "For each e-bike product listed, extract the EXACT product image URL (the full src URL from the img tag, including cdn/shop/files/ path with version parameter). List each model name and its exact image URL."

Store the model→image URL mapping for use when inserting into Supabase.

#### 1c. Scrape individual product pages for specs

For EACH bike model found, scrape the product detail page to extract:

| Field | Source | Notes |
|-------|--------|-------|
| `brand` | User input | Exact brand name |
| `model` | Product title | Strip brand prefix if repeated |
| `slug` | Generate | `{brand}-{model}` kebab-case |
| `price` | Product page | EUR price, numeric only |
| `price_usd` | Convert | EUR × 1.10 (approximate) |
| `price_category` | Derive | budget (<$1000), mid-range ($1000-$2500), premium (>$2500) |
| `images` | Collection page | Array of REAL CDN URLs from step 1b (max 5) |
| `motor_type` | Specs | Map to: `mid-drive`, `front-hub`, or `rear-hub` |
| `motor_brand` | Specs | e.g. "Bafang", "Shimano", brand-specific |
| `torque` | Specs | Number in Nm |
| `battery_capacity` | Specs | Number in Ah |
| `range_miles` | Specs | Range in miles (convert km ÷ 1.609) |
| `range_manufacturer` | Same | In miles |
| `range_practical` | Derive | ~60-70% of manufacturer range |
| `charge_time` | Specs | Hours as decimal |
| `battery_removable` | Specs | Boolean |
| `frame_type` | Specs/images | `step-through`, `step-over`, or `sport` |
| `frame_material` | Specs | Default "Aluminium" if not found |
| `wheel_size` | Specs | Inches as number (e.g. 26, 20, 27.5) |
| `weight` | Specs | In lbs (convert from kg: kg × 2.205) |
| `weight_lbs` | Same | |
| `max_weight` | Specs | Max payload in lbs |
| `gear_type` | Specs | `derailleur`, `single-speed`, or NULL if no gears |
| `gear_count` | Specs | Number of speeds (1 if single/no gears) |
| `gear_brand` | Specs | e.g. "Shimano Tourney" |
| `suitable_for` | Derive from bike type | Array: `commuting`, `recreation`, `sport`, `cargo`, `off-road` |
| `bike_class` | Specs | `class-1`, `class-2`, or `class-3` |
| `has_throttle` | Specs | Boolean (class-2 always true) |
| `has_suspension` | Specs | `none`, `front`, or `full` |
| `max_speed_mph` | Specs | Number |
| `affiliate_url` | Product URL | The product page URL (tagging happens in code) |
| `description` | Original | 1-2 sentence summary, ORIGINAL writing, NOT copied |
| `highlights` | Derive | 3-5 bullet points about standout features |
| `year` | Default 2025 | Unless specified |
| `is_active` | `true` | |
| `ships_to_us` | Check site | `true` if they ship to US |
| `brand_country` | Research | Country of origin |

**Scoring guidelines** (0-10 scale):
- `score_overall`: Weighted average of other scores
- `score_value`: Price vs features compared to competitors
- `score_range`: Based on practical range (>60mi=9+, >40mi=7+, >25mi=5+)
- `score_power`: Based on torque and motor (>80Nm=9+, >60Nm=7+, >40Nm=5+)
- `score_comfort`: Based on suspension, frame, tire width, seat
- `score_build_quality`: Based on component brands, frame material, warranty
- `score_versatility`: Based on suitable_for variety and features

#### 1d. Skip non-bicycle products

Do NOT add electric wagons, scooters, cargo carts, or accessories — only e-bikes.

#### 1e. Insert into Supabase

1. Before inserting, check for duplicates: query Supabase for existing bikes with same brand+model.
2. Insert all new bikes into Supabase `ebikes` table using `mcp__supabase__execute_sql`.
3. Use `ON CONFLICT (slug) DO NOTHING` to prevent duplicate errors.

### Step 2: Update `next.config.ts` Image Hostnames

**BEFORE loading the site**, check if the brand's image hostname is already in `next.config.ts` `images.remotePatterns`. If not, add it.

Extract the hostname from the image URLs (e.g. `duotts.com` from `https://duotts.com/cdn/shop/files/...`).

Check for BOTH `www.` and non-`www.` variants — some brands use both. Add any missing hostnames.

If `cdn.shopify.com` is the hostname, it's likely already configured.

**This step prevents `next/image` runtime errors** that crash the page.

### Step 3: Scrape Store / Dealer Locations

1. Look for a store locator, dealer finder, or "where to buy" page on the brand website. Common paths:
   - `/stores`, `/dealers`, `/where-to-buy`, `/find-a-dealer`, `/locations`, `/store-locator`
2. Many brands use **Stockist.co** or **Storepoint** widgets that load dynamically. If the page uses a widget:
   - Use `WebSearch` to find "[brand] dealer locations" or "[brand] store locator"
   - Try fetching the Stockist API directly: `https://stockist.co/api/v1/u{ID}/locations/search?tag=&latitude=0&longitude=0`
3. If the brand is **online-only** (most Chinese DTC brands are), note this and skip.
4. For each store location found, extract:
   - `name`, `address`, `city`, `state`, `country`, `countryCode`, `zip`, `phone`, `website`
   - `lat`, `lng` (if not available, use WebSearch to geocode the address)
   - `brands`: array including this brand (check if store already exists with other brands)
   - `types`: array of `sales`, `service`, `test-ride`, `rental` based on what the store offers
5. Generate a unique `id` in kebab-case: `{brand}-{city}` or `{storename-slug}`
6. Check for existing stores in `lib/store-data.ts`:
   - If a store already exists at the same address, ADD the new brand to its `brands` array
   - If it's a new store, add a new entry
7. Edit `lib/store-data.ts` to add the new stores to the `STORES` array

### Step 4: Configure Affiliate Tracking

1. If the user provided an affiliate ref code:
   - Edit `lib/ebike-data.ts` to add a new entry in `AFFILIATE_IDS`
   - Add a new entry in `AFFILIATE_TAGS` array with the correct `match` patterns (brand name + domain keywords) and `tag` function
   - If the program is confirmed active, do NOT set `pending: true`
   - Only set `pending: true` if explicitly told "pending approval"
2. If no code provided, note this as a TODO for the user

### Step 5: Verify & Report

After all changes:

1. **Verify Supabase**: Query to confirm bikes were inserted
2. **Restart dev server** if `next.config.ts` was modified (config changes require restart)
3. **Check for errors**: Load `/e-bikes/overzicht` and verify no runtime errors
4. Provide a summary:

```
## Brand Onboarding Complete: {Brand Name}

### E-Bikes Added ({count})
| Model | Price | Class | Motor |
|-------|-------|-------|-------|

### Stores Added ({count})
| Store | City | Country | Types |
(or "Online only — no physical stores")

### Affiliate Setup
- Network: {network type}
- Code: {code or "pending"}
- Status: {active/pending}

### Files Modified
- `next.config.ts` — image hostname added
- `lib/store-data.ts` — {n} stores added/updated
- `lib/ebike-data.ts` — affiliate config added
- Supabase `ebikes` table — {n} rows inserted
```

## Important Notes

- Always write original descriptions; NEVER copy marketing text verbatim from the brand website
- Convert all measurements to US units (miles, lbs, inches) for the database
- If a spec is not found on the website, leave the field as NULL rather than guessing
- **Images MUST use the REAL CDN URL** from the brand's website — never guess filenames
- Image URLs from Shopify stores contain UUIDs (e.g. `_f64a0296-ed18-4c49-a96e-bc654a9aebb8.webp`) — these cannot be predicted
- Check that product URLs are correct and accessible before inserting
- If the website blocks scraping, fall back to WebSearch for product specs
- After inserting bikes, verify by querying Supabase to confirm the rows exist
- EUR prices go in `price`, USD conversions go in `price_usd` (multiply EUR × ~1.10)
