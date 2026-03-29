'use client';

import { useState, useMemo } from 'react';
import BikeCard from '@/components/BikeCard';
import { bikes, getAllBrands, filterBikes } from '@/lib/ebike-data';
import { FilterState } from '@/lib/types';

const motorLabels: Record<string, string> = { 'midden': 'Middenmotor', 'naaf-voor': 'Voornaaf', 'naaf-achter': 'Achternaaf' };
const frameLabels: Record<string, string> = { 'laag-instap': 'Laag instap', 'hoog-instap': 'Hoog instap', 'sportief': 'Sportief' };
const doelLabels: Record<string, string> = { 'woon-werk': 'Woon-werk', 'recreatief': 'Recreatief', 'sportief': 'Sportief', 'transport': 'Transport', 'off-road': 'Off-road' };
const sortLabels: Record<string, string> = { 'score': 'Beste score', 'price-asc': 'Prijs laag-hoog', 'price-desc': 'Prijs hoog-laag', 'range': 'Grootste bereik', 'newest': 'Nieuwste' };

export default function FietsenPage() {
  const allBrands = getAllBrands();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [1000, 5000],
    brands: [],
    motorTypes: [],
    frameTypes: [],
    suitableFor: [],
    minRange: 0,
    sortBy: 'score',
  });

  const filteredBikes = useMemo(() => filterBikes(filters), [filters]);

  const toggleFilter = (key: 'brands' | 'motorTypes' | 'frameTypes' | 'suitableFor', value: string) => {
    setFilters(prev => {
      const current = prev[key] as string[];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const activeFilterCount = filters.brands.length + filters.motorTypes.length + filters.frameTypes.length + filters.suitableFor.length + (filters.minRange > 0 ? 1 : 0);

  const resetFilters = () => setFilters({
    priceRange: [1000, 5000], brands: [], motorTypes: [], frameTypes: [], suitableFor: [], minRange: 0, sortBy: filters.sortBy,
  });

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alle elektrische fietsen</h1>
            <p className="text-gray-600 mt-1">{filteredBikes.length} van {bikes.length} modellen</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
              Filters {activeFilterCount > 0 && <span className="px-2 py-0.5 text-xs rounded-full text-white" style={{ backgroundColor: '#5A7A48' }}>{activeFilterCount}</span>}
            </button>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              {Object.entries(sortLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-xs text-red-600 hover:underline">Reset</button>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Prijs (max)</h3>
                <input type="range" min={1000} max={5000} step={100} value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [1000, Number(e.target.value)] }))}
                  className="w-full" />
                <div className="text-sm text-gray-600 mt-1">Tot €{filters.priceRange[1].toLocaleString('nl-NL')}</div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Merk</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={filters.brands.includes(brand)} onChange={() => toggleFilter('brands', brand)} className="rounded" />
                      <span className="text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Motor type */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Motortype</h3>
                <div className="space-y-2">
                  {Object.entries(motorLabels).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={filters.motorTypes.includes(val)} onChange={() => toggleFilter('motorTypes', val)} className="rounded" />
                      <span className="text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Frame type */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Frametype</h3>
                <div className="space-y-2">
                  {Object.entries(frameLabels).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={filters.frameTypes.includes(val)} onChange={() => toggleFilter('frameTypes', val)} className="rounded" />
                      <span className="text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Usage */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Geschikt voor</h3>
                <div className="space-y-2">
                  {Object.entries(doelLabels).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={filters.suitableFor.includes(val)} onChange={() => toggleFilter('suitableFor', val)} className="rounded" />
                      <span className="text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Min range */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Min. bereik (km)</h3>
                <input type="range" min={0} max={120} step={10} value={filters.minRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRange: Number(e.target.value) }))}
                  className="w-full" />
                <div className="text-sm text-gray-600 mt-1">{filters.minRange > 0 ? `Minimaal ${filters.minRange} km` : 'Geen minimum'}</div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filteredBikes.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBikes.map(bike => (
                  <BikeCard key={bike.id} bike={bike} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">Geen e-bikes gevonden met deze filters.</p>
                <button onClick={resetFilters} className="text-white px-6 py-2 rounded-lg font-medium" style={{ backgroundColor: '#5A7A48' }}>
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
