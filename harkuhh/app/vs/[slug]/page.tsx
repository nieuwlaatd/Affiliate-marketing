import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBikes } from '@/lib/ebike-data';
import { EBike } from '@/lib/types';
import AffiliateLink from '@/components/AffiliateLink';

// Curated matchups (SEO). Each side is either a brand slug (we pick that brand's
// top-scoring bike) or an exact bike slug (findSide checks exact-slug match first).
// Must resolve to real catalog brands/bikes (see lib/ebike-data.ts) -- a slug that
// matches no bike or brand renders notFound(), which ships a dead 404 URL in the
// sitemap. Add more real brand-vs-brand or bike-vs-bike pairs as the catalog grows;
// once P2.1 (Aventon/Lectric/Rad Power/Ride1Up/Velotric affiliate approval) lands,
// those become real high-volume matchups worth adding here.
const MATCHUPS: [string, string][] = [
  ['engwe', 'eunorau'],
  ['duotts', 'engwe'],
  ['eunorau', 'samebike'],
  ['vtuvia', 'dyu'],
  ['walfisk', 'engwe'],
  // Bike-level matchups (2026-07-10, run 15): pairs actual bikes with GSC/PostHog
  // revenue signal rather than brand top-scorers, targeting real comparison-intent
  // searches between models buyers are already clicking on.
  ['engwe-n1-pro', 'duotts-s26'], // top affiliate-click bike vs top PostHog product page (S26 has zero matching GSC signal after 6 runs -- this gives it a fresh internal link + comparison surface)
  ['samebike-rs-a01-pro', 'samebike-rs-a01-men'], // two variants of the same model, both climbing in GSC (pos 14.7 / pos 9.1) -- a natural "which RS-A01 should I buy" query
  ['duotts-duotts-c29-k', 'eunorau-meta-24-1'], // both have a confirmed GSC click this run, mid-range price tier
  ['eunorau-meta-275-st-1', 'engwe-l20'], // both recurring PostHog signal (3 visitors, 2 consecutive pulls) with no vs-page yet, identical $1,399 price -- a natural "same price, which one" query
  ['eunorau-flash-lite-st', 'eunorau-flash-lite-2-0'], // FLASH LITE ST is this run's #1 affiliate-click bike (4 clicks, the highest single-bike click count logged yet) with no vs-page; FLASH LITE is the identical $1,899/92Nm platform differing only in frame geometry (step-through vs step-over) -- the exact "which frame should I get" query a buyer comparing this bike would search
  ['dyu-m20', 'dyu-c9'], // DYU M20 has tied for the #2 affiliate-click bike across 2 consecutive runs with no vs-page; C9 is DYU's only other bike at the identical $899 price point, but a very different build (66 lb light city bike, 93mi manufacturer range vs M20's 88 lb full-suspension fat-tire commuter) -- a real "same price, which DYU" query
  ['duotts-f20', 'duotts-duotts-f26lite-electric-bike'], // F20 logged an affiliate click this run with no vs-page; F26 Lite is its closest DUOTTS "F-series" fat-tire sibling ($1,099 vs $1,199, both full suspension) but trades range for torque (F20: 87mi manufacturer/70 Nm vs F26 Lite: 50mi manufacturer/80 Nm) -- a real "which F-series DUOTTS" query
  ['engwe-p275-se', 'engwe-p275-pro'], // P275 SE tied for the site's #1 PostHog page this run (13 views/13 visitors/13 sessions) with no vs-page; P275 Pro is its natural same-family sibling ($899 step-through rear-hub with torque sensor vs $1,099 step-over mid-drive with Gates belt drive) -- a real "which ENGWE P275 should I buy" query given both share the same product-line name
  // 2026-07-25 run 55: P4.2 (programmatic long-tail expansion) first slice -- naming-confusion
  // sibling pairs within a brand's own model family that share a name stem but have real spec
  // gaps, a genuine "which one do I buy" query for anyone comparing the brand's own lineup.
  ['samebike-m20', 'samebike-m20-iii'], // "M20 vs M20-III" -- same base name, real generational upgrade ($1,299/100Nm/87mi vs $1,599/160Nm/174mi manufacturer range, nearly double)
  ['engwe-l20', 'engwe-l20-boost'], // "L20 vs L20 Boost" -- ENGWE's L20 line has 4 similarly-named SKUs (L20, L20 Boost, L20 3.0 Boost, L20 3.0 Pro); L20 Boost is actually $250 cheaper than base L20 while carrying more torque (75 vs 50 Nm), a genuinely counterintuitive naming trap worth a direct comparison
  ['samebike-rs-a02-pro', 'samebike-rs-a02-plus'], // "RS-A02 Pro vs Plus" -- same chassis, Plus is a clear torque/range upgrade ($959/80Nm/68mi vs $1,399/100Nm/81mi)
  ['duotts-f26', 'duotts-n26'], // "F26 vs N26" -- same 130 Nm dual-motor platform, same $1,299-1,349 price band, but N26 is actually *cheaper* ($1,299 vs $1,349) while adding full front+rear suspension where F26 is front-only -- a genuine "why would I pay more for less suspension" trap worth surfacing directly
  ['engwe-l20-3-0-boost', 'engwe-l20-3-0-pro'], // "L20 3.0 Boost vs L20 3.0 Pro" -- the other half of ENGWE's confusing L20 family (after L20 vs L20 Boost); Pro is a real $300 upgrade (100 Nm/75mi practical range vs Boost's 75 Nm/63mi) for anyone deciding between the two "3.0" tiers
  ['vtuvia-sx20', 'vtuvia-sn100'], // "SX20 vs SN100" -- identical price ($1,599), torque (85 Nm), battery and range, but SX20 is a 20in step-through with a 330 lb payload while SN100 is a 26in step-over rated to 400 lb -- same platform, different frame geometry and payload, a real "which frame fits me" query
  // 2026-07-26 run 57: CREST vs STORM resolved (was skipped twice, runs 55-56, as a
  // byte-identical-spec duplicate-row question). SAMEBIKE's own official "Storm vs Crest"
  // comparison page (samebike.com/blogs/ebikes/storm-vs-crest-fat-tire-electric-mountain-bike)
  // confirms these are two genuinely different frame builds on the same 85Nm/48V 20Ah
  // platform -- Storm keeps a traditional high top-tube step-over frame, Crest drops the
  // top tube for a low-step step-through design. Fixed `frame_type` in the DB to match
  // (both were 'sport', a non-differentiating placeholder) before adding this pairing.
  ['samebike-crest-fat-tire-mountain-e-bike', 'samebike-storm-fat-tire-mountain-e-bike'], // "Crest vs Storm" -- identical motor/battery/range/price, the only real difference is frame geometry (step-through vs step-over) -- a genuine "which frame fits me" query, same pattern as the SX20/SN100 pairing
  // 2026-07-26 run 59: P4.2 naming-confusion slice 3 -- GSC/PostHog flat for a 16th
  // consecutive run with no new signal bikes, so continued mining the catalog for
  // remaining within-brand naming-confusion pairs with a real spec story.
  ['duotts-c29', 'duotts-duotts-c29max-electric-bike'], // "C29 vs C29Max" -- same 799/1149 platform, C29Max adds a torque sensor and 10 more Nm but loses 2mi of practical range and costs $350 more, a real "is the torque sensor worth it" query within DUOTTS' own C29 family (C29 Lite and C29-K already covered by other angles)
  ['vtuvia-zeal-lt7', 'vtuvia-zeal-xt8'], // "Zeal LT7 vs Zeal XT8" -- same step-through rear-hub platform, XT8 is a genuine $500 upgrade (85 Nm/52mi practical/350 lb payload vs LT7's 65 Nm/45mi/350 lb) -- a real "which Zeal" query given both share the product-line name
  ['samebike-lo26-plus', 'samebike-lo26-ii-yd'], // "LO26 Plus vs LO26-II-YD" -- both full-suspension step-over 75 Nm fat-tire bikes sharing the LO26 name stem, but LO26-II-YD is $100 cheaper with a smaller payload rating (264 vs 330 lb) and shorter range (40mi vs 44mi practical) -- a genuine "which LO26" query
  // 2026-07-29 run 60: P4.2 naming-confusion slice 4 -- GSC/PostHog flat for a 17th
  // consecutive run with no new signal bikes, so continued mining remaining within-brand
  // pairs flagged as candidates in run 59's log.
  ['engwe-p275-se', 'engwe-p275-st'], // "P275 SE vs P275 ST" -- both step-through frames (unlike the already-shipped SE vs Pro, which pairs step-through against step-over), but a genuinely different motor architecture: SE is rear-hub/55Nm/$899/46mi practical range, ST is mid-drive/70Nm/$1,199/121mi practical range -- a real "which step-through P275" query for a buyer who already knows they want the low-step frame
  ['samebike-rs-a01-pro', 'samebike-rs-a01-plus'], // "RS-A01 Pro vs Plus" -- the third RS-A01 variant (already have Pro vs Men); both step-through, but Plus is a genuine $240 power upgrade (70 Nm/48V 14Ah vs Pro's 55 Nm/36V 15Ah) that trades some range (40mi vs 44mi practical) for torque -- a real "is the Plus worth $240 more" query
  ['dyu-c5-27-5-inch-city-electric-bike', 'dyu-c6-26-inch-city-electric-bike'], // "C5 vs C6" -- DYU's closest same-price pair ($799 vs $819), both rear-hub/front-suspension city bikes, differing mainly in frame geometry (C5 step-over 27.5in wheels vs C6 step-through 26in wheels) and battery (10Ah vs 12Ah) -- a real "which frame" query, same pattern as the SX20/SN100 and CREST/STORM pairings
];

