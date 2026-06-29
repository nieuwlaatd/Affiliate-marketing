## 2026-06-30: weekly catalog sync

### Summary

| Brand    | Vendor bikes (kept) | DB rows | Prices applied | New inserted | Discontinued applied | Deferred (review) |
|----------|--------------------:|--------:|---------------:|-------------:|---------------------:|------------------:|
| ENGWE    | 25                  | 26      | 0              | 0            | 0                    | 12 price + 8 new + 9 disc |
| Eunorau  | 24                  | 26      | 1              | 0            | 0                    | 2 price + 1 new + 3 disc |
| Walfiske | 6                   | 3       | 1              | 0            | 0                    | 1 price + 3 new |
| DUOTTS   | 17                  | 11      | 0              | 0            | 0                    | 6 new (Ship-to-UK / pre-owned) |
| SAMEBIKE | 20                  | 22      | 0              | 0            | 0                    | 3 disc (false-positive matcher) |
| DYU      | 10                  | 10      | 0              | 0            | 0                    | (clean - no real changes) |
| VTUVIA   | 20                  | 11      | 0              | 0            | 0                    | 10 new (color variants of SX20/SF20H) |

### Applied changes (2 total)

- **Eunorau R1+** (`eunorau-r1-plus`): $4999.00 -> $4499.00 (-$500.00). Last week's run had it as "possibly discontinued"; vendor relisted and dropped price. Clean slug match.
- **Walfiske WF26** (`walfisk-walfisk-26-fat-tire-bafang-750w-...`): $1199.00 -> $999.00 (-$200.00). Clean slug match, real vendor price drop.

### ENGWE - all deferred (vendor generation update)

Vendor catalog underwent a major model-line update. DB still holds older model versions while vendor sells new generations. Owner judgment needed before applying:

- **L20**: DB has base "L20" at $1099; vendor lists "L20" at $1399 and "L20 2.0" at $699 and "L20 3.0" at $1399. Three SKUs share the L20 root. Don't overwrite DB price without picking which SKU the DB row should now represent.
- **M20**: DB has base "M20" at $1099; vendor lists "M20" at $1399, "M20 2.0" at $1499, "M20 3.0" at $1499. Same issue.
- **EP-2**: DB has "EP-2 Pro" and "EP-2 Boost"; vendor lists "EP-2 Pro" at $1399 and "EP-2 3.0" at $999 and a battery-pack accessory at $1599. Matcher noise.
- **Engine Pro 2.0**: DB $1399; vendor "Engine Pro 2.0" at $1699. Could be a real $300 increase but want to verify before applying.
- **LE20**: DB $1449; vendor $1699. Real increase candidate but Wartung last week's price uncertainty (price_usd was NULL).
- **E26**: DB $1499; vendor $1699 ($200 increase candidate).
- **T14**: DB $599; vendor $650 ($51 increase candidate).
- **X20/X24/X26**: DB has them as one combined row; vendor now lists X20 ($1599), X24 ($1799), X26 ($1499) as separate products plus an "X26/24/X20" combined listing at $1599. Owner can split or keep combined.
- **EASE 2 PRO**: DB $999; vendor lists "Ease 1" ($799), "Ease 2 Pro" ($999), "Ease 3" ($899). DB matches vendor exactly on Ease 2 Pro - no change needed.

**New ENGWE candidates not in DB** (8 - need owner sign-off before insert):
- Ease 1 ($799), Ease 3 ($899) - new entries in the Ease family
- M20 2.0 ($1499) - new M20 generation
- X20 ($1599), X26 ($1499) - listed separately from the X20/X24/X26 combined row
- "M20 (Battery Pack)" ($1999) - accessory, skip
- "EP-2 Pro (Battery Pack)" ($1599) - accessory, skip
- "X26/24/X20" combined ($1599) - duplicates the existing combined row, skip

**Likely discontinued** (still left active in DB to preserve SEO until owner reviews):
- Engine X ($1299), L20 Boost ($1149), M1 ($1099), N1 Air ($1249), N1 Pro ($1599), P20 ($999), P275 Pro ($1099), P275 SE ($899), P275 ST ($1199). Confirmed absent across all ENGWE products.json pages. Detail pages will continue to show "available" until owner OKs marking `available = false`.

### Eunorau

**Applied** (1): R1+ price drop (see above).

