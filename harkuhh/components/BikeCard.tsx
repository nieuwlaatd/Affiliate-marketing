import Image from 'next/image';
import Link from 'next/link';
import { EBike } from '@/lib/types';

interface BikeCardProps {
  bike: EBike;
  compact?: boolean;
}

const motorTypeLabels: Record<string, string> = {
  'midden': 'Middenmotor',
  'naaf-voor': 'Voornaafmotor',
  'naaf-achter': 'Achternaafmotor',
};

const usageLabels: Record<string, string> = {
  'woon-werk': 'Woon-werk',
  'recreatief': 'Recreatief',
  'sportief': 'Sportief',
  'transport': 'Transport',
  'off-road': 'Off-road',
};

export default function BikeCard({ bike, compact = false }: BikeCardProps) {
  const brandSlug = bike.brand.toLowerCase().replace(/\s+/g, '-');
  const href = `/fietsen/${brandSlug}/${bike.slug}`;

  return (
    <Link href={href} className="group block bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-lg transition-all overflow-hidden">
      {/* Image placeholder or realistic image */}
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center relative overflow-hidden">
        {bike.images && bike.images.length > 0 ? (
          <Image 
            src={bike.images[0]} 
            alt={`${bike.brand} ${bike.model}`} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4 2.4-2.8 2.8c-.5.5-.8 1.1-.8 1.8V20h2v-3.5l2.8-2.8 2.3 2.3.5 3h2l-1.3-6.5-2.8-2.8 2-3.5-1.7-1L12 8l-3 1v4h2V9.7l1.8-.7z" />
            <path d="M19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
          </svg>
        )}
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md">
          <span className="text-sm font-bold text-gray-900">€{bike.price.toLocaleString('nl-NL')}</span>
        </div>
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#5A7A48' }}>
          {bike.scoreOverall}/10
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{bike.brand}</p>
        <h3 className="text-base font-bold text-gray-900 mt-0.5 group-hover:text-green-700 transition-colors">{bike.model}</h3>

        {!compact && (
          <>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-600">
              <span>{motorTypeLabels[bike.motorType]}</span>
              <span>{bike.batteryCapacity} Ah</span>
              <span>~{bike.rangePractical} km</span>
              <span>{bike.weight} kg</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {bike.suitableFor.slice(0, 3).map(use => (
                <span key={use} className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                  {usageLabels[use]}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
