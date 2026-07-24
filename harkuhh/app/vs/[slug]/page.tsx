import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBikes } from '@/lib/ebike-data';
import { EBike } from '@/lib/types';
import AffiliateLink from '@/components/AffiliateLink';

// Curated matchups (SEO). Each side is either a brand slug (we pick that brand's
// top-scoring bike) or an exact bike slug (findSide checks exact-slug match first).
// Must resolve to real catalog brands/bikes (see lib/ebike-data.ts) -- a slug that
// matches no bike or brand renders notFound(), which ships a dead 404 URL in the
// sitemap. Add more real brand-vs-brand or bike-vs-bike pairs as the catalog grows;
// once P2.1 (Aventon/Lectric/Rad Power/Ride1Up/Velotric affiliate approval) lands,
// those become real high-volume matchups worth adding here.
const MATCHUPS: [string, string][] = [
  ['engwe', 'eunorau'],
  ['duotts', 'engwe'],
  ['eunorau', 'samebike'],
  ['vtuvia', 'dyu'],
  ['walfisk', 'engwe'],
  // Bike-level matchups (2026-07-10, run 15): pairs actual bikes with GSC/PostHog
  // revenue signal rather than brand top-scorers, targeting real comparison-intent
  // searches between models buyers are already clicking on.
  ['engwe-n1-pro', 'duotts-s26'], // top affiliate-click bike vs top PostHog product page (S26 has zero matching GSC signal after 6 runs -- this gives it a fresh internal link + comparison surface)
  ['samebike-rs-a01-pro', 'samebike-rs-a01-men'], // two variants of the same model, both climbing in GSC (pos 14.7 / pos 9.1) -- a natural "which RS-A01 should I buy" query
  ['duotts-duotts-c29-k', 'eunorau-meta-24-1'], // both have a confirmed GSC click this run, mid-range price tier
  ['eunorau-meta-275-st-1', 'engwe-l20'], // both recurring PostHog signal (3 visitors, 2 consecutive pulls) with no vs-page yet, identical $1,399 price -- a natural "same price, which one" query
  ['eunorau-flash-lite-st', 'eunorau-flash-lite-2-0'], // FLASH LITE ST is this run's #1 affiliate-click bike (4 clicks, the highest single-bike click count logged yet) with no vs-page; FLASH LITE is the identical $1,899/92Nm platform differing only in frame geometry (step-through vs step-over) -- the exact "which frame should I get" query a buyer comparing this bike would search
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
              <AffiliateLink key={bike.slug} href={bike.affiliateUrl} brand={bike.brand} model={bike.model} slug={bike.slug} price={bike.price} network={bike.affiliateNetwork} cta="check_price"
                className="cta-primary px-4 py-2.5 text-sm font-bold rounded-lg text-center" style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}>
                Check price →
              </AffiliateLink>
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
