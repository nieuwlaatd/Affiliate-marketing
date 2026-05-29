import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBikes } from '@/lib/ebike-data';
import { EBike } from '@/lib/types';

// Curated high-volume matchups (SEO). Each side is a brand slug; we pick that
// brand's top-scoring bike. Add more as the database grows.
const MATCHUPS: [string, string][] = [
  ['aventon', 'rad-power-bikes'],
  ['lectric', 'rad-power-bikes'],
  ['velotric', 'aventon'],
  ['ride1up', 'aventon'],
  ['himiway', 'heybike'],
  ['lectric', 'aventon'],
];

function brandSlug(b: EBike): string {
  return b.brand.toLowerCase().replace(/\s+/g, '-');
}

function findSide(bikes: EBike[], slugPart: string): EBike | undefined {
  // exact bike slug match first
  const byBike = bikes.find((b) => b.slug === slugPart);
  if (byBike) return byBike;
  // otherwise top-scoring bike for that brand slug
  return bikes
    .filter((b) => brandSlug(b) === slugPart)
    .sort((a, b) => b.scoreOverall - a.scoreOverall)[0];
}

export function generateStaticParams() {
  return MATCHUPS.map(([a, b]) => ({ slug: `${a}-vs-${b}` }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return { title: 'Comparison not found' };
  const allBikes = await getAllBikes();
  const a = findSide(allBikes, parts[0]);
  const b = findSide(allBikes, parts[1]);
  if (!a || !b) return { title: 'Comparison not found' };
  const title = `${a.brand} ${a.model} vs ${b.brand} ${b.model}: Which Should You Buy?`;
  const description = `${a.brand} vs ${b.brand}: side-by-side specs, scores and price. We pick a winner in each category to help you decide.`;
  return {
    title,
    description,
    alternates: { canonical: `/vs/${slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

const Row = ({ label, a, b, winner }: { label: string; a: string; b: string; winner?: 0 | 1 | null }) => (
  <div className="grid grid-cols-[120px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] gap-3 py-3 border-b border-[var(--border)]">
    <div className="text-sm text-[var(--muted)]">{label}</div>
    <div className={`text-sm font-medium ${winner === 0 ? 'text-[var(--accent)] font-bold' : 'text-[var(--foreground)]'}`}>{a}</div>
    <div className={`text-sm font-medium ${winner === 1 ? 'text-[var(--accent)] font-bold' : 'text-[var(--foreground)]'}`}>{b}</div>
  </div>
);

export default async function VsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parts = slug.split('-vs-');
  if (parts.length !== 2) notFound();

  const allBikes = await getAllBikes();
  const a = findSide(allBikes, parts[0]);
  const b = findSide(allBikes, parts[1]);
  if (!a || !b) notFound();

  const cmp = (x: number, y: number, higher = true): 0 | 1 | null =>
    x === y ? null : higher ? (x > y ? 0 : 1) : x < y ? 0 : 1;

  const scoreWinner = a.scoreOverall === b.scoreOverall ? null : a.scoreOverall > b.scoreOverall ? a : b;

  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <Link href="/e-bikes" className="hover:text-[var(--foreground)]">E-Bikes</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)]">Comparison</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          {a.brand} {a.model} vs {b.brand} {b.model}
        </h1>
        <p className="text-[var(--muted)] text-lg mt-3 max-w-3xl leading-relaxed">
          A data-driven, side-by-side comparison. We score every e-bike on value, range, power,
          comfort and build quality so you can decide with confidence.
        </p>

        {/* Headers */}
        <div className="grid grid-cols-[120px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] gap-3 mt-10 mb-2">
          <div />
          {[a, b].map((bike) => (
            <div key={bike.slug} className="text-center">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-[var(--surface)] mb-3">
                {bike.images?.[0] ? (
                  <Image src={bike.images[0]} alt={`${bike.brand} ${bike.model}`} fill className="object-cover" sizes="(max-width:640px) 50vw, 300px" />
                ) : (
                  <div className="flex items-center justify-center h-full text-3xl opacity-30">🚲</div>
                )}
              </div>
              <p className="text-xs text-[var(--muted)] uppercase tracking-wide">{bike.brand}</p>
              <h2 className="font-bold text-[var(--foreground)]">{bike.model}</h2>
            </div>
          ))}
        </div>

        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
          <Row label="Price" a={`$${a.price.toLocaleString('en-US')}`} b={`$${b.price.toLocaleString('en-US')}`} winner={cmp(a.price, b.price, false)} />
          <Row label="Overall score" a={`${a.scoreOverall}`} b={`${b.scoreOverall}`} winner={cmp(a.scoreOverall, b.scoreOverall)} />
          <Row label="Value" a={`${a.scoreValue}`} b={`${b.scoreValue}`} winner={cmp(a.scoreValue, b.scoreValue)} />
          <Row label="Range (real-world)" a={`~${a.rangePractical} mi`} b={`~${b.rangePractical} mi`} winner={cmp(a.rangePractical, b.rangePractical)} />
          <Row label="Motor" a={`${a.torque} Nm`} b={`${b.torque} Nm`} winner={cmp(a.torque, b.torque)} />
          <Row label="Battery" a={`${a.batteryCapacity} Ah`} b={`${b.batteryCapacity} Ah`} winner={cmp(a.batteryCapacity, b.batteryCapacity)} />
          <Row label="Weight" a={`${a.weight} lbs`} b={`${b.weight} lbs`} winner={cmp(a.weight, b.weight, false)} />
          <Row label="Max payload" a={`${a.maxWeight} lbs`} b={`${b.maxWeight} lbs`} winner={cmp(a.maxWeight, b.maxWeight)} />
          <Row label="Warranty" a={a.warrantyYears ? `${a.warrantyYears} yr` : '—'} b={b.warrantyYears ? `${b.warrantyYears} yr` : '—'} />

          <div className="grid grid-cols-[120px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] gap-3 pt-6">
            <div />
            {[a, b].map((bike) => (
              <a key={bike.slug} href={bike.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                className="cta-primary px-4 py-2.5 text-sm font-bold rounded-lg text-center" style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}>
                Check price →
              </a>
            ))}
          </div>
        </div>

        {/* Verdict */}
        <div className="mt-10 p-6 rounded-xl border-2" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--accent-soft)' }}>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Our verdict</h2>
          <p className="text-[var(--muted)] leading-relaxed">
            {scoreWinner ? (
              <>On our scoring model the <strong className="text-[var(--foreground)]">{scoreWinner.brand} {scoreWinner.model}</strong> comes out ahead overall
              ({scoreWinner.scoreOverall} vs {(scoreWinner === a ? b : a).scoreOverall}). That said, the right
              choice depends on your priorities. Use the quiz below for a recommendation tailored to you.</>
            ) : (
              <>It’s remarkably close: both score {a.scoreOverall} overall. The right choice comes down to
              your budget, terrain and feature priorities. Take the quiz for a personalized pick.</>
            )}
          </p>
          <Link href="/e-bikes/quiz" className="cta-primary inline-flex mt-5 px-6 py-3 font-bold rounded-lg" style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}>
            Find My E-Bike →
          </Link>
        </div>
      </div>
    </div>
  );
}
