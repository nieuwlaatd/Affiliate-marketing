import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BikeCard from '@/components/BikeCard';
import FilterMatchBlock from '@/components/FilterMatchBlock';
import { getAllBikes, getBikeBySlug, getSimilarBikes } from '@/lib/ebike-data';

const motorLabels: Record<string, string> = { 'midden': 'Middenmotor', 'naaf-voor': 'Voornaafmotor', 'naaf-achter': 'Achternaafmotor' };
const frameLabels: Record<string, string> = { 'laag-instap': 'Laag instap', 'hoog-instap': 'Hoog instap', 'sportief': 'Sportief' };
const gearLabels: Record<string, string> = { 'derailleur': 'Derailleur', 'naaf': 'Naafversnelling', 'cvt': 'CVT' };
const usageLabels: Record<string, string> = { 'woon-werk': 'Woon-werk', 'recreatief': 'Recreatief', 'sportief': 'Sportief', 'transport': 'Transport', 'off-road': 'Off-road' };

export async function generateStaticParams() {
  const allBikes = await getAllBikes();
  return allBikes.map(bike => ({
    brand: bike.brand.toLowerCase().replace(/\s+/g, '-'),
    model: bike.slug,
  }));
}

const ScoreBar = ({ score, label }: { score: number; label: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-[var(--muted)] w-28 shrink-0">{label}</span>
    <div className="flex-1 bg-[var(--surface)] rounded-full h-2.5">
      <div className="h-2.5 rounded-full" style={{ width: `${score * 10}%`, backgroundColor: '#5A7A48' }} />
    </div>
    <span className="text-sm font-bold w-8 text-right text-[var(--foreground)]">{score}</span>
  </div>
);

export default async function ProductPage({ params }: { params: Promise<{ brand: string; model: string }> }) {
  const { model } = await params;
  const bike = await getBikeBySlug(model);
  if (!bike) notFound();

  const similar = await getSimilarBikes(bike, 3);



  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-[var(--muted)] mb-6">
          <Link href="/e-bikes/overzicht" className="hover:text-[var(--foreground)]">Alle e-bikes</Link>
          <span className="mx-2">›</span>
          <Link href={`/e-bikes/overzicht?merk=${bike.brand}`} className="hover:text-[var(--foreground)]">{bike.brand}</Link>
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
            <p className="text-sm text-[var(--muted)] mt-1">Modeljaar {bike.year}</p>

            <div className="flex items-baseline gap-4 mt-4">
              <span className="text-3xl font-bold text-[var(--foreground)]">€{bike.price.toLocaleString('nl-NL')}</span>
              <span className="text-sm px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#5A7A4820', color: '#5A7A48' }}>
                {bike.scoreOverall}
              </span>
            </div>

            <p className="text-[var(--muted)] mt-4 leading-relaxed">{bike.description}</p>

            <ul className="mt-6 space-y-2">
              {bike.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                  <span style={{ color: '#5A7A48' }}>✓</span> {h}
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
              <a href={bike.affiliateUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 text-white font-bold rounded-lg text-center transition-colors" style={{ backgroundColor: '#5A7A48' }}>
                Bekijk beste prijs →
              </a>
              <a href={bike.testRideUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border-2 font-bold rounded-lg text-center transition-colors bg-[var(--card-bg)]" style={{ borderColor: '#5A7A48', color: '#5A7A48' }}>
                Boek proefrit
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
            <ScoreBar score={bike.scoreOverall} label="Totaalscore" />
            <ScoreBar score={bike.scorePriceQuality} label="Prijs-kwaliteit" />
            <ScoreBar score={bike.scoreComfort} label="Comfort" />
            <ScoreBar score={bike.scoreRange} label="Bereik" />
          </div>
        </div>

        {/* Specs table */}
        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6 mb-8">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Specificaties</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Motor & Aandrijving</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Motortype</dt><dd className="font-medium text-[var(--foreground)]">{motorLabels[bike.motorType]}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Motormerk</dt><dd className="font-medium text-[var(--foreground)]">{bike.motorBrand}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Koppel</dt><dd className="font-medium text-[var(--foreground)]">{bike.torque} Nm</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Ondersteuningsniveaus</dt><dd className="font-medium text-[var(--foreground)]">{bike.supportLevels}</dd></div>
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Accu</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Capaciteit</dt><dd className="font-medium text-[var(--foreground)]">{bike.batteryCapacity} Ah</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Bereik (fabrikant)</dt><dd className="font-medium text-[var(--foreground)]">{bike.rangeManufacturer} km</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Bereik (praktijk)</dt><dd className="font-medium text-[var(--foreground)]">~{bike.rangePractical} km</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Laadtijd</dt><dd className="font-medium text-[var(--foreground)]">{bike.chargeTime} uur</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Afneembaar</dt><dd className="font-medium text-[var(--foreground)]">{bike.batteryRemovable ? 'Ja' : 'Nee'}</dd></div>
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Frame & Comfort</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Frametype</dt><dd className="font-medium text-[var(--foreground)]">{frameLabels[bike.frameType]}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Materiaal</dt><dd className="font-medium text-[var(--foreground)]">{bike.frameMaterial}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Wielmaat</dt><dd className="font-medium text-[var(--foreground)]">{bike.wheelSize} inch</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Gewicht</dt><dd className="font-medium text-[var(--foreground)]">{bike.weight} kg</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Max. belasting</dt><dd className="font-medium text-[var(--foreground)]">{bike.maxWeight} kg</dd></div>
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wide mb-4">Versnellingen</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Type</dt><dd className="font-medium text-[var(--foreground)]">{gearLabels[bike.gearType]}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Aantal</dt><dd className="font-medium text-[var(--foreground)]">{bike.gearCount}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-[var(--muted)]">Merk</dt><dd className="font-medium text-[var(--foreground)]">{bike.gearBrand}</dd></div>
              </dl>
            </div>
          </div>
        </div>

        {/* All Specs (Dynamic) */}
        {bike.fullSpecs && Object.keys(bike.fullSpecs).length > 0 && (
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6 mb-8">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Alle Technische Details</h2>
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
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-12 text-center">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">Wil je deze fiets vergelijken?</h2>
            <p className="text-sm text-[var(--muted)] mb-4">Vergelijk de {bike.model} met andere e-bikes</p>
          <Link href={`/e-bikes/vergelijk?bikes=${bike.slug}`} className="inline-flex px-6 py-2 text-white font-bold rounded-lg" style={{ backgroundColor: '#5A7A48' }}>
            Open vergelijking
          </Link>
        </div>

        {/* Similar bikes */}
        {similar.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Vergelijkbare e-bikes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similar.map(b => <BikeCard key={b.id} bike={b} compact />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
