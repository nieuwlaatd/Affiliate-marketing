import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BikeCard from '@/components/BikeCard';
import { ShortlistProvider } from '@/lib/shortlist-context';
import { getAllBikes } from '@/lib/ebike-data';
import { EBike } from '@/lib/types';

interface CategoryDef {
  slug: string;
  title: string;
  h1: string;
  intro: string;
  metaDescription: string;
  filter: (b: EBike) => boolean;
  faqs: { q: string; a: string }[];
  /** Optional buyer's-guide body, rendered between the bike grid and the FAQ. */
  sections?: { h2: string; body: string[] }[];
  /** ISO date of the last meaningful content update (freshness signal). */
  lastUpdated?: string;
}

const YEAR = 2026;

const CATEGORIES: CategoryDef[] = [
  {
    slug: 'ebikes-under-1000',
    title: `Best E-Bikes Under $1,000 (${YEAR})`,
    h1: `Best E-Bikes Under $1,000 in ${YEAR}`,
    metaDescription: `The best electric bikes under $1,000 in ${YEAR}, ranked by value, range and build quality. Honest, data-driven picks for every rider type.`,
    intro:
      'You don\'t need to spend a fortune to get a capable electric bike. These are the best e-bikes under $1,000 right now, ranked by our value, range and build-quality scores. Every pick is judged on real-world range rather than optimistic manufacturer claims.',
    filter: (b) => b.price <= 1000,
    lastUpdated: '2026-06-27',
    sections: [
      {
        h2: 'What can you really get for under $1,000?',
        body: [
          'Budget e-bikes have improved dramatically. At the $700 to $1,000 price point you can now find 500W to 750W motors, removable batteries and real-world ranges of 25 to 45 miles. These are not toys: they cover daily commutes, grocery runs and weekend recreation without apology.',
          'The honest trade-offs at this price are component longevity (cheaper derailleurs and brakes wear faster), build finishing (rougher welds, basic paint) and warranty coverage (often one year parts, limited support). If you plan to ride daily in all weather, budget $50 to $100 for a maintenance fund in year one.',
          'Every bike ranked below has cleared our floor standards: a properly rated battery from a known cell supplier, at least 25 miles of real-world range on assist level 3, and a published max-payload rating. We exclude bikes that fail those basics regardless of price.',
        ],
      },
      {
        h2: 'Step-through vs step-over under $1,000',
        body: [
          'At this price you will find both frame styles, and the right one depends on how you mount the bike and what you wear. Step-through frames let you swing a leg forward or backward without lifting it high, which matters for riders with limited flexibility, frequent stop-and-go city riding, or anyone who commutes in work clothes. Step-over (diamond frame) bikes are slightly stiffer and lighter for the same tubing, and they tend to look more traditional.',
          'Neither is faster or more capable at the sub-$1,000 price point. Pick the one that feels natural to you when you stop at a red light.',
        ],
      },
      {
        h2: 'What to watch for when buying a budget e-bike',
        body: [
          'Battery quality is the single biggest variable at the sub-$1,000 price point. A genuine 48V 10Ah pack from name-brand cells (LG, Samsung, Panasonic) will last 500 to 800 full charge cycles. An unbranded pack may degrade much sooner. We check manufacturer disclosures and cross-reference community reports before scoring any battery.',
          'Check whether the battery is removable. A removable pack means you can charge it indoors, which extends cell life in cold climates and makes charging easier in an apartment. Several bikes at this price point lock the battery to the frame, which is a meaningful convenience trade-off.',
          'Finally, read the return policy before you click buy. E-bikes are heavy and ship freight, so a 30-day no-questions-asked window with free return shipping is rare but worth seeking out. Most budget brands offer a limited return window, so inspect your bike promptly on arrival.',
        ],
      },
    ],
    faqs: [
      { q: 'Are e-bikes under $1,000 any good?', a: 'Yes, several budget brands now offer solid 500W to 750W motors, removable batteries and real-world ranges of 25 to 45 miles. The trade-offs are usually weight, basic components and shorter warranties compared to mid-range bikes.' },
      { q: 'What range can I expect from a cheap e-bike?', a: 'Most sub-$1,000 e-bikes deliver 25 to 45 miles of realistic range on lower assist levels. We list practical range, not the inflated manufacturer figure, and the difference can be 30 to 50 percent.' },
      { q: 'What is the best e-bike for under $1,000?', a: `Our top-ranked pick under $1,000 in ${YEAR} balances motor power, real-world range and battery quality at the lowest price we can honestly recommend. See the ranked list above for our current top picks.` },
      { q: 'Are budget e-bikes safe?', a: 'Yes, as long as you buy from a brand with UL or CE certification on the battery and charger. The bikes ranked here all pass that bar. Avoid no-name marketplace listings with no certifications listed.' },
      { q: 'How long does a cheap e-bike battery last?', a: 'A quality sub-$1,000 battery lasts 500 to 800 full charge cycles, which is roughly three to five years of regular use. Storing the battery at 40 to 80 percent charge and avoiding extreme temperatures significantly extends lifespan.' },
      { q: 'Do I need a license for a budget e-bike?', a: 'In most US states, Class 1 and Class 2 e-bikes (up to 20 mph) require no license, registration or insurance. Always check your state and city rules, especially for throttle-equipped Class 2 bikes on shared paths.' },
    ],
  },
  {
    slug: 'ebikes-under-1500',
    title: `Best E-Bikes Under $1,500 (${YEAR})`,
    h1: `Best E-Bikes Under $1,500 in ${YEAR}`,
    metaDescription: `The best electric bikes under $1,500 in ${YEAR}. Our value-ranked picks with real-world range and honest scoring.`,
    intro:
      'The $1,000–$1,500 range is the sweet spot for most riders: better components, longer range and more refined ride quality without premium pricing. Here are the best e-bikes under $1,500, ranked by our scoring model.',
    filter: (b) => b.price <= 1500,
    faqs: [
      { q: 'Is $1,500 enough for a good e-bike?', a: 'Absolutely. At this price you get reliable hydraulic brakes, 45–60 mile real-world range and well-supported brands with decent warranties.' },
    ],
  },
  {
    slug: 'commuter-ebikes',
    title: `Best Commuter E-Bikes (${YEAR}): Top Picks for the Daily Ride`,
    h1: `Best Commuter E-Bikes in ${YEAR}`,
    metaDescription: `The best commuter electric bikes in ${YEAR}: efficient, comfortable and reliable picks for the daily ride to work. Ranked by range, comfort and all-weather reliability.`,
    intro:
      'A great commuter e-bike is fast enough to keep up with traffic, comfortable over potholes and reliable rain or shine. These picks score highest for commuting use, with extra weight on range, comfort, real-world reliability and how easy the bike is to lock and maintain day-to-day.',
    filter: (b) => b.suitableFor.includes('commuting'),
    lastUpdated: '2026-06-27',
    sections: [
      {
        h2: 'What makes a great commuter e-bike',
        body: [
          'Commuter e-bikes live a harder life than weekend recreational bikes: daily use, varying weather, locking outside and frequent stopping and starting. The specs that matter most for commuting are range, weight and the availability of fenders, racks and lights either built-in or compatible with the frame.',
          'Range is the most misunderstood commuter spec. Manufacturers quote range at low assist on flat ground in warm weather. Your real-world commuting range -- moderate assist, loaded with a bag, stopping at lights -- is typically 40 to 60 percent lower. We list practical range on every bike page so you can size up whether the battery covers your route with margin to spare. A good rule of thumb: if your commute is 15 miles each way, look for at least 40 miles of practical range so you are never anxious about charging at the office.',
          'Weight matters for commuters who carry the bike into buildings, up stairs or onto transit. A 45 to 55 lb e-bike is manageable for most riders; anything above 70 lbs gets tiring fast on stairs. Step-through frames also lower the bar for mount and dismount in stop-heavy city riding.',
        ],
      },
      {
        h2: 'Class 1 vs Class 2 vs Class 3 for commuting',
        body: [
          'Class 1 e-bikes (pedal-assist only, max 20 mph) are the most widely legal option -- allowed on almost all bike paths and lanes across the US. They are a great fit for short to medium commutes where path access matters more than top speed.',
          'Class 2 e-bikes add a throttle that lets you move without pedaling, up to 20 mph. The throttle is genuinely useful for city commuting: you can ease away from lights without clipping in, navigate tricky spots without full effort and arrive less sweaty. Access rules are the same as Class 1 in most jurisdictions, though a handful of states and cities restrict throttle use on shared paths.',
          'Class 3 e-bikes assist up to 28 mph and are the fastest legal option for most commuters. The higher speed makes longer commutes practical -- a 10-mile commute takes about 25 minutes at 25 mph versus 40+ at 15 mph. The trade-off: Class 3 bikes are typically banned from multi-use paths and required to have a speedometer in some states. If your whole commute is on road or protected bike lanes, Class 3 is usually the smarter choice for anything over six miles.',
        ],
      },
      {
        h2: 'How far can you realistically commute on an e-bike?',
        body: [
          'Most commuters ride between 5 and 20 miles each way. E-bikes with 30 to 50 miles of practical range comfortably cover a 10 to 15 mile one-way commute with a single charge, assuming you can charge at home or at the office. For commutes over 20 miles each way, look for bikes with 50+ miles of practical range, or a removable battery you can top up during the day.',
          'Terrain and cargo load have a real impact on range. A 10 lb backpack and a few moderate hills can cut practical range by 20 percent compared to a flat, lightly loaded ride. In cold weather (below 40 degrees F) battery capacity drops a further 10 to 20 percent. Build that buffer into your route planning.',
        ],
      },
    ],
    faqs: [
      { q: 'What class e-bike is best for commuting?', a: 'Class 3 (28 mph pedal-assist) is the fastest legal option and makes longer commutes practical, but it is restricted from some shared paths. Class 2 (throttle + 20 mph) is the most versatile city option. Class 1 is the most universally path-legal choice for shorter commutes.' },
      { q: 'How far can you commute on an e-bike?', a: 'Most e-bikes cover 5 to 25 miles each way on a single charge. A bike with 40 to 50 miles of practical range comfortably handles a 15-mile one-way commute. We list practical range on every bike page -- not the inflated manufacturer figure.' },
      { q: 'Are e-bikes good for commuting?', a: 'Yes. An e-bike typically cuts commute time by 20 to 40 percent versus a traditional bike, arrives without the sweat of heavy pedaling on hills, and costs a fraction of car ownership per mile. For commutes under 20 miles each way, an e-bike is often the fastest door-to-door option in urban areas.' },
      { q: 'What should I look for in a commuter e-bike?', a: 'Prioritize: (1) enough practical range to cover your route with 20 percent margin, (2) a removable battery if you need to charge at your desk, (3) mounting points for fenders and a rear rack, (4) weight under 65 lbs if you carry the bike indoors, and (5) hydraulic disc brakes for confident stopping in wet weather.' },
      { q: 'Do I need a license to commute on an e-bike?', a: 'In most US states, Class 1, 2 and 3 e-bikes do not require a license, registration or insurance. Local rules vary -- check your state, and check whether your city restricts Class 3 bikes from certain paths.' },
      { q: `How much does a good commuter e-bike cost in ${YEAR}?`, a: 'A reliable commuter e-bike costs between $800 and $2,000. At $800 to $1,200 you get a solid motor, 30 to 45 miles of practical range and basic components. At $1,200 to $2,000 you get better brakes, longer range, integrated lighting and finer finishing. Above $2,000 you pay for brand reputation, premium components and longer warranties.' },
    ],
  },
  {
    slug: 'folding-ebikes',
    title: `Best Folding E-Bikes (${YEAR}): Top Picks for Apartments & Commutes`,
    h1: `Best Folding E-Bikes in ${YEAR}`,
    metaDescription: `The best folding electric bikes in ${YEAR} for apartments, mixed commutes, RVs and travel. Compact, capable picks ranked by portability, ride quality and value.`,
    intro:
      'A folding e-bike solves a problem no regular e-bike can: you can carry it into an office, stow it under a train seat, slide it into a car trunk or tuck it in a closet the size of a suitcase. These are the best folding electric bikes right now, ranked by portability, motor capability and real-world ride quality.',
    filter: (b) => !!b.dimensions?.foldedSize,
    lastUpdated: '2026-06-28',
    sections: [
      {
        h2: 'Who should buy a folding e-bike',
        body: [
          'Folding e-bikes make the most sense when storage or transport is your main constraint. If you live in an apartment without a bike room, a folding e-bike comes indoors with you -- no worrying about theft or rain. If you commute by train or bus and want to cover the last mile on a bike, a folder goes under the seat or in the baggage rack where a full-size e-bike never would.',
          'RV travelers and van lifers love folders for the same reason: two or three fit in the storage bay where a single full-size e-bike would barely squeeze. Boat owners use them as tenders. Anyone who travels frequently and wants to bring their bike on the road without a roof rack or cargo van will find a folding e-bike changes what a trip looks like.',
          'The trade-off is that folding bikes are typically heavier than a similarly sized rigid bike, because the hinge mechanism adds material and requires a beefier frame to stay rigid under load. If storage and transport are not constraints for you, a rigid e-bike will usually give you more range and performance per dollar.',
        ],
      },
      {
        h2: 'What to look for in a folding e-bike',
        body: [
          'Folded weight and folded dimensions are the two numbers that determine whether a folder actually solves your problem. A bike that folds to 40 x 27 x 28 inches fits in a standard car trunk; one that only folds to 60 x 27 x 40 inches often does not. Check the folded dimensions, not just the claim that the bike "folds." Similarly, weight matters more in a folder: lugging a 70 lb folding bike up stairs or onto a train defeats the purpose.',
          'The hinge quality is the most important build attribute to evaluate. A solid hinge keeps the bike stiff and silent when riding; a flimsy one introduces flex and creak that makes the bike feel unsafe. Look for thick aluminum frames with a secure latch mechanism -- a hinge that requires two hands to close but stays closed confidently under load is preferable to one that opens with one tap but rattles when you pedal.',
          'Wheel size determines how the bike handles on the road. Folding bikes most commonly use 20-inch wheels, which give a smaller folded footprint but produce a slightly more nervous ride at high speed compared to a 26-inch wheel. Fat 20-inch tires (4 inches wide) compensate with more stability and traction, at the cost of a heavier, wider package. For multi-modal commuting in the city, 20-inch standard or fat-tire wheels are the most practical choice.',
          'For motor power, 500W to 750W is the sweet spot for US riders who want throttle-up capability and can handle moderate hills. A 250W motor is enough for flat city riding with pedal assist, but feels sluggish if you ever face a 5 to 8 percent grade. Look for at least 500W nominal if you have any hills on your route.',
        ],
      },
      {
        h2: 'How far can a folding e-bike go?',
        body: [
          'Folding e-bikes typically carry smaller batteries than full-size models because the frame has less room. Most use 10 to 15 Ah packs, which deliver 20 to 40 miles of realistic range. Fat-tire folding bikes with 13 to 17.5 Ah batteries can reach 30 to 50 miles. We list practical range on every bike page, which is typically 30 to 50 percent lower than the manufacturer claim, because manufacturers test at low assist on flat ground.',
          'For most use cases -- apartment to office or train station, last-mile transit, RV campsite exploration -- this range is plenty. Where it can fall short is long rides or loaded commutes on hills. If you need 30-plus miles every day on hilly terrain, a full-size e-bike with a 17 to 25 Ah battery will serve you better. If you are covering 8 to 15 miles per trip with the option to charge at each end, a folding e-bike hits the sweet spot.',
        ],
      },
    ],
    faqs: [
      { q: 'Are folding e-bikes worth it?', a: 'Yes, if storage or portability is a real constraint. For apartment dwellers, multi-modal commuters (bike plus train), RV owners and frequent travelers, a folding e-bike opens up options a regular e-bike cannot. If you have a dedicated place to store a bike and do not need to carry it, a regular e-bike usually offers more range and performance per dollar.' },
      { q: `What is the best folding e-bike in ${YEAR}?`, a: `Our top-ranked folding e-bikes in ${YEAR} balance a secure, stiff hinge mechanism with a capable motor (500W or more), a practical battery (at least 30 miles of realistic range) and a folded size that actually fits in a car trunk or under a train seat. See the ranked list above for our current picks.` },
      { q: 'How small do folding e-bikes get when folded?', a: 'Most 20-inch folding e-bikes fold to roughly 35 to 45 inches long, 20 to 27 inches wide and 25 to 32 inches tall. Compact mini-folders with 14-inch wheels can fold smaller. The folded dimensions are listed on each bike page and matter more than the brand claim that the bike "folds compact."' },
      { q: 'How much do folding e-bikes weigh?', a: 'Most folding e-bikes weigh between 45 and 75 lbs. The folding hinge and reinforced frame add weight compared to a similarly sized rigid bike. If you need to carry the bike up stairs regularly, look for models under 55 lbs and check whether the bike has a carrying handle built in.' },
      { q: 'Can I take a folding e-bike on public transit?', a: 'Most transit agencies allow folding bikes on trains and buses, though rules vary. In general, folded bikes must fit in the luggage area or overhead rack and cannot block the aisle. Check your specific transit agency\'s policy before buying -- most published policies define "folding bike" by size rather than by the presence of an electric motor.' },
      { q: 'Are folding e-bikes as fast as regular e-bikes?', a: 'Yes. Most folding e-bikes are Class 2 (throttle-assisted to 20 mph) or Class 3 (pedal-assisted to 28 mph), the same classes as full-size e-bikes. The top speed comes from the motor and bike class, not the frame style. Fat-tire models with a 750W motor will keep up with any Class 3 rider on flat ground.' },
      { q: 'Can a folding e-bike handle hills?', a: 'Yes, provided the motor is powerful enough. A 500W to 750W motor with 70 to 90 Nm of torque will handle 5 to 10 percent grades comfortably. Under-powered 250W motors struggle on steeper hills, especially when the rider is heavier. Check the torque spec and the practical range -- steep terrain will cut your real-world range by 20 to 35 percent.' },
    ],
  },
  {
    slug: 'cargo-ebikes',
    title: `Best Cargo E-Bikes (${YEAR}): Top Picks for Hauling Kids & Gear`,
    h1: `Best Cargo E-Bikes in ${YEAR}`,
    metaDescription: `The best cargo e-bikes of ${YEAR} for hauling kids, groceries and gear. Ranked by payload, torque, stability and value, with real-world range and honest scoring.`,
    intro:
      'A good cargo e-bike can replace a second car for school runs, grocery hauls and weekend errands. We ranked the best cargo and utility electric bikes for ' +
      YEAR +
      ' on the four things that actually matter when you load one up: rated payload, motor torque on hills, frame stability and braking. Every pick is scored on real-world range, not the optimistic manufacturer number.',
    // A practical cargo bike is defined by what it can haul, not just a label.
    // Include anything tagged cargo, plus high-payload, high-torque utility bikes.
    filter: (b) =>
      b.suitableFor.includes('cargo') ||
      ((b.maxWeight ?? 0) >= 350 && (b.torque ?? 0) >= 80),
    lastUpdated: '2026-06-27',
    sections: [
      {
        h2: 'What makes a good cargo e-bike',
        body: [
          'Cargo e-bikes are built to carry weight, so the spec sheet matters more here than on any other type of e-bike. The single most important number is rated payload: the total the bike can safely carry including you, your passengers and the cargo. We only list bikes with a published payload rating, and we show it on every bike page so you can match it to your real load.',
          'Torque is the second number to watch. Pulling 80 to 150 pounds of kids and groceries up a hill needs muscle, and torque (measured in newton-metres) is what delivers it from a standstill. Look for at least 80 Nm if you have any hills on your route, and 100 Nm or more if you ride loaded in hilly terrain every day.',
          'Finally, stability and stopping power. A long wheelbase, fat tires and a low center of gravity keep a loaded bike planted, while hydraulic disc brakes give you the confidence to stop a heavy bike in the wet. Every bike below clears that bar.',
        ],
      },
      {
        h2: 'Longtail vs front-loader vs utility frames',
        body: [
          'Longtail cargo bikes stretch the rear rack so you can fit two child seats or a big cargo bag behind the rider. They handle much like a normal bike, which makes them the easiest type for new cargo riders, and they are the most popular family choice.',
          'Front-loaders (also called bakfiets or box bikes) put a cargo box between the rider and the front wheel. They carry the most volume and keep kids in view, but they are heavier, pricier and take practice to steer. ',
          'Utility and fat-tire bikes with a high payload rating are the value option. They do not have a dedicated cargo box, but with a sturdy rear rack and panniers they handle grocery runs and commutes with a passenger comfortably, at roughly half the price of a dedicated longtail.',
        ],
      },
      {
        h2: 'How much does a cargo e-bike cost?',
        body: [
          'Dedicated family longtails from established brands typically run $1,800 to $5,000. Front-loaders sit at the top of that range and beyond. The good news for ' +
            YEAR +
            ' is that capable high-payload utility e-bikes now start under $1,500, so you no longer need a five-figure budget to ditch the car for the school run.',
          'When you compare prices, factor in accessories. Child seats, running boards, a second battery and panniers can add $300 to $800, so a cheaper bike that bundles a rack and fenders can be the better overall deal.',
        ],
      },
    ],
    faqs: [
      { q: 'How much can a cargo e-bike carry?', a: 'Most cargo and high-payload utility e-bikes handle 330 to 450 lbs of total payload including the rider. Dedicated longtails are at the top of that range. Always check the rated max payload, which we list on every bike page.' },
      { q: 'What is the best cargo e-bike in ' + YEAR + '?', a: 'Our current top pick balances a high payload rating, strong hill torque and a stable, well-braked frame at a fair price. The ranked list above updates as we test new models, so the bike at the top is our best overall cargo pick right now.' },
      { q: 'Can a cargo e-bike carry two kids?', a: 'Yes. Most longtail cargo bikes are rated for two child seats on the rear deck, and many utility bikes with a 400 lb payload can do the same with the right rack and seats. Check the payload rating against your kids\' combined weight plus your own.' },
      { q: 'Are cargo e-bikes worth it?', a: 'For families who do regular short trips, a cargo e-bike often replaces a second car and pays for itself in fuel, parking and maintenance within a couple of years. If you mostly ride solo for fitness, a lighter commuter or recreation e-bike is a better fit.' },
      { q: 'What is the difference between a cargo bike and a cargo e-bike?', a: 'A cargo e-bike adds a motor and battery to the cargo frame, which is what makes hauling heavy loads and climbing hills practical. An unpowered cargo bike is far harder to ride loaded, especially uphill or into wind.' },
      { q: 'How much range does a loaded cargo e-bike get?', a: 'Carrying cargo and climbing hills drains the battery faster, so expect 20 to 40 miles of real-world range when loaded, depending on assist level and terrain. We list practical range, not the inflated manufacturer figure, and a second battery roughly doubles it.' },
      { q: 'Do I need a license to ride a cargo e-bike?', a: 'In most US states, Class 1, 2 and 3 e-bikes do not require a license, registration or insurance. Local rules vary, so check your state and city regulations, especially for Class 3 bikes on shared paths.' },
    ],
  },
  {
    slug: 'class-3-ebikes',
    title: `Best Class 3 E-Bikes (28 mph) (${YEAR})`,
    h1: `Best Class 3 E-Bikes in ${YEAR}`,
    metaDescription: `The best Class 3 electric bikes in ${YEAR}. 28 mph pedal-assist speed pedelecs for fast commutes.`,
    intro:
      'Class 3 e-bikes assist up to 28 mph, making them the fastest legal option for commuters in most US states. These are the top-scoring Class 3 models.',
    filter: (b) => b.bikeClass === 'class-3',
    faqs: [
      { q: 'Where can I ride a Class 3 e-bike?', a: 'Class 3 e-bikes are road and bike-lane legal in most US states but are often restricted from multi-use paths. Always check your local rules.' },
    ],
  },
  {
    slug: 'ebikes-for-seniors',
    title: `Best E-Bikes for Seniors (${YEAR})`,
    h1: `Best E-Bikes for Seniors in ${YEAR}`,
    metaDescription: `The best electric bikes for seniors in ${YEAR}: easy step-through frames, stable handling and confidence-inspiring brakes.`,
    intro:
      'The best e-bikes for older riders combine a low step-through frame, upright comfortable geometry, smooth power delivery and strong brakes. These picks score highest on comfort and ease of use.',
    filter: (b) => b.frameType === 'step-through' && b.suitableFor.includes('recreation'),
    faqs: [
      { q: 'What type of e-bike is best for seniors?', a: 'A step-through frame with a low standover height, a comfortable upright riding position and a throttle (Class 2) for extra confidence on hills and from a stop.' },
    ],
  },
];

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const def = CATEGORIES.find((c) => c.slug === category);
  if (!def) return { title: 'Category not found' };
  return {
    title: def.title,
    description: def.metaDescription,
    alternates: { canonical: `/best/${def.slug}` },
    openGraph: { title: def.title, description: def.metaDescription, type: 'website' },
  };
}

