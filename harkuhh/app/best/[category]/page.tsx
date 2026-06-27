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
  /** Optional buyer's-guide body, rendered between the bike grid and the FAQ. */
  sections?: { h2: string; body: string[] }[];
  /** ISO date of the last meaningful content update (freshness signal). */
  lastUpdated?: string;
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
    title: `Best Cargo E-Bikes (${YEAR}): Top Picks for Hauling Kids & Gear`,
    h1: `Best Cargo E-Bikes in ${YEAR}`,
    metaDescription: `The best cargo e-bikes of ${YEAR} for hauling kids, groceries and gear. Ranked by payload, torque, stability and value, with real-world range and honest scoring.`,
    intro:
      'A good cargo e-bike can replace a second car for school runs, grocery hauls and weekend errands. We ranked the best cargo and utility electric bikes for ' +
      YEAR +
      ' on the four things that actually matter when you load one up: rated payload, motor torque on hills, frame stability and braking. Every pick is scored on real-world range, not the optimistic manufacturer number.',
    // A practical cargo bike is defined by what it can haul, not just a label.
    // Include anything tagged cargo, plus high-payload, high-torque utility bikes.
    filter: (b) =>
      b.suitableFor.includes('cargo') ||
      ((b.maxWeight ?? 0) >= 350 && (b.torque ?? 0) >= 80),
    lastUpdated: '2026-06-27',
    sections: [
      {
        h2: 'What makes a good cargo e-bike',
        body: [
          'Cargo e-bikes are built to carry weight, so the spec sheet matters more here than on any other type of e-bike. The single most important number is rated payload: the total the bike can safely carry including you, your passengers and the cargo. We only list bikes with a published payload rating, and we show it on every bike page so you can match it to your real load.',
          'Torque is the second number to watch. Pulling 80 to 150 pounds of kids and groceries up a hill needs muscle, and torque (measured in newton-metres) is what delivers it from a standstill. Look for at least 80 Nm if you have any hills on your route, and 100 Nm or more if you ride loaded in hilly terrain every day.',
          'Finally, stability and stopping power. A long wheelbase, fat tires and a low center of gravity keep a loaded bike planted, while hydraulic disc brakes give you the confidence to stop a heavy bike in the wet. Every bike below clears that bar.',
        ],
      },
      {
        h2: 'Longtail vs front-loader vs utility frames',
        body: [
          'Longtail cargo bikes stretch the rear rack so you can fit two child seats or a big cargo bag behind the rider. They handle much like a normal bike, which makes them the easiest type for new cargo riders, and they are the most popular family choice.',
          'Front-loaders (also called bakfiets or box bikes) put a cargo box between the rider and the front wheel. They carry the most volume and keep kids in view, but they are heavier, pricier and take practice to steer. ',
          'Utility and fat-tire bikes with a high payload rating are the value option. They do not have a dedicated cargo box, but with a sturdy rear rack and panniers they handle grocery runs and commutes with a passenger comfortably, at roughly half the price of a dedicated longtail.',
        ],
      },
      {
        h2: 'How much does a cargo e-bike cost?',
        body: [
          'Dedicated family longtails from established brands typically run $1,800 to $5,000. Front-loaders sit at the top of that range and beyond. The good news for ' +
            YEAR +
            ' is that capable high-payload utility e-bikes now start under $1,500, so you no longer need a five-figure budget to ditch the car for the school run.',
          'When you compare prices, factor in accessories. Child seats, running boards, a second battery and panniers can add $300 to $800, so a cheaper bike that bundles a rack and fenders can be the better overall deal.',
        ],
      },
    ],
    faqs: [
      { q: 'How much can a cargo e-bike carry?', a: 'Most cargo and high-payload utility e-bikes handle 330 to 450 lbs of total payload including the rider. Dedicated longtails are at the top of that range. Always check the rated max payload, which we list on every bike page.' },
      { q: 'What is the best cargo e-bike in ' + YEAR + '?', a: 'Our current top pick balances a high payload rating, strong hill torque and a stable, well-braked frame at a fair price. The ranked list above updates as we test new models, so the bike at the top is our best overall cargo pick right now.' },
      { q: 'Can a cargo e-bike carry two kids?', a: 'Yes. Most longtail cargo bikes are rated for two child seats on the rear deck, and many utility bikes with a 400 lb payload can do the same with the right rack and seats. Check the payload rating against your kids’ combined weight plus your own.' },
      { q: 'Are cargo e-bikes worth it?', a: 'For families who do regular short trips, a cargo e-bike often replaces a second car and pays for itself in fuel, parking and maintenance within a couple of years. If you mostly ride solo for fitness, a lighter commuter or recreation e-bike is a better fit.' },
      { q: 'What is the difference between a cargo bike and a cargo e-bike?', a: 'A cargo e-bike adds a motor and battery to the cargo frame, which is what makes hauling heavy loads and climbing hills practical. An unpowered cargo bike is far harder to ride loaded, especially uphill or into wind.' },
      { q: 'How much range does a loaded cargo e-bike get?', a: 'Carrying cargo and climbing hills drains the battery faster, so expect 20 to 40 miles of real-world range when loaded, depending on assist level and terrain. We list practical range, not the inflated manufacturer figure, and a second battery roughly doubles it.' },
      { q: 'Do I need a license to ride a cargo e-bike?', a: 'In most US states, Class 1, 2 and 3 e-bikes do not require a license, registration or insurance. Local rules vary, so check your state and city regulations, especially for Class 3 bikes on shared paths.' },
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
        {def.lastUpdated && (
          <p className="text-xs text-[var(--muted)] mt-2">
            Last updated{' '}
            {new Date(def.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}
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

        {/* Buyer's guide */}
        {def.sections && def.sections.length > 0 && (
          <div className="mt-16 max-w-3xl">
            {def.sections.map((s) => (
              <section key={s.h2} className="mb-10">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">{s.h2}</h2>
                <div className="space-y-4">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-[var(--muted)] leading-relaxed">{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
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
          <Link href="/e-bikes/quiz" className="cta-primary inline-flex px-7 py-3 font-bold rounded-lg" style={{ backgroundColor: 'var(--gold)', color: 'var(--cta-ink)' }}>
            Find My E-Bike →
          </Link>
        </div>
      </div>
    </div>
  );
}
