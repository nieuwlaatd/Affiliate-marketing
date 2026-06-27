import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE, SCORING_AXES } from '@/lib/editorial';

export const metadata: Metadata = {
  title: 'How We Test and Score E-Bikes',
  description:
    'Our independent, data-driven methodology for ranking electric bikes: six scoring axes, real-world range, and why affiliate commissions never change a ranking.',
  alternates: { canonical: '/how-we-test' },
  openGraph: {
    title: 'How We Test and Score E-Bikes',
    description:
      'The independent, data-driven methodology behind every Best Bike For Me ranking.',
    type: 'website',
  },
};

export default function HowWeTestPage() {
  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <Link href="/" className="hover:text-[var(--foreground)]">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)]">How we test</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-3">
          How we test and score e-bikes
        </h1>
        <p className="text-lg text-[var(--muted)] leading-relaxed mb-10 max-w-2xl">
          Every score and ranking on {SITE.name} comes from the same transparent
          method. Here is exactly how we evaluate each electric bike, where our
          data comes from, and why our rankings are independent of the
          commissions we earn.
        </p>

        <div className="prose-bbfm">
          <h2>The six-axis score</h2>
          <p>
            We rate every bike on six axes, each on a 0 to 10 scale. The overall
            score you see on a bike card is a weighted average of these six, with
            range and power weighted slightly higher because they are the numbers
            riders most often regret getting wrong.
          </p>
        </div>

        {/* Scoring axes */}
        <div className="mt-6 space-y-4">
          {SCORING_AXES.map((axis) => (
            <div
              key={axis.key}
              className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]"
            >
              <h3 className="font-bold text-[var(--foreground)]">{axis.label}</h3>
              <p className="text-[var(--muted)] mt-2 leading-relaxed">{axis.what}</p>
            </div>
          ))}
        </div>

        <div className="prose-bbfm mt-12">
          <h2>We use real-world range, not lab numbers</h2>
          <p>
            Manufacturer range claims are measured in ideal conditions: a light
            rider, flat ground, the lowest assist level and a fresh battery. Almost
            nobody rides that way. Wherever we show range, we estimate the
            practical range you can expect on moderate assist with real terrain and
            a typical rider, which is usually 60 to 70 percent of the headline
            figure. It is the number we would want before spending our own money.
          </p>

          <h2>Where our data comes from</h2>
          <p>
            Our scores are built from published manufacturer specifications,
            component-level details (motor, battery, brakes, drivetrain), warranty
            terms, and patterns we see across owner reviews and reported real-world
            performance. We normalize all measurements to US units and cross-check
            specs against multiple sources before a bike is published. When a spec
            is genuinely unknown, we leave it blank rather than guess.
          </p>

          <h2>Independence: commissions never move a ranking</h2>
          <p>
            {SITE.name} is reader-supported. When you buy through a link on our
            site we may earn an affiliate commission at no extra cost to you. That
            is how we keep the site free. It does not buy a better score or a
            higher position. We rank bikes the same way whether or not a brand has
            an affiliate program, and several bikes we rate highly earn us nothing.
            You can read the full details in our{' '}
            <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
          </p>

          <h2>We keep scores current</h2>
          <p>
            Prices, models and specs change constantly. We revisit rankings as new
            models launch, as prices shift and as we gather more real-world data,
            and we show a last-updated date on pages we maintain on a schedule. If
            you spot something out of date or incorrect, tell us and we will fix
            it.
          </p>

          <h2>Found an error?</h2>
          <p>
            Accuracy matters more to us than being first. If a spec, price or score
            looks wrong, email{' '}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> and we
            will review it. Corrections are made promptly and transparently.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl p-8 text-center border" style={{ backgroundColor: 'var(--accent-soft, var(--surface))', borderColor: 'var(--accent)' }}>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">See the method in action</h2>
          <p className="text-sm text-[var(--muted)] mb-4">Browse our independently scored rankings, or get a personalized top 3 in 60 seconds.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/e-bikes/overzicht" className="cta-primary inline-flex px-6 py-2.5 font-bold rounded-lg" style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}>
              Browse all e-bikes →
            </Link>
            <Link href="/e-bikes/quiz" className="inline-flex px-6 py-2.5 font-bold rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)]">
              Take the quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
