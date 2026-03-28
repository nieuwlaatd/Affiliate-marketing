'use client';

import { FilterState } from '@/lib/types';

const doelOptions = [
  { value: 'woon-werk', label: 'Woon-werk', icon: '🚴' },
  { value: 'recreatief', label: 'Recreatief', icon: '🌳' },
  { value: 'sportief', label: 'Sportief', icon: '⚡' },
  { value: 'transport', label: 'Transport', icon: '📦' },
  { value: 'off-road', label: 'Off-road', icon: '🏔️' },
];

const frameOptions = [
  { value: 'laag-instap', label: 'Laag instap' },
  { value: 'hoog-instap', label: 'Hoog instap' },
];

interface KeuzehulpBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function KeuzehulpBar({ filters, onFiltersChange }: KeuzehulpBarProps) {
  const toggleSuitableFor = (value: string) => {
    const current = filters.suitableFor;
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, suitableFor: updated });
  };

  const toggleFrameType = (value: string) => {
    const current = filters.frameTypes;
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, frameTypes: updated });
  };

  const activeCount =
    filters.suitableFor.length +
    filters.frameTypes.length +
    (filters.priceRange[1] < 2000 ? 1 : 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-8">
        {/* Gebruiksdoel */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Waar zoek je een e-bike voor?</h3>
          <div className="flex flex-wrap gap-2">
            {doelOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleSuitableFor(option.value)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  filters.suitableFor.includes(option.value)
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={
                  filters.suitableFor.includes(option.value)
                    ? { backgroundColor: '#5A7A48' }
                    : undefined
                }
              >
                <span>{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="lg:w-48">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Max. budget</h3>
          <div>
            <input
              type="range"
              min={500}
              max={2000}
              step={50}
              value={filters.priceRange[1]}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  priceRange: [500, Number(e.target.value)],
                })
              }
              className="w-full accent-[#5A7A48]"
            />
            <div className="text-sm font-medium mt-1" style={{ color: '#5A7A48' }}>
              Tot €{filters.priceRange[1].toLocaleString('nl-NL')}
            </div>
          </div>
        </div>

        {/* Frametype */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Frametype</h3>
          <div className="flex gap-2">
            {frameOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleFrameType(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  filters.frameTypes.includes(option.value)
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={
                  filters.frameTypes.includes(option.value)
                    ? { backgroundColor: '#5A7A48' }
                    : undefined
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filter count + reset */}
      {activeCount > 0 && (
        <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500">
            {activeCount} filter{activeCount !== 1 ? 's' : ''} actief
          </span>
          <button
            onClick={() =>
              onFiltersChange({
                ...filters,
                suitableFor: [],
                frameTypes: [],
                priceRange: [500, 2000],
              })
            }
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Reset keuzehulp
          </button>
        </div>
      )}
    </div>
  );
}
