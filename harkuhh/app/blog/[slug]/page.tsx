import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSlugs, getPostBySlug, getRelatedPosts } from '@/lib/blog-data';
import { markdownToHtml } from '@/lib/markdown';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const contentHtml = markdownToHtml(post.content);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { '@type': 'Organization', name: 'Best Bike For Me' },
    publisher: {
      '@type': 'Organization',
      name: 'Best Bike For Me',
      url: 'https://www.bestbikeforme.com',
    },
    mainEntityOfPage: `https://www.bestbikeforme.com/blog/${post.slug}`,
  };

  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-[var(--muted)] mb-6">
          <Link href="/blog" className="hover:text-[var(--foreground)]">
            Blog
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)]">{post.category}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--accent-soft, var(--surface))',
                color: 'var(--accent)',
              }}
            >
              {post.category}
            </span>
            <span className="text-sm text-[var(--muted)]">
              {post.readingTime} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">
            {post.description}
          </p>

          <div className="mt-4 flex items-center gap-4 text-sm text-[var(--muted)]">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            {post.updatedAt && (
              <span>
                Updated{' '}
                <time dateTime={post.updatedAt}>
                  {new Date(post.updatedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </span>
            )}
          </div>
        </header>

        {/* Content */}
        <div
          className="prose-bbfm"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Quiz CTA */}
        <div
          className="mt-12 rounded-xl p-8 text-center border"
          style={{
            backgroundColor: 'var(--accent-soft, var(--surface))',
            borderColor: 'var(--accent)',
          }}
        >
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
            Ready to find your e-bike?
          </h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Take our 60-second quiz and get a personalized top 3.
          </p>
          <Link
            href="/e-bikes/quiz"
            className="cta-primary inline-flex px-6 py-2.5 font-bold rounded-lg"
            style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}
          >
            Find My E-Bike →
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
              Related articles
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] transition-shadow hover:shadow-md"
                >
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--accent)' }}
                  >
                    {r.category}
                  </span>
                  <h3 className="mt-1 font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {r.readingTime} min read
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