**Deferred** (2 price + 1 new + 3 disc):
- **FLASH 2.0** (`eunorau-flash-2`): DB $2099 (set last week), vendor today $2499. Possible vendor revert of last week's drop, or last week's update was wrong. Owner to decide.
- **R1**: DB $3749, vendor $3750 ($1 delta - rounding, skip).
- **R1 Compact** (new): vendor lists at $3749. Possibly a renamed R1 or a new variant. Owner to confirm before insert.
- **DEFENDER, Defender-S, META275** flagged "discontinued" by matcher: false positives. Vendor still has DEFENDER ($1599), META275 1.0 ($1399), META275 2.0 ($1699). My scraper filter dropped DEFENDER because the handle has no digit; not a real disappearance.

### Walfiske

**Applied** (1): WF26 price drop (see above).

**Deferred** (1 price + 3 new):
- **ET-7 Ultra** (`walfisk-...-et-7-...-bla`): DB $2299.99, vendor now lists at $2499.99 for the matched SKU. Vendor has 3 separate ET-7 listings ($2299.99 x2, $2499.99 x1) - the $2499.99 may be the new "black warrior" variant. Owner to decide whether the DB row tracks the lower-priced base SKU.
- New vendor listings: 2 additional ET-7 SKUs + VIPERA 20" Retro at $1399.99. Could be new SKUs or duplicates of existing.

### DUOTTS

No applied changes.

**Deferred** (6 new candidates, all rejectable):
- "Certified Pre-Owned E-Bikes" ($999): placeholder collection product, skip.
- "DUOTTS S26/F26/N26 Electric Bike Ship to UK" (3 listings): UK-market variants, do not list on US site.
- "S26" ($1349), "F26" ($1399), "N26" ($1399): vendor added bare-slug duplicates alongside existing "duotts-s26", "duotts-f26", "duotts-n26" listings - same products, just second URL. Skip (would create duplicate DB rows).

### SAMEBIKE

No applied changes.

**Deferred** (3 "discontinued" false positives):
- 20LVXD30-II, LOTDM200-II, YINYU14 flagged "discontinued" by matcher: false positives. Vendor still has 20LVXD30-II ($699) and LOTDM200-II ($899). YINYU14 not found in vendor catalog this run but was present last week - leave active pending one more cycle confirmation.

Matcher-swap noise (CY20 <-> CY20 Pro, RS-A01 MEN <-> RS-A01 Plus) was identified and skipped - DB values verified correct.

### DYU

No changes. All 10 DB rows match the vendor catalog 1:1 at identical prices. Three "discontinued" flags (A5, C9, T1) were matcher false positives due to 2-character model codes being too short for the token rule - they're all in the vendor catalog at the same prices as the DB.

### VTUVIA

No changes.

