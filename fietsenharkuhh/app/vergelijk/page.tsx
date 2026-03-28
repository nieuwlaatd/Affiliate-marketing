'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { bikes, getBikeBySlug } from '@/lib/ebike-data';
import { EBike } from '@/lib/types';

const motorLabels: Record<string, string> = { 'midden': 'Middenmotor', 'naaf-voor': 'Voornaaf', 'naaf-achter': 'Achternaaf' };
const frameLabels: Record<string, string> = { 'laag-instap': 'Laag instap', 'hoog-instap': 'Hoog instap', 'sportief': 'Sportief' };
const usageLabels: Record<string, string> = { 'woon-werk': 'Woon-werk', 'recreatief': 'Recreatief', 'sportief': 'Sportief', 'transport': 'Transport', 'off-road': 'Off-road' };

export default function VergelijkPage() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedBikes = useMemo(() =>
    selectedSlugs.map(s => getBikeBySlug(s)).filter(Boolean) as EBike[],
    [selectedSlugs]
  );

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return bikes.filter(b =>
      !selectedSlugs.includes(b.slug) &&
      (`${b.brand} ${b.model}`.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchQuery, selectedSlugs]);

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

  const SpecRow = ({ label, values, bestIdx }: { label: string; values: string[]; bestIdx?: number }) => (
    <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${selectedBikes.length}, 1fr)` }}>
      <div className="text-sm text-gray-600 py-2">{label}</div>
      {values.map((val, i) => (
        <div key={i} className={`text-sm font-medium py-2 ${bestIdx === i ? 'text-green-700 font-bold' : 'text-gray-900'}`}>
          {val}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">E-bikes vergelijken</h1>
        <p className="text-gray-600 mb-8">Selecteer tot 3 e-bikes om naast elkaar te vergelijken.</p>

        {/* Search to add */}
        {selectedSlugs.length < 3 && (
          <div className="relative mb-8 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek een e-bike om toe te voegen..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {searchResults.map(bike => (
                  <button
                    key={bike.slug}
                    onClick={() => addBike(bike.slug)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <span className="font-medium">{bike.brand}</span> <span className="text-gray-600">{bike.model}</span>
                    <span className="text-sm text-gray-400 ml-2">€{bike.price.toLocaleString('nl-NL')}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected bikes chips */}
        {selectedBikes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {selectedBikes.map(bike => (
              <span key={bike.slug} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: '#5A7A4820', color: '#5A7A48' }}>
                {bike.brand} {bike.model}
                <button onClick={() => removeBike(bike.slug)} className="hover:opacity-70">✕</button>
              </span>
            ))}
          </div>
        )}

        {/* Empty state */}
        {selectedBikes.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-lg mb-4">Selecteer e-bikes om te vergelijken</p>
            <p className="text-gray-400 text-sm mb-6">Zoek hierboven of kies uit populaire modellen:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {bikes.slice(0, 6).map(b => (
                <button key={b.slug} onClick={() => addBike(b.slug)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:border-green-500 transition-colors">
                  {b.brand} {b.model}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comparison table */}
        {selectedBikes.length >= 2 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 overflow-x-auto">
            {/* Headers */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `140px repeat(${selectedBikes.length}, 1fr)` }}>
              <div></div>
              {selectedBikes.map(bike => (
                <div key={bike.slug} className="text-center">
                  <p className="text-xs text-gray-500 uppercase">{bike.brand}</p>
                  <h3 className="font-bold text-gray-900">{bike.model}</h3>
                  <p className="text-lg font-bold mt-1">€{bike.price.toLocaleString('nl-NL')}</p>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            {/* Scores */}
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Scores</h3>
            <SpecRow label="Totaalscore" values={selectedBikes.map(b => `${b.scoreOverall}/10`)} bestIdx={bestValue(b => b.scoreOverall)} />
            <SpecRow label="Prijs-kwaliteit" values={selectedBikes.map(b => `${b.scorePriceQuality}/10`)} bestIdx={bestValue(b => b.scorePriceQuality)} />
            <SpecRow label="Comfort" values={selectedBikes.map(b => `${b.scoreComfort}/10`)} bestIdx={bestValue(b => b.scoreComfort)} />
            <SpecRow label="Bereik" values={selectedBikes.map(b => `${b.scoreRange}/10`)} bestIdx={bestValue(b => b.scoreRange)} />

            <hr className="my-4" />

            {/* Motor */}
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Motor</h3>
            <SpecRow label="Type" values={selectedBikes.map(b => motorLabels[b.motorType])} />
            <SpecRow label="Merk" values={selectedBikes.map(b => b.motorBrand)} />
            <SpecRow label="Koppel" values={selectedBikes.map(b => `${b.torque} Nm`)} bestIdx={bestValue(b => b.torque)} />

            <hr className="my-4" />

            {/* Battery */}
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Accu</h3>
            <SpecRow label="Capaciteit" values={selectedBikes.map(b => `${b.batteryCapacity} Wh`)} bestIdx={bestValue(b => b.batteryCapacity)} />
            <SpecRow label="Bereik (praktijk)" values={selectedBikes.map(b => `~${b.rangePractical} km`)} bestIdx={bestValue(b => b.rangePractical)} />
            <SpecRow label="Laadtijd" values={selectedBikes.map(b => `${b.chargeTime} uur`)} bestIdx={bestValue(b => b.chargeTime, false)} />
            <SpecRow label="Afneembaar" values={selectedBikes.map(b => b.batteryRemovable ? 'Ja' : 'Nee')} />

            <hr className="my-4" />

            {/* Frame */}
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Frame</h3>
            <SpecRow label="Frametype" values={selectedBikes.map(b => frameLabels[b.frameType])} />
            <SpecRow label="Gewicht" values={selectedBikes.map(b => `${b.weight} kg`)} bestIdx={bestValue(b => b.weight, false)} />
            <SpecRow label="Max. belasting" values={selectedBikes.map(b => `${b.maxWeight} kg`)} bestIdx={bestValue(b => b.maxWeight)} />

            <hr className="my-4" />

            {/* Usage */}
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Geschikt voor</h3>
            <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${selectedBikes.length}, 1fr)` }}>
              <div></div>
              {selectedBikes.map(bike => (
                <div key={bike.slug} className="flex flex-wrap gap-1">
                  {bike.suitableFor.map(use => (
                    <span key={use} className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                      {usageLabels[use]}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <hr className="my-6" />

            {/* CTA buttons */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${selectedBikes.length}, 1fr)` }}>
              <div></div>
              {selectedBikes.map(bike => (
                <div key={bike.slug} className="flex flex-col gap-2">
                  <a href={bike.affiliateUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-white text-sm font-bold rounded-lg text-center" style={{ backgroundColor: '#5A7A48' }}>
                    Bekijk prijs
                  </a>
                  <Link href={`/fietsen/${bike.brand.toLowerCase().replace(/\s+/g, '-')}/${bike.slug}`} className="px-4 py-2 border text-sm font-medium rounded-lg text-center hover:bg-gray-50" style={{ borderColor: '#5A7A48', color: '#5A7A48' }}>
                    Meer info
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
