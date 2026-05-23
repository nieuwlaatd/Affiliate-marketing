/**
 * US e-bike scraper — Shopify `products.json` based (reliable, no HTML parsing).
 *
 * Run:
 *   npx tsx scripts/scrape-us-ebikes.ts            # writes data/ + seed SQL
 *   npx tsx scripts/scrape-us-ebikes.ts --push     # also upserts to Supabase
 *
 * (Node 24 can also run it directly: `node scripts/scrape-us-ebikes.ts`.)
 *
 * It pulls every product from each brand's Shopify storefront, keeps the real
 * e-bikes, extracts specs from the title + body_html, computes the 7-axis
 * score model, and emits:
 *   - data/us-ebikes.json          (inspectable)
 *   - supabase-seed-us-ebikes.sql  (idempotent upsert by slug)
 *
 * Add a brand by appending to BRANDS. `affiliateKey` must match a keyword in
 * lib/ebike-data.ts AFFILIATE_TAGS so links get tagged at render time.
 */

import { load } from 'cheerio';
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Curated overrides — for brands whose Shopify body_html has NO spec text
 * (specs live in images). Keyed by a substring that must appear in the product
 * title (case-insensitive). Matched products get these fields force-set.
 * Edit data/curated-overrides.json to correct or extend.
 */
type Override = { titleIncludes: string; brand: string } & Partial<ParsedBike>;
function loadOverrides(): Override[] {
  const p = join('data', 'curated-overrides.json');
  if (!existsSync(p)) return [];
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as Override[];
  } catch {
    return [];
  }
}

interface BrandConfig {
  brand: string;
  base: string; // storefront origin, no trailing slash
  affiliateNetwork: 'goaffpro' | 'direct';
  brandCountry: string;
  shipsToUs: boolean;
  warrantyYears: number;
  /** product handles/titles to skip (accessories, kids, UTV, scooters...) */
  excludeRe: RegExp;
}

const BRANDS: BrandConfig[] = [
  {
    brand: 'Walfisk',
    base: 'https://walfiskebike.com',
    affiliateNetwork: 'goaffpro',
    brandCountry: 'CN',
    shipsToUs: true,
    warrantyYears: 1,
    excludeRe: /(spare part|accessor|battery only|charger|tire only|tube|wheel set)/i,
  },
  {
    brand: 'Eunorau',
    base: 'https://eunorau-ebike.com',
    affiliateNetwork: 'goaffpro',
    brandCountry: 'US',
    shipsToUs: true,
    warrantyYears: 2,
    excludeRe: /(wheel set|conversion kit|battery|charger|accessor|part|spare|kids|ekids|utility vehicle|utv|scooter|trike|bundle|2x )/i,
  },
  {
    brand: 'DUOTTS',
    base: 'https://duotts.com',
    affiliateNetwork: 'goaffpro',
    brandCountry: 'CN',
    shipsToUs: true,
    warrantyYears: 1,
    excludeRe: /(part|spare|accessor|charger|battery only|helmet|lock|bag|rack|ship-to-uk|eu version)/i,
  },
];

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  product_type: string;
  tags: string[] | string;
  body_html: string;
  vendor: string;
  images: { src: string }[];
  variants: { price: string; available: boolean }[];
};

const num = (s: string | undefined | null) => {
  if (!s) return undefined;
  const m = s.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : undefined;
};

const KM_TO_MI = 0.621371;
const KG_TO_LB = 2.20462;

