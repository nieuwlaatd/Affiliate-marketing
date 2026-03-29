'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EBike } from '@/lib/types';

const motorLabels: Record<string, string> = { 'midden': 'Middenmotor', 'naaf-voor': 'Voornaafmotor', 'naaf-achter': 'Achternaafmotor' };
const doelLabels: Record<string, string> = { 'woon-werk': 'Woon-werk', 'recreatief': 'Recreatief', 'sportief': 'Sportief', 'transport': 'Transport', 'off-road': 'Off-road' };
const omgevingLabels: Record<string, string> = { 'stad': 'Stad & Verhard', 'heuvelachtig': 'Heuvels & Bergen', 'onverhard': 'Off-road' };
const frameLabels: Record<string, string> = { 'laag-instap': 'Lage instap', 'hoog-instap': 'Hoge instap', 'sportief': 'Sportief' };

interface MatchResult {
  label: string;
  wens: string;
  matches: boolean;
  detail: string;
}

export default function FilterMatchBlock({ bike }: { bike: EBike }) {
  const searchParams = useSearchParams();
  
  // Extract filter criteria from URL params
  const budget = searchParams.get('budget');
  const doel = searchParams.get('doel');
  const omgeving = searchParams.get('omgeving');
  const lengte = searchParams.get('lengte');
  const frame = searchParams.get('frame');
  const bereik = searchParams.get('bereik');
  const opvouwbaar = searchParams.get('opvouwbaar');
  const accuAfneembaar = searchParams.get('accuAfneembaar');
  const maxGewicht = searchParams.get('maxGewicht');
  const motor = searchParams.get('motor');

  // If no filters are set, don't render anything
  const hasFilters = budget || doel || omgeving || lengte || frame || bereik || opvouwbaar || accuAfneembaar || maxGewicht || motor;
  if (!hasFilters) return null;

  const results: MatchResult[] = [];

  // Budget check
  if (budget) {
    const max = Number(budget);
    results.push({
      label: '💰',
      wens: `Budget tot €${max.toLocaleString('nl-NL')}`,
      matches: bike.price <= max,
      detail: bike.price <= max 
        ? `€${bike.price.toLocaleString('nl-NL')} — past binnen je budget`
        : `€${bike.price.toLocaleString('nl-NL')} — €${(bike.price - max).toLocaleString('nl-NL')} boven je budget`,
    });
  }

  // Usage check
  if (doel) {
    const doelen = doel.split(',');
    const bikeDoelen = bike.suitableFor;
    const matchedDoelen = doelen.filter(d => bikeDoelen.includes(d as EBike['suitableFor'][number]));
    results.push({
      label: '🚴',
      wens: `Geschikt voor ${doelen.map(d => doelLabels[d] || d).join(', ')}`,
      matches: matchedDoelen.length > 0,
      detail: matchedDoelen.length > 0 
        ? `Geschikt voor ${matchedDoelen.map(d => doelLabels[d] || d).join(', ')}`
        : `Niet specifiek geschikt voor ${doelen.map(d => doelLabels[d] || d).join(', ')}`,
    });
  }

  // Environment check
  if (omgeving) {
    let matches = true;
    let detail = '';
    if (omgeving === 'heuvelachtig') {
      matches = bike.torque >= 50;
      detail = matches 
        ? `${bike.torque} Nm koppel — genoeg voor heuvels`
        : `${bike.torque} Nm koppel — mogelijk te weinig voor heuvels (50+ Nm aanbevolen)`;
    } else if (omgeving === 'onverhard') {
      matches = bike.suitableFor.includes('off-road') || bike.suitableFor.includes('sportief');
      detail = matches ? 'Geschikt voor onverhard terrein' : 'Niet specifiek ontworpen voor off-road';
    } else {
      detail = 'Geschikt voor stadgebruik';
    }
    results.push({
      label: '🗺️',
      wens: `Omgeving: ${omgevingLabels[omgeving] || omgeving}`,
      matches,
      detail,
    });
  }

  // Height ranges check
  const lengteRanges = searchParams.get('lengteRanges');
  if (lengteRanges) {
    const ranges = lengteRanges.split(',');
    const bikeMin = bike.minRiderHeight || 0;
    const bikeMax = bike.maxRiderHeight || 999;
    
    const matches = ranges.some(range => {
      let min = 0;
      let max = 999;
      if (range.startsWith('<')) max = parseInt(range.substring(1));
      else if (range.endsWith('+')) min = parseInt(range.substring(0, range.length - 1));
      else {
        const parts = range.split('-');
        min = parseInt(parts[0]);
        max = parseInt(parts[1]);
      }
      return bikeMin <= max && bikeMax >= min;
    });
    
    results.push({
      label: '📏',
      wens: `Lengte: ${ranges.join(', ')} cm`,
      matches,
      detail: matches 
        ? `Geschikt voor ${bikeMin}–${bikeMax} cm — past bij jouw selectie`
        : `Geschikt voor ${bikeMin}–${bikeMax} cm — wijkt af van jouw selectie`,
    });
  }

  // Height check (specific)
  if (lengte) {
    const h = Number(lengte);
    const hasRange = bike.minRiderHeight && bike.maxRiderHeight;
    const matches = hasRange ? (h >= bike.minRiderHeight! && h <= bike.maxRiderHeight!) : true;
    results.push({
      label: '📏',
      wens: `Jouw lengte: ${h} cm`,
      matches,
      detail: hasRange 
        ? (matches 
          ? `Aanbevolen voor ${bike.minRiderHeight}–${bike.maxRiderHeight} cm — past perfect`
          : `Aanbevolen voor ${bike.minRiderHeight}–${bike.maxRiderHeight} cm — mogelijk niet ideaal`)
        : 'Geen specifieke lengte-aanbeveling beschikbaar',
    });
  }

  // Frame type check
  if (frame) {
    const frames = frame.split(',');
    const matches = frames.includes(bike.frameType);
    results.push({
      label: '🖼️',
      wens: `Frametype: ${frames.map(f => frameLabels[f] || f).join(', ')}`,
      matches,
      detail: matches
        ? `Dit is een ${frameLabels[bike.frameType]} frame`
        : `Dit is een ${frameLabels[bike.frameType]} frame (je zocht ${frames.map(f => frameLabels[f] || f).join(', ')})`,
    });
  }

  // Range check
  if (bereik) {
    const min = Number(bereik);
    const matches = bike.rangePractical >= min;
    results.push({
      label: '🔋',
      wens: `Minimaal ${min} km bereik`,
      matches,
      detail: matches
        ? `~${bike.rangePractical} km praktijkbereik — voldoende`
        : `~${bike.rangePractical} km praktijkbereik — ${min - bike.rangePractical} km tekort`,
    });
  }

  // Motor type check
  if (motor) {
    const motors = motor.split(',');
    const matches = motors.includes(bike.motorType);
    results.push({
      label: '⚙️',
      wens: `Motortype: ${motors.map(m => motorLabels[m] || m).join(', ')}`,
      matches,
      detail: matches 
        ? `${motorLabels[bike.motorType]} — zoals gewenst`
        : `${motorLabels[bike.motorType]} (je zocht ${motors.map(m => motorLabels[m] || m).join(', ')})`,
    });
  }

  // Foldable check
  if (opvouwbaar === '1') {
    const isFoldable = bike.dimensions?.foldedSize && bike.dimensions.foldedSize !== 'Yes';
    results.push({
      label: '📐',
      wens: 'Opvouwbaar',
      matches: !!isFoldable,
      detail: isFoldable
        ? `Opvouwbaar tot ${bike.dimensions!.foldedSize}`
        : 'Deze fiets is niet opvouwbaar',
    });
  }

  // Battery removable check
  if (accuAfneembaar === '1') {
    results.push({
      label: '🔌',
      wens: 'Afneembare accu',
      matches: bike.batteryRemovable,
      detail: bike.batteryRemovable
        ? 'Accu is afneembaar voor apart opladen'
        : 'Accu is niet afneembaar',
    });
  }

  // Weight check
  if (maxGewicht) {
    const max = Number(maxGewicht);
    const matches = bike.weight <= max;
    results.push({
      label: '⚖️',
      wens: `Max ${max} kg fietsgewicht`,
      matches,
      detail: matches
        ? `${bike.weight} kg — licht genoeg`
        : `${bike.weight} kg — ${(bike.weight - max).toFixed(0)} kg te zwaar`,
    });
  }

  const matchCount = results.filter(r => r.matches).length;
  const totalCount = results.length;
  const matchPct = Math.round((matchCount / totalCount) * 100);
  const allMatch = matchCount === totalCount;

  // Build return-to-overview link with same filters
  const overviewUrl = `/fietsen/overzicht?${searchParams.toString()}`;

  return (
    <div className={`rounded-xl border-2 p-6 mb-8 ${allMatch ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white ${allMatch ? 'bg-[#5A7A48]' : 'bg-amber-500'}`}>
            {matchCount}/{totalCount}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {allMatch ? 'Past perfect bij jouw wensen!' : 'Past bij jouw wensen'}
            </h2>
            <p className="text-sm text-gray-500">
              Op basis van jouw geselecteerde filters
            </p>
          </div>
        </div>
        <Link 
          href={overviewUrl}
          className="text-xs font-bold px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Terug naar overzicht
        </Link>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${allMatch ? 'bg-[#5A7A48]' : 'bg-amber-500'}`}
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
                ? 'bg-white border-green-200' 
                : 'bg-white border-red-100'
            }`}
          >
            <span className="text-lg mt-0.5">{r.matches ? '✅' : '❌'}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800">{r.wens}</p>
              <p className={`text-xs mt-0.5 ${r.matches ? 'text-green-600' : 'text-red-500'}`}>{r.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
