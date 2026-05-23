# Skill: Sync Brands from Excel

Read `affiliate-partners.xlsx` in the project root and process all rows with Status = "New" (case-insensitive). For each new brand, run the full onboarding pipeline, then update the Excel file.

## Step 1: Read the Excel File

Use Python with openpyxl to read `affiliate-partners.xlsx`:

```python
import openpyxl
wb = openpyxl.load_workbook('affiliate-partners.xlsx')
ws = wb['Affiliate Partners']
```

Parse all rows (starting from row 2) into a list of dicts with keys:
`brand, website, network, code, affiliate_link, commission, cookie_days, status, bikes_scraped, stores_scraped, last_updated, notes`

Filter for rows where:
- `status` matches "New" (case-insensitive: "New", "new", "NEW" all count)
- `brand` is not empty

If the `website` field is empty but `affiliate_link` contains a domain, extract the website from it.

If no new rows are found, report "No new brands to process" and stop.

## Step 2: Process Each New Brand

For each new brand row, execute the `/add-brand` skill pipeline:

### 2a. Scrape E-Bikes

1. First fetch the **collection/catalog page** (not individual product pages) to get:
   - All model names
   - All **real product image URLs** (the exact `src` from `<img>` tags, with full CDN path including version parameters like `?v=...`)
   - Product page URLs
2. Then fetch individual product pages for detailed specs
3. Insert into Supabase `ebikes` table using the REAL image URLs from step 1
4. Count how many bikes were added

**CRITICAL — Image URLs:**
- Always use the EXACT image URLs from the website's collection or product pages
- These are typically in the format: `//domain.com/cdn/shop/files/FILENAME.webp?v=TIMESTAMP`
- Add `https:` prefix if the URL starts with `//`
- NEVER guess or simplify image filenames — they contain UUIDs and specific naming
- Verify at least one image URL per brand loads correctly before inserting all bikes

### 2b. Update `next.config.ts` Image Hostnames

**BEFORE inserting bikes**, check if the brand's image hostname is already in `next.config.ts` `remotePatterns`. If not, add it.

Read the current `next.config.ts` and check for the hostname(s) used in the image URLs. Common patterns:
- `brand.com` and `www.brand.com` may both be needed
- Some brands use `cdn.shopify.com` (already configured)

Add any missing hostnames to the `remotePatterns` array. This prevents `next/image` runtime errors.

### 2c. Scrape Store Locations
- Look for dealer/store locator pages on the brand website
- Extract all store locations with addresses, coordinates, phone, types
- Add new stores to `lib/store-data.ts`
- If a store already exists (same address), add the new brand to its `brands` array
- Count how many stores were added
- If the brand is online-only (no physical stores), note this and skip

### 2d. Configure Affiliate Tracking
- If `code` is provided in the Excel row:
  - Add the brand's affiliate ID to `AFFILIATE_IDS` in `lib/ebike-data.ts`
  - Add a matching entry to `AFFILIATE_TAGS` array with `match` patterns including the brand name and website domain
  - If the code is confirmed working, do NOT set `pending: true`
  - Only set `pending: true` if the Excel notes explicitly say "pending approval"
- If `code` is empty, skip this step and note it in the report

### 2e. Determine Final Status
- If `code` is provided and working: status = "Active"
- If `code` is provided but explicitly pending approval: status = "Pending"
- If no `code`: status = "Not Applied"

## Step 3: Update the Excel File

**IMPORTANT:** Ask the user to close the Excel file before saving. If `PermissionError` occurs, remind the user to close Excel and retry.

After processing all new brands, update the Excel file using Python:

```python
import openpyxl
from datetime import date

wb = openpyxl.load_workbook('affiliate-partners.xlsx')
ws = wb['Affiliate Partners']

# For each processed brand, find its row and update:
# - Status column (H) -> "Active" or "Pending"
# - Bikes Scraped (I) -> "Yes"
# - Stores Scraped (J) -> "Yes" or "No"
# - Last Updated (K) -> today's date (ISO format)
# - Affiliate Link (E) -> generated full URL if code was provided
# - Notes (L) -> summary of what was added
# - Apply color coding: green fill for Active, yellow for Pending

wb.save('affiliate-partners.xlsx')
```

Use these fill colors to match the existing styling:
- Active: `PatternFill(start_color="E2EFDA", fill_type="solid")`
- Pending: `PatternFill(start_color="FFF2CC", fill_type="solid")`

## Step 4: Verify & Test

1. **Verify Supabase data**: Query the inserted bikes to confirm they exist
2. **Restart the dev server**: `next.config.ts` changes require a server restart
3. **Check for runtime errors**: Load `/e-bikes/overzicht` and check for `next/image` hostname errors or 404s on images
4. **Fix any issues** before reporting success

## Step 5: Report Results

Print a summary table:

```
## Sync Complete

### Processed Brands
| Brand | Bikes Added | Stores Added | Affiliate | Status |
|-------|-------------|--------------|-----------|--------|
| ...   | ...         | ...          | ...       | ...    |

### Files Modified
- affiliate-partners.xlsx — updated {n} rows
- next.config.ts — {n} image hostnames added
- lib/store-data.ts — {n} stores added
- lib/ebike-data.ts — {n} affiliate configs added
- Supabase ebikes table — {n} bikes inserted

### Errors (if any)
- ...
```

## Important Notes

- Always read the CURRENT state of the Excel file at the start (user may have edited it)
- Only process rows with Status = "New" (case-insensitive) — never reprocess Active/Pending rows
- If scraping fails for a brand, set status to "Error" and add error details in Notes column
- The Excel file path is always: `{project_root}/affiliate-partners.xlsx`
- After updating the Excel, verify the save was successful by reading it back
- Do NOT delete the `create-excel.py` helper script
- When adding stores, always verify lat/lng coordinates are correct using WebSearch
- Write original descriptions for bikes — never copy marketing text from brand websites
- The `next.config.ts` file is at `{project_root}/next.config.ts`
- All brands so far use Shopify stores with CDN pattern `//domain.com/cdn/shop/files/...`
- Price fields should be in EUR for `price` and USD for `price_usd` (convert EUR→USD at ~1.10)
- Bikes without gears should use `gear_count: 1` and `gear_type: NULL`
- Electric wagons, scooters, and non-bicycle products should be SKIPPED
