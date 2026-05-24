import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BikeCard from '@/components/BikeCard';
import { ShortlistProvider } from '@/lib/shortlist-context';
import { getAllBikes } from '@/lib/ebike-data';
import { EBike } from '@/lib/types';

interface CategoryDef {
  slug: string;
  title: string;
  h1: string;
  intro: string;
  metaDescription: string;
  filter: (b: EBike) => boolean;
  faqs: { q: string; a: string }[];
}

const YEAR = 2026;

const CATEGORIES: CategoryDef[] = [
  {
    slug: 'ebikes-under-1000',
    title: `Best E-Bikes Under $1,000 (${YEAR})`,
    h1: `Best E-Bikes Under $1,000 in ${YEAR}`,
    metaDescription: `The best electric bikes under $1,000 in ${YEAR}, ranked by value, range and build quality. Honest, data-driven picks.`,
    intro:
      'You don’t need to spend a fortune to get a capable electric bike. These are the best e-bikes under $1,000 right now, ranked by our value, range and build-quality scores. Every pick is judged on real-world range rather than optimistic manufacturer claims.',
    filter: (b) => b.price <= 1000,
    faqs: [
      { q: 'Are e-bikes under $1,000 any good?', a: 'Yes, several budget brands now offer solid 500W+ motors, removable batteries and real-world ranges of 25–40 miles. The trade-offs are usually weight, basic components and shorter warranties.' },
      { q: 'What range can I expect from a cheap e-bike?', a: 'Most sub-$1,000 e-bikes deliver 25–45 miles of realistic range on lower assist levels. We list practical range, not the inflated manufacturer figure.' },
    ],
  },
  {
    slug: 'ebikes-under-1500',
    title: `Best E-Bikes Under $1,500 (${YEAR})`,
    h1: `Best E-Bikes Under $1,500 in ${YEAR}`,
    metaDescription: `The best electric bikes under $1,500 in ${YEAR}. Our value-ranked picks with real-world range and honest scoring.`,
    intro:
      'The $1,000–$1,500 range is the sweet spot for most riders: better components, longer range and more refined ride quality without premium pricing. Here are the best e-bikes under $1,500, ranked by our scoring model.',
    filter: (b) => b.price <= 1500,
    faqs: [
      { q: 'Is $1,500 enough for a good e-bike?', a: 'Absolutely. At this price you get reliable hydraulic brakes, 45–60 mile real-world range and well-supported brands with decent warranties.' },
    ],
  },
  {
    slug: 'commuter-ebikes',
    title: `Best Commuter E-Bikes (${YEAR})`,
    h1: `Best Commuter E-Bikes in ${YEAR}`,
    metaDescription: `The best commuter electric bikes in ${YEAR}: efficient, comfortable and reliable picks for the daily ride to work.`,
    intro:
      'A great commuter e-bike is fast enough to keep up with traffic, comfortable over potholes and reliable in all weather. These picks score highest for commuting, weighing range, comfort and build quality.',
    filter: (b) => b.suitableFor.includes('commuting'),
    faqs: [
      { q: 'What class e-bike is best for commuting?', a: 'Class 3 (28 mph pedal-assist) is ideal for longer or faster commutes where it’s legal, while Class 1/2 are great for shorter, relaxed trips and shared paths.' },
    ],
  },
  {
    slug: 'folding-ebikes',
    title: `Best Folding E-Bikes (${YEAR})`,
    h1: `Best Folding E-Bikes in ${YEAR}`,
    metaDescription: `The best folding electric bikes in ${YEAR} for apartments, RVs and mixed commutes. Compact, capable picks.`,
    intro:
      'Folding e-bikes are perfect for apartments, RVs, boats and multi-modal commutes. These are the best folding models, ranked on portability, ride quality and value.',
    filter: (b) => !!b.dimensions?.foldedSize,
    faqs: [
      { q: 'Are folding e-bikes worth it?', a: 'If storage or transport is a constraint, yes. Modern folders ride surprisingly well and store in a closet or car trunk. Expect slightly heavier frames for the folding mechanism.' },
    ],
  },
  {
    slug: 'cargo-ebikes',
    title: `Best Cargo E-Bikes (${YEAR})`,
    h1: `Best Cargo E-Bikes in ${YEAR}`,
    metaDescription: `The best cargo electric bikes in ${YEAR} for hauling kids and groceries. Stable, powerful, family-ready picks.`,
    intro:
      'Cargo e-bikes replace a second car for many families. These models score highest for hauling, weighing payload, torque, stability and braking.',
    filter: (b) => b.suitableFor.includes('cargo'),
    faqs: [
      { q: 'How much can a cargo e-bike carry?', a: 'Most cargo e-bikes handle 300–450 lbs of total payload including the rider. Always check the rated max payload, which we list on every bike page.' },
    ],
  },
  {
    slug: 'class-3-ebikes',
    title: `Best Class 3 E-Bikes (28 mph) (${YEAR})`,
    h1: `Best Class 3 E-Bikes in ${YEAR}`,
    metaDescription: `The best Class 3 electric bikes in ${YEAR}. 28 mph pedal-assist speed pedelecs for fast commutes.`,
    intro:
      'Class 3 e-bikes assist up to 28 mph, making them the fastest legal option for commuters in most US states. These are the top-scoring Class 3 models.',
    filter: (b) => b.bikeClass === 'class-3',
    faqs: [
      { q: 'Where can I ride a Class 3 e-bike?', a: 'Class 3 e-bikes are road and bike-lane legal in most US states but are often restricted from multi-use paths. Always check your local rules.' },
    ],
  },
  {
    slug: 'ebikes-for-seniors',
    title: `Best E-Bikes for Seniors (${YEAR})`,
    h1: `Best E-Bikes for Seniors in ${YEAR}`,
    metaDescription: `The best electric bikes for seniors in ${YEAR}: easy step-through frames, stable handling and confidence-inspiring brakes.`,
    intro:
      'The best e-bikes for older riders combine a low step-through frame, upright comfortable geometry, smooth power delivery and strong brakes. These picks score highest on comfort and ease of use.',
    filter: (b) => b.frameType === 'step-through' && b.suitableFor.includes('recreation'),
    faqs: [
      { q: 'What type of e-bike is best for seniors?', a: 'A step-through frame with a low standover height, a comfortable upright riding position and a throttle (Class 2) for extra confidence on hills and from a stop.' },
    ],
  },
];

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const def = CATEGORIES.find((c) => c.slug === category);
  if (!def) return { title: 'Category not found' };
  return {
    title: def.title,
    description: def.metaDescription,
    alternates: { canonical: `/best/${def.slug}` },
    openGraph: { title: def.title, description: def.metaDescription, type: 'website' },
  };
}

