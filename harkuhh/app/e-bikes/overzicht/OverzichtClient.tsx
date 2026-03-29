'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import BikeCard from '@/components/BikeCard';
import KeuzehulpBar from '@/components/KeuzehulpBar';
import { getAllBrands, filterBikes } from '@/lib/ebike-filters';
import { EBike, FilterState } from '@/lib/types';

const motorLabels: Record<string, string> = { 'midden': 'Middenmotor', 'naaf-voor': 'Voornaaf', 'naaf-achter': 'Achternaaf' };
const doelLabels: Record<string, string> = { 'woon-werk': 'Woon-werk', 'recreatief': 'Recreatief', 'sportief': 'Sportief', 'transport': 'Transport', 'off-road': 'Off-road' };
const sortLabels: Record<string, string> = { 'score': 'Beste score', 'price-asc': 'Prijs laag-hoog', 'price-desc': 'Prijs hoog-laag', 'range': 'Grootste bereik', 'newest': 'Nieuwste' };

export default function OverzichtClient({ initialBikes }: { initialBikes: EBike[] }) {
  const allBrands = getAllBrands(initialBikes);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [500, 4000],
    brands: [],
    motorTypes: [],
    frameTypes: [],
    suitableFor: [],
    minRange: 0,
    sortBy: 'score',
    heightRanges: [],
    foldable: undefined,
    removableBattery: undefined,
    maxBikeWeight: undefined,
  });

  const filteredBikes = useMemo(() => filterBikes(initialBikes, filters), [initialBikes, filters]);

  const toggleFilter = (key: 'brands' | 'motorTypes' | 'frameTypes' | 'suitableFor', value: string) => {
    setFilters(prev => {
      const current = prev[key] as string[];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const activeFilterCount = filters.brands.length + filters.motorTypes.length + filters.frameTypes.length + filters.suitableFor.length + (filters.minRange > 0 ? 1 : 0) + (filters.afstandPerRit ? 1 : 0) + (filters.omgeving ? 1 : 0) + (filters.lichaamslengte ? 1 : 0) + (filters.priceRange[1] < 4000 ? 1 : 0) + (filters.heightRanges.length > 0 ? 1 : 0) + (filters.foldable ? 1 : 0) + (filters.removableBattery ? 1 : 0) + (filters.maxBikeWeight ? 1 : 0);

  const resetFilters = () => setFilters({
    priceRange: [500, 4000], brands: [], motorTypes: [], frameTypes: [], suitableFor: [], minRange: 0, sortBy: filters.sortBy,
    afstandPerRit: undefined, omgeving: undefined, lichaamslengte: undefined, heightRanges: [],
    foldable: undefined, removableBattery: undefined, maxBikeWeight: undefined,
  });

  const handleFiltersChange = (newFilters: FilterState) => {
    // Sync height to heightRanges if height changed
    if (newFilters.lichaamslengte !== filters.lichaamslengte && newFilters.lichaamslengte) {
      const h = newFilters.lichaamslengte;
      let range = "";
      if (h < 160) range = "< 160";
      else if (h < 170) range = "160-170";
      else if (h < 180) range = "170-180";
      else if (h < 190) range = "180-190";
      else if (h < 200) range = "190-200";
      else range = "200+";
      
      newFilters.heightRanges = [range];
    }
    setFilters(newFilters);
  };

  // ── Smart Sticky Sidebar Logic ──────────────────────────────
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({
    position: 'sticky',
    top: '128px', // Start with top-offset
    transition: 'top 0.1s ease-out'
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const onScroll = () => {
      if (!sidebarRef.current) return;
      
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const sidebarHeight = sidebarRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const topOffset = 120; // Room for header
      const bottomOffset = 20; // Room at bottom
      
      // If sidebar fits entirely in viewport, just keep it sticky at the top
      if (sidebarHeight + topOffset + bottomOffset < viewportHeight) {
        setSidebarStyle({ position: 'sticky', top: `${topOffset}px` });
        lastScrollY = currentScrollY;
        return;
      }

      // If sidebar is taller than viewport:
      if (scrollingDown) {
        // When scrolling down, stick to the bottom
        setSidebarStyle({ 
          position: 'sticky', 
          top: `${viewportHeight - sidebarHeight - bottomOffset}px`,
          transition: 'top 0.3s ease-out' // Smooth transition to bottom stick
        });
      } else {
        // When scrolling up, stick to the top
        setSidebarStyle({ 
          position: 'sticky', 
          top: `${topOffset}px`,
          transition: 'top 0.3s ease-out' // Smooth transition to top stick
        });
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">Alle elektrische fietsen</h1>
            <p className="text-[var(--muted)] mt-1">{filteredBikes.length} van {initialBikes.length} modellen</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden px-4 py-2 border border-[var(--border)] rounded-lg text-sm font-medium bg-[var(--card-bg)] hover:bg-[var(--surface)] transition-colors flex items-center gap-2">
              Filters {activeFilterCount > 0 && <span className="px-2 py-0.5 text-xs rounded-full text-white" style={{ backgroundColor: '#5A7A48' }}>{activeFilterCount}</span>}
            </button>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
              className="harkuhh-select"
            >
              {Object.entries(sortLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* KeuzehulpBar — inline filterbalk */}
        <KeuzehulpBar filters={filters} onFiltersChange={handleFiltersChange} />

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div 
              ref={sidebarRef}
              style={sidebarStyle}
              className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] pt-8 pb-10 px-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-[var(--foreground)]">Filters</h2>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-xs text-red-600 hover:underline">Reset</button>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[var(--muted)] mb-3">Prijs (max)</h3>
                <input type="range" min={500} max={2000} step={50} value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [500, Number(e.target.value)] }))}
                  className="harkuhh-slider" />
                <div className="flex justify-between text-xs font-semibold text-[var(--muted)] mt-1">
                  <span>€500</span>
                  <span>Tot €{filters.priceRange[1].toLocaleString('nl-NL')}</span>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[var(--muted)] mb-3">Merk</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={filters.brands.includes(brand)} onChange={() => toggleFilter('brands', brand)} className="harkuhh-checkbox" />
                      <span className="text-[var(--foreground)] font-medium">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Motor type */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[var(--muted)] mb-3">Motortype</h3>
                <div className="space-y-2">
                  {Object.entries(motorLabels).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={filters.motorTypes.includes(val)} onChange={() => toggleFilter('motorTypes', val)} className="harkuhh-checkbox" />
                      <span className="text-[var(--foreground)] font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>


              {/* Usage */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[var(--muted)] mb-3">Geschikt voor</h3>
                <div className="space-y-2">
                  {Object.entries(doelLabels).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={filters.suitableFor.includes(val)} onChange={() => toggleFilter('suitableFor', val)} className="harkuhh-checkbox" />
                      <span className="text-[var(--foreground)] font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Height Ranges */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Lengte berijder (cm)</h3>
                <div className="flex flex-wrap gap-2">
                  {["< 160", "160-170", "170-180", "180-190", "190-200", "200+"].map(range => {
                    const isActive = filters.heightRanges.includes(range);
                    return (
                      <button
                        key={range}
                        onClick={() => {
                          const newRanges = isActive 
                            ? filters.heightRanges.filter(r => r !== range)
                            : [...filters.heightRanges, range];
                          setFilters(prev => ({ ...prev, heightRanges: newRanges }));
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                          isActive
                            ? 'bg-[#5A7A48] text-white border-[#5A7A48] shadow-sm'
                            : 'bg-[var(--card-bg)] text-[var(--muted)] border-[var(--border)] hover:border-[#5A7A48]'
                        }`}
                      >
                        {range}
                      </button>
                    );
                  })}
                </div>
                {filters.lichaamslengte && (
                  <p className="text-[10px] text-[var(--muted)] mt-2 italic font-medium opacity-70">
                    * Gebaseerd op keuze {filters.lichaamslengte} cm
                  </p>
                )}
              </div>

              {/* Min range */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--muted)] mb-3">Min. bereik (km)</h3>
                <input type="range" min={0} max={120} step={10} value={filters.minRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRange: Number(e.target.value) }))}
                  className="harkuhh-slider" />
                 <div className="flex justify-between text-xs font-semibold text-[var(--muted)] mt-1">
                  <span>0 km</span>
                  <span>{filters.minRange > 0 ? `Minimaal ${filters.minRange} km` : 'Geen minimum'}</span>
                </div>
              </div>

              {/* Foldable toggle */}
              <div className="mb-6">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-semibold text-[var(--muted)]">Opvouwbaar</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, foldable: prev.foldable ? undefined : true }))}
                     className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${filters.foldable ? 'bg-[#5A7A48]' : 'bg-[var(--border)]'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${filters.foldable ? 'translate-x-5' : ''}`} />
                  </button>
                 </label>
                <p className="text-[10px] text-[var(--muted)] mt-1 opacity-70">Alleen fietsen die je kunt opvouwen</p>
              </div>

              {/* Removable battery toggle */}
              <div className="mb-6">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-semibold text-[var(--muted)]">Afneembare accu</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, removableBattery: prev.removableBattery ? undefined : true }))}
                     className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${filters.removableBattery ? 'bg-[#5A7A48]' : 'bg-[var(--border)]'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${filters.removableBattery ? 'translate-x-5' : ''}`} />
                  </button>
                 </label>
                <p className="text-[10px] text-[var(--muted)] mt-1 opacity-70">Handig als je de accu apart wilt opladen</p>
              </div>

              {/* Max weight slider */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--muted)] mb-3">Max. fietsgewicht (kg)</h3>
                <input type="range" min={0} max={50} step={5}
                  value={filters.maxBikeWeight || 50}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFilters(prev => ({ ...prev, maxBikeWeight: val >= 50 ? undefined : val }));
                  }}
                  className="harkuhh-slider" />
                 <div className="flex justify-between text-xs font-semibold text-[var(--muted)] mt-1">
                  <span>15 kg</span>
                  <span>{filters.maxBikeWeight && filters.maxBikeWeight < 50 ? `Max ${filters.maxBikeWeight} kg` : 'Geen maximum'}</span>
                </div>
                <p className="text-[10px] text-[var(--muted)] mt-1 opacity-70">Belangrijk als je de fiets moet tillen</p>
              </div>


            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filteredBikes.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBikes.map(bike => (
                  <BikeCard key={bike.id} bike={bike} userHeight={filters.lichaamslengte} activeFilters={filters} />
                ))}
              </div>
            ) : (
               <div className="text-center py-16">
                <p className="text-[var(--muted)] text-lg mb-4">Geen e-bikes gevonden met deze filters.</p>
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
