import type { Metadata } from 'next';
import { getAllBikes } from '@/lib/ebike-data';
import { FilterState } from '@/lib/types';
import OverzichtClient from './OverzichtClient';

export const metadata: Metadata = {
  title: 'All Electric Bikes | Browse, Filter & Compare 88+ Models',
  description:
    'Browse every e-bike we review. Filter by price, range, motor type, frame style and more to find the electric bike that fits your ride.',
  alternates: { canonical: '/e-bikes/overzicht' },
};

const RIDE_LABELS: Record<string, string> = {
  city: 'city streets',
  hills: 'hills & climbs',
  trails: 'trails & gravel',
  beach: 'beach & boardwalk',
  mixed: 'mixed terrain',
};

export default async function FietsenOverzichtPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const allBikes = await getAllBikes();
  const sp = await searchParams;

  const str = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined;

  const initialFilters: Partial<FilterState> = {};

  const budget = Number(str('budget'));
  if (budget && budget > 0) initialFilters.priceRange = [0, budget];

  const purpose = str('purpose');
  if (purpose) initialFilters.suitableFor = purpose.split(',');

  const terrain = str('terrain');
  if (terrain === 'flat' || terrain === 'hilly' || terrain === 'mixed') {
    initialFilters.terrain = terrain;
  }

  const distance = Number(str('distance'));
  if (distance && distance > 0) initialFilters.distancePerRide = distance;

  const height = Number(str('height'));
  if (height && height > 0) initialFilters.riderHeight = height;

  const frame = str('frame');
  if (frame === 'step-through' || frame === 'step-over' || frame === 'sport') {
    initialFilters.frameTypes = [frame];
  }

  const bikeClass = str('class');
  if (bikeClass === 'class-1' || bikeClass === 'class-2' || bikeClass === 'class-3') {
    initialFilters.bikeClasses = [bikeClass];
  }

  const ride = str('ride');
  const rideLabel = ride && RIDE_LABELS[ride] ? RIDE_LABELS[ride] : null;

  return (
    <OverzichtClient
      initialBikes={allBikes}
      initialFilters={initialFilters}
      rideLabel={rideLabel}
    />
  );
}