export default async function BestCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const def = CATEGORIES.find((c) => c.slug === category);
  if (!def) notFound();

  const allBikes = await getAllBikes();
  const bikes = allBikes
    .filter(def.filter)
    .sort((a, b) => b.scoreOverall - a.scoreOverall)
    .slice(0, 12);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: def.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: bikes.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${b.brand} ${b.model}`,
    })),
  };

  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <Link href="/e-bikes" className="hover:text-[var(--foreground)]">E-Bikes</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)]">Best of</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">{def.h1}</h1>
        <p className="text-[var(--muted)] text-lg mt-3 max-w-3xl leading-relaxed">{def.intro}</p>

        <div className="mt-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-sm text-[var(--muted)] max-w-3xl">
          <strong className="text-[var(--foreground)]">How we rank:</strong> every bike is scored on value,
          real-world range, power, comfort, build quality and versatility. We earn an affiliate commission if
          you buy through our links, but it never changes the ranking.
        </div>

        {bikes.length > 0 ? (
          <ShortlistProvider>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
              {bikes.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          </ShortlistProvider>
        ) : (
          <p className="text-[var(--muted)] mt-10">No bikes in this category yet. Check back soon.</p>
        )}

        {/* FAQ */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {def.faqs.map((f) => (
              <div key={f.q} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
                <h3 className="font-bold text-[var(--foreground)]">{f.q}</h3>
                <p className="text-[var(--muted)] mt-2 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz CTA */}
        <div className="mt-16 text-center rounded-2xl p-10" style={{ backgroundColor: 'var(--bordeaux)' }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--on-bordeaux)' }}>Not sure which one is right for you?</h2>
          <p className="mb-6" style={{ color: 'var(--muted-on-bordeaux)' }}>Take the 60-second quiz for a personalized top 3.</p>
          <Link href="/" className="inline-flex px-7 py-3 font-bold rounded-lg" style={{ backgroundColor: 'var(--gold)', color: 'var(--cta-ink)' }}>
            Find My E-Bike →
          </Link>
        </div>
      </div>
    </div>
  );
}
