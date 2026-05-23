import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import BikeCard from '@/components/BikeCard';
import FilterMatchBlock from '@/components/FilterMatchBlock';
import { getAllBikes, getBikeBySlug, getSimilarBikes } from '@/lib/ebike-data';

const motorLabels: Record<string, string> = { 'mid-drive': 'Mid-drive', 'front-hub': 'Front hub', 'rear-hub': 'Rear hub' };
const frameLabels: Record<string, string> = { 'step-through': 'Step-through', 'step-over': 'Step-over', 'sport': 'Sport' };
const gearLabels: Record<string, string> = { 'derailleur': 'Derailleur', 'internal-hub': 'Internal hub', 'cvt': 'CVT', 'single-speed': 'Single speed' };
const usageLabels: Record<string, string> = { 'commuting': 'Commuting', 'recreation': 'Recreation', 'sport': 'Sport', 'cargo': 'Cargo', 'off-road': 'Off-road' };
const classLabels: Record<string, string> = { 'class-1': 'Class 1 (pedal-assist, 20 mph)', 'class-2': 'Class 2 (throttle, 20 mph)', 'class-3': 'Class 3 (pedal-assist, 28 mph)' };

export async function generateStaticParams() {
  const allBikes = await getAllBikes();
  return allBikes.map(bike => ({
    brand: bike.brand.toLowerCase().replace(/\s+/g, '-'),
    model: bike.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string; model: string }> }): Promise<Metadata> {
  const { model } = await params;
  const bike = await getBikeBySlug(model);
  if (!bike) return { title: 'E-Bike not found — Harkuhh' };
  const title = `${bike.brand} ${bike.model} Review ${bike.year} — Specs, Price & Where to Buy`;
  const description = `Is the ${bike.brand} ${bike.model} worth $${bike.price.toLocaleString('en-US')}? Compare specs, read our analysis and find the best price.`;
  return {
    title,
    description,
    openGraph: { title, description, images: bike.images?.[0] ? [bike.images[0]] : [], type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const ScoreBar = ({ score, label }: { score: number; label: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-[var(--muted)] w-28 shrink-0">{label}</span>
    <div className="flex-1 bg-[var(--surface)] rounded-full h-2.5">
      <div className="h-2.5 rounded-full" style={{ width: `${score * 10}%`, backgroundColor: 'var(--accent)' }} />
    </div>
    <span className="text-sm font-bold w-8 text-right text-[var(--foreground)]">{score}</span>
  </div>
);

export default async function ProductPage({ params }: { params: Promise<{ brand: string; model: string }> }) {
  const { model } = await params;
  const bike = await getBikeBySlug(model);
  if (!bike) notFound();

  const similar = await getSimilarBikes(bike, 3);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${bike.brand} ${bike.model}`,
    image: bike.images,
    description: bike.description,
    brand: { '@type': 'Brand', name: bike.brand },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: bike.price,
      availability: 'https://schema.org/InStock',
      url: bike.affiliateUrl,
    },
    aggregateRating: bike.scoreOverall
      ? { '@type': 'AggregateRating', ratingValue: (bike.scoreOverall / 2).toFixed(1), bestRating: '5', ratingCount: 1 }
      : undefined,
  };

  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-[var(--muted)] mb-6">
          <Link href="/e-bikes/overzicht" className="hover:text-[var(--foreground)]">All e-bikes</Link>
          <span className="mx-2">›</span>
          <Link href={`/e-bikes/overzicht?brand=${bike.brand}`} className="hover:text-[var(--foreground)]">{bike.brand}</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)]">{bike.model}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] aspect-[4/3] flex items-center justify-center relative overflow-hidden">
            {bike.images && bike.images.length > 0 ? (
              <Image
                src={bike.images[0]}
                alt={`${bike.brand} ${bike.model}`}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
               <svg className="w-24 h-24 text-[var(--muted)] opacity-30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4 2.4-2.8 2.8c-.5.5-.8 1.1-.8 1.8V20h2v-3.5l2.8-2.8 2.3 2.3.5 3h2l-1.3-6.5-2.8-2.8 2-3.5-1.7-1L12 8l-3 1v4h2V9.7l1.8-.7z" />
                <path d="M19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
              </svg>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-sm font-medium text-[var(--muted)] uppercase tracking-wide">{bike.brand}</p>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mt-1">{bike.model}</h1>
            <p className="text-sm text-[var(--muted)] mt-1">Model year {bike.year}</p>

            <div className="flex items-baseline gap-4 mt-4">
              <span className="text-3xl font-bold text-[var(--foreground)]">${bike.price.toLocaleString('en-US')}</span>
              <span className="text-sm px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                {bike.scoreOverall}
              </span>
            </div>

            <p className="text-[var(--muted)] mt-4 leading-relaxed">{bike.description}</p>

            <ul className="mt-6 space-y-2">
              {bike.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                  <span style={{ color: 'var(--accent)' }}>✓</span> {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 mt-6">
              {bike.suitableFor.map(use => (
                <span key={use} className="text-xs px-3 py-1 rounded-full bg-[var(--surface)] text-[var(--accent)] border border-[var(--border)]">
                  {usageLabels[use]}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a href={bike.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="px-6 py-3 font-bold rounded-lg text-center transition-colors" style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}>
                Check best price →
              </a>
              <a href={bike.testRideUrl} target="_blank" rel="noopener noreferrer sponsored" className="px-6 py-3 border-2 font-bold rounded-lg text-center transition-colors bg-[var(--card-bg)]" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                Visit official site
              </a>
            </div>
          </div>
        </div>

        {/* Filter Match Block (shows when user came from filtered overview) */}
        <Suspense fallback={null}>
          <FilterMatchBlock bike={bike} />
        </Suspense>

        {/* Scores */}
        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6 mb-8">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Scores</h2>
          <div className="space-y-4 max-w-lg">
            <ScoreBar score={bike.scoreOverall} label="Overall score" />
            <ScoreBar score={bike.scoreValue} label="Value" />
            <ScoreBar score={bike.scoreRange} label="Range" />
            <ScoreBar score={bike.scorePower} label="Power" />
            <ScoreBar score={bike.scoreComfort} label="Comfort" />
            <ScoreBar score={bike.scoreBuildQuality} label="Build quality" />
            <ScoreBar score={bike.scoreVersatility} label="Versatility" />
          </div>
        </div>

        {/* Specs table */}
        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6 mb-8">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Specifications</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Motor & Drivetrain</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Motor type</dt><dd className="font-medium text-[var(--foreground)]">{motorLabels[bike.motorType]}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Motor brand</dt><dd className="font-medium text-[var(--foreground)]">{bike.motorBrand}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Torque</dt><dd className="font-medium text-[var(--foreground)]">{bike.torque} Nm</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Assist levels</dt><dd className="font-medium text-[var(--foreground)]">{bike.supportLevels}</dd></div>
                {bike.bikeClass && <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Class</dt><dd className="font-medium text-[var(--foreground)]">{classLabels[bike.bikeClass]}</dd></div>}
                {bike.maxSpeedMph != null && <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Top speed</dt><dd className="font-medium text-[var(--foreground)]">{bike.maxSpeedMph} mph</dd></div>}
                {bike.hasThrottle != null && <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Throttle</dt><dd className="font-medium text-[var(--foreground)]">{bike.hasThrottle ? 'Yes' : 'No'}</dd></div>}
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Battery</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Capacity</dt><dd className="font-medium text-[var(--foreground)]">{bike.batteryCapacity} Ah</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Range (claimed)</dt><dd className="font-medium text-[var(--foreground)]">{bike.rangeManufacturer} mi</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Range (real-world)</dt><dd className="font-medium text-[var(--foreground)]">~{bike.rangePractical} mi</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Charge time</dt><dd className="font-medium text-[var(--foreground)]">{bike.chargeTime} hrs</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Removable</dt><dd className="font-medium text-[var(--foreground)]">{bike.batteryRemovable ? 'Yes' : 'No'}</dd></div>
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Frame & Comfort</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Frame type</dt><dd className="font-medium text-[var(--foreground)]">{frameLabels[bike.frameType]}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Material</dt><dd className="font-medium text-[var(--foreground)]">{bike.frameMaterial}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Wheel size</dt><dd className="font-medium text-[var(--foreground)]">{bike.wheelSize}"</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Weight</dt><dd className="font-medium text-[var(--foreground)]">{bike.weight} lbs</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Max. payload</dt><dd className="font-medium text-[var(--foreground)]">{bike.maxWeight} lbs</dd></div>
                {bike.hasSuspension && <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Suspension</dt><dd className="font-medium text-[var(--foreground)] capitalize">{bike.hasSuspension}</dd></div>}
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Gearing</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Type</dt><dd className="font-medium text-[var(--foreground)]">{gearLabels[bike.gearType]}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Speeds</dt><dd className="font-medium text-[var(--foreground)]">{bike.gearCount}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Brand</dt><dd className="font-medium text-[var(--foreground)]">{bike.gearBrand}</dd></div>
                {bike.warrantyYears != null && <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Warranty</dt><dd className="font-medium text-[var(--foreground)]">{bike.warrantyYears} yr</dd></div>}
              </dl>
            </div>
          </div>
        </div>

        {/* All Specs (Dynamic) */}
        {bike.fullSpecs && Object.keys(bike.fullSpecs).length > 0 && (
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6 mb-8">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">All Technical Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
              {Object.entries(bike.fullSpecs).map(([key, value]) => (
                <div key={key} className="flex flex-col border-b border-[var(--surface)] pb-2">
                  <dt className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">{key}</dt>
                  <dd className="text-sm font-medium text-[var(--foreground)] mt-1">{value}</dd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compare CTA */}
        <div className="rounded-xl p-6 mb-12 text-center border" style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--accent)' }}>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">Want to compare this bike?</h2>
            <p className="text-sm text-[var(--muted)] mb-4">Compare the {bike.model} against other e-bikes</p>
          <Link href={`/e-bikes/vergelijk?bikes=${bike.slug}`} className="inline-flex px-6 py-2 font-bold rounded-lg" style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}>
            Open comparison
          </Link>
        </div>

        {/* Similar bikes */}
        {similar.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Similar e-bikes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similar.map(b => <BikeCard key={b.id} bike={b} compact />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