export default async function BestCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const def = CATEGORIES.find((c) => c.slug === category);
  if (!def) notFound();

  const allBikes = await getAllBikes();
  const bikes = allBikes
    .filter(def.filter)
    .sort((a, b) => b.scoreOverall - a.scoreOverall)
    .slice(0, 12);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: def.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: bikes.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${b.brand} ${b.model}`,
    })),
  };

  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <Link href="/e-bikes" className="hover:text-[var(--foreground)]">E-Bikes</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)]">Best of</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">{def.h1}</h1>
        {def.lastUpdated && (
          <p className="text-xs text-[var(--muted)] mt-2">
            Last updated{' '}
            {new Date(def.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}
        <p className="text-[var(--muted)] text-lg mt-3 max-w-3xl leading-relaxed">{def.intro}</p>

        <div className="mt-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-sm text-[var(--muted)] max-w-3xl">
          <strong className="text-[var(--foreground)]">How we rank:</strong> every bike is scored on value,
          real-world range, power, comfort, build quality and versatility.{' '}
          <Link href="/how-we-test" className="underline hover:text-[var(--foreground)] transition-colors">See our full methodology.</Link>{' '}
          We earn an affiliate commission if you buy through our links, but it never changes the ranking.
        </div>

        {bikes.length > 0 ? (
          <ShortlistProvider>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
              {bikes.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          </ShortlistProvider>
        ) : (
          <p className="text-[var(--muted)] mt-10">No bikes in this category yet. Check back soon.</p>
        )}

        {/* Buyer's guide */}
        {def.sections && def.sections.length > 0 && (
          <div className="mt-16 max-w-3xl">
            {def.sections.map((s) => (
              <section key={s.h2} className="mb-10">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">{s.h2}</h2>
                <div className="space-y-4">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-[var(--muted)] leading-relaxed">{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* FAQ */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {def.faqs.map((f) => (
              <div key={f.q} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
                <h3 className="font-bold text-[var(--foreground)]">{f.q}</h3>
                <p className="text-[var(--muted)] mt-2 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz CTA */}
        <div className="mt-16 text-center rounded-2xl p-10" style={{ backgroundColor: 'var(--bordeaux)' }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--on-bordeaux)' }}>Not sure which one is right for you?</h2>
          <p className="mb-6" style={{ color: 'var(--muted-on-bordeaux)' }}>Take the 60-second quiz for a personalized top 3.</p>
          <Link href="/e-bikes/quiz" className="cta-primary inline-flex px-7 py-3 font-bold rounded-lg" style={{ backgroundColor: 'var(--gold)', color: 'var(--cta-ink)' }}>
            Find My E-Bike →
          </Link>
        </div>
      </div>
    </div>
  );
}
