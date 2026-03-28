import { createClient } from '@supabase/supabase-js';
import { EBike, KeuzeHulpState } from './types';

function withAffiliateTag(urlStr: string | null | undefined): string {
  if (!urlStr) return '';
  try {
    const url = new URL(urlStr);
    if (url.hostname.includes('engwe')) {
      url.searchParams.set('ref', 'uzjsbqmm');
      return url.toString();
    }
    return urlStr;
  } catch {
    return urlStr;
  }
}

export function mapRowToEBike(row: Record<string, unknown>): EBike {
  return {
    id: row.id as string,
    slug: row.slug as string,
    brand: row.brand as string,
    model: row.model as string,
    year: row.year as number,
    price: Number(row.price),
    priceCategory: row.price_category as 'budget' | 'midden' | 'premium',
    images: (row.images as string[]) || [],
    motorType: row.motor_type as 'midden' | 'naaf-voor' | 'naaf-achter',
    motorBrand: row.motor_brand as string,
    torque: row.torque as number,
    supportLevels: row.support_levels as number,
    batteryCapacity: row.battery_capacity as number,
    rangeManufacturer: row.range_manufacturer as number,
    rangePractical: row.range_practical as number,
    chargeTime: Number(row.charge_time),
    batteryRemovable: row.battery_removable as boolean,
    frameType: row.frame_type as 'laag-instap' | 'hoog-instap' | 'sportief',
    frameMaterial: row.frame_material as string,
    wheelSize: Number(row.wheel_size),
    weight: Number(row.weight),
    maxWeight: row.max_weight as number,
    gearType: row.gear_type as 'derailleur' | 'naaf' | 'cvt',
    gearCount: row.gear_count as number,
    gearBrand: row.gear_brand as string,
    suitableFor: row.suitable_for as ('woon-werk' | 'recreatief' | 'sportief' | 'transport' | 'off-road')[],
    scoreOverall: Number(row.score_overall),
    scorePriceQuality: Number(row.score_price_quality),
    scoreComfort: Number(row.score_comfort),
    scoreRange: Number(row.score_range),
    affiliateUrl: withAffiliateTag(row.affiliate_url as string),
    testRideUrl: withAffiliateTag(row.test_ride_url as string),
    description: row.description as string,
    highlights: (row.highlights as string[]) || [],
  };
}

export async function getAllBikes(): Promise<EBike[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
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
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
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
    .filter(b => b.id !== bike.id)
    .map(b => {
      let similarity = 0;
      if (b.brand === bike.brand) similarity += 2;
      const sharedUsage = b.suitableFor.filter(u => bike.suitableFor.includes(u));
      similarity += sharedUsage.length;
      if (b.frameType === bike.frameType) similarity += 1;
      if (b.motorType === bike.motorType) similarity += 1;
      if (Math.abs(b.price - bike.price) < 300) similarity += 2;
      return { bike: b, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, count)
    .map(s => s.bike);
}


export async function getRecommendations(state: KeuzeHulpState): Promise<EBike[]> {
  const allBikes = await getAllBikes();
  const scored = allBikes.map(bike => {
    let score = 0;

    if (bike.price >= state.budget[0] && bike.price <= state.budget[1]) {
      score += 30;
    } else if (bike.price < state.budget[0]) {
      score += 15;
    }

    const usageOverlap = state.gebruiksDoel.filter(g => bike.suitableFor.includes(g));
    score += usageOverlap.length * 15;

    if (state.frameVoorkeur && state.frameVoorkeur !== 'geen-voorkeur') {
      if (bike.frameType === state.frameVoorkeur) score += 10;
    }

    if (state.woonWerkAfstand && state.gebruiksDoel.includes('woon-werk')) {
      const neededRange = state.woonWerkAfstand * 2 * 1.3;
      if (bike.rangePractical >= neededRange) {
        score += 20;
      }
    }

    return { bike, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map(s => s.bike);
}
