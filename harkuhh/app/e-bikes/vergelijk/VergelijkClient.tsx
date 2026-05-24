'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useShortlist } from '@/lib/shortlist-context';
import { EBike } from '@/lib/types';

const motorLabels: Record<string, string> = { 'mid-drive': 'Mid-drive', 'front-hub': 'Front hub', 'rear-hub': 'Rear hub' };
const frameLabels: Record<string, string> = { 'step-through': 'Step-through', 'step-over': 'Step-over', 'sport': 'Sport' };
const usageLabels: Record<string, string> = { 'commuting': 'Commuting', 'recreation': 'Recreation', 'sport': 'Sport', 'cargo': 'Cargo', 'off-road': 'Off-road' };
const gearLabels: Record<string, string> = { 'derailleur': 'Derailleur', 'internal-hub': 'Internal hub', 'cvt': 'CVT', 'single-speed': 'Single speed' };
const suspensionLabels: Record<string, string> = { 'none': 'None', 'front': 'Front only', 'full': 'Full suspension' };
const classLabels: Record<string, string> = { 'class-1': 'Class 1', 'class-2': 'Class 2', 'class-3': 'Class 3' };

const SpecRow = ({ label, values, bestIdx, cols }: { label: string; values: string[]; bestIdx?: number; cols: number }) => (
  <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${cols}, 1fr)` }}>
    <div className="text-sm text-[var(--muted)] py-2">{label}</div>
    {values.map((val, i) => (
      <div key={i} className={`text-sm font-medium py-2 ${bestIdx === i ? 'text-[var(--accent)] font-bold' : 'text-[var(--foreground)]'}`}>
        {val}
      </div>
    ))}
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <>
    <hr className="my-4 border-[var(--border)]" />
    <h3 className="text-sm font-bold text-[var(--muted)] opacity-70 uppercase tracking-wide mb-3">{title}</h3>
  </>
);

export default function VergelijkClient({ initialBikes }: { initialBikes: EBike[] }) {
  const { shortlist, isReady } = useShortlist();
  const searchParams = useSearchParams();
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized || !isReady) return;

    const slugs: string[] = [];

    const bikesParam = searchParams.get('bikes');
    if (bikesParam) {
      const paramSlugs = bikesParam.split(',').filter(s => initialBikes.some(b => b.slug === s));
      slugs.push(...paramSlugs);
    }

    for (const item of shortlist) {
      if (!slugs.includes(item.slug) && slugs.length < 3) {
        slugs.push(item.slug);
      }
    }

    if (slugs.length > 0) {
      setSelectedSlugs(slugs.slice(0, 3));
    }
    setIsInitialized(true);
  }, [shortlist, searchParams, initialBikes, isInitialized, isReady]);

  const selectedBikes = useMemo(() =>
    selectedSlugs.map(s => initialBikes.find(b => b.slug === s)).filter(Boolean) as EBike[],
    [selectedSlugs, initialBikes]
  );

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return initialBikes.filter(b =>
      !selectedSlugs.includes(b.slug) &&
      (`${b.brand} ${b.model}`.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [searchQuery, selectedSlugs, initialBikes]);

  const popularBikes = useMemo(() =>
    [...initialBikes].sort((a, b) => b.scoreOverall - a.scoreOverall).slice(0, 6),
    [initialBikes]
  );

  const addBike = (slug: string) => {
    if (selectedSlugs.length < 3 && !selectedSlugs.includes(slug)) {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
    setSearchQuery('');
  };

  const removeBike = (slug: string) => {
    setSelectedSlugs(selectedSlugs.filter(s => s !== slug));
  };

  const bestValue = (getValue: (b: EBike) => number, higher = true) => {
    if (selectedBikes.length < 2) return -1;
    const values = selectedBikes.map(getValue);
    return higher ? values.indexOf(Math.max(...values)) : values.indexOf(Math.min(...values));
  };

  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Compare e-bikes</h1>
        <p className="text-[var(--muted)] mb-8">Select up to 3 e-bikes to compare side by side.</p>

        {/* Search */}
        {selectedSlugs.length < 3 && (
          <div className="relative mb-8 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search an e-bike to add..."
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-[var(--card-bg)] rounded-lg shadow-lg border border-[var(--border)] overflow-hidden">
                {searchResults.map(bike => (
                  <button
                    key={bike.slug}
                    onClick={() => addBike(bike.slug)}
                    className="w-full text-left px-4 py-3 hover:bg-[var(--surface)] transition-colors border-b border-[var(--border)] last:border-0 flex items-center gap-3"
                  >
                    {bike.images?.[0] && (
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image src={bike.images[0]} alt={bike.model} fill className="object-contain" sizes="40px" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-medium text-[var(--foreground)]">{bike.brand}</span>{' '}
                      <span className="text-[var(--muted)]">{bike.model}</span>
                      <span className="text-sm text-[var(--muted)] opacity-60 ml-2">${bike.price.toLocaleString('en-US')}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected bike chips */}
        {selectedBikes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {selectedBikes.map(bike => (
              <span key={bike.slug} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                {bike.brand} {bike.model}
                <button onClick={() => removeBike(bike.slug)} className="hover:opacity-70">✕</button>
              </span>
            ))}
          </div>
        )}

        {/* Empty state with popular bikes */}
        {selectedBikes.length === 0 && (
          <div className="text-center py-12 bg-[var(--card-bg)] rounded-xl border border-[var(--border)]">
            <p className="text-[var(--muted)] text-lg mb-2">Select e-bikes to compare</p>
            <p className="text-[var(--muted)] opacity-60 text-sm mb-8">Search above or pick from top-rated models:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto px-6">
              {popularBikes.map(b => (
                <button
                  key={b.slug}
                  onClick={() => addBike(b.slug)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface)] transition-colors"
                >
                  {b.images?.[0] && (
                    <div className="relative w-20 h-16">
                      <Image src={b.images[0]} alt={b.model} fill className="object-contain" sizes="80px" />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xs text-[var(--muted)] opacity-70 uppercase tracking-wide">{b.brand}</p>
                    <p className="text-sm font-bold text-[var(--foreground)] leading-tight">{b.model}</p>
                    <p className="text-xs font-semibold text-[var(--muted)] mt-0.5">${b.price.toLocaleString('en-US')}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comparison table — show even with 1 bike selected */}
        {selectedBikes.length >= 1 && (
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6 overflow-x-auto">
            {/* Bike headers */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `140px repeat(${selectedBikes.length}, 1fr)` }}>
              <div></div>
              {selectedBikes.map(bike => (
                <div key={bike.slug} className="text-center flex flex-col items-center">
                  {bike.images?.[0] && (
                    <div className="relative w-28 h-28 mb-3">
                      <Image src={bike.images[0]} alt={bike.model} fill className="object-contain" sizes="112px" />
                    </div>
                  )}
                  <p className="text-xs text-[var(--muted)] opacity-70 uppercase tracking-wide">{bike.brand}</p>
                  <h3 className="font-bold text-[var(--foreground)]">{bike.model}</h3>
                  <p className="text-lg font-bold mt-1 text-[var(--foreground)]">${bike.price.toLocaleString('en-US')}</p>
                </div>
              ))}
            </div>

            <hr className="my-4 border-[var(--border)]" />

            {/* Scores */}
            <h3 className="text-sm font-bold text-[var(--muted)] opacity-70 uppercase tracking-wide mb-3">Scores</h3>
            <SpecRow cols={selectedBikes.length} label="Overall score" values={selectedBikes.map(b => `${b.scoreOverall}/10`)} bestIdx={bestValue(b => b.scoreOverall)} />
            <SpecRow cols={selectedBikes.length} label="Value" values={selectedBikes.map(b => `${b.scoreValue}/10`)} bestIdx={bestValue(b => b.scoreValue)} />
            <SpecRow cols={selectedBikes.length} label="Range" values={selectedBikes.map(b => `${b.scoreRange}/10`)} bestIdx={bestValue(b => b.scoreRange)} />
            <SpecRow cols={selectedBikes.length} label="Power" values={selectedBikes.map(b => `${b.scorePower}/10`)} bestIdx={bestValue(b => b.scorePower)} />
            <SpecRow cols={selectedBikes.length} label="Comfort" values={selectedBikes.map(b => `${b.scoreComfort}/10`)} bestIdx={bestValue(b => b.scoreComfort)} />
            <SpecRow cols={selectedBikes.length} label="Build quality" values={selectedBikes.map(b => `${b.scoreBuildQuality}/10`)} bestIdx={bestValue(b => b.scoreBuildQuality)} />
            <SpecRow cols={selectedBikes.length} label="Versatility" values={selectedBikes.map(b => `${b.scoreVersatility}/10`)} bestIdx={bestValue(b => b.scoreVersatility)} />

            {/* Motor */}
            <SectionHeader title="Motor" />
            <SpecRow cols={selectedBikes.length} label="Type" values={selectedBikes.map(b => motorLabels[b.motorType] || b.motorType)} />
            <SpecRow cols={selectedBikes.length} label="Brand" values={selectedBikes.map(b => b.motorBrand)} />
            <SpecRow cols={selectedBikes.length} label="Torque" values={selectedBikes.map(b => `${b.torque} Nm`)} bestIdx={bestValue(b => b.torque)} />
            <SpecRow cols={selectedBikes.length} label="Assist levels" values={selectedBikes.map(b => `${b.supportLevels}`)} />

            {/* Performance */}
            <SectionHeader title="Performance" />
            <SpecRow cols={selectedBikes.length} label="Top speed" values={selectedBikes.map(b => b.maxSpeedMph ? `${b.maxSpeedMph} mph` : '—')} bestIdx={bestValue(b => b.maxSpeedMph || 0)} />
            <SpecRow cols={selectedBikes.length} label="Bike class" values={selectedBikes.map(b => b.bikeClass ? classLabels[b.bikeClass] || b.bikeClass : '—')} />
            <SpecRow cols={selectedBikes.length} label="Has throttle" values={selectedBikes.map(b => b.hasThrottle ? 'Yes' : 'No')} />

            {/* Battery */}
            <SectionHeader title="Battery" />
            <SpecRow cols={selectedBikes.length} label="Capacity" values={selectedBikes.map(b => `${b.batteryCapacity} Ah`)} bestIdx={bestValue(b => b.batteryCapacity)} />
            <SpecRow cols={selectedBikes.length} label="Range (real-world)" values={selectedBikes.map(b => `~${b.rangePractical} mi`)} bestIdx={bestValue(b => b.rangePractical)} />
            <SpecRow cols={selectedBikes.length} label="Charge time" values={selectedBikes.map(b => `${b.chargeTime} hrs`)} bestIdx={bestValue(b => b.chargeTime, false)} />
            <SpecRow cols={selectedBikes.length} label="Removable" values={selectedBikes.map(b => b.batteryRemovable ? 'Yes' : 'No')} />

            {/* Frame & Dimensions */}
            <SectionHeader title="Frame & Dimensions" />
            <SpecRow cols={selectedBikes.length} label="Frame type" values={selectedBikes.map(b => frameLabels[b.frameType] || b.frameType)} />
            <SpecRow cols={selectedBikes.length} label="Frame material" values={selectedBikes.map(b => b.frameMaterial)} />
            <SpecRow cols={selectedBikes.length} label="Weight" values={selectedBikes.map(b => `${b.weight} lbs`)} bestIdx={bestValue(b => b.weight, false)} />
            <SpecRow cols={selectedBikes.length} label="Max. payload" values={selectedBikes.map(b => `${b.maxWeight} lbs`)} bestIdx={bestValue(b => b.maxWeight)} />
            <SpecRow cols={selectedBikes.length} label="Wheel size" values={selectedBikes.map(b => `${b.wheelSize}″`)} />
            <SpecRow cols={selectedBikes.length} label="Rider height" values={selectedBikes.map(b =>
              b.minRiderHeight && b.maxRiderHeight ? `${b.minRiderHeight}″ – ${b.maxRiderHeight}″` : '—'
            )} />

            {/* Drivetrain */}
            <SectionHeader title="Drivetrain" />
            <SpecRow cols={selectedBikes.length} label="Gear type" values={selectedBikes.map(b => gearLabels[b.gearType] || b.gearType)} />
            <SpecRow cols={selectedBikes.length} label="Gear count" values={selectedBikes.map(b => `${b.gearCount}-speed`)} bestIdx={bestValue(b => b.gearCount)} />
            <SpecRow cols={selectedBikes.length} label="Gear brand" values={selectedBikes.map(b => b.gearBrand)} />

            {/* Comfort & Handling */}
            <SectionHeader title="Comfort & Handling" />
            <SpecRow cols={selectedBikes.length} label="Suspension" values={selectedBikes.map(b => b.hasSuspension ? suspensionLabels[b.hasSuspension] || b.hasSuspension : '—')} />
            {selectedBikes.some(b => b.warrantyYears) && (
              <SpecRow cols={selectedBikes.length} label="Warranty" values={selectedBikes.map(b => b.warrantyYears ? `${b.warrantyYears} yr${b.warrantyYears > 1 ? 's' : ''}` : '—')} bestIdx={bestValue(b => b.warrantyYears || 0)} />
            )}

            {/* Good for */}
            <SectionHeader title="Good for" />
            <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${selectedBikes.length}, 1fr)` }}>
              <div></div>
              {selectedBikes.map(bike => (
                <div key={bike.slug} className="flex flex-wrap gap-1">
                  {bike.suitableFor.map(use => (
                    <span key={use} className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--accent)] border border-[var(--border)]">
                      {usageLabels[use] || use}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <hr className="my-6 border-[var(--border)]" />
            <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${selectedBikes.length}, 1fr)` }}>
              <div></div>
              {selectedBikes.map(bike => (
                <div key={bike.slug} className="flex flex-col gap-2">
                  <a href={bike.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="px-4 py-2 text-sm font-bold rounded-lg text-center" style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}>
                    Check price
                  </a>
                  <Link href={`/e-bikes/${bike.brand.toLowerCase().replace(/\s+/g, '-')}/${bike.slug}`} className="px-4 py-2 border text-sm font-medium rounded-lg text-center bg-[var(--card-bg)] hover:bg-[var(--surface)] transition-colors" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                    Full review
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
