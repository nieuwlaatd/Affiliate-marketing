import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog-data';

export const metadata: Metadata = {
  title: 'E-Bike Blog | Guides, Tips & Buying Advice',
  description:
    'Expert guides, buying advice and maintenance tips to help you choose and enjoy the right electric bike. Updated weekly.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'E-Bike Blog | Guides, Tips & Buying Advice',
    description:
      'Expert guides, buying advice and maintenance tips for electric bikes.',
    type: 'website',
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Guides: 'var(--accent)',
  'Buying Advice': 'var(--gold, var(--accent))',
  Tips: 'var(--accent)',
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Best Bike For Me Blog',
    description: 'Expert guides, buying advice and maintenance tips for electric bikes.',
    url: 'https://www.bestbikeforme.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Best Bike For Me',
      url: 'https://www.bestbikeforme.com',
    },
  };

  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* Hero */}
      <section
        className="border-b border-[var(--border)] py-16"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em] mb-3"
            style={{ color: 'var(--accent)' }}
          >
            The Blog
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
            Guides, Tips & Buying Advice
          </h1>
          <p className="mt-3 text-lg text-[var(--muted)] max-w-2xl mx-auto">
            Everything you need to know about choosing, riding and maintaining an electric bike.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden transition-shadow hover:shadow-lg"
            >
              {/* Color strip */}
              <div
                className="h-1.5 w-full"
                style={{
                  backgroundColor: CATEGORY_COLORS[post.category] ?? 'var(--accent)',
                }}
              />

              <div className="flex-1 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--accent-soft, var(--surface))',
                      color: CATEGORY_COLORS[post.category] ?? 'var(--accent)',
                    }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {post.readingTime} min read
                  </span>
                </div>

                <h2 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </div>

              <div className="px-5 pb-4 pt-0">
                <time className="text-xs text-[var(--muted)]" dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>
            </Link>
          ))}
        </div>

        {/* Quiz CTA */}
        <div
          className="mt-16 text-center rounded-2xl p-10"
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
            style={{ backgroundColor: 'var(--gold, var(--cta))', color: 'var(--cta-ink)' }}
          >
            Find My E-Bike →
          </Link>
        </div>
      </section>
    </div>
  );
}
