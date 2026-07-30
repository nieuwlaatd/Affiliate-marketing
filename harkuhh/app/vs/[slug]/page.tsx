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
  // 2026-07-29 run 61: P4.2 naming-confusion slice 5 -- GSC/PostHog flat for an 18th
  // consecutive run with no new signal bikes, so did a fresh per-brand sweep of the full
  // catalog for remaining same-stem sibling pairs (the run-59/60 candidate list was
  // exhausted). While sourcing the META275 pairing, found and fixed a real data bug: see
  // SEO-LOG for details.
  ['eunorau-specter-s-hunter', 'eunorau-specter-st-1'], // "SPECTER-S 3.0 vs SPECTER-ST 2.0" -- identical price ($2,999), motor (1000W Bafang M620 mid-drive, 160 Nm), battery, and dual-battery range (80mi), the only real difference is frame geometry (sport/step-over vs step-through) -- same pattern as CREST/STORM and SX20/SN100
  ['vtuvia-reindeer-step-thru-electric-bike', 'vtuvia-reindeer-2'], // "Reindeer 1.0 vs Reindeer 2.0" -- a genuinely counterintuitive upgrade: 2.0 is $100 cheaper than 1.0 ($1,599 vs $1,699) while adding more torque (85 vs 80 Nm) and a torque sensor, at the cost of a slightly heavier build (75 vs 72 lbs) and less range (70mi vs 55mi manufacturer) -- a real "why is the newer one cheaper" query
  ['eunorau-meta-275-1', 'eunorau-meta-275-st-1'], // "META275 1.0 vs META275 ST" -- byte-identical specs (price, motor, torque, battery, weight, range all match exactly), the only difference is frame geometry (step-over vs step-through) -- same pattern as CREST/STORM; fixed a real bug on META275 1.0 first (see SEO-LOG: its description wrongly claimed "step-through" despite a correct step-over `frame_type` field, confirmed against Eunorau's own product page)
  // 2026-07-29 run 62: P4.2 naming-confusion slice 6 -- GSC/PostHog flat for a 19th
  // consecutive run with no new signal bikes, so continued mining the run-61 candidate
  // list (DYU C2/C5/C6 -- already exhausted, see the C5-vs-C6 pairing above; ENGWE EP-2
  // family; Eunorau FLASH vs FLASH AWD).
  ['engwe-ep-2-boost', 'engwe-ep-2-pro'], // "EP-2 Boost vs EP-2 Pro" -- same 30kg/66lb folding fat-tire platform, 55 Nm, 48V 13Ah, but a real drivetrain-tech gap web-verified via ENGWE's own product pages and an independent review (cyclingeu.com): Boost uses a torque sensor with a "boost mode" button and no throttle (EU/UK Class-1-legal), Pro pairs a cadence sensor with throttle assist and a smaller 160mm brake rotor (vs Boost's 180mm) -- a genuine "which sensor type do I want" query, not a resolved generational upgrade like the L20 pairs
  ['eunorau-flash-2', 'eunorau-flash-awd-1-0'], // "FLASH vs FLASH AWD" -- while sourcing this pairing, found and fixed a real bug: FLASH (2.0)'s `motor_type` was stored as 'rear-hub' despite its own description explicitly naming a "52V 1000W Truckrun mid-drive motor" -- confirmed genuinely mid-drive via 6+ independent retailer listings (bikeberry.com, ebikejoy.com, offgridlux.com, omahasportsandgames.com), so corrected the DB field before shipping this comparison. The two bikes now contrast cleanly: FLASH is a single 1000W mid-drive motor (220 Nm) built for climbing power, FLASH AWD is dual 750W hub motors (184 Nm combined) built for traction in snow/sand/gravel -- a real "climbing power vs all-wheel traction" query, and $400 cheaper for the AWD version
  // 2026-07-30 run 63: P4.2 naming-confusion slice 7 -- GSC/PostHog flat for a 20th
  // consecutive run with no new signal bikes. Walfisk had zero within-brand vs-pages
  // (flagged as a fresh candidate in run 62); it only has 3 SKUs, so checked all pairs
  // and found one genuine story rather than forcing one across all three.
  ['walfisk-walfisk-26-fat-tire-bafang-750w-powerful-brushless-motor-22-5ah-large-ca', 'walfisk-walfisk-wf750-urbanx-fat-tire-electric-bike-48v-750w-25ah-battery-up-to-'], // "WF26 vs WF750 UrbanX" -- same 80 Nm rear-hub motor, front suspension, 330 lb payload and Class 3 rating, but WF750 UrbanX has a 55% bigger battery (35Ah vs 22.5Ah) for 45mi vs 38mi practical range at $500 more ($1,499.99 vs $999) -- a real "is the bigger battery worth $500" query. ET-7 Ultra (Walfisk's 3rd SKU) is a 3000W off-road-only motor, not a legal e-bike, so it has no natural same-category pairing with either street-legal sibling.
  // 2026-07-30 run 64: P4.2 naming-confusion slice 8 -- GSC/PostHog flat for a 21st
  // consecutive run (one new query, "samebike lo26 plus review", but the matching page
  // already has full depth and a vs-page, nothing to action there). Fresh full-catalog
  // sweep found 3 more genuine same-stem sibling pairs that had never been paired despite
  // sharing an obvious name stem.
  ['eunorau-r1', 'eunorau-r1-plus'], // "R1 vs R1+" -- the site's two most expensive flagships share the literal "R1"/"R1+" name stem but had never been paired; R1+ is a real generational upgrade (72V 5,000W/500 Nm vs R1's 72V 4,000W/330 Nm, 150 lbs vs 130 lbs) for $749 more -- a genuine "is the Plus worth it" query between the catalog's two priciest bikes
  ['engwe-n1-air', 'engwe-n1-pro'], // "N1 Air vs N1 Pro" -- both carbon fiber "N1" bikes (confirmed carbon frame material for both, run 38) but a real architecture gap: N1 Air is rear-hub/40 Nm/34.4 lbs (the lightest bike in the ENGWE lineup) at $1,249, N1 Pro is mid-drive/80 Nm/41.9 lbs with a 1.5hr flash-charge system at $1,599 -- a genuine "lightweight vs climbing power" query, and both bikes carry real GSC/PostHog signal history
  ['eunorau-meta275-2', 'eunorau-meta-275-st-1'], // "META275 2.0 vs META275 ST" -- while sourcing this pairing, found and fixed a real bug: `eunorau-meta275-2` stored `weight_lbs=60` and `frame_type='step-over'`, but its own description already said "step-thru city commuter," and Eunorau's own product page for this exact SKU (ca.eunorau-ebike.com/products/meta275-2-0) confirms a step-thru frame option and 68.4 lbs, not 60 -- fixed both fields before shipping. With that corrected, 2.0 and ST are both step-through META275s at nearly identical weight, but 2.0 trades 10 Nm of torque (55 vs 65) for a bigger 15Ah battery and much longer range (100mi/75mi vs 65mi/49mi) at $300 more -- a real "which step-through META275" query, same pattern as the P275 SE-vs-ST pairing
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
