'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EBike } from '@/lib/types';

const motorLabels: Record<string, string> = { 'mid-drive': 'Mid-drive', 'front-hub': 'Front hub', 'rear-hub': 'Rear hub' };
const purposeLabels: Record<string, string> = { 'commuting': 'Getting to work', 'recreation': 'Weekend rides', 'sport': 'Fitness & speed', 'cargo': 'Hauling & family' };
const terrainLabels: Record<string, string> = { 'flat': 'City streets', 'hilly': 'Hills & climbs', 'mixed': 'Trails & gravel' };
const frameLabels: Record<string, string> = { 'step-through': 'Step-through', 'step-over': 'Step-over', 'sport': 'Sport' };

interface MatchResult {
  label: string;
  want: string;
  matches: boolean;
  detail: string;
}

export default function FilterMatchBlock({ bike }: { bike: EBike }) {
  const searchParams = useSearchParams();

  const budget = searchParams.get('budget');
  const purpose = searchParams.get('purpose');
  const terrain = searchParams.get('terrain');
  const height = searchParams.get('height');
  const frame = searchParams.get('frame');
  const range = searchParams.get('range');
  const foldable = searchParams.get('foldable');
  const removableBattery = searchParams.get('removableBattery');
  const maxWeight = searchParams.get('maxWeight');
  const motor = searchParams.get('motor');

  const hasFilters = budget || purpose || terrain || height || frame || range || foldable || removableBattery || maxWeight || motor;
  if (!hasFilters) return null;

  const results: MatchResult[] = [];

  // Budget check
  if (budget) {
    const max = Number(budget);
    results.push({
      label: '💰',
      want: `Budget up to $${max.toLocaleString('en-US')}`,
      matches: bike.price <= max,
      detail: bike.price <= max
        ? `$${bike.price.toLocaleString('en-US')}, within your budget`
        : `$${bike.price.toLocaleString('en-US')}, $${(bike.price - max).toLocaleString('en-US')} over your budget`,
    });
  }

  // Usage check
  if (purpose) {
    const purposes = purpose.split(',');
    const bikePurposes = bike.suitableFor;
    const matched = purposes.filter(d => bikePurposes.includes(d as EBike['suitableFor'][number]));
    results.push({
      label: '🚴',
      want: `Good for ${purposes.map(d => purposeLabels[d] || d).join(', ')}`,
      matches: matched.length > 0,
      detail: matched.length > 0
        ? `Suited for ${matched.map(d => purposeLabels[d] || d).join(', ')}`
        : `Not specifically built for ${purposes.map(d => purposeLabels[d] || d).join(', ')}`,
    });
  }

  // Terrain check
  if (terrain) {
    let matches = true;
    let detail = '';
    if (terrain === 'hilly') {
      matches = bike.torque >= 50;
      detail = matches
        ? `${bike.torque} Nm torque, plenty for hills`
        : `${bike.torque} Nm torque, may be low for hills (50+ Nm recommended)`;
    } else if (terrain === 'mixed') {
      matches = bike.suitableFor.includes('off-road') || bike.suitableFor.includes('sport');
      detail = matches ? 'Good for mixed terrain and trails' : 'Not specifically designed for off-road';
    } else {
      detail = 'Good for flat city riding';
    }
    results.push({
      label: '🗺️',
      want: `Terrain: ${terrainLabels[terrain] || terrain}`,
      matches,
      detail,
    });
  }

  // Height ranges check
  const heightRanges = searchParams.get('heightRanges');
  if (heightRanges) {
    const ranges = heightRanges.split(',');
    const bikeMin = bike.minRiderHeight || 0;
    const bikeMax = bike.maxRiderHeight || 999;

    const matches = ranges.some(r => {
      let min = 0;
      let max = 999;
      if (r.startsWith('<')) max = parseInt(r.substring(1));
      else if (r.endsWith('+')) min = parseInt(r.substring(0, r.length - 1));
      else {
        const parts = r.split('-');
        min = parseInt(parts[0]);
        max = parseInt(parts[1]);
      }
      return bikeMin <= max && bikeMax >= min;
    });

    results.push({
      label: '📏',
      want: `Rider height: ${ranges.join(', ')} in`,
      matches,
      detail: matches
        ? `Fits riders ${bikeMin}–${bikeMax}", matches your selection`
        : `Fits riders ${bikeMin}–${bikeMax}", differs from your selection`,
    });
  }

  // Specific height check
  if (height) {
    const h = Number(height);
    const hasRange = bike.minRiderHeight && bike.maxRiderHeight;
    const matches = hasRange ? (h >= bike.minRiderHeight! && h <= bike.maxRiderHeight!) : true;
    results.push({
      label: '📏',
      want: `Your height: ${h}"`,
      matches,
      detail: hasRange
        ? (matches
          ? `Recommended for ${bike.minRiderHeight}–${bike.maxRiderHeight}", perfect fit`
          : `Recommended for ${bike.minRiderHeight}–${bike.maxRiderHeight}", may not be ideal`)
        : 'No specific height recommendation available',
    });
  }

  // Frame type check
  if (frame) {
    const frames = frame.split(',');
    const matches = frames.includes(bike.frameType);
    results.push({
      label: '🖼️',
      want: `Frame type: ${frames.map(f => frameLabels[f] || f).join(', ')}`,
      matches,
      detail: matches
        ? `This is a ${frameLabels[bike.frameType]} frame`
        : `This is a ${frameLabels[bike.frameType]} frame (you wanted ${frames.map(f => frameLabels[f] || f).join(', ')})`,
    });
  }

  // Range check
  if (range) {
    const min = Number(range);
    const matches = bike.rangePractical >= min;
    results.push({
      label: '🔋',
      want: `At least ${min} mi range`,
      matches,
      detail: matches
        ? `~${bike.rangePractical} mi real-world range, sufficient`
        : `~${bike.rangePractical} mi real-world range, ${min - bike.rangePractical} mi short`,
    });
  }

  // Motor type check
  if (motor) {
    const motors = motor.split(',');
    const matches = motors.includes(bike.motorType);
    results.push({
      label: '⚙️',
      want: `Motor type: ${motors.map(m => motorLabels[m] || m).join(', ')}`,
      matches,
      detail: matches
        ? `${motorLabels[bike.motorType]}, as desired`
        : `${motorLabels[bike.motorType]} (you wanted ${motors.map(m => motorLabels[m] || m).join(', ')})`,
    });
  }

  // Foldable check
  if (foldable === '1') {
    const isFoldable = bike.dimensions?.foldedSize && bike.dimensions.foldedSize !== 'Yes';
    results.push({
      label: '📐',
      want: 'Foldable',
      matches: !!isFoldable,
      detail: isFoldable
        ? `Folds down to ${bike.dimensions!.foldedSize}`
        : 'This bike does not fold',
    });
  }

  // Battery removable check
  if (removableBattery === '1') {
    results.push({
      label: '🔌',
      want: 'Removable battery',
      matches: bike.batteryRemovable,
      detail: bike.batteryRemovable
        ? 'Battery is removable for separate charging'
        : 'Battery is not removable',
    });
  }

  // Weight check
  if (maxWeight) {
    const max = Number(maxWeight);
    const matches = bike.weight <= max;
    results.push({
      label: '⚖️',
      want: `Max ${max} lbs bike weight`,
      matches,
      detail: matches
        ? `${bike.weight} lbs, light enough`
        : `${bike.weight} lbs, ${(bike.weight - max).toFixed(0)} lbs too heavy`,
    });
  }

  const matchCount = results.filter(r => r.matches).length;
  const totalCount = results.length;
  const matchPct = Math.round((matchCount / totalCount) * 100);
  const allMatch = matchCount === totalCount;

  const overviewUrl = `/e-bikes/overzicht?${searchParams.toString()}`;

  return (
    <div className={`rounded-xl border-2 p-6 mb-8 ${allMatch
      ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
      : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900'}`
    }>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white ${allMatch ? 'bg-[var(--accent)]' : 'bg-amber-500'}`}>
            {matchCount}/{totalCount}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              {allMatch ? 'A perfect match for you!' : 'Matches your needs'}
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Based on your selected filters
            </p>
          </div>
        </div>
        <Link
          href={overviewUrl}
          className="text-xs font-bold px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--muted)] hover:bg-[var(--surface)] transition-colors"
        >
          ← Back to overview
        </Link>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[var(--surface)] rounded-full h-2 mb-5">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${allMatch ? 'bg-[var(--accent)]' : 'bg-amber-500'}`}
          style={{ width: `${matchPct}%` }}
        />
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {results.map((r, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${
              r.matches
                ? 'bg-[var(--card-bg)] border-[var(--accent)]'
                : 'bg-[var(--card-bg)] border-red-100 dark:border-red-900'
            }`}
          >
            <span className="text-lg mt-0.5">{r.matches ? '✅' : '❌'}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)]">{r.want}</p>
              <p className={`text-xs mt-0.5 ${r.matches ? 'text-[var(--accent)]' : 'text-red-500 dark:text-red-400'}`}>{r.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
