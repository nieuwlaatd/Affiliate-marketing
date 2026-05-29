import type { Metadata } from "next";
import Link from "next/link";
import HomeFunnel from "@/components/Funnel/HomeFunnel";
import { getAllPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Best Bike For Me | Find the Right E-Bike for Your Ride",
  description:
    "Start with where you ride. Answer three quick questions and get a ranked, unbiased lineup of electric bikes matched to your terrain, riding style and budget.",
  alternates: { canonical: "/" },
};

const CATEGORIES = [
  { href: '/best/commuter-ebikes', label: 'Best Commuter E-Bikes' },
  { href: '/best/ebikes-under-1000', label: 'Best E-Bikes Under $1,000' },
  { href: '/best/ebikes-under-1500', label: 'Best E-Bikes Under $1,500' },
  { href: '/best/folding-ebikes', label: 'Best Folding E-Bikes' },
  { href: '/best/cargo-ebikes', label: 'Best Cargo E-Bikes' },
  { href: '/best/class-3-ebikes', label: 'Best Class 3 E-Bikes' },
  { href: '/best/ebikes-for-seniors', label: 'Best E-Bikes for Seniors' },
];

export default function HomePage() {
  return (
    <>
      <HomeFunnel />

      <section className="bg-[var(--background)] py-16 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8 text-center">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { step: '1', title: 'Tell us how you ride', desc: 'Answer a few quick questions about your terrain, distance and budget. No account needed.' },
              { step: '2', title: 'Get your ranked lineup', desc: 'Our algorithm scores 88+ electric bikes on range, power, comfort, value and build quality. No affiliate bias.' },
              { step: '3', title: 'Compare and decide', desc: 'Compare up to 3 e-bikes side by side on every spec that matters, then buy from the brand you trust.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--accent)', color: 'var(--on-bordeaux)' }}>
                  {item.step}
                </div>
                <h3 className="font-bold text-[var(--foreground)] mb-1">{item.title}</h3>
                <p className="text-sm text-[var(--muted)]">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">
            Popular categories
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.href}
                href={cat.href}
                className="px-4 py-2 text-sm font-medium rounded-full border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[var(--surface)] transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">
            From the blog
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {getAllPosts().slice(0, 3).map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] transition-shadow hover:shadow-md"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                  {post.category}
                </span>
                <h3 className="mt-1 font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">{post.description}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{post.readingTime} min read</p>
              </Link>
            ))}
          </div>

          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">Why trust our reviews?</h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Every e-bike on Best Bike For Me is scored using the same data-driven methodology. We evaluate range, motor performance, build quality, comfort and value for money. Our rankings are never influenced by affiliate partnerships. We compare specs from the manufacturer, cross-reference real-world rider feedback, and present the results so you can make an informed decision.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
