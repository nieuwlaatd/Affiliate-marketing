'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import BikeCard from '@/components/BikeCard';
import KeuzehulpBar from '@/components/KeuzehulpBar';
import { getAllBrands, filterBikes } from '@/lib/ebike-filters';
import { EBike, FilterState } from '@/lib/types';

const motorLabels: Record<string, string> = { 'mid-drive': 'Mid-drive', 'front-hub': 'Front hub', 'rear-hub': 'Rear hub' };
const purposeLabels: Record<string, string> = { commuting: 'Getting to work', recreation: 'Weekend rides', sport: 'Fitness & speed', cargo: 'Hauling & family' };
const terrainLabels: Record<string, string> = { flat: 'City streets', hilly: 'Hills & climbs', mixed: 'Trails & gravel' };
const sortLabels: Record<string, string> = { score: 'Best score', 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low', range: 'Longest range', newest: 'Newest' };
const suspensionLabels: Record<string, string> = { none: 'None', front: 'Front', full: 'Full' };
const bikeClassLabels: Record<string, { label: string; hint: string }> = {
  'class-1': { label: 'Class 1', hint: 'Pedal-assist, 20 mph' },
  'class-2': { label: 'Class 2', hint: 'Throttle + assist, 20 mph' },
  'class-3': { label: 'Class 3', hint: 'Pedal-assist, 28 mph' },
};

const HEIGHT_RANGES = ['< 60', '60-66', '66-70', '70-74', '74-78', '78+'];

function heightToRange(h: number): string {
  if (h < 60) return '< 60';
  if (h < 66) return '60-66';
  if (h < 70) return '66-70';
  if (h < 74) return '70-74';
  if (h < 78) return '74-78';
  return '78+';
}

/* ── Collapsible filter section ────────────────────────── */

function FilterSection({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className="text-sm font-semibold text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors flex items-center gap-2">
          {title}
          {count !== undefined && count > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: 'var(--accent)', color: 'var(--on-bordeaux)' }}>
              {count}
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-[var(--muted)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Toggle switch component ───────────────────────────── */

function ToggleSwitch({
  label,
  hint,
  active,
  onToggle,
}: {
  label: string;
  hint: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="flex items-center justify-between cursor-pointer group">
        <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
        <button
          onClick={onToggle}
          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${active ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${active ? 'translate-x-5' : ''}`} />
        </button>
      </label>
      <p className="text-[10px] text-[var(--muted)] mt-1 opacity-70">{hint}</p>
    </div>
  );
}

/* ── Chip button component ─────────────────────────────── */

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
        active
          ? 'bg-[var(--accent)] text-[var(--on-bordeaux)] border-[var(--accent)] shadow-sm'
          : 'bg-[var(--card-bg)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)]'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Active filter chip (dismissable) ──────────────────── */

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:border-red-300 hover:bg-red-50 group"
      style={{ borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'var(--accent-soft)' }}
    >
      {label}
      <svg className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

/* ── Main component ────────────────────────────────────── */

export default function OverzichtClient({
  initialBikes,
  initialFilters,
  rideLabel,
}: {
  initialBikes: EBike[];
  initialFilters?: Partial<FilterState>;
  rideLabel?: string | null;
}) {
  const allBrands = getAllBrands(initialBikes);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [500, 5000],
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
    bikeClasses: [],
    hasThrottle: undefined,
    suspensionTypes: [],
    minTopSpeed: undefined,
    wheelSizes: [],
    ...initialFilters,
  });

  const filteredBikes = useMemo(() => filterBikes(initialBikes, filters), [initialBikes, filters]);

  const toggleArrayFilter = (key: 'brands' | 'motorTypes' | 'frameTypes' | 'suitableFor' | 'bikeClasses' | 'suspensionTypes', value: string) => {
    setFilters(prev => {
      const current = (prev[key] as string[]) || [];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const toggleWheelSize = (size: number) => {
    setFilters(prev => {
      const current = prev.wheelSizes || [];
      const updated = current.includes(size) ? current.filter(s => s !== size) : [...current, size];
      return { ...prev, wheelSizes: updated };
    });
  };

  // Count active filters
  const activeFilterCount =
    filters.brands.length +
    filters.motorTypes.length +
    filters.frameTypes.length +
    filters.suitableFor.length +
    (filters.bikeClasses?.length || 0) +
    (filters.suspensionTypes?.length || 0) +
    (filters.wheelSizes?.length || 0) +
    (filters.minRange > 0 ? 1 : 0) +
    (filters.distancePerRide ? 1 : 0) +
    (filters.terrain ? 1 : 0) +
    (filters.riderHeight ? 1 : 0) +
    (filters.priceRange[1] < 5000 ? 1 : 0) +
    (filters.heightRanges.length > 0 ? 1 : 0) +
    (filters.foldable ? 1 : 0) +
    (filters.removableBattery ? 1 : 0) +
    (filters.hasThrottle ? 1 : 0) +
    (filters.maxBikeWeight ? 1 : 0) +
    (filters.minTopSpeed ? 1 : 0);

  const resetFilters = () => setFilters({
    priceRange: [500, 5000], brands: [], motorTypes: [], frameTypes: [], suitableFor: [], minRange: 0, sortBy: filters.sortBy,
    distancePerRide: undefined, terrain: undefined, riderHeight: undefined, heightRanges: [],
    foldable: undefined, removableBattery: undefined, maxBikeWeight: undefined,
    bikeClasses: [], hasThrottle: undefined, suspensionTypes: [], minTopSpeed: undefined, wheelSizes: [],
  });

  const handleFiltersChange = (newFilters: FilterState) => {
    if (newFilters.riderHeight !== filters.riderHeight && newFilters.riderHeight) {
      newFilters.heightRanges = [heightToRange(newFilters.riderHeight)];
    }
    setFilters(newFilters);
  };

  // Build active filter chips for display
  const activeChips: { label: string; remove: () => void }[] = [];

  if (filters.priceRange[1] < 5000) {
    activeChips.push({ label: `< $${filters.priceRange[1].toLocaleString('en-US')}`, remove: () => setFilters(p => ({ ...p, priceRange: [500, 5000] })) });
  }
  filters.brands.forEach(b => {
    activeChips.push({ label: b, remove: () => toggleArrayFilter('brands', b) });
  });
  filters.suitableFor.forEach(s => {
    activeChips.push({ label: purposeLabels[s] || s, remove: () => toggleArrayFilter('suitableFor', s) });
  });
  filters.motorTypes.forEach(m => {
    activeChips.push({ label: motorLabels[m] || m, remove: () => toggleArrayFilter('motorTypes', m) });
  });
  (filters.bikeClasses || []).forEach(c => {
    activeChips.push({ label: bikeClassLabels[c]?.label || c, remove: () => toggleArrayFilter('bikeClasses', c) });
  });
  if (filters.hasThrottle) {
    activeChips.push({ label: 'Has Throttle', remove: () => setFilters(p => ({ ...p, hasThrottle: undefined })) });
  }
  (filters.suspensionTypes || []).forEach(s => {
    activeChips.push({ label: `${suspensionLabels[s] || s} suspension`, remove: () => toggleArrayFilter('suspensionTypes', s) });
  });
  if (filters.minTopSpeed) {
    activeChips.push({ label: `${filters.minTopSpeed}+ mph`, remove: () => setFilters(p => ({ ...p, minTopSpeed: undefined })) });
  }
  if (filters.minRange > 0) {
    activeChips.push({ label: `${filters.minRange}+ mi range`, remove: () => setFilters(p => ({ ...p, minRange: 0 })) });
  }
  if (filters.foldable) {
    activeChips.push({ label: 'Foldable', remove: () => setFilters(p => ({ ...p, foldable: undefined })) });
  }
  if (filters.removableBattery) {
    activeChips.push({ label: 'Removable Battery', remove: () => setFilters(p => ({ ...p, removableBattery: undefined })) });
  }
  if (filters.maxBikeWeight) {
    activeChips.push({ label: `< ${filters.maxBikeWeight} lbs`, remove: () => setFilters(p => ({ ...p, maxBikeWeight: undefined })) });
  }
  if (filters.terrain) {
    activeChips.push({ label: terrainLabels[filters.terrain] || filters.terrain, remove: () => setFilters(p => ({ ...p, terrain: undefined })) });
  }
  if (filters.riderHeight) {
    activeChips.push({ label: `${filters.riderHeight}" tall`, remove: () => setFilters(p => ({ ...p, riderHeight: undefined, heightRanges: [] })) });
  }
  filters.frameTypes.forEach(f => {
    const frameLabel = f === 'step-through' ? 'Step-through' : f === 'step-over' ? 'Step-over' : 'Sport';
    activeChips.push({ label: frameLabel, remove: () => toggleArrayFilter('frameTypes', f) });
  });
  if (filters.distancePerRide) {
    const distLabels: Record<number, string> = { 5: '< 5 mi', 15: '5–15 mi', 30: '15–30 mi', 50: '30+ mi' };
    activeChips.push({ label: distLabels[filters.distancePerRide] || `${filters.distancePerRide} mi`, remove: () => setFilters(p => ({ ...p, distancePerRide: undefined })) });
  }

  // ── Smart Sticky Sidebar Logic ──────────────────────────────
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({
    position: 'sticky',
    top: '128px',
    transition: 'top 0.1s ease-out',
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      if (!sidebarRef.current) return;

      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const sidebarHeight = sidebarRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const topOffset = 120;
      const bottomOffset = 20;

      if (sidebarHeight + topOffset + bottomOffset < viewportHeight) {
        setSidebarStyle({ position: 'sticky', top: `${topOffset}px` });
        lastScrollY = currentScrollY;
        return;
      }

      if (scrollingDown) {
        setSidebarStyle({
          position: 'sticky',
          top: `${viewportHeight - sidebarHeight - bottomOffset}px`,
          transition: 'top 0.3s ease-out',
        });
      } else {
        setSidebarStyle({
          position: 'sticky',
          top: `${topOffset}px`,
          transition: 'top 0.3s ease-out',
        });
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Get unique wheel sizes from data
  const availableWheelSizes = useMemo(() => {
    const sizes = new Set<number>();
    initialBikes.forEach(b => { if (b.wheelSize) sizes.add(b.wheelSize); });
    return Array.from(sizes).sort((a, b) => a - b);
  }, [initialBikes]);

  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            {rideLabel ? (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>
                  Matched to your ride
                </p>
                <h1 className="text-3xl font-bold text-[var(--foreground)] mt-1">
                  Built for {rideLabel}
                </h1>
              </>
            ) : (
              <h1 className="text-3xl font-bold text-[var(--foreground)]">All electric bikes</h1>
            )}
            <p className="text-[var(--muted)] mt-1">
              {filteredBikes.length} of {initialBikes.length} models
              {rideLabel ? ' — fine-tune with filters below' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden px-4 py-2 border border-[var(--border)] rounded-lg text-sm font-medium bg-[var(--card-bg)] hover:bg-[var(--surface)] transition-colors flex items-center gap-2">
              Filters {activeFilterCount > 0 && <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--on-bordeaux)' }}>{activeFilterCount}</span>}
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

        {/* Inline filter bar */}
        <KeuzehulpBar filters={filters} onFiltersChange={handleFiltersChange} />

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mr-1">Active:</span>
            {activeChips.map((chip, i) => (
              <ActiveChip key={`${chip.label}-${i}`} label={chip.label} onRemove={chip.remove} />
            ))}
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div
              ref={sidebarRef}
              style={sidebarStyle}
              className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] py-4 px-5"
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <h2 className="font-bold text-[var(--foreground)]">Filters</h2>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-xs text-red-600 hover:underline">Reset ({activeFilterCount})</button>
                )}
              </div>

              {/* Quiz filters (Purpose, Terrain, Height, Frame, Class, Distance) live in KeuzehulpBar above */}
              {/* Sidebar filters ranked by customer impact: */}

              {/* ── Price ── */}
              <FilterSection title="Price" count={filters.priceRange[1] < 5000 ? 1 : 0} defaultOpen>
                <input type="range" min={500} max={5000} step={100} value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [500, Number(e.target.value)] }))}
                  className="harkuhh-slider" />
                <div className="flex justify-between text-xs font-semibold text-[var(--muted)] mt-1">
                  <span>$500</span>
                  <span>Up to ${filters.priceRange[1].toLocaleString('en-US')}</span>
                </div>
              </FilterSection>

              {/* ── Brand ── */}
              <FilterSection title="Brand" count={filters.brands.length} defaultOpen>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={filters.brands.includes(brand)} onChange={() => toggleArrayFilter('brands', brand)} className="harkuhh-checkbox" />
                      <span className="text-[var(--foreground)] font-medium">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* ── Throttle ── */}
              <FilterSection title="Throttle" count={filters.hasThrottle ? 1 : 0}>
                <ToggleSwitch
                  label="Has throttle"
                  hint="Ride without pedaling when you need to"
                  active={!!filters.hasThrottle}
                  onToggle={() => setFilters(p => ({ ...p, hasThrottle: p.hasThrottle ? undefined : true }))}
                />
              </FilterSection>

              {/* ── Top Speed ── */}
              <FilterSection title="Top speed" count={filters.minTopSpeed ? 1 : 0}>
                <input type="range" min={15} max={30} step={1}
                  value={filters.minTopSpeed || 15}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFilters(prev => ({ ...prev, minTopSpeed: val <= 15 ? undefined : val }));
                  }}
                  className="harkuhh-slider" />
                <div className="flex justify-between text-xs font-semibold text-[var(--muted)] mt-1">
                  <span>15 mph</span>
                  <span>{filters.minTopSpeed && filters.minTopSpeed > 15 ? `At least ${filters.minTopSpeed} mph` : 'Any speed'}</span>
                </div>
              </FilterSection>

              {/* ── Motor type ── */}
              <FilterSection title="Motor type" count={filters.motorTypes.length}>
                <div className="space-y-2">
                  {Object.entries(motorLabels).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={filters.motorTypes.includes(val)} onChange={() => toggleArrayFilter('motorTypes', val)} className="harkuhh-checkbox" />
                      <span className="text-[var(--foreground)] font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* ── Suspension ── */}
              <FilterSection title="Suspension" count={filters.suspensionTypes?.length || 0}>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(suspensionLabels).map(([val, label]) => (
                    <ChipButton
                      key={val}
                      active={(filters.suspensionTypes || []).includes(val)}
                      onClick={() => toggleArrayFilter('suspensionTypes', val)}
                    >
                      {label}
                    </ChipButton>
                  ))}
                </div>
              </FilterSection>

              {/* ── Range ── */}
              <FilterSection title="Min. range" count={filters.minRange > 0 ? 1 : 0}>
                <input type="range" min={0} max={80} step={5} value={filters.minRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRange: Number(e.target.value) }))}
                  className="harkuhh-slider" />
                <div className="flex justify-between text-xs font-semibold text-[var(--muted)] mt-1">
                  <span>0 mi</span>
                  <span>{filters.minRange > 0 ? `At least ${filters.minRange} mi` : 'No minimum'}</span>
                </div>
              </FilterSection>

              {/* ── Wheel size ── */}
              {availableWheelSizes.length > 1 && (
                <FilterSection title="Wheel size" count={filters.wheelSizes?.length || 0}>
                  <div className="flex flex-wrap gap-2">
                    {availableWheelSizes.map(size => (
                      <ChipButton
                        key={size}
                        active={(filters.wheelSizes || []).includes(size)}
                        onClick={() => toggleWheelSize(size)}
                      >
                        {size}&quot;
                      </ChipButton>
                    ))}
                  </div>
                </FilterSection>
              )}

              {/* ── Toggles: Foldable, Removable Battery ── */}
              <FilterSection title="Features" count={(filters.foldable ? 1 : 0) + (filters.removableBattery ? 1 : 0)}>
                <div className="space-y-4">
                  <ToggleSwitch
                    label="Foldable"
                    hint="Only bikes that fold down"
                    active={!!filters.foldable}
                    onToggle={() => setFilters(p => ({ ...p, foldable: p.foldable ? undefined : true }))}
                  />
                  <ToggleSwitch
                    label="Removable battery"
                    hint="Charge the battery separately"
                    active={!!filters.removableBattery}
                    onToggle={() => setFilters(p => ({ ...p, removableBattery: p.removableBattery ? undefined : true }))}
                  />
                </div>
              </FilterSection>

              {/* ── Bike weight ── */}
              <FilterSection title="Bike weight" count={filters.maxBikeWeight ? 1 : 0}>
                <input type="range" min={0} max={110} step={5}
                  value={filters.maxBikeWeight || 110}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFilters(prev => ({ ...prev, maxBikeWeight: val >= 110 ? undefined : val }));
                  }}
                  className="harkuhh-slider" />
                <div className="flex justify-between text-xs font-semibold text-[var(--muted)] mt-1">
                  <span>35 lbs</span>
                  <span>{filters.maxBikeWeight && filters.maxBikeWeight < 110 ? `Max ${filters.maxBikeWeight} lbs` : 'No maximum'}</span>
                </div>
                <p className="text-[10px] text-[var(--muted)] mt-1 opacity-70">Important if you need to lift the bike</p>
              </FilterSection>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filteredBikes.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBikes.map(bike => (
                  <BikeCard key={bike.id} bike={bike} userHeight={filters.riderHeight} activeFilters={filters} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-[var(--muted)] text-lg mb-4">No e-bikes found with these filters.</p>
                <button onClick={resetFilters} className="px-6 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}>
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
