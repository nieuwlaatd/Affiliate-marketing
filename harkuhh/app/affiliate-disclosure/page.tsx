import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'How Best Bike For Me earns revenue through affiliate partnerships, and why it never affects our rankings.',
  alternates: { canonical: '/affiliate-disclosure' },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Affiliate Disclosure</h1>
        <p className="text-sm text-[var(--muted)] mb-10">Last updated: May 29, 2026</p>

        <div className="prose-bbfm">
          <p>
            Transparency matters to us. This page explains how Best Bike For Me earns money and how that does (and does not) affect the content you see on this site.
          </p>

          <h2>How we earn revenue</h2>
          <p>
            Best Bike For Me is a reader-supported website. When you click a link on our site that takes you to a retailer or brand's website and you make a purchase, we may earn a commission through affiliate partnerships. This happens at no extra cost to you. The price you pay is the same whether you use our link or go directly to the retailer.
          </p>
          <p>
            We participate in affiliate programs with multiple e-bike brands and networks, including but not limited to ShareASale, AvantLink, and direct brand partnerships. Each program has its own commission structure.
          </p>

          <h2>What links are affiliate links?</h2>
          <p>
            On our product pages, you will see buttons like "Check best price" and "Visit official site." These are affiliate links. They take you to the brand's website with a tracking parameter that tells the brand you came from Best Bike For Me.
          </p>
          <p>
            When you click an affiliate link, the brand or affiliate network may place a cookie on your browser. If you make a purchase within a certain time window (typically 30 to 90 days, depending on the program), we receive a commission.
          </p>

          <h2>How affiliate partnerships affect our content</h2>
          <p>
            <strong>They don't affect our rankings.</strong> Every e-bike on our site is scored using the same data-driven methodology. We evaluate range, motor performance, build quality, comfort, versatility, and value for money. A bike's position in our rankings is determined by these scores alone.
          </p>
          <p>
            We cover bikes from brands regardless of whether we have an affiliate relationship with them. If a brand does not offer an affiliate program, we still list their bikes and link to their website. We just don't earn anything when you click.
          </p>
          <p>
            We will never:
          </p>
          <ul>
            <li>Rank a bike higher because it pays a higher commission</li>
            <li>Exclude a bike because a competitor pays us more</li>
            <li>Write fake positive reviews to earn affiliate revenue</li>
            <li>Hide the fact that a link is an affiliate link</li>
          </ul>

          <h2>Why we use affiliate links</h2>
          <p>
            Running this website costs money: hosting, data, development, and the time it takes to research and compare 88+ electric bikes. Affiliate commissions allow us to keep the site free and ad-free for you. We do not display banner ads, pop-ups, or sponsored content placements.
          </p>

          <h2>FTC compliance</h2>
          <p>
            In accordance with the Federal Trade Commission's guidelines on endorsements and testimonials (16 CFR Part 255), we disclose our affiliate relationships. This disclosure appears:
          </p>
          <ul>
            <li>On this page (which you are reading now)</li>
            <li>In the footer of every page on the site</li>
            <li>On category and ranking pages where affiliate links are present</li>
          </ul>

          <h2>Your choices</h2>
          <p>
            You are never required to click an affiliate link. If you prefer not to use our affiliate links, you can navigate directly to the brand's website by typing their URL into your browser. We will still provide the same information and recommendations regardless.
          </p>
          <p>
            If you use an ad blocker or have disabled third-party cookies, affiliate tracking may not work. This does not affect your browsing experience on our site.
          </p>

          <h2>Questions?</h2>
          <p>
            If you have questions about our affiliate relationships or how we make money, contact us at:
          </p>
          <p>
            <strong>Email:</strong> disclosure@bestbikeforme.com
          </p>
          <p>
            You can also read our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link> for related information.
          </p>
        </div>
      </div>
    </div>
  );
}