function textOf(html: string): string {
  try {
    return load(html).text().replace(/\s+/g, ' ').trim();
  } catch {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
}

function pick(re: RegExp, ...sources: string[]): string | undefined {
  for (const s of sources) {
    const m = s.match(re);
    if (m) return m[1] ?? m[0];
  }
  return undefined;
}

interface ParsedBike {
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  priceCategory: 'budget' | 'mid-range' | 'premium';
  images: string[];
  motorType: 'mid-drive' | 'rear-hub' | 'front-hub';
  motorBrand: string;
  motorWatts: number;
  torque: number;
  supportLevels: number;
  batteryCapacity: number; // Ah
  rangeManufacturer: number; // mi
  rangePractical: number; // mi
  chargeTime: number;
  batteryRemovable: boolean;
  frameType: 'step-through' | 'step-over' | 'sport';
  frameMaterial: string;
  wheelSize: number;
  weight: number; // lbs
  maxWeight: number; // lbs payload
  gearType: 'derailleur' | 'internal-hub' | 'single-speed' | 'cvt';
  gearCount: number;
  gearBrand: string;
  suitableFor: string[];
  bikeClass: 'class-1' | 'class-2' | 'class-3' | null;
  hasThrottle: boolean;
  hasSuspension: 'none' | 'front' | 'full';
  maxSpeedMph: number;
  affiliateNetwork: string;
  brandCountry: string;
  shipsToUs: boolean;
  warrantyYears: number;
  description: string;
  highlights: string[];
  affiliateUrl: string;
  scoreOverall: number;
  scoreValue: number;
  scoreRange: number;
  scorePower: number;
  scoreComfort: number;
  scoreBuildQuality: number;
  scoreVersatility: number;
}

function classify(mph: number, hasThrottle: boolean): ParsedBike['bikeClass'] {
  if (!mph) return null;
  if (mph >= 27) return 'class-3';
  if (mph >= 19 && hasThrottle) return 'class-2';
  if (mph >= 19) return 'class-1';
  return 'class-2';
}

function parseProduct(p: ShopifyProduct, cfg: BrandConfig): ParsedBike | null {
  const title = p.title;
  const handle = p.handle;
  const tagStr = Array.isArray(p.tags) ? p.tags.join(' ') : p.tags || '';
  const haystack = `${title} ${p.product_type} ${tagStr}`;

  // Hard accessory/part reject (applies to every brand).
  const ACCESSORY_RE =
    /\b(charger|fender|pannier|helmet|\block\b|inner tube|tire only|tyre only|pedal set|saddle|seatpost|kickstand|mirror|light kit|wheel ?set|conversion kit)\b/i;
  if (ACCESSORY_RE.test(`${title} ${handle}`)) return null;
  if (cfg.excludeRe.test(`${title} ${handle}`)) return null;

  // A "battery" product is an accessory unless it also advertises a motor or is
  // explicitly an electric bike.
  const mentionsBattery = /\bbatter(y|ies)\b/i.test(title);
  const looksElectricBike = /(e-?bike|electric bike|electric bicycle|bicycle|电动自行车)/i.test(haystack);
  const advertisesMotor = /\b\d{3,4}\s*w\b/i.test(title);
  if (mentionsBattery && !advertisesMotor && !looksElectricBike) return null;
  if (/\bbattery\s+for\b|\bbattery\s*$/i.test(title)) return null;

  const isBike = looksElectricBike || advertisesMotor || /ebike|e-bike/i.test(tagStr);
  if (!isBike) return null;

  const price = num(p.variants?.[0]?.price) ?? 0;
  if (price < 600) return null; // real US e-bikes start well above this

  const body = textOf(p.body_html || '');
  const all = `${title} ${body}`;

  const watts = num(pick(/(\d{3,4})\s*W\b/i, all)) ?? 0;
  const volts = num(pick(/(\d{2,3})\s*V\b/i, all)) ?? 48;
  const ah = num(pick(/([\d.]+)\s*A[hH]\b/i, all)) ?? 0;
  let mph = num(pick(/([\d.]+)\s*mph/i, all)) ?? 0;
  if (!mph) {
    const kmh = num(pick(/([\d.]+)\s*km\/?h/i, all));
    if (kmh) mph = Math.round(kmh * KM_TO_MI);
  }
  let rangeMi = num(pick(/([\d.]+)\s*(?:miles|mile|mi)\b/i, all)) ?? 0;
  if (!rangeMi) {
    const km = num(pick(/([\d.]+)\s*km\b/i, all));
    if (km) rangeMi = Math.round(km * KM_TO_MI);
  }
  let weightLb = num(pick(/([\d.]+)\s*(?:lbs|lb|pounds)\b/i, all)) ?? 0;
  if (!weightLb) {
    const kg = num(pick(/([\d.]+)\s*kg\b/i, all));
    if (kg) weightLb = Math.round(kg * KG_TO_LB);
  }
  let payloadLb = num(pick(/(?:payload|max(?:imum)? load|capacity)[^\d]{0,12}([\d.]+)\s*(?:lbs|lb)/i, all)) ?? 0;
  if (!payloadLb) {
    const kg = num(pick(/(?:payload|max load|capacity)[^\d]{0,12}([\d.]+)\s*kg/i, all));
    if (kg) payloadLb = Math.round(kg * KG_TO_LB);
  }
  const torque = num(pick(/([\d.]+)\s*N[·.]?m/i, all)) ?? 0;
  const wheel = num(pick(/\b(16|20|24|26|27\.5|28|29)\s*(?:inch|"|”|in\b)/i, all)) ?? 26;

  const lower = all.toLowerCase();
  const isMid = /(mid-?drive|mid motor|bafang m6|m600|m615|m620|m510|m500)/.test(lower);
  const motorType: ParsedBike['motorType'] = isMid ? 'mid-drive' : 'rear-hub';
  const motorBrand = /bafang/.test(lower) ? 'Bafang' : isMid ? 'Mid-drive' : 'Hub';
  const frameType: ParsedBike['frameType'] = /step-?thr(o|u)|low-?step|step thru/.test(lower)
    ? 'step-through'
    : /(mtb|mountain|sport|trail)/.test(lower)
      ? 'sport'
      : 'step-over';
  const hasFull = /full[-\s]?suspension|dual suspension|rear shock/.test(lower);
  const hasFront = hasFull || /(front fork|suspension fork|hydraulic fork|front suspension|rockshox)/.test(lower);
  const hasSuspension: ParsedBike['hasSuspension'] = hasFull ? 'full' : hasFront ? 'front' : 'none';
  const hasThrottle = /(throttle)/.test(lower) || (mph > 0 && mph <= 28 && !/no throttle/.test(lower));
  const removable = /(removable|detachable).{0,18}batter|batter.{0,18}(removable|detachable)/.test(lower);

  // gears
  const gearCount = num(pick(/(\d{1,2})[-\s]?speed/i, all)) ?? 7;
  const gearType: ParsedBike['gearType'] = gearCount <= 1 ? 'single-speed' : 'derailleur';
  const gearBrand = /shimano/.test(lower) ? 'Shimano' : /sram/.test(lower) ? 'SRAM' : 'Generic';

  // suitable-for heuristic
  const suitable = new Set<string>();
  if (/(commut|city|urban|step-?thr)/.test(lower)) suitable.add('commuting');
  if (/(fat|off-?road|trail|mountain|mtb|all-?terrain|moto)/.test(lower)) suitable.add('off-road');
  if (/(cargo|utility|hauling|family|passenger)/.test(lower)) suitable.add('cargo');
  if (/(sport|fast|performance|speed|mtb)/.test(lower)) suitable.add('sport');
  suitable.add('recreation');
  if (suitable.size === 1) suitable.add('commuting');

  const priceCategory: ParsedBike['priceCategory'] = price < 1200 ? 'budget' : price < 2400 ? 'mid-range' : 'premium';


  const codeMatch = title.match(
    /\b(WF\s?\d+\w*|ET-?\d+\s?(?:ULTRA|PRO)?|VIPERA|URUS\s?\d*(?:\.\d)?|META\s?\d+\s?(?:\d\.\d)?|DEFENDER(?:-S)?|FAT-?AWD\s?\d?(?:\.\d)?|E-?FAT-?MN|SPECTER-?\w*|C29\w*|C29|S26|F26\w*|F20|N26|E29|E26|G\d{3})\b/i
  );
  const model =
    (codeMatch ? codeMatch[1].replace(/\s+/g, ' ').trim() : '') ||
    title
      .replace(/walfisk|eunorau|duotts/gi, '')
      .replace(/electric bike|e-?bike|ebike|fat tire|brushless motor/gi, '')
      .replace(/\b\d+["“”]?\s*(?:inch|in)?\b/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .split(/[,|–-]/)[0]
      .trim()
      .slice(0, 40) ||
    title.slice(0, 40);
  const cleanModel = model.replace(/^[\s.\-|,"“”]+|[\s.\-|,"“”]+$/g, '').trim() || title.slice(0, 40);

  const slug = `${cfg.brand}-${handle}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  const highlights = [
    watts ? `${watts}W motor` : null,
    volts && ah ? `${volts}V ${ah}Ah battery` : null,
    rangeMi ? `Up to ${rangeMi} mi range` : null,
    mph ? `${mph} mph top speed` : null,
    hasSuspension !== 'none' ? `${hasSuspension === 'full' ? 'Full' : 'Front'} suspension` : null,
  ].filter(Boolean) as string[];

  const bike: ParsedBike = {
    slug,
    brand: cfg.brand,
    model: cleanModel,
    year: 2026,
    price,
    priceCategory,
    images: (p.images || []).slice(0, 4).map((i) => i.src),
    motorType,
    motorBrand,
    motorWatts: watts || 0,
    torque: torque || 0,
    supportLevels: 5,
    batteryCapacity: ah || 0,
    rangeManufacturer: rangeMi || 0,
    rangePractical: rangeMi ? Math.round(rangeMi * 0.75) : 0,
    chargeTime: 6,
    batteryRemovable: removable,
    frameType,
    frameMaterial: /carbon/.test(lower) ? 'Carbon' : 'Aluminum',
    wheelSize: wheel,
    weight: weightLb || 0,
    maxWeight: payloadLb || 0,
    gearType,
    gearCount,
    gearBrand,
    suitableFor: [...suitable],
    bikeClass: classify(mph, hasThrottle),
    hasThrottle,
    hasSuspension,
    maxSpeedMph: mph || 0,
    affiliateNetwork: cfg.affiliateNetwork,
    brandCountry: cfg.brandCountry,
    shipsToUs: cfg.shipsToUs,
    warrantyYears: cfg.warrantyYears,
    description: (body || title).slice(0, 400),
    highlights,
    affiliateUrl: `${cfg.base}/products/${handle}`,
    scoreOverall: 0,
    scoreValue: 0,
    scoreRange: 0,
    scorePower: 0,
    scoreComfort: 0,
    scoreBuildQuality: 0,
    scoreVersatility: 0,
  };
  return rescore(bike);
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const round1 = (n: number) => Math.round(n * 10) / 10;

/** Recompute the 7-axis score model from a bike's spec fields. */
function rescore(b: ParsedBike): ParsedBike {
  const rangeScore = clamp(b.rangeManufacturer / 8, 1, 10);
  const powerScore = clamp(b.motorWatts / 200 + b.torque / 18, 1, 10);
  const comfortScore = clamp(
    3 +
      (b.hasSuspension === 'full' ? 4 : b.hasSuspension === 'front' ? 2 : 0) +
      (b.frameType === 'step-through' ? 2 : 0) +
      (b.wheelSize >= 26 ? 1 : 0),
    1,
    10
  );
  const buildScore = clamp(
    4 +
      (b.motorBrand === 'Bafang' ? 2 : 0) +
      (b.warrantyYears >= 2 ? 2 : 1) +
      (b.gearBrand !== 'Generic' ? 1 : 0),
    1,
    10
  );
  const versatility = clamp(b.suitableFor.length * 2, 1, 10);
  const specPower = (b.motorWatts || 500) + (b.batteryCapacity || 12) * 25 + b.rangeManufacturer * 8;
  const valueScore = clamp(specPower / (b.price / 1.6), 1, 10);
  b.scoreRange = round1(rangeScore);
  b.scorePower = round1(powerScore);
  b.scoreComfort = round1(comfortScore);
  b.scoreBuildQuality = round1(buildScore);
  b.scoreVersatility = round1(versatility);
  b.scoreValue = round1(valueScore);
  b.scoreOverall = round1(
    valueScore * 0.25 +
      rangeScore * 0.2 +
      powerScore * 0.15 +
      comfortScore * 0.15 +
      buildScore * 0.15 +
      versatility * 0.1
  );
  return b;
}

async function fetchProducts(cfg: BrandConfig): Promise<ShopifyProduct[]> {
  const out: ShopifyProduct[] = [];
  for (let page = 1; page <= 6; page++) {
    const url = `${cfg.base}/products.json?limit=250&page=${page}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 HarkuhhBot' } });
    if (!res.ok) break;
    const json = (await res.json()) as { products: ShopifyProduct[] };
    if (!json.products?.length) break;
    out.push(...json.products);
    if (json.products.length < 250) break;
  }
  return out;
}

function sqlStr(s: string): string {
  return `'${String(s).replace(/'/g, "''")}'`;
}
function sqlArr(a: string[]): string {
  return `ARRAY[${a.map(sqlStr).join(',')}]::text[]`;
}

function toSql(bikes: ParsedBike[]): string {
  const cols = [
    'slug', 'brand', 'model', 'year', 'price', 'price_usd', 'price_category', 'images',
    'motor_type', 'motor_brand', 'torque', 'support_levels', 'battery_capacity',
    'range_manufacturer', 'range_practical', 'range_miles', 'charge_time', 'battery_removable',
    'frame_type', 'frame_material', 'wheel_size', 'weight', 'weight_lbs', 'max_weight',
    'gear_type', 'gear_count', 'gear_brand', 'suitable_for', 'bike_class', 'has_throttle',
    'has_suspension', 'max_speed_mph', 'affiliate_network', 'brand_country', 'ships_to_us',
    'warranty_years', 'description', 'highlights', 'affiliate_url', 'test_ride_url',
    'score_overall', 'score_value', 'score_range', 'score_power', 'score_comfort',
    'score_build_quality', 'score_versatility',
  ];
  const rows = bikes.map((b) => `(${[
    sqlStr(b.slug), sqlStr(b.brand), sqlStr(b.model), b.year, b.price, b.price, sqlStr(b.priceCategory),
    sqlArr(b.images), sqlStr(b.motorType), sqlStr(b.motorBrand), b.torque, b.supportLevels,
    b.batteryCapacity, b.rangeManufacturer, b.rangePractical, b.rangeManufacturer, b.chargeTime,
    b.batteryRemovable, sqlStr(b.frameType), sqlStr(b.frameMaterial), b.wheelSize, b.weight, b.weight,
    b.maxWeight, sqlStr(b.gearType), b.gearCount, sqlStr(b.gearBrand), sqlArr(b.suitableFor),
    b.bikeClass ? sqlStr(b.bikeClass) : 'NULL', b.hasThrottle, sqlStr(b.hasSuspension), b.maxSpeedMph,
    sqlStr(b.affiliateNetwork), sqlStr(b.brandCountry), b.shipsToUs, b.warrantyYears,
    sqlStr(b.description), sqlArr(b.highlights), sqlStr(b.affiliateUrl), sqlStr(b.affiliateUrl),
    b.scoreOverall, b.scoreValue, b.scoreRange, b.scorePower, b.scoreComfort,
    b.scoreBuildQuality, b.scoreVersatility,
  ].join(', ')})`);

  const updates = cols.filter((c) => c !== 'slug').map((c) => `${c}=EXCLUDED.${c}`).join(', ');
  return [
    '-- Auto-generated by scripts/scrape-us-ebikes.ts. Run in Supabase SQL editor.',
    `INSERT INTO ebikes (${cols.join(', ')}) VALUES`,
    rows.join(',\n'),
    `ON CONFLICT (slug) DO UPDATE SET ${updates};`,
    '',
  ].join('\n');
}

async function main() {
  const all: ParsedBike[] = [];
  for (const cfg of BRANDS) {
    process.stdout.write(`Scraping ${cfg.brand}... `);
    let products: ShopifyProduct[] = [];
    try {
      products = await fetchProducts(cfg);
    } catch (e) {
      console.log(`FAILED (${(e as Error).message})`);
      continue;
    }
    const bikes = products
      .map((p) => parseProduct(p, cfg))
      .filter((b): b is ParsedBike => b !== null);
    console.log(`${products.length} products -> ${bikes.length} e-bikes`);
    all.push(...bikes);
  }

  // Apply curated overrides (fixes brands whose specs aren't in HTML text).
  const overrides = loadOverrides();
  let patched = 0;
  for (const b of all) {
    const hay = `${b.brand} ${b.model} ${b.slug} ${b.affiliateUrl}`.toLowerCase();
    const ov = overrides.find(
      (o) =>
        o.brand.toLowerCase() === b.brand.toLowerCase() &&
        hay.includes(o.titleIncludes.toLowerCase())
    );
    if (ov) {
      const { titleIncludes: _t, brand: _b, ...fields } = ov;
      Object.assign(b, fields);
      rescore(b);
      patched++;
    }
  }
  if (overrides.length) console.log(`Applied ${patched} curated override(s).`);

  // Drop bikes still missing core specs (avoids junk in the finder).
  const before = all.length;
  const clean = all.filter((b) => b.maxSpeedMph > 0 && b.rangeManufacturer > 0 && b.batteryCapacity > 0);
  if (clean.length !== before) console.log(`Dropped ${before - clean.length} bike(s) with incomplete specs.`);

  // Dedupe region/variant listings: one row per brand+model (best score, then
  // lowest price for an equivalent bike).
  const byKey = new Map<string, ParsedBike>();
  for (const b of clean) {
    const key = `${b.brand.toLowerCase()}|${b.model.toLowerCase()}`;
    const cur = byKey.get(key);
    if (
      !cur ||
      b.scoreOverall > cur.scoreOverall ||
      (b.scoreOverall === cur.scoreOverall && b.price < cur.price)
    ) {
      byKey.set(key, b);
    }
  }
  const deduped = [...byKey.values()];
  if (deduped.length !== clean.length) {
    console.log(`Deduped ${clean.length - deduped.length} variant listing(s).`);
  }
  all.length = 0;
  all.push(...deduped);

  writeFileSync(join('data', 'us-ebikes.json'), JSON.stringify(all, null, 2));
  writeFileSync('supabase-seed-us-ebikes.sql', toSql(all));
  console.log(`\nWrote data/us-ebikes.json and supabase-seed-us-ebikes.sql (${all.length} bikes).`);

  if (process.argv.includes('--push')) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      console.log('--push set but SUPABASE env vars missing; skipping DB upsert.');
      return;
    }
    const { createClient } = await import('@supabase/supabase-js');
    const sb = createClient(url, key);
    const rows = all.map((b) => ({
      slug: b.slug, brand: b.brand, model: b.model, year: b.year,
      price: b.price, price_usd: b.price, price_category: b.priceCategory,
      images: b.images, motor_type: b.motorType, motor_brand: b.motorBrand,
      torque: b.torque, support_levels: b.supportLevels, battery_capacity: b.batteryCapacity,
      range_manufacturer: b.rangeManufacturer, range_practical: b.rangePractical, range_miles: b.rangeManufacturer,
      charge_time: b.chargeTime, battery_removable: b.batteryRemovable, frame_type: b.frameType,
      frame_material: b.frameMaterial, wheel_size: b.wheelSize, weight: b.weight, weight_lbs: b.weight,
      max_weight: b.maxWeight, gear_type: b.gearType, gear_count: b.gearCount, gear_brand: b.gearBrand,
      suitable_for: b.suitableFor, bike_class: b.bikeClass, has_throttle: b.hasThrottle,
      has_suspension: b.hasSuspension, max_speed_mph: b.maxSpeedMph, affiliate_network: b.affiliateNetwork,
      brand_country: b.brandCountry, ships_to_us: b.shipsToUs, warranty_years: b.warrantyYears,
      description: b.description, highlights: b.highlights, affiliate_url: b.affiliateUrl,
      test_ride_url: b.affiliateUrl, score_overall: b.scoreOverall, score_value: b.scoreValue,
      score_range: b.scoreRange, score_power: b.scorePower, score_comfort: b.scoreComfort,
      score_build_quality: b.scoreBuildQuality, score_versatility: b.scoreVersatility,
    }));
    const { error } = await sb.from('ebikes').upsert(rows, { onConflict: 'slug' });
    console.log(error ? `Upsert error: ${error.message}` : `Upserted ${rows.length} rows to Supabase.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
