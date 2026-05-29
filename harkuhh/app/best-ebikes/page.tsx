import type { Metadata } from 'next';
import Link from 'next/link';
import { STATES } from '@/lib/state-data';

export const metadata: Metadata = {
  title: 'Best E-Bikes by State | Laws, Top Picks & Local Dealers',
  description:
    'Find the best electric bikes for your state. E-bike laws, top-rated picks, terrain tips, and dealer locations for all 50 states.',
  alternates: { canonical: '/best-ebikes' },
};

export default function BestEbikesIndexPage() {
  const sorted = [...STATES].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <section
        className="border-b border-[var(--border)] py-14"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
            Best E-Bikes by State
          </h1>
          <p className="mt-3 text-lg text-[var(--muted)] max-w-2xl mx-auto">
            E-bike laws, top picks, and local dealer information for every state.
            Choose your state to see what applies to you.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((state) => (
            <Link
              key={state.slug}
              href={`/best-ebikes/${state.slug}`}
              className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 transition-shadow hover:shadow-md"
            >
              <div>
                <p className="font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {state.name}
                </p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {state.classSystem ? 'Three-class system' : 'Non-standard rules'} · Max{' '}
                  {state.maxSpeed}
                </p>
              </div>
              <span className="text-lg font-bold text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                {state.abbreviation}
              </span>
            </Link>
          ))}
        </div>

        <div
          className="mt-16 rounded-2xl p-10 text-center"
          style={{ backgroundColor: 'var(--bordeaux, var(--surface))' }}
        >
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--on-bordeaux, var(--foreground))' }}
          >
            Not sure which e-bike is right for you?
          </h2>
          <p
            className="mb-6"
            style={{ color: 'var(--muted-on-bordeaux, var(--muted))' }}
          >
            Take our 60-second quiz for a personalized top 3.
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
