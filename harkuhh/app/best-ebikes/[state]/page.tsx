import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BikeCard from '@/components/BikeCard';
import { ShortlistProvider } from '@/lib/shortlist-context';
import { getAllBikes } from '@/lib/ebike-data';
import { getAllStateSlugs, getStateBySlug } from '@/lib/state-data';
import { STORES } from '@/lib/store-data';

export function generateStaticParams() {
  return getAllStateSlugs().map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return { title: 'State not found' };
  const title = `Best E-Bikes in ${state.name} (2026) | Laws, Top Picks & Dealers`;
  return {
    title,
    description: state.metaDescription,
    alternates: { canonical: `/best-ebikes/${state.slug}` },
    openGraph: { title, description: state.metaDescription, type: 'website' },
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const allBikes = await getAllBikes();
  const bikes = allBikes
    .sort((a, b) => b.scoreOverall - a.scoreOverall)
    .slice(0, 9);

  const dealers = STORES.filter(
    (s) =>
      s.country === 'United States' &&
      s.state.toLowerCase().replace(/\s+/g, '-') === slug
  );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Are e-bikes legal in ${state.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: state.lawSummary,
        },
      },
      {
        '@type': 'Question',
        name: `Do I need a license to ride an e-bike in ${state.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: state.licenseRequired
            ? `Yes, ${state.name} requires a valid driver's license to ride an e-bike.`
            : `No, ${state.name} does not require a license, registration, or insurance for e-bikes.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the speed limit for e-bikes in ${state.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The maximum motor-assisted speed for e-bikes in ${state.name} is ${state.maxSpeed}.`,
        },
      },
    ],
  };

  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section
        className="border-b border-[var(--border)] py-14"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-[var(--muted)] mb-4">
            <Link href="/e-bikes/overzicht" className="hover:text-[var(--foreground)]">
              All E-Bikes
            </Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-[var(--foreground)]">{state.name}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
            Best E-Bikes in {state.name} (2026)
          </h1>
          <p className="mt-3 text-lg text-[var(--muted)] max-w-3xl leading-relaxed">
            {state.intro}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick facts */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              label: 'Class system',
              value: state.classSystem ? 'Three-class (1/2/3)' : 'Non-standard',
            },
            { label: 'License required', value: state.licenseRequired ? 'Yes' : 'No' },
            { label: 'Max speed', value: state.maxSpeed },
            { label: 'Max motor', value: state.maxWattage },
          ].map((fact) => (
            <div
              key={fact.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4"
            >
              <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
                {fact.label}
              </p>
              <p className="mt-1 text-lg font-bold text-[var(--foreground)]">{fact.value}</p>
            </div>
          ))}
        </div>

        {/* Laws section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
            E-Bike Laws in {state.name}
          </h2>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 space-y-4">
            <p className="text-[var(--muted)] leading-relaxed">{state.lawSummary}</p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold text-[var(--foreground)]">Helmet requirements</p>
                <p className="text-[var(--muted)]">{state.helmetRequired}</p>
              </div>
              <div>
                <p className="font-bold text-[var(--foreground)]">Bike paths</p>
                <p className="text-[var(--muted)]">{state.bikePaths}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Riding tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
            Riding in {state.name}: What to Know
          </h2>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
            <p className="text-sm text-[var(--muted)] mb-1">
              <strong className="text-[var(--foreground)]">Terrain:</strong> {state.terrain}
            </p>
            <ul className="mt-4 space-y-2">
              {state.ridingTips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[var(--muted)]"
                >
                  <span style={{ color: 'var(--accent)' }} className="mt-0.5 shrink-0">
                    &bull;
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Top bikes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Top-Rated E-Bikes for {state.name}
          </h2>
          <p className="text-sm text-[var(--muted)] mb-6">
            Our highest-scoring e-bikes, ranked by value, range, and build quality.
            Not sure which one fits?{' '}
            <Link
              href="/e-bikes/quiz"
              className="text-[var(--accent)] underline"
            >
              Take the quiz
            </Link>{' '}
            for a personalized match.
          </p>
          <ShortlistProvider>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bikes.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          </ShortlistProvider>
          <div className="mt-6 text-center">
            <Link
              href="/e-bikes/overzicht"
              className="text-sm font-medium text-[var(--accent)] underline"
            >
              Browse all {allBikes.length}+ e-bikes &rarr;
            </Link>
          </div>
        </section>

        {/* Dealers */}
        {dealers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
              E-Bike Dealers in {state.name}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {dealers.slice(0, 6).map((store) => (
                <div
                  key={store.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4"
                >
                  <p className="font-bold text-[var(--foreground)]">{store.name}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {store.city}, {state.abbreviation}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    Brands: {store.brands.join(', ')}
                  </p>
                  {store.website && (
                    <a
                      href={store.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-[var(--accent)] underline"
                    >
                      Visit website
                    </a>
                  )}
                </div>
              ))}
            </div>
            {dealers.length > 6 && (
              <p className="mt-4 text-center">
                <Link
                  href="/stores"
                  className="text-sm font-medium text-[var(--accent)] underline"
                >
                  View all {dealers.length} dealers in {state.name} &rarr;
                </Link>
              </p>
            )}
          </section>
        )}

        {/* Popular cities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
            Popular E-Bike Cities in {state.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {state.topCities.map((city) => (
              <span
                key={city}
                className="px-4 py-2 text-sm font-medium rounded-full border border-[var(--border)] text-[var(--foreground)] bg-[var(--card-bg)]"
              >
                {city}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
              <h3 className="font-bold text-[var(--foreground)]">
                Are e-bikes legal in {state.name}?
              </h3>
              <p className="text-[var(--muted)] mt-2 leading-relaxed">
                {state.lawSummary}
              </p>
            </div>
            <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
              <h3 className="font-bold text-[var(--foreground)]">
                Do I need a license to ride an e-bike in {state.name}?
              </h3>
              <p className="text-[var(--muted)] mt-2 leading-relaxed">
                {state.licenseRequired
                  ? `Yes, ${state.name} requires a valid driver's license to operate an e-bike.`
                  : `No. ${state.name} does not require a license, registration, or insurance for e-bikes that meet the state's power and speed limits.`}
              </p>
            </div>
            <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
              <h3 className="font-bold text-[var(--foreground)]">
                Can I ride an e-bike on bike paths in {state.name}?
              </h3>
              <p className="text-[var(--muted)] mt-2 leading-relaxed">
                {state.bikePaths}
              </p>
            </div>
          </div>
        </section>

        {/* Quiz CTA */}
        <div
          className="rounded-2xl p-10 text-center"
          style={{ backgroundColor: 'var(--bordeaux, var(--surface))' }}
        >
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--on-bordeaux, var(--foreground))' }}
          >
            Find the best e-bike for your {state.name} ride
          </h2>
          <p
            className="mb-6"
            style={{ color: 'var(--muted-on-bordeaux, var(--muted))' }}
          >
            Answer 6 quick questions and get a personalized top 3.
          </p>
          <Link
            href="/e-bikes/quiz"
            className="cta-primary inline-flex px-7 py-3 font-bold rounded-lg"
            style={{
              backgroundColor: 'var(--gold, var(--cta))',
              color: 'var(--cta-ink)',
            }}
          >
            Find My E-Bike &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
