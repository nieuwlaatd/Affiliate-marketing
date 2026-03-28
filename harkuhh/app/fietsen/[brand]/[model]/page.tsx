import Link from 'next/link';
import { notFound } from 'next/navigation';
import BikeCard from '@/components/BikeCard';
import { bikes, getBikeBySlug, getSimilarBikes } from '@/lib/ebike-data';

const motorLabels: Record<string, string> = { 'midden': 'Middenmotor', 'naaf-voor': 'Voornaafmotor', 'naaf-achter': 'Achternaafmotor' };
const frameLabels: Record<string, string> = { 'laag-instap': 'Laag instap', 'hoog-instap': 'Hoog instap', 'sportief': 'Sportief' };
const gearLabels: Record<string, string> = { 'derailleur': 'Derailleur', 'naaf': 'Naafversnelling', 'cvt': 'CVT' };
const usageLabels: Record<string, string> = { 'woon-werk': 'Woon-werk', 'recreatief': 'Recreatief', 'sportief': 'Sportief', 'transport': 'Transport', 'off-road': 'Off-road' };

export function generateStaticParams() {
  return bikes.map(bike => ({
    brand: bike.brand.toLowerCase().replace(/\s+/g, '-'),
    model: bike.slug,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ brand: string; model: string }> }) {
  const { model } = await params;
  const bike = getBikeBySlug(model);
  if (!bike) notFound();

  const similar = getSimilarBikes(bike, 3);

  const ScoreBar = ({ score, label }: { score: number; label: string }) => (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-28 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
        <div className="h-2.5 rounded-full" style={{ width: `${score * 10}%`, backgroundColor: '#5A7A48' }} />
      </div>
      <span className="text-sm font-bold w-8 text-right">{score}</span>
    </div>
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/fietsen/overzicht" className="hover:text-gray-700">Alle e-bikes</Link>
          <span className="mx-2">›</span>
          <Link href={`/fietsen/overzicht?merk=${bike.brand}`} className="hover:text-gray-700">{bike.brand}</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{bike.model}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="bg-white rounded-xl border border-gray-200 aspect-[4/3] flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4 2.4-2.8 2.8c-.5.5-.8 1.1-.8 1.8V20h2v-3.5l2.8-2.8 2.3 2.3.5 3h2l-1.3-6.5-2.8-2.8 2-3.5-1.7-1L12 8l-3 1v4h2V9.7l1.8-.7z" />
              <path d="M19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
            </svg>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{bike.brand}</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{bike.model}</h1>
            <p className="text-sm text-gray-500 mt-1">Modeljaar {bike.year}</p>

            <div className="flex items-baseline gap-4 mt-4">
              <span className="text-3xl font-bold text-gray-900">€{bike.price.toLocaleString('nl-NL')}</span>
              <span className="text-sm px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#5A7A4820', color: '#5A7A48' }}>
                {bike.scoreOverall}/10
              </span>
            </div>

            <p className="text-gray-600 mt-4 leading-relaxed">{bike.description}</p>

            <ul className="mt-6 space-y-2">
              {bike.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span style={{ color: '#5A7A48' }}>✓</span> {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 mt-6">
              {bike.suitableFor.map(use => (
                <span key={use} className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                  {usageLabels[use]}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a href={bike.affiliateUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 text-white font-bold rounded-lg text-center transition-colors" style={{ backgroundColor: '#5A7A48' }}>
                Bekijk beste prijs →
              </a>
              <a href={bike.testRideUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border-2 font-bold rounded-lg text-center transition-colors" style={{ borderColor: '#5A7A48', color: '#5A7A48' }}>
                Boek proefrit
              </a>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Scores</h2>
          <div className="space-y-4 max-w-lg">
            <ScoreBar score={bike.scoreOverall} label="Totaalscore" />
            <ScoreBar score={bike.scorePriceQuality} label="Prijs-kwaliteit" />
            <ScoreBar score={bike.scoreComfort} label="Comfort" />
            <ScoreBar score={bike.scoreRange} label="Bereik" />
          </div>
        </div>

        {/* Specs table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Specificaties</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Motor & Aandrijving</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Motortype</dt><dd className="font-medium">{motorLabels[bike.motorType]}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Motormerk</dt><dd className="font-medium">{bike.motorBrand}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Koppel</dt><dd className="font-medium">{bike.torque} Nm</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Ondersteuningsniveaus</dt><dd className="font-medium">{bike.supportLevels}</dd></div>
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Accu</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Capaciteit</dt><dd className="font-medium">{bike.batteryCapacity} Wh</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Bereik (fabrikant)</dt><dd className="font-medium">{bike.rangeManufacturer} km</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Bereik (praktijk)</dt><dd className="font-medium">~{bike.rangePractical} km</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Laadtijd</dt><dd className="font-medium">{bike.chargeTime} uur</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Afneembaar</dt><dd className="font-medium">{bike.batteryRemovable ? 'Ja' : 'Nee'}</dd></div>
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Frame & Comfort</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Frametype</dt><dd className="font-medium">{frameLabels[bike.frameType]}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Materiaal</dt><dd className="font-medium">{bike.frameMaterial}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Wielmaat</dt><dd className="font-medium">{bike.wheelSize} inch</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Gewicht</dt><dd className="font-medium">{bike.weight} kg</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Max. belasting</dt><dd className="font-medium">{bike.maxWeight} kg</dd></div>
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Versnellingen</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Type</dt><dd className="font-medium">{gearLabels[bike.gearType]}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Aantal</dt><dd className="font-medium">{bike.gearCount}</dd></div>
                <div className="flex justify-between text-sm"><dt className="text-gray-600">Merk</dt><dd className="font-medium">{bike.gearBrand}</dd></div>
              </dl>
            </div>
          </div>
        </div>

        {/* Compare CTA */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Wil je deze fiets vergelijken?</h2>
          <p className="text-sm text-gray-600 mb-4">Vergelijk de {bike.model} met andere e-bikes</p>
          <Link href={`/fietsen/vergelijk?bikes=${bike.slug}`} className="inline-flex px-6 py-2 text-white font-bold rounded-lg" style={{ backgroundColor: '#5A7A48' }}>
            Open vergelijking
          </Link>
        </div>

        {/* Similar bikes */}
        {similar.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vergelijkbare e-bikes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similar.map(b => <BikeCard key={b.id} bike={b} compact />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
