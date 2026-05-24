'use client';

import { useState } from 'react';
import { FilterState } from '@/lib/types';

// ── Filter options ─────────────────────────────────────────

// Options match HomeFunnel quiz exactly (same labels, same order)

const terrainOptions = [
  { value: 'flat', label: 'City streets' },
  { value: 'hilly', label: 'Hills & climbs' },
  { value: 'mixed', label: 'Trails & gravel' },
];

const purposeOptions = [
  { value: 'commuting', label: 'Getting to work' },
  { value: 'recreation', label: 'Weekend rides' },
  { value: 'sport', label: 'Fitness & speed' },
  { value: 'cargo', label: 'Hauling & family' },
];

const distanceOptions = [
  { value: 5, label: 'Under 5 mi' },
  { value: 15, label: '5–15 mi' },
  { value: 30, label: '15–30 mi' },
  { value: 50, label: '30+ mi' },
];

const frameOptions = [
  { value: 'step-through', label: 'Step-through' },
  { value: 'step-over', label: 'Step-over' },
  { value: 'sport', label: 'Sport' },
];

const bikeClassOptions = [
  { value: 'class-1', label: 'Class 1', hint: 'Pedal-assist only, 20 mph' },
  { value: 'class-2', label: 'Class 2', hint: 'Throttle + assist, 20 mph' },
  { value: 'class-3', label: 'Class 3', hint: 'Pedal-assist only, 28 mph' },
];

// ── Component ──────────────────────────────────────────────

interface KeuzehulpBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function KeuzehulpBar({ filters, onFiltersChange }: KeuzehulpBarProps) {
  const [heightUnit, setHeightUnit] = useState<'in' | 'cm'>('in');
  const [heightDisplay, setHeightDisplay] = useState<string>(filters.riderHeight ? String(filters.riderHeight) : '');

  const toggleArray = (key: 'suitableFor' | 'frameTypes' | 'bikeClasses', value: string) => {
    const current = (filters[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  const handleTerrain = (val: 'flat' | 'hilly' | 'mixed') => {
    onFiltersChange({ ...filters, terrain: val === filters.terrain ? undefined : val });
  };

  const handleDistance = (miles: number) => {
    onFiltersChange({ ...filters, distancePerRide: filters.distancePerRide === miles ? undefined : miles });
  };

  const totalActive =
    filters.suitableFor.length +
    filters.frameTypes.length +
    (filters.bikeClasses?.length || 0) +
    (filters.terrain ? 1 : 0) +
    (filters.riderHeight ? 1 : 0) +
    (filters.distancePerRide ? 1 : 0);

  const resetKeuzehulp = () => {
    onFiltersChange({
      ...filters,
      suitableFor: [],
      frameTypes: [],
      bikeClasses: [],
      terrain: undefined,
      riderHeight: undefined,
      distancePerRide: undefined,
    });
  };

  const chipClass = (active: boolean) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
      active
        ? 'bg-[var(--accent)] text-[var(--on-bordeaux)] border-[var(--accent)] shadow-sm'
        : 'bg-[var(--card-bg)] text-[var(--foreground)] border-[var(--border)] hover:border-gray-300 hover:bg-[var(--surface)]'
    }`;

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6 mb-8 mt-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Find your perfect e-bike
          </h2>
          <p className="text-[var(--muted)] text-sm mt-1">Answer a few questions and we&apos;ll filter the lineup for you.</p>
        </div>

        {totalActive > 0 && (
          <button
            onClick={resetKeuzehulp}
            className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Reset {totalActive} filter{totalActive !== 1 && 's'}</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Grid: 6 orienting questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">

        {/* 1. Where will you ride? (HomeFunnel step 1) */}
        <div className="bg-[var(--surface)] p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Where will you ride?</h3>
          <div className="flex flex-wrap gap-2">
            {terrainOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleTerrain(opt.value as 'flat' | 'hilly' | 'mixed')}
                className={chipClass(filters.terrain === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. What's it mostly for? (HomeFunnel step 2) */}
        <div className="bg-[var(--surface)] p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">What&apos;s it mostly for?</h3>
          <div className="flex flex-wrap gap-2">
            {purposeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleArray('suitableFor', opt.value)}
                className={chipClass(filters.suitableFor.includes(opt.value))}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. How far do you typically ride? (HomeFunnel step 4) */}
        <div className="bg-[var(--surface)] p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">How far do you typically ride?</h3>
          <div className="flex flex-wrap gap-2">
            {distanceOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleDistance(opt.value)}
                className={chipClass(filters.distancePerRide === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. How tall are you? (HomeFunnel step 5) */}
        <div className="bg-[var(--surface)] p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3 flex justify-between items-center">
            How tall are you?
            <span className="text-xs font-normal text-[var(--muted)] bg-[var(--card-bg)] px-2 py-0.5 rounded border border-[var(--border)]">Fit advice</span>
          </h3>
          <div className="flex rounded-lg overflow-hidden border border-[var(--border)] mb-2">
            {(['in', 'cm'] as const).map((u) => (
              <button
                key={u}
                onClick={() => {
                  if (u === heightUnit) return;
                  if (heightDisplay) {
                    const val = Number(heightDisplay);
                    const converted = u === 'cm' ? Math.round(val * 2.54) : Math.round(val / 2.54);
                    setHeightDisplay(String(converted));
                    onFiltersChange({ ...filters, riderHeight: u === 'cm' ? Math.round(converted / 2.54) : converted });
                  }
                  setHeightUnit(u);
                }}
                className="flex-1 py-1.5 text-xs font-bold transition-colors"
                style={{
                  backgroundColor: heightUnit === u ? 'var(--accent)' : 'var(--card-bg)',
                  color: heightUnit === u ? 'var(--on-bordeaux)' : 'var(--muted)',
                }}
              >
                {u === 'in' ? 'Inches' : 'cm'}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder={heightUnit === 'in' ? 'e.g. 69' : 'e.g. 175'}
              className="w-full harkuhh-input font-medium pr-12"
              value={heightDisplay}
              onChange={(e) => {
                setHeightDisplay(e.target.value);
                const val = e.target.value ? Number(e.target.value) : undefined;
                const inches = val && heightUnit === 'cm' ? Math.round(val / 2.54) : val;
                onFiltersChange({ ...filters, riderHeight: inches });
              }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] opacity-50 font-bold text-sm pointer-events-none">
              {heightUnit}
            </span>
          </div>
        </div>

        {/* 5. Frame type (HomeFunnel step 6) */}
        <div className="bg-[var(--surface)] p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Frame type preference</h3>
          <div className="flex flex-wrap gap-2">
            {frameOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleArray('frameTypes', opt.value)}
                className={chipClass(filters.frameTypes.includes(opt.value))}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6. What class do you need? (HomeFunnel step 6) */}
        <div className="bg-[var(--surface)] p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">What class do you need?</h3>
          <div className="flex flex-wrap gap-2">
            {bikeClassOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleArray('bikeClasses', opt.value)}
                className={chipClass((filters.bikeClasses || []).includes(opt.value))}
                title={opt.hint}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[var(--muted)] mt-2 opacity-70">
            Class determines max speed &amp; throttle availability
          </p>
        </div>

      </div>
    </div>
  );
}
