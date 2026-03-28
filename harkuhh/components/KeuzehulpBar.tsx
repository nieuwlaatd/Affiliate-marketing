'use client';

import { FilterState } from '@/lib/types';

// ── Oriëntatie-opties ──────────────────────────────────────

const doelOptions = [
  { value: 'woon-werk', label: 'Woon-werk', icon: '🚴' },
  { value: 'recreatief', label: 'Recreatief', icon: '🌳' },
  { value: 'sportief', label: 'Sportief', icon: '⚡' },
  { value: 'transport', label: 'Transport', icon: '📦' },
  { value: 'off-road', label: 'Off-road', icon: '🏔️' },
];

const omgevingOptions = [
  { value: 'stad', label: 'Stad & Verhard', icon: '🏙️' },
  { value: 'heuvelachtig', label: 'Heuvels & Bergen', icon: '⛰️' },
  { value: 'onverhard', label: 'Onverhard / Off-road', icon: '🌲' },
];

const frameOptions = [
  { value: 'laag-instap', label: 'Lage instap' },
  { value: 'sportief', label: 'Sportief' },
  { value: 'hoog-instap', label: 'Hoge instap' },
];

// ── Component ──────────────────────────────────────────────

interface KeuzehulpBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function KeuzehulpBar({ filters, onFiltersChange }: KeuzehulpBarProps) {

  /* ── helpers ─────────────────────────────────────── */

  const toggleArray = (key: 'suitableFor' | 'frameTypes', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  const handleOmgeving = (val: 'stad' | 'heuvelachtig' | 'onverhard') => {
    onFiltersChange({ ...filters, omgeving: val === filters.omgeving ? undefined : val });
  };

  /* ── actieve-filter teller ───────────────────────── */

  const totalActive =
    filters.suitableFor.length +
    filters.frameTypes.length +
    (filters.omgeving ? 1 : 0) +
    (filters.lichaamslengte ? 1 : 0);

  const resetKeuzehulp = () => {
    onFiltersChange({
      ...filters,
      suitableFor: [],
      frameTypes: [],
      omgeving: undefined,
      lichaamslengte: undefined,
    });
  };

  /* ── shared chip style ───────────────────────────── */

  const chipClass = (active: boolean) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
      active
        ? 'bg-[#5A7A48] text-white border-[#5A7A48] shadow-sm'
        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
    }`;

  /* ── render ──────────────────────────────────────── */

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-8 mt-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#5A7A48]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Vind jouw perfecte e-bike
          </h2>
          <p className="text-gray-500 text-sm mt-1">Beantwoord een paar vragen en wij filteren het aanbod voor je.</p>
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

      {/* Grid: 4 oriënterende vragen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">

        {/* 1. Waarvoor */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Waarvoor gebruik je hem?</h3>
          <div className="flex flex-wrap gap-2">
            {doelOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleArray('suitableFor', opt.value)}
                className={chipClass(filters.suitableFor.includes(opt.value))}
              >
                <span className={filters.suitableFor.includes(opt.value) ? 'opacity-100' : 'opacity-80'}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Omgeving */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Waar rijd je het meest?</h3>
          <div className="flex flex-wrap gap-2">
            {omgevingOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleOmgeving(opt.value as 'stad' | 'heuvelachtig' | 'onverhard')}
                className={chipClass(filters.omgeving === opt.value)}
              >
                <span className={filters.omgeving === opt.value ? 'opacity-100' : 'opacity-80'}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Lichaamslengte */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex justify-between items-center">
            Hoe lang ben je?
            <span className="text-xs font-normal text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-100">Maatadvies</span>
          </h3>
          <div className="relative">
            <input
              type="number"
              placeholder="bijv. 175"
              className="w-full harkuhh-input font-medium pr-12"
              value={filters.lichaamslengte || ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                onFiltersChange({ ...filters, lichaamslengte: val });
              }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm pointer-events-none">
              cm
            </span>
          </div>
        </div>

        {/* 4. Frametype */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Voorkeur frametype</h3>
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

      </div>
    </div>
  );
}