function brandSlug(b: EBike): string {
  return b.brand.toLowerCase().replace(/\s+/g, '-');
}

function findSide(bikes: EBike[], slugPart: string): EBike | undefined {
  // exact bike slug match first
  const byBike = bikes.find((b) => b.slug === slugPart);
  if (byBike) return byBike;
  // otherwise top-scoring bike for that brand slug
  return bikes
    .filter((b) => brandSlug(b) === slugPart)
    .sort((a, b) => b.scoreOverall - a.scoreOverall)[0];
}

export function generateStaticParams() {
  return MATCHUPS.map(([a, b]) => ({ slug: `${a}-vs-${b}` }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return { title: 'Comparison not found' };
  const allBikes = await getAllBikes();
  const a = findSide(allBikes, parts[0]);
  const b = findSide(allBikes, parts[1]);
  if (!a || !b) return { title: 'Comparison not found' };
  const title = `${a.brand} ${a.model} vs ${b.brand} ${b.model}: Which Should You Buy?`;
  const description = `${a.brand} vs ${b.brand}: side-by-side specs, scores and price. We pick a winner in each category to help you decide.`;
  return {
    title,
    description,
    alternates: { canonical: `/vs/${slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

const Row = ({ label, a, b, winner }: { label: string; a: string; b: string; winner?: 0 | 1 | null }) => (
  <div className="grid grid-cols-[120px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] gap-3 py-3 border-b border-[var(--border)]">
    <div className="text-sm text-[var(--muted)]">{label}</div>
    <div className={`text-sm font-medium ${winner === 0 ? 'text-[var(--accent)] font-bold' : 'text-[var(--foreground)]'}`}>{a}</div>
    <div className={`text-sm font-medium ${winner === 1 ? 'text-[var(--accent)] font-bold' : 'text-[var(--foreground)]'}`}>{b}</div>
  </div>
);

export default async function VsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parts = slug.split('-vs-');
  if (parts.length !== 2) notFound();

  const allBikes = await getAllBikes();
  const a = findSide(allBikes, parts[0]);
  const b = findSide(allBikes, parts[1]);
  if (!a || !b) notFound();

  const cmp = (x: number, y: number, higher = true): 0 | 1 | null =>
    x === y ? null : higher ? (x > y ? 0 : 1) : x < y ? 0 : 1;

  const scoreWinner = a.scoreOverall === b.scoreOverall ? null : a.scoreOverall > b.scoreOverall ? a : b;

  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <Link href="/e-bikes" className="hover:text-[var(--foreground)]">E-Bikes</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)]">Comparison</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          {a.brand} {a.model} vs {b.brand} {b.model}
        </h1>
        <p className="text-[var(--muted)] text-lg mt-3 max-w-3xl leading-relaxed">
          A data-driven, side-by-side comparison. We score every e-bike on value, range, power,
          comfort and build quality so you can decide with confidence.
        </p>

        {/* Headers */}
        <div className="grid grid-cols-[120px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] gap-3 mt-10 mb-2">
          <div />
          {[a, b].map((bike) => (
            <div key={bike.slug} className="text-center">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-[var(--surface)] mb-3">
                {bike.images?.[0] ? (
                  <Image src={bike.images[0]} alt={`${bike.brand} ${bike.model}`} fill className="object-cover" sizes="(max-width:640px) 50vw, 300px" />
                ) : (
                  <div className="flex items-center justify-center h-full text-3xl opacity-30">🚲</div>
                )}
              </div>
              <p className="text-xs text-[var(--muted)] uppercase tracking-wide">{bike.brand}</p>
              <h2 className="font-bold text-[var(--foreground)]">{bike.model}</h2>
            </div>
          ))}
        </div>

        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
          <Row label="Price" a={`$${a.price.toLocaleString('en-US')}`} b={`$${b.price.toLocaleString('en-US')}`} winner={cmp(a.price, b.price, false)} />
          <Row label="Overall score" a={`${a.scoreOverall}`} b={`${b.scoreOverall}`} winner={cmp(a.scoreOverall, b.scoreOverall)} />
          <Row label="Value" a={`${a.scoreValue}`} b={`${b.scoreValue}`} winner={cmp(a.scoreValue, b.scoreValue)} />
          <Row label="Range (real-world)" a={`~${a.rangePractical} mi`} b={`~${b.rangePractical} mi`} winner={cmp(a.rangePractical, b.rangePractical)} />
          <Row label="Motor" a={`${a.torque} Nm`} b={`${b.torque} Nm`} winner={cmp(a.torque, b.torque)} />
          <Row label="Battery" a={`${a.batteryCapacity} Ah`} b={`${b.batteryCapacity} Ah`} winner={cmp(a.batteryCapacity, b.batteryCapacity)} />
          <Row label="Weight" a={`${a.weight} lbs`} b={`${b.weight} lbs`} winner={cmp(a.weight, b.weight, false)} />
          <Row label="Max payload" a={`${a.maxWeight} lbs`} b={`${b.maxWeight} lbs`} winner={cmp(a.maxWeight, b.maxWeight)} />
          <Row label="Warranty" a={a.warrantyYears ? `${a.warrantyYears} yr` : '—'} b={b.warrantyYears ? `${b.warrantyYears} yr` : '—'} />

          <div className="grid grid-cols-[120px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] gap-3 pt-6">
            <div />
            {[a, b].map((bike) => (
              <AffiliateLink key={bike.slug} href={bike.affiliateUrl} brand={bike.brand} model={bike.model} slug={bike.slug} price={bike.price} network={bike.affiliateNetwork} cta="check_price"
                className="cta-primary px-4 py-2.5 text-sm font-bold rounded-lg text-center" style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}>
                Check price →
              </AffiliateLink>
            ))}
          </div>
        </div>

        {/* Verdict */}
        <div className="mt-10 p-6 rounded-xl border-2" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--accent-soft)' }}>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Our verdict</h2>
          <p className="text-[var(--muted)] leading-relaxed">
            {scoreWinner ? (
              <>On our scoring model the <strong className="text-[var(--foreground)]">{scoreWinner.brand} {scoreWinner.model}</strong> comes out ahead overall
              ({scoreWinner.scoreOverall} vs {(scoreWinner === a ? b : a).scoreOverall}). That said, the right
              choice depends on your priorities. Use the quiz below for a recommendation tailored to you.</>
            ) : (
              <>It’s remarkably close: both score {a.scoreOverall} overall. The right choice comes down to
              your budget, terrain and feature priorities. Take the quiz for a personalized pick.</>
            )}
          </p>
          <Link href="/e-bikes/quiz" className="cta-primary inline-flex mt-5 px-6 py-3 font-bold rounded-lg" style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}>
            Find My E-Bike →
          </Link>
        </div>
      </div>
    </div>
  );
}
