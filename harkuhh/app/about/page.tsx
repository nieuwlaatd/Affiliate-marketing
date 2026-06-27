import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/editorial';

export const metadata: Metadata = {
  title: 'About Best Bike For Me',
  description:
    'Who we are and why we built Best Bike For Me: independent, data-driven electric bike rankings and comparison tools for US riders.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Best Bike For Me',
    description:
      'Independent, data-driven electric bike rankings and comparison tools for US riders.',
    type: 'website',
  },
};

export default function AboutPage() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    email: SITE.contactEmail,
    foundingDate: String(SITE.foundedYear),
    description:
      'Independent, data-driven electric bike rankings and comparison tools for US riders.',
  };

  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <Link href="/" className="hover:text-[var(--foreground)]">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)]">About</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-3">
          About {SITE.name}
        </h1>
        <p className="text-lg text-[var(--muted)] leading-relaxed mb-10 max-w-2xl">
          We help US riders find the right electric bike without the marketing
          noise: independent rankings, real-world numbers and tools that compare
          bikes on what actually matters.
        </p>

        <div className="prose-bbfm">
          <h2>Why we built this</h2>
          <p>
            Buying an e-bike is confusing on purpose. Every brand claims the
            longest range, the most power and the best value, and the spec sheets
            are written to flatter, not to inform. We built {SITE.name} to cut
            through that. We score every bike the same way, show the range you will
            realistically get rather than the lab number, and put the comparison
            tools front and center so you can decide for yourself.
          </p>

          <h2>What makes us different</h2>
          <ul>
            <li>
              <strong>One consistent scoring method.</strong> Every bike is rated
              on the same six axes, so a score means the same thing across brands.
              See exactly how on our{' '}
              <Link href="/how-we-test">how we test</Link> page.
            </li>
            <li>
              <strong>Real-world range, not lab numbers.</strong> We show the range
              a typical rider can expect on moderate assist, not the optimistic
              headline figure.
            </li>
            <li>
              <strong>Independence first.</strong> We are reader-supported through
              affiliate links, but commissions never change a ranking. Several
              bikes we recommend earn us nothing.
            </li>
            <li>
              <strong>Tools, not just lists.</strong> Filter the full catalog,
              compare bikes side by side, or take a 60-second quiz for a
              personalized top three.
            </li>
          </ul>

          <h2>How we make money</h2>
          <p>
            When you buy through a link on our site, we may earn a commission at no
            extra cost to you. That keeps {SITE.name} free and free of intrusive
            ads. It has no influence on our scores or rankings. Full details are in
            our <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
          </p>

          <h2>An independent, AI-run project</h2>
          <p>
            {SITE.name} is an independent project that is built and maintained
            entirely by artificial intelligence. An AI system researches each
            electric bike, scores it using the same fixed methodology, writes the
            content and refreshes the rankings on a regular schedule. We are
            transparent about this because it is exactly what makes the site
            useful.
          </p>
          <p>
            Being AI-run is a feature, not a disclaimer. Every bike is judged by
            the identical method, so a score means the same thing across brands;
            there is no favorite brand, no advertiser pressure and no reviewer
            bias; and the catalog and prices are kept current far more often than a
            small human team could manage. The method itself is documented on our{' '}
            <Link href="/how-we-test">how we test</Link> page so you can see
            exactly how a ranking is reached.
          </p>
          <p>
            AI is not infallible, so accuracy is something we take seriously.
            Corrections are always welcome, and you can reach us using the contact
            details below.
          </p>

          <h2>Get in touch</h2>
          <p>
            Questions, corrections or a bike we should add? Email{' '}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. We read
            everything and fix errors quickly.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl p-8 text-center border" style={{ backgroundColor: 'var(--accent-soft, var(--surface))', borderColor: 'var(--accent)' }}>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Find your e-bike</h2>
          <p className="text-sm text-[var(--muted)] mb-4">Get a personalized top 3 in 60 seconds, or browse every bike we have scored.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/e-bikes/quiz" className="cta-primary inline-flex px-6 py-2.5 font-bold rounded-lg" style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}>
              Take the quiz →
            </Link>
            <Link href="/e-bikes/overzicht" className="inline-flex px-6 py-2.5 font-bold rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)]">
              Browse all e-bikes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
