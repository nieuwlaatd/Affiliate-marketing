import { createClient } from '@supabase/supabase-js';
import { EBike } from './types';

/**
 * Multi-affiliate URL tagging system.
 *
 * Each entry maps a brand keyword (matched against the destination hostname or
 * the bike's `brand` field) to a function that injects the correct affiliate
 * tracking parameters for that brand's network.
 *
 * IMPORTANT FOR DYLAN: replace every `YOUR_..._ID` placeholder with the real
 * affiliate / publisher ID you receive AFTER each program approves you.
 * Until then the original URL is returned untagged (no commission, but no
 * broken links either).
 */

const PLACEHOLDER = /^YOUR_.*_ID$/;

function appendParam(urlStr: string, key: string, value: string): string {
  if (!value || PLACEHOLDER.test(value)) return urlStr;
  try {
    const url = new URL(urlStr);
    url.searchParams.set(key, value);
    return url.toString();
  } catch {
    return urlStr;
  }
}

/** Append several query params at once (e.g. ref + utm_* for GoAffPro). */
function appendParams(urlStr: string, params: Record<string, string>): string {
  try {
    const url = new URL(urlStr);
    for (const [k, v] of Object.entries(params)) {
      if (v && !PLACEHOLDER.test(v)) url.searchParams.set(k, v);
    }
    return url.toString();
  } catch {
    return urlStr;
  }
}

/**
 * Wrap a destination URL in a network deep-link (used by AvantLink / Impact /
 * ShareASale style trackers where the merchant URL is passed as a parameter).
 */
function deepLink(base: string, destParam: string, destUrl: string, idParam: string, idValue: string): string {
  if (!idValue || PLACEHOLDER.test(idValue)) return destUrl;
  try {
    const u = new URL(base);
    u.searchParams.set(idParam, idValue);
    u.searchParams.set(destParam, destUrl);
    return u.toString();
  } catch {
    return destUrl;
  }
}

// --- Affiliate IDs ---
// Direct codes from approved programs are real values.
// `YOUR_..._ID` placeholders are filled in after each network approves you.
const AFFILIATE_IDS = {
  engweRef: 'uzjsbqmm', // active
  walfiskeRef: 'n2s1jiavyb', // active
  eunorauRef: 'mtilusfn', // active (GoAffPro)
  duottsRef: 'bestbikeforme', // active
  samebikeRef: 'ylbjvzes', // active
  dyuRef: 'n2s1jiavyb', // active
  vtuviaRef: 'n2s1jiavyb', // active
  shareasaleId: 'YOUR_SHAREASALE_ID',
  impactRadId: 'YOUR_RAD_IMPACT_ID',
  impactVelotricId: 'YOUR_VELOTRIC_IMPACT_ID',
  avantlinkId: 'YOUR_AVANTLINK_ID',
  rakutenId: 'YOUR_RAKUTEN_ID',
  goaffproId: 'YOUR_GOAFFPRO_ID',
} as const;

type Tagger = (url: string) => string;

// `pending: true` => program not yet approved; links stay untagged (clean,
// no broken links, no attribution) until you flip the flag after approval.
const AFFILIATE_TAGS: { match: string[]; tag: Tagger; pending?: boolean }[] = [
  {
    match: ['engwe'],
    tag: (url) => appendParam(url, 'ref', AFFILIATE_IDS.engweRef),
  },
  {
    match: ['walfiske', 'walfiskebike'],
    tag: (url) => appendParam(url, 'ref', AFFILIATE_IDS.walfiskeRef),
  },
  {
    match: ['eunorau'],
    tag: (url) =>
      appendParams(url, {
        ref: AFFILIATE_IDS.eunorauRef,
        utm_medium: 'affiliate',
        utm_source: 'goaffpro',
      }),
  },
  {
    match: ['duotts'],
    tag: (url) => appendParam(url, 'ref', AFFILIATE_IDS.duottsRef),
  },
  {
    match: ['samebike', 'same-bike', 'same bikes'],
    tag: (url) => appendParam(url, 'ref', AFFILIATE_IDS.samebikeRef),
  },
  {
    match: ['dyu', 'dyucycle'],
    tag: (url) => appendParam(url, 'ref', AFFILIATE_IDS.dyuRef),
  },
  {
    match: ['vtuvia', 'vtuviaebike'],
    tag: (url) => appendParam(url, 'ref', AFFILIATE_IDS.vtuviaRef),
  },
  {
    match: ['aventon'],
    tag: (url) =>
      deepLink(
        'https://www.avantlink.com/click.php',
        'url',
        url,
        'tt',
        AFFILIATE_IDS.avantlinkId
      ),
  },
  {
    match: ['trek', 'trekbikes'],
    tag: (url) =>
      deepLink(
        'https://www.avantlink.com/click.php',
        'url',
        url,
        'tt',
        AFFILIATE_IDS.avantlinkId
      ),
  },
  {
    match: ['radpowerbikes', 'rad power', 'radpower'],
    tag: (url) => appendParam(url, 'irclickid', AFFILIATE_IDS.impactRadId),
  },
  {
    match: ['velotric', 'velotricbike'],
    tag: (url) => appendParam(url, 'irclickid', AFFILIATE_IDS.impactVelotricId),
  },
  {
    match: ['lectric', 'lectricebikes'],
    tag: (url) => appendParam(url, 'sscid', AFFILIATE_IDS.shareasaleId),
  },
  {
    match: ['velowave'],
    tag: (url) => appendParam(url, 'sscid', AFFILIATE_IDS.shareasaleId),
  },
  {
    match: ['specialized'],
    tag: (url) => appendParam(url, 'ranMID', AFFILIATE_IDS.rakutenId),
  },
  {
    match: ['heybike', 'wallke'],
    tag: (url) => appendParam(url, 'ref', AFFILIATE_IDS.goaffproId),
  },
];