**Deferred** (10 new candidates - mostly color/size variants):
- SX20 Red, White, Blue, "Folding": all $1599 - same product as DB `vtuvia-sx20`, just different colors/configs. Skip (DB stores one row per model, not per color).
- SF20H Red, Green, White, "Utility": all $1399 - same product as DB `vtuvia-sf20h`, color/variant duplicates. Skip.
- CMB 10-Speed ($2149) and CMB 8-Speed ($1899): vendor now lists 8-speed and 10-speed as separate products. DB `vtuvia-cmb` at $1899 matches the 8-Speed. Owner to decide whether to add the 10-speed as a separate listing (still pending from last week's log).

### Notes

- Two confident price drops applied via Supabase MCP (live immediately).
- Scraper used a Python re-implementation of the Shopify products.json approach (the project's `scripts/scrape-us-ebikes.ts` BRANDS array only covers 3 of the 7 active brands; previous run used the same approach).
- Matcher uses slug + normalized model-token overlap. Known false-positive patterns: 2-char model codes, generation suffixes (X vs X 2.0 vs X 3.0), color variants, accessory listings that share a model code, market-specific variants (Ship to UK).
- Conservative posture: when in doubt, the rule is "leave the DB value and note the discrepancy" rather than write a wrong price. Today only the two cleanest signals were applied.
- ENGWE remains the highest-priority owner task: the catalog has clearly rotated to new model generations, and the DB hasn't followed yet.
- `affiliate-partners.xlsx` updated for all 7 active brands; Last Updated = 2026-06-30.

---

## 2026-06-28: weekly catalog sync

### Summary

| Brand | Vendor bikes | DB rows | Price updates applied | NEW bikes inserted | Spec discrepancies (review) | Possibly discontinued (review) | Price changes deferred (review) |
|---|---:|---:|---:|---:|---:|---:|---:|
| ENGWE | 21 | 22 | 0 | 4 | 13 | 12 | 10 |
| Eunorau | 25 | 18 | 7 | 8 | 3 | 5 | 0 |
| Walfisk | 3 | 3 | 0 | 0 | 0 | 0 | 1 |
| DUOTTS | 11 | 11 | 11 | 0 | 4 | 0 | 0 |
| SAMEBIKE | 20 | 19 | 17 | 3 | 7 | 2 | 0 |
| DYU | 10 | 7 | 7 | 3 | 2 | 0 | 0 |
| VTUVIA | 23 | 8 | 0 | 3 | 4 | 0 | 1 |

### ENGWE

**New bikes inserted** (4):
- L16 (engwe-l16): $899 - ENGWE L16
- Y400 (engwe-y400): $599 - ENGWE Y400
- EASE 2 PRO (engwe-ease-2-pro): $999 - ENGWE Ease 2 Pro
- Y600 (engwe-y600): $699 - ENGWE Y600

**Price changes flagged for review** (10) - currency or match uncertain, not applied:
- EP-2 Pro (engwe-ep-2-pro): DB $1049.00 vs vendor $1399.00 (from `engwe-ep-2-pro-750w-folding-electric-mountain-bike`)
- LE20 (engwe-le20): DB $1449.00 vs vendor $1699.00 (from `le20`)
- EP-2 3.0 Boost (engwe-ep-2-3-0-boost): DB $1199.00 vs vendor $999.00 (from `electric-commuter-bike-fast-electric-bike-engwe-ep-2-3-0`)
- L20 (engwe-l20): DB $1099.00 vs vendor $1399.00 (from `l20`)
- M20 (engwe-m20): DB $1099.00 vs vendor $1699.00 (from `m20`)
- Engine Pro 2.0 (engwe-engine-pro-2-0): DB $1399.00 vs vendor $1699.00 (from `engwe-engine-pro-2-0`)
- E26 (engwe-e26): DB $1499.00 vs vendor $1699.00 (from `engwe-e26`)
- Engine X (engwe-engine-x): DB $1299.00 vs vendor $1599.00 (from `usengine-pro-750w-16ah-high-performance-electric-bike`)
- X20/X24/X26 (engwe-x20-x24-x26): DB $1499.00 vs vendor $1799.00 (from `engwe-x24`)
- T14 (engwe-t14): DB $599.00 vs vendor $650.00 (from `engwe-t14-350w-miniebike`)

**Spec discrepancies flagged for review** (13) - not auto-applied:
- EP-2 Pro (engwe-ep-2-pro): battery_capacity DB=16.0 vs vendor=13.0 Ah
- EP-2 Pro (engwe-ep-2-pro): range_manufacturer DB=120.0 vs vendor=75.0 mi
- LE20 (engwe-le20): battery_capacity DB=16.0 vs vendor=38.4 Ah
- LE20 (engwe-le20): range_manufacturer DB=340.0 vs vendor=211.0 mi
- EP-2 3.0 Boost (engwe-ep-2-3-0-boost): range_manufacturer DB=120.0 vs vendor=65.0 mi
- L20 (engwe-l20): battery_capacity DB=16.0 vs vendor=13.0 Ah
- M20 (engwe-m20): battery_capacity DB=16.0 vs vendor=13.0 Ah
- M20 (engwe-m20): range_manufacturer DB=75.0 vs vendor=44.0 mi
- Engine Pro 2.0 (engwe-engine-pro-2-0): range_manufacturer DB=110.0 vs vendor=68.0 mi
- E26 (engwe-e26): range_manufacturer DB=140.0 vs vendor=78.0 mi
- X20/X24/X26 (engwe-x20-x24-x26): battery_capacity DB=16.0 vs vendor=19.2 Ah
- T14 (engwe-t14): battery_capacity DB=16.0 vs vendor=110.0 Ah
- T14 (engwe-t14): range_manufacturer DB=55.0 vs vendor=21.0 mi

**Possibly discontinued** (12) - left active in DB (preserving SEO):
- N1 Air (engwe-n1-air)
- L20 3.0 Boost (engwe-l20-3-0-boost)
- P275 Pro (engwe-p275-pro)
- P275 SE (engwe-p275-se)
- N1 Pro (engwe-n1-pro)
- P275 ST (engwe-p275-st)
- L20 3.0 Pro (engwe-l20-3-0-pro)
- L20 Boost (engwe-l20-boost)
- M1 (engwe-m1)
- P20 (engwe-p20)
- EP-2 Boost (engwe-ep-2-boost)
- Engine Pro 3.0 Boost (engwe-engine-pro-3-0-boost)

### Eunorau

**Prices updated** (7):
- FAT-AWD 2.0 (eunorau-fat-awd-2): $1799.00 -> $1699.00 ($-100.00)
- META26 1.0 (eunorau-meta-26-1): $1699.00 -> $1499.00 ($-200.00)
- R1 (eunorau-r1): $3999.00 -> $3749.00 ($-250.00)
- META20 1.0 (eunorau-meta-20-1): $1699.00 -> $1549.00 ($-150.00)
- META24 1.0 (eunorau-meta-24-1): $1699.00 -> $1499.00 ($-200.00)
- FAT-AWD 3.0 (eunorau-fat-awd-3-0): $1799.00 -> $1699.00 ($-100.00)
- FLASH (eunorau-flash-2): $2499.00 -> $2099.00 ($-400.00)

**New bikes inserted** (8):
- S1 (eunorau-s1-dirt-bike): $1599 - S1 Dirt Bike
- FAT-HD 1.0 (eunorau-fat-hd): $1999 - FAT-HD 1.0 Pro / Hunter X7
- SPECTER-S 3.0 (eunorau-specter-s-hunter): $2999 - SPECTER-S 3.0 / Hunter X9
- FAT-HD 2.0 (eunorau-fat-hd-2-0): $2099 - FAT-HD 2.0/Hunter X7
- E-FAT-MN (eunorau-e-fat-mn): $1099 - E-FAT-MN
- SPECTER-ST 2.0 (eunorau-specter-st-1): $2999 - SPECTER-ST 2.0
- FAT-HS (eunorau-fat-hs): $2999 - FAT-HS / Hunter X8
- MAX-CARGO 2.0 (eunorau-max-cargo): $1699 - MAX-CARGO 2.0

**New candidates skipped (not real bikes)** (2):
- s500-utility-vehicle - S500 Utility Vehicle (not a real e-bike (rack/utility/etc))
- s1000-utility-vehicle - S1000 Utility Vehicle (not a real e-bike (rack/utility/etc))

**Spec discrepancies flagged for review** (3) - not auto-applied:
- FLASH LITE (eunorau-flash-lite-2-0): range_manufacturer DB=220.0 vs vendor=100.0 mi
- FLASH LITE (eunorau-flash-lite-2-0): max_speed_mph DB=28.0 vs vendor=20.0 mph
- FLASH (eunorau-flash-2): max_speed_mph DB=20.0 vs vendor=28.0 mph

**Possibly discontinued** (5) - left active in DB (preserving SEO):
- FLASH AWD (eunorau-flash-awd-1-0)
- META275 (eunorau-meta-275-st-1)
- R1+ (eunorau-r1-plus)
- FLASH LITE ST (eunorau-flash-lite-st)
- Defender-S (eunorau-defender-s-fat-hs)

### Walfisk

**Price changes flagged for review** (1) - currency or match uncertain, not applied:
- ET-7 Ultra (walfisk-walfisk-electric-bike-et-7-3000w-brushless-motor-60v45ah-big-battery-bla): DB $2299.99 vs vendor $599.00 (from `walfisk-electric-bike-et-7-1500w-3000w-rear-motor`)

### DUOTTS

**Prices updated** (11):
- C29 (duotts-c29): $899.00 -> $799.00 ($-100.00)
- F26 (duotts-f26): $1529.00 -> $1399.00 ($-130.00)
- F20 (duotts-f20): $1369.00 -> $1199.00 ($-170.00)
- C29-K (duotts-duotts-c29-k): $1199.00 -> $1219.00 (+$20.00)
- C29Max (duotts-duotts-c29max-electric-bike): $1099.00 -> $1149.00 (+$50.00)
- C29 Lite (duotts-duotts-c29lite-electric-bike): $719.00 -> $759.00 (+$40.00)
- F26 Lite (duotts-duotts-f26lite-electric-bike): $1199.00 -> $1269.00 (+$70.00)
- S26 AWD (duotts-s26): $1299.00 -> $1349.00 (+$50.00)
- N26 (duotts-n26): $1459.00 -> $1399.00 ($-60.00)
- E26 (duotts-e26): $2299.00 -> $2099.00 ($-200.00)
- E29 (duotts-e29): $1599.00 -> $1429.00 ($-170.00)

**Spec discrepancies flagged for review** (4) - not auto-applied:
- F26 (duotts-f26): battery_capacity DB=20.0 vs vendor=17.5 Ah
- S26 AWD (duotts-s26): range_manufacturer DB=75.0 vs vendor=37.0 mi
- S26 AWD (duotts-s26): max_speed_mph DB=28.0 vs vendor=37.0 mph
- S26 AWD (duotts-s26): weight_lbs DB=84.0 vs vendor=441.0 lb

### SAMEBIKE

**Prices updated** (17):
- RS-A01 MEN (samebike-rs-a01-men): $829.00 -> $759.00 ($-70.00)
- EBE2 (samebike-ebe2): $709.00 -> $619.00 ($-90.00)
- LO26-II-YD (samebike-lo26-ii-yd): $989.00 -> $899.00 ($-90.00)
- C05 Pro (samebike-c05-pro): $939.00 -> $859.00 ($-80.00)
- CY20 (samebike-cy20): $769.00 -> $699.00 ($-70.00)
- CY20 Pro (samebike-cy20-pro): $809.00 -> $759.00 ($-50.00)
- 20LVXD30-II (samebike-20lvxd30-ii): $769.00 -> $699.00 ($-70.00)
- RS-A01 Pro (samebike-rs-a01-pro): $829.00 -> $759.00 ($-70.00)
- RS-A01 Plus (samebike-rs-a01-plus): $1199.00 -> $999.00 ($-200.00)
- RS-A02 Pro (samebike-rs-a02-pro): $1049.00 -> $959.00 ($-90.00)
- RS-A02 Plus (samebike-rs-a02-plus): $1639.00 -> $1499.00 ($-140.00)
- LOTDM200-II (samebike-lotdm200-ii): $989.00 -> $899.00 ($-90.00)
- LO26 Plus (samebike-lo26-plus): $1099.00 -> $999.00 ($-100.00)
- SY26-II (samebike-sy26-ii): $769.00 -> $699.00 ($-70.00)
- XD26-II (samebike-xd26-ii): $939.00 -> $859.00 ($-80.00)
- RS-A07 (samebike-rs-a07): $989.00 -> $899.00 ($-90.00)
- YINYU14 (samebike-yinyu14): $489.00 -> $449.00 ($-40.00)

**New bikes inserted** (3):
- STORM (samebike-storm-fat-tire-mountain-e-bike): $1549 - STORM Fat Tire Mountain E-Bike
- CREST (samebike-crest-fat-tire-mountain-e-bike): $1549 - CREST Fat Tire Mountain E-Bike
- RS-A08-II (samebike-rsa08-ii-powerful-all-terrain-electric-bicycle): $1599 - RS-A08-II High-performance Fat Tire Mountain E-Bike

**Spec discrepancies flagged for review** (7) - not auto-applied:
- LO26-II-YD (samebike-lo26-ii-yd): range_manufacturer DB=62.0 vs vendor=31.0 mi
- 20LVXD30-II (samebike-20lvxd30-ii): range_manufacturer DB=56.0 vs vendor=16.0 mi
- RS-A01 Pro (samebike-rs-a01-pro): battery_capacity DB=15.0 vs vendor=13.0 Ah
- RS-A01 Pro (samebike-rs-a01-pro): max_speed_mph DB=16.0 vs vendor=20.0 mph
- RS-A01 Plus (samebike-rs-a01-plus): range_manufacturer DB=62.0 vs vendor=25.0 mi
- RS-A01 Plus (samebike-rs-a01-plus): max_speed_mph DB=16.0 vs vendor=25.0 mph
- XD26-II (samebike-xd26-ii): range_manufacturer DB=62.0 vs vendor=16.0 mi

**Possibly discontinued** (2) - left active in DB (preserving SEO):
- M20 (samebike-m20)
- M20-III (samebike-m20-iii)

### DYU

**Prices updated** (7):
- D3F (dyu-d3f): $599.00 -> $499.00 ($-100.00)
- A1F Pro (dyu-a1f-pro): $549.00 -> $429.00 ($-120.00)
- T1 (dyu-t1): $769.00 -> $699.00 ($-70.00)
- A5 (dyu-a5): $569.00 -> $519.00 ($-50.00)
- Stroll 1 (dyu-stroll-1): $1099.00 -> $999.00 ($-100.00)
- M20 (dyu-m20): $1039.00 -> $949.00 ($-90.00)
- C9 (dyu-c9): $989.00 -> $899.00 ($-90.00)

**New bikes inserted** (3):
- C6 (dyu-c6-26-inch-city-electric-bike): $819 - DYU C6 26 Inch City Electric Bike
- C2 (dyu-c2-16-inch-full-folding-electric-bike): $549 - DYU C2 16 Inch Full Folding Electric Bike
- C5 (dyu-c5-27-5-inch-city-electric-bike): $799 - DYU C5 27.5 Inch City Electric Bike

**Spec discrepancies flagged for review** (2) - not auto-applied:
- A5 (dyu-a5): weight_lbs DB=40.0 vs vendor=49.0 lb
- M20 (dyu-m20): range_manufacturer DB=99.0 vs vendor=16.0 mi

### VTUVIA

**Price changes flagged for review** (1) - variant ambiguity, not applied:
- CMB (vtuvia-cmb): DB $1899.00 vs vendor $2149.00 (vendor catalog now lists two CMB variants: 8-Speed at $1899 (matches DB) and 10-Speed at $2149; the 10-speed is a new variant, not a price change on the 8-speed)

**New bikes inserted** (3):
- FMB (vtuvia-fmb-full-suspension-mountain-ebike): $2999 - VTUVIA FMB Ebike
- GIRAFFE (vtuvia-giraffe-step-thru-city-commuter-electric-bike): $1599 - VTUVIA Giraffe Ebike
- REINDEER 1.0 (vtuvia-reindeer-step-thru-electric-bike): $1699 - VTUVIA Reindeer 1.0

**New candidates skipped (not real bikes)** (3):
- rv-rider-e-bike-rack - RV Rider E-Bike Rack (not a real e-bike (rack/utility/etc))
- destination-e-bike-rack-for-electric-bikes - Destination E Bike Rack for Electric Bikes (not a real e-bike (rack/utility/etc))
- sport-rider-bike-rack - Sport Rider Bike Rack (not a real e-bike (rack/utility/etc))

**Spec discrepancies flagged for review** (4) - not auto-applied:
- Zeal XT8 (vtuvia-zeal-xt8): weight_lbs DB=65.0 vs vendor=50.0 lb
- SF20H (vtuvia-sf20h): weight_lbs DB=60.0 vs vendor=330.0 lb
- Zeal LT7 (vtuvia-zeal-lt7): weight_lbs DB=62.0 vs vendor=50.0 lb
- SN100 (vtuvia-sn100): weight_lbs DB=87.0 vs vendor=400.0 lb

### Notes

- Price updates were deferred for ENGWE (DB has `price_usd=NULL`; need to confirm whether `price` column currently holds EUR-converted or USD values before overwriting).
- Walfisk had only one candidate price match (`ET-7 Ultra` vs vendor's `ET-7 1500W/3000W rear-motor` listing) which is clearly a wrong match - logged for review, not applied.
- No spec values were auto-updated this run: vendor body_html parsing produced several implausible deltas (e.g. weight 441 lb, torque 110 Nm batteries). Owner to review.
- No DB rows were deactivated; possibly-discontinued items are kept `is_active=true` to preserve SEO history.
- VTUVIA's only flagged price change (CMB) is a new 10-speed variant the vendor added alongside the existing 8-speed; not a price change on the existing DB row. Owner can decide whether to add the 10-speed as a separate listing.
- `affiliate-partners.xlsx` could not be updated this run: file was open in Excel (PermissionError). Spreadsheet timestamps for active brands are unchanged.
- Final tallies: 42 prices updated, 21 new bikes inserted (109 ebike rows total after sync, was 88).
