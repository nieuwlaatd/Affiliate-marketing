import Link from 'next/link';
import { EBike } from '@/lib/types';

export default function SpecComparisonTable({ bikes }: { bikes: EBike[] }) {
  if (bikes.length === 0) return null;

  return (
    <div className="mt-10 overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-[var(--card-bg)] text-left">
            <th className="px-4 py-3 font-bold text-[var(--foreground)]">#</th>
            <th className="px-4 py-3 font-bold text-[var(--foreground)]">Bike</th>
            <th className="px-4 py-3 font-bold text-[var(--foreground)]">Price</th>
            <th className="px-4 py-3 font-bold text-[var(--foreground)]">Range</th>
            <th className="px-4 py-3 font-bold text-[var(--foreground)]">Torque</th>
            <th className="px-4 py-3 font-bold text-[var(--foreground)]">Payload</th>
            <th className="px-4 py-3 font-bold text-[var(--foreground)]">Score</th>
          </tr>
        </thead>
        <tbody>
          {bikes.map((bike, i) => {
            const brandSlug = bike.brand.toLowerCase().replace(/\s+/g, '-');
            return (
              <tr
                key={bike.id}
                className="border-t border-[var(--border)] hover:bg-[var(--card-bg)] transition-colors"
              >
                <td className="px-4 py-3 text-[var(--muted)]">{i + 1}</td>
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/e-bikes/${brandSlug}/${bike.slug}`}
                    className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                  >
                    {bike.brand} {bike.model}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--muted)] whitespace-nowrap">
                  ${bike.price.toLocaleString('en-US')}
                </td>
                <td className="px-4 py-3 text-[var(--muted)] whitespace-nowrap">
                  {bike.rangePractical} mi
                </td>
                <td className="px-4 py-3 text-[var(--muted)] whitespace-nowrap">
                  {bike.torque > 0 ? `${bike.torque} Nm` : '—'}
                </td>
                <td className="px-4 py-3 text-[var(--muted)] whitespace-nowrap">
                  {bike.maxWeight > 0 ? `${bike.maxWeight} lbs` : '—'}
                </td>
                <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: 'var(--accent)' }}>
                  {bike.scoreOverall}/10
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