function withAffiliateTag(urlStr: string | null | undefined, brand?: string): string {
  if (!urlStr) return '';
  const haystack = `${urlStr} ${brand || ''}`.toLowerCase();
  for (const entry of AFFILIATE_TAGS) {
    if (entry.match.some((m) => haystack.includes(m))) {
      // Pending programs: leave the link clean until approved.
      return entry.pending ? urlStr : entry.tag(urlStr);
    }
  }
  return urlStr;
}

export function mapRowToEBike(row: Record<string, unknown>): EBike {
  const brand = row.brand as string;
  return {
    id: row.id as string,
    slug: row.slug as string,
    brand,
    model: row.model as string,
    year: row.year as number,
    price: Number(row.price_usd ?? row.price),
    priceCategory: (row.price_category as EBike['priceCategory']) || 'mid-range',
    images: (row.images as string[]) || [],
    motorType: (row.motor_type as EBike['motorType']) || 'rear-hub',
    motorBrand: row.motor_brand as string,
    torque: row.torque as number,
    supportLevels: row.support_levels as number,
    batteryCapacity: row.battery_capacity as number,
    rangeManufacturer: Number(row.range_manufacturer ?? row.range_miles ?? 0),
    rangePractical: Number(row.range_practical ?? row.range_miles ?? 0),
    chargeTime: Number(row.charge_time),
    batteryRemovable: row.battery_removable as boolean,
    frameType: (row.frame_type as EBike['frameType']) || 'step-over',
    frameMaterial: row.frame_material as string,
    wheelSize: Number(row.wheel_size),
    weight: Number(row.weight_lbs ?? row.weight),
    maxWeight: row.max_weight as number,
    gearType: (row.gear_type as EBike['gearType']) || 'derailleur',
    gearCount: row.gear_count as number,
    gearBrand: row.gear_brand as string,
    suitableFor: (row.suitable_for as EBike['suitableFor']) || [],
    scoreOverall: Number(row.score_overall ?? 0),
    scoreValue: Number(row.score_value ?? row.score_price_quality ?? 0),
    scoreRange: Number(row.score_range ?? 0),
    scorePower: Number(row.score_power ?? 0),
    scoreComfort: Number(row.score_comfort ?? 0),
    scoreBuildQuality: Number(row.score_build_quality ?? 0),
    scoreVersatility: Number(row.score_versatility ?? 0),
    affiliateUrl: withAffiliateTag(row.affiliate_url as string, brand),
    testRideUrl: withAffiliateTag(row.test_ride_url as string, brand),
    bikeClass: row.bike_class as EBike['bikeClass'],
    hasThrottle: row.has_throttle as boolean,
    hasSuspension: row.has_suspension as EBike['hasSuspension'],
    maxSpeedMph: row.max_speed_mph as number,
    affiliateNetwork: row.affiliate_network as EBike['affiliateNetwork'],
    affiliateProgramId: row.affiliate_program_id as string,
    commissionPct: row.commission_pct as number,
    cookieDays: row.cookie_days as number,
    brandCountry: row.brand_country as string,
    shipsToUs: (row.ships_to_us as boolean) ?? true,
    warrantyYears: row.warranty_years as number,
    description: row.description as string,
    highlights: (row.highlights as string[]) || [],
    availableFrameSizes: (row.available_frame_sizes as number[]) || [],
    minRiderHeight: row.min_rider_height as number,
    maxRiderHeight: row.max_rider_height as number,
    dimensions: row.dimensions as EBike['dimensions'],
    fullSpecs: row.full_specs as Record<string, string>,
  };
}

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getAllBikes(): Promise<EBike[]> {
  const { data, error } = await supabase()
    .from('ebikes')
    .select('*')
    .order('score_overall', { ascending: false });

  if (error) {
    console.error('Error fetching ebikes:', error);
    return [];
  }
  return (data || []).map(mapRowToEBike);
}

export async function getBikeBySlug(slug: string): Promise<EBike | undefined> {
  const { data, error } = await supabase()
    .from('ebikes')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return undefined;
  return mapRowToEBike(data);
}

export async function getSimilarBikes(bike: EBike, count: number = 3): Promise<EBike[]> {
  const allBikes = await getAllBikes();
  return allBikes
    .filter((b) => b.id !== bike.id)
    .map((b) => {
      let similarity = 0;
      if (b.brand === bike.brand) similarity += 2;
      const sharedUsage = b.suitableFor.filter((u) => bike.suitableFor.includes(u));
      similarity += sharedUsage.length;
      if (b.frameType === bike.frameType) similarity += 1;
      if (b.motorType === bike.motorType) similarity += 1;
      if (Math.abs(b.price - bike.price) < 400) similarity += 2;
      return { bike: b, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, count)
    .map((s) => s.bike);
}

