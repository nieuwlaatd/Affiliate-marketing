import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BikeCard from '@/components/BikeCard';
import SpecComparisonTable from '@/components/SpecComparisonTable';
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
  /** Related blog posts shown at the bottom of the page for internal linking. */
  relatedPosts?: { title: string; slug: string }[];
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
    relatedPosts: [
      { title: 'How to Choose an Electric Bike: The Complete Buyer\'s Guide', slug: 'how-to-choose-an-electric-bike' },
      { title: 'Are E-Bikes Worth It?', slug: 'are-ebikes-worth-it' },
    ],
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
    relatedPosts: [
      { title: 'Best E-Bikes for Commuting in 2026', slug: 'best-ebikes-for-commuting-2026' },
      { title: 'E-Bike Classes Explained: Class 1 vs. 2 vs. 3', slug: 'ebike-classes-explained' },
      { title: 'Best E-Bikes for Hills', slug: 'best-ebikes-for-hills' },
    ],
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
    relatedPosts: [
      { title: 'How to Choose an Electric Bike: The Complete Buyer\'s Guide', slug: 'how-to-choose-an-electric-bike' },
      { title: 'Best E-Bikes for Commuting in 2026', slug: 'best-ebikes-for-commuting-2026' },
    ],
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
    relatedPosts: [
      { title: 'Best E-Bikes for Heavy Riders', slug: 'best-ebikes-for-heavy-riders' },
      { title: 'Are E-Bikes Worth It?', slug: 'are-ebikes-worth-it' },
    ],
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
  {
    slug: 'fat-tire-ebikes',
    title: `Best Fat Tire E-Bikes (${YEAR}): Top Picks for All-Terrain Riding`,
    h1: `Best Fat Tire E-Bikes in ${YEAR}`,
    metaDescription: `The best fat tire electric bikes of ${YEAR}, ranked by off-road capability, motor power, range and value. Honest picks for beach, trails, snow and city riding.`,
    intro:
      'Fat tire e-bikes replace the standard 1.75 to 2.5-inch road tire with a wide 3 to 4-inch knobbed tire that grips loose sand, packed snow, gravel, mud and roots without needing a full-suspension mountain bike. These picks score highest across our off-road, range and build-quality axes, covering everything from folding commuters to dual-motor AWD trail rigs.',
    filter: (b) =>
      b.description.toLowerCase().includes('fat') ||
      b.highlights.some((h) => h.toLowerCase().includes('fat')),
    lastUpdated: '2026-06-28',
    relatedPosts: [
      { title: 'Best E-Bikes for Heavy Riders', slug: 'best-ebikes-for-heavy-riders' },
      { title: 'Best E-Bikes for Hills', slug: 'best-ebikes-for-hills' },
    ],
    sections: [
      {
        h2: 'What is a fat tire e-bike and who should buy one',
        body: [
          'A fat tire e-bike runs a tire between 3 and 4.5 inches wide, inflated to a low 6 to 15 PSI. At that pressure the tire deforms around obstacles instead of bouncing off them, giving you traction on surfaces that would defeat a narrow road or trail tire: soft beach sand, packed winter snow, wet roots, loose gravel and broken pavement. You get this without a rear shock, which keeps the bike simpler, lighter and more affordable than a full-suspension trail bike.',
          'The biggest beneficiaries are riders who face unpredictable surfaces. Beach-town commuters, riders in the Midwest or Northeast where snowy and slushy winters are the norm, and anyone whose route mixes paved streets with unpaved trail or gravel path all find that a fat tire dramatically expands where they can confidently ride. Fat tires are also gentler on rough urban pavement, which is why many city commuters choose them for comfort even when they never go near a trail.',
          'Heavier riders (200 lbs and up) also benefit: the larger contact patch distributes weight more evenly, reducing the chance of pinch flats and improving cornering stability under load. If you have hills in your route and the bike has a motor of 750W or more, fat tires and elevation are a fine combination.',
        ],
      },
      {
        h2: 'How fat tires affect range, speed and handling',
        body: [
          'The main trade-off with fat tires is rolling resistance. A 4-inch tire at 10 PSI creates more friction against the road surface than a 2-inch tire at 40 PSI, and that friction uses battery capacity. On a flat paved road, a fat tire e-bike typically delivers 10 to 15 percent less range than an equivalent road-tire bike with the same motor and battery. On loose or soft surfaces, the rolling resistance gap shrinks because the fat tire floats while the narrow tire sinks and fights.',
          'Handling is different, not worse. Fat tires steer more slowly and feel more planted, which new riders often find reassuring. The lower air pressure absorbs bumps that would transmit directly through a rigid fork on a narrow-tire bike, so rough roads feel smoother. Top speed is the same as any other e-bike in the same class; the motor and class determine the speed ceiling, not the tire.',
          'Weight is the third factor. A 26-inch fat tire adds roughly 1.5 to 2.5 lbs over a comparable road tire. A complete fat-tire e-bike typically weighs 55 to 80 lbs, which is heavier than a narrow-tire commuter but similar to most cargo e-bikes. If you need to carry the bike up stairs, look for folding fat-tire models with built-in carry handles, which keep the weight manageable for building access.',
        ],
      },
      {
        h2: '20-inch vs 26-inch fat tires: which wheel size is right for you',
        body: [
          'Twenty-inch fat tire bikes fold more compactly, stand lower to the ground and are easier to mount and dismount, especially on 20x4-inch wheels. They are the dominant choice for folding fat-tire e-bikes, city commuters who store the bike indoors, and lighter riders who prioritize portability. The shorter wheelbase turns more quickly in traffic. The trade-off is a slightly more nervous, busier ride feel at higher speeds compared to a longer wheelbase bike, and slightly less momentum conservation on undulating terrain.',
          'Twenty-six-inch fat tire bikes use a longer wheelbase that tracks straighter at speed, holds momentum better on rolling terrain, and feels more stable when loaded with cargo or ridden by a heavier rider. They are the standard choice for trail and off-road use, and they are what most dual-motor AWD fat-tire bikes use. The larger wheel also rolls over obstacles more smoothly because the contact point hits them at a shallower angle.',
          'Both wheel sizes are available with 3-inch, 3.5-inch and 4-inch tires. If you are primarily riding on pavement and light gravel, a 3-inch tire gives most of the comfort benefit with less rolling resistance. If you are regularly on sand, snow or technical trail, a 4-inch tire delivers noticeably more traction. The 3-to-4 inch range is where you get the most practical balance for mixed riding.',
        ],
      },
    ],
    faqs: [
      { q: 'Are fat tire e-bikes good for beginners?', a: `Yes. The wide tires are more forgiving of minor steering errors, gravel crossings and cracked pavement than narrow tires, which makes fat tire e-bikes a confidence-building choice for new riders. The throttle on most Class 2 fat-tire models also means you never have to pedal hard from a stop.` },
      { q: 'How far can a fat tire e-bike go on one charge?', a: 'Most 750W fat tire e-bikes with a 14 to 20 Ah battery deliver 35 to 55 miles of real-world range on a mix of assist levels. High-capacity models with 20 Ah or larger batteries can exceed 60 miles on flat ground. Fat tires add about 10 to 15 percent more rolling resistance than road tires on pavement, which reduces range compared to a narrow-tire bike with the same motor and battery.' },
      { q: 'Can a fat tire e-bike ride on the beach?', a: 'Yes, on packed or firm sand. Soft, deep sand is harder even for a fat tire: you need very low pressure (6 to 8 PSI), a powerful motor (750W or more) and momentum. A 4-inch tire handles beach riding far better than a 3-inch tire. Look for bikes with at least 750W nominal power and a throttle if beach riding is a regular use case for you.' },
      { q: 'Are fat tire e-bikes good in snow?', a: 'Yes. Fat tires at low pressure grip compacted snow similarly to how they grip sand, by floating rather than digging. For winter riding, a 4-inch tire at 8 to 12 PSI works well on packed snow; consider adding studded tires for icy conditions. Most fat-tire motors are powerful enough to push through the additional drag of deep snow.' },
      { q: 'Do fat tires make an e-bike harder to pedal?', a: 'Slightly. The extra rolling resistance means more effort at the same assist level compared to a road bike. In practice, most fat-tire e-bike riders use a slightly higher assist level to compensate, which costs a small amount of range. For most e-bike riders who use mid to high assist most of the time, the difference is not noticeable day to day.' },
      { q: 'How much do fat tire e-bikes weigh?', a: 'Most fat tire e-bikes weigh between 55 and 80 lbs. A 20-inch folding fat-tire model typically weighs 55 to 65 lbs. A 26-inch dual-motor AWD fat-tire bike can reach 70 to 80 lbs. The fat tires themselves add about 3 to 5 lbs over narrow tires, with the rest of the weight coming from the motor, battery and frame.' },
      { q: `What is the difference between 3-inch and 4-inch fat tires?`, a: 'A 3-inch tire gives most of the comfort and stability benefit of a fat tire with slightly less rolling resistance, making it better for mixed road and light trail use. A 4-inch tire delivers maximum traction on soft surfaces like sand, snow and mud, but adds more rolling resistance on pavement. For all-terrain riding, 4 inches is the better choice; for mostly-road with occasional trail, 3 to 3.5 inches is a good compromise.' },
    ],
  },
  {
    slug: 'long-range-ebikes',
    title: `Best Long-Range E-Bikes (${YEAR}): Top Picks for 50+ Miles`,
    h1: `Best Long-Range E-Bikes in ${YEAR}`,
    metaDescription: `The best long-range electric bikes of ${YEAR} with 50 or more miles of real-world range. Battery size, motor efficiency and honest range estimates for every pick.`,
    intro:
      'Most e-bikes claim 40 to 80 miles of range but deliver 25 to 45 miles in real-world conditions. These long-range picks genuinely go further, with large batteries, efficient motors and practical ranges we verify against real-world use data. Ranked by overall score with extra weight on real-world range.',
    filter: (b) => b.rangePractical >= 55,
    lastUpdated: '2026-06-28',
    relatedPosts: [
      { title: 'E-Bike Battery and Range Guide', slug: 'ebike-battery-range-guide' },
      { title: 'Best E-Bikes for Hills', slug: 'best-ebikes-for-hills' },
    ],
    sections: [
      {
        h2: 'What "long range" actually means for an e-bike',
        body: [
          'E-bike range claims are the most inflated figures in the industry. Manufacturers test at the lowest assist level, on flat ground, with a 155 lb rider, in warm weather, at a slow speed. Real-world riding means higher assist levels, headwinds, hills, a full-sized rider with a bag and temperature fluctuations. The result is that a bike claiming 80 miles typically delivers 35 to 50 miles under everyday use conditions.',
          'We define long range as bikes that deliver at least 50 miles of practical range at moderate assist. That threshold separates bikes where most riders can expect to charge once a day or less (covering a 20 to 25 mile round-trip commute with comfortable margin) from bikes that require mid-day top-ups or careful assist management. For touring or rural routes where charging points are sparse, look for bikes that deliver 60 to 80 miles practically.',
          'The bikes on this page have been verified to exceed the 50-mile practical threshold based on battery capacity, motor efficiency and community range data. We flag manufacturer claims separately so you can see the gap and set realistic expectations before you buy.',
        ],
      },
      {
        h2: 'What drives e-bike range: battery, motor, rider and terrain',
        body: [
          'Battery capacity is the primary variable. Battery energy is measured in watt-hours (Wh): volts multiplied by amp-hours. A 48V 20Ah battery holds 960 Wh. A typical 750W hub-motor e-bike consumes 15 to 25 Wh per mile at moderate assist, so that 960 Wh battery delivers 38 to 64 miles in real-world use. To reliably achieve 60 miles of practical range, you generally need at least a 48V 20Ah (960 Wh) or 52V 17Ah (884 Wh) pack.',
          'Motor type affects efficiency on hills and varied terrain. Mid-drive motors sense your pedaling effort and apply power more precisely, which can deliver 10 to 20 percent better range on rolling or hilly terrain compared to a hub motor at the same battery size. Hub motors (rear and front) are simpler and cheaper, and their range disadvantage shrinks on flat ground. For long-range flat commuting, a quality hub motor is fine; for hilly terrain where you want every mile of range, a mid-drive is the better choice.',
          'Rider weight and assist level have the largest impact on daily range. A 180 lb rider on level 3 assist typically uses 18 to 22 Wh per mile; a 250 lb rider on the same setting uses 22 to 30 Wh per mile. Reducing from assist level 3 to level 2 on flat sections and reserving level 4 or 5 for hills is the single most effective range-extension technique, often adding 20 to 30 percent of usable range without changing the bike.',
        ],
      },
      {
        h2: 'Long-range e-bikes vs standard e-bikes: the trade-offs',
        body: [
          'A large battery adds weight: a 20 Ah pack weighs roughly 8 to 11 lbs more than a 10 Ah pack. On top of that, long-range bikes often use heavier frames to handle the battery weight. The result is that a genuine 60-mile-range e-bike typically weighs 65 to 85 lbs, which is meaningful if you need to carry it up stairs or onto transit.',
          'Long-range bikes also cost more. A 20 Ah battery adds $200 to $500 to the component cost versus a 10 Ah pack, and this flows through to retail price. Most genuine long-range e-bikes start at $1,000 and commonly run $1,500 to $2,500. Budget long-range options (under $1,200) typically achieve their range by using a lower-voltage 36V system with a very large Ah rating, which gives a bigger number but sometimes sacrifices hill-climbing torque.',
          'For most urban commuters with routes under 15 miles each way, a standard 40 to 50 mile practical range bike is sufficient. Long-range bikes pay off for riders with 20 to 30 mile one-way commutes, rural routes where charging mid-day is not practical, heavy riders who experience higher-than-average consumption, or touring riders who want multi-day capability without daily charging.',
        ],
      },
    ],
    faqs: [
      { q: 'How far can a long-range e-bike realistically go?', a: 'The bikes on this page deliver 50 to 80 miles of real-world range at moderate assist on relatively flat terrain. Hilly routes and high assist levels reduce this by 20 to 40 percent. We list practical range for every bike, which is our estimate of real-world performance at assist level 3 with a typical rider load, not the inflated manufacturer claim.' },
      { q: `What battery size do I need for 50 miles of range?`, a: 'You generally need at least a 48V 17Ah (816 Wh) or 52V 15Ah (780 Wh) battery to reliably achieve 50 miles at moderate assist. A 48V 20Ah (960 Wh) pack gives you more margin. Smaller 10 to 13 Ah packs can approach 50 miles only on flat ground at low assist, which is not realistic for everyday riding.' },
      { q: 'Does motor type affect e-bike range?', a: 'Yes, meaningfully on hilly terrain. Mid-drive motors are 10 to 20 percent more efficient on hills because they use your gears to apply power at the optimal RPM. Hub motors work at a fixed RPM regardless of grade, so they waste more energy climbing. On flat ground, the efficiency gap shrinks to 5 to 10 percent. For flat city commuting, a hub motor is fine; for hilly routes, a mid-drive extends range noticeably.' },
      { q: 'How does rider weight affect e-bike range?', a: 'A heavier rider uses more energy to move the same distance, especially uphill. A 250 lb rider typically sees 25 to 35 percent less range than a 155 lb rider on the same bike in the same conditions. If you are over 220 lbs, look for bikes with larger batteries (20 Ah or more) and higher torque motors (80 Nm or more) to compensate for the additional draw.' },
      { q: 'Can I add a second battery to extend range?', a: 'Some long-range e-bikes support a second battery that doubles or nearly doubles range. This is more common in premium and cargo-oriented models. Check whether the frame has a mount point and whether the controller supports dual-battery input before buying. A purpose-designed dual-battery system is safer and more effective than aftermarket adapters.' },
      { q: 'How long does it take to charge a long-range e-bike battery?', a: 'A 48V 20Ah (960 Wh) battery takes 5 to 8 hours to charge from near-empty with a standard 2A to 3A charger. Fast chargers (5A to 6A) cut this to 3 to 4 hours. Most e-bikes ship with a standard charger; upgrading to a faster charger is usually possible and worthwhile if you want to top up mid-day.' },
      { q: 'Are long-range e-bikes worth the extra cost?', a: `For commuters with routes under 15 miles each way, a standard e-bike is usually sufficient and the extra battery cost is not justified. For commutes of 20 miles or more each way, rural riders without mid-day charging access, or heavy riders who experience above-average consumption, the range premium pays off in peace-of-mind and charging flexibility. The sweet spot for most buyers is a 50 to 65 mile practical range bike in the $1,200 to $1,800 range.` },
    ],
  },
  {
    slug: 'step-through-ebikes',
    title: `Best Step-Through E-Bikes (${YEAR}): Easy-Mount Picks for Every Rider`,
    h1: `Best Step-Through E-Bikes in ${YEAR}`,
    metaDescription: `The best step-through electric bikes in ${YEAR}: low-entry frames that are easy to mount and unmount for commuters, seniors and riders who want comfort over everything. Honest, data-driven picks.`,
    intro:
      'A step-through e-bike removes the top tube, letting you step forward onto the bike without swinging a leg over a high crossbar. The result is easier mounting and dismounting at red lights, less strain on hips and knees, and a more confident feel for riders returning to cycling or dealing with limited mobility. These picks are ranked by overall score with extra weight on comfort and everyday usability.',
    filter: (b) => b.frameType === 'step-through',
    lastUpdated: '2026-06-30',
    relatedPosts: [
      { title: 'Step-Through vs. Step-Over E-Bikes: Which Frame Is Right for You?', slug: 'step-through-vs-step-over-ebike' },
      { title: 'Best E-Bikes for Commuting in 2026', slug: 'best-ebikes-for-commuting-2026' },
      { title: 'How to Choose an Electric Bike: The Complete Buyer\'s Guide', slug: 'how-to-choose-an-electric-bike' },
    ],
    sections: [
      {
        h2: 'Who should choose a step-through e-bike',
        body: [
          'Step-through frames were originally designed for riders in skirts or dresses who could not swing a leg over a diamond frame. Today their appeal is much broader. Urban commuters who stop frequently at traffic lights find the step-forward mount faster and less awkward, especially in work clothes. Riders over 50 appreciate the lower hip demand, particularly if their flexibility has decreased over time. Cyclists returning from injury or surgery also benefit from not having to balance on one leg while mounting.',
          'The low entry is also genuinely useful for shorter riders who would otherwise have to tiptoe on a step-over bike. A step-through frame allows the saddle to sit at a proper pedaling height without leaving the rider stranded at stops with no foot flat on the ground.',
          'Where step-through frames are a poorer fit: aggressive off-road riding or situations where you need a very stiff, light frame. Removing the top tube does reduce torsional rigidity somewhat, though on a motorized bike traveling at e-bike speeds this rarely matters. For trail riding, sport riding or competitive use, a step-over or sport frame will outperform. For commuting, city riding, recreation and mixed-use, a step-through is nearly always the more comfortable and practical choice.',
        ],
      },
      {
        h2: 'What to look for in a step-through e-bike',
        body: [
          'Frame rigidity is the first thing to check. Some budget step-through frames flex noticeably when climbing or sprinting, which transmits vibration through the handlebars and bottom bracket. Look for frames made from butted aluminum alloy (not single-butted or Hi-Ten steel), and check community reviews for any comments about frame flex or creaking at the headset.',
          'Standover height determines how easily you actually get on and off. The standover height is the vertical distance from the ground to the top of the lowest frame tube at the midpoint of the bike. Most step-through e-bikes have a standover of 20 to 28 inches, making them accessible to riders with an inseam as low as 24 inches. We list the standover height and recommended rider height range on each bike page.',
          'Motor and range considerations are the same as any other e-bike. For city commuting, a 500W to 750W rear-hub motor with a 10 to 15 Ah battery covers 25 to 45 miles of practical range, enough for a 10 to 15 mile one-way commute with comfortable margin. If your route has significant hills, look for at least 70 Nm of torque -- step-through bikes are popular with riders who prioritize comfort, but hills do not know or care about your frame style.',
          'Check for fender and rack compatibility. A commuter who buys a step-through e-bike for the daily ride to work almost always wants to add fenders for rain and a rear rack for a bag or panniers. Most step-through bikes include both, but some sport-oriented step-throughs omit them. Verify before buying if this matters to you.',
        ],
      },
      {
        h2: 'Step-through vs step-over e-bikes: the real trade-offs',
        body: [
          'The most important difference is mounting ease, not performance. Step-through bikes are easier to get on and off, especially for shorter riders, older riders or anyone in restrictive clothing. Step-over bikes (classic diamond frame) are marginally stiffer and lighter for the same material and tubing, but on a motorized e-bike traveling at 15 to 20 mph the difference is not noticeable in everyday riding.',
          'Weight is slightly higher on step-through frames because the frame needs more material at the head tube and seat tube junction to compensate for the missing top tube. In practice this difference is 0.5 to 1.5 lbs, which is negligible when the whole bike weighs 50 to 70 lbs.',
          'Style and perception also matter. Step-through bikes have a more traditional, approachable look that some riders prefer. Step-over bikes signal a sportier intent. Neither is objectively better -- pick the one that matches how you plan to ride and how the bike will fit into your daily life.',
        ],
      },
    ],
    faqs: [
      { q: 'What is a step-through e-bike?', a: 'A step-through e-bike has a low or absent top tube, so you step forward onto the bike rather than swinging a leg over a high crossbar. This makes mounting and dismounting easier, especially at frequent stops, for riders with limited hip flexibility, or in clothing that restricts leg swing.' },
      { q: 'Are step-through e-bikes less sturdy than step-over bikes?', a: 'No, not in practical use. Step-through frames are slightly less torsionally rigid than diamond frames, but on a motorized e-bike traveling at 15 to 20 mph this difference has no real-world impact on performance or safety. Step-through bikes from reputable brands are fully rated for the same payloads as their step-over counterparts.' },
      { q: `What is the best step-through e-bike in ${YEAR}?`, a: `Our top-ranked step-through picks in ${YEAR} balance frame quality, motor power, real-world range and mounting ease. See the ranked list above for current top picks. Use our quiz for a personalized recommendation based on your height, route and budget.` },
      { q: 'Are step-through e-bikes only for women?', a: 'No. Step-through frames were historically associated with women\'s bikes, but they are genuinely practical for any rider who values easier mounting and dismounting. Many male commuters, older riders and shorter riders choose step-through bikes for the comfort benefit, regardless of gender.' },
      { q: 'What is the standover height on a step-through e-bike?', a: 'Most step-through e-bikes have a standover height of 20 to 28 inches at the lowest frame tube, making them accessible to riders with an inseam as low as 24 to 26 inches. The standover height is listed on each bike page, along with the minimum and maximum recommended rider height.' },
      { q: 'Can I ride a step-through e-bike on hills?', a: 'Yes. The frame style has no effect on climbing ability -- that comes from the motor, battery and torque. For hilly commutes, look for at least 70 Nm of torque and a 500W or larger motor, regardless of frame style. Most step-through e-bikes use the same motors and batteries as their step-over counterparts.' },
      { q: 'Are step-through e-bikes good for seniors?', a: 'Yes, especially for older riders who find it harder to swing a leg over a high top tube, or who have hip, knee or back limitations. The low-entry frame reduces the balance demand at stops and the mounting effort from a full stand. Pair a step-through frame with a Class 2 throttle and upright geometry for the most comfortable and confidence-inspiring senior setup.' },
    ],
  },
  {
    slug: 'off-road-ebikes',
    title: `Best Off-Road E-Bikes (${YEAR}): All-Terrain Picks for Trails, Gravel & Sand`,
    h1: `Best Off-Road E-Bikes in ${YEAR}`,
    metaDescription: `The best off-road electric bikes of ${YEAR} for trails, gravel, sand and mixed terrain. Ranked by torque, traction and real-world toughness. Honest picks with actual range figures.`,
    intro:
      'Off-road e-bikes go where pavement ends: gravel fire roads, packed dirt trails, beach access paths, and the rough rural routes that destroy a standard commuter bike in one season. These picks are ranked by overall score with extra weight on motor torque, tire width and build durability — the three specs that actually determine whether a bike handles the terrain you throw at it.',
    filter: (b) => b.suitableFor.includes('sport') || b.suitableFor.includes('off-road'),
    lastUpdated: '2026-07-04',
    relatedPosts: [
      { title: 'AWD E-Bikes Explained: Do You Need All-Wheel Drive?', slug: 'awd-ebikes-explained' },
      { title: 'Best E-Bikes for Hills', slug: 'best-ebikes-for-hills' },
      { title: 'Best E-Bikes for Heavy Riders', slug: 'best-ebikes-for-heavy-riders' },
    ],
    sections: [
      {
        h2: 'Who needs an off-road e-bike',
        body: [
          'Off-road e-bikes are the right choice when your riding consistently leaves paved surfaces. Riders who commute on gravel paths, access rural properties on unpaved roads, or explore trails at state and county parks need a bike built for that abuse. A standard commuter e-bike with 1.75-inch road tires at 50 PSI will struggle on loose gravel, bog down on soft dirt and transmit every rock and root straight through the handlebars.',
          'Fat-tire off-road e-bikes solve this with 3 to 4-inch tires run at low pressure (6 to 15 PSI), which float over loose surfaces, absorb impacts passively and give a stable contact patch on camber and corners. Combined with a powerful motor (750W or more) and substantial torque (70 Nm minimum, 90 to 110 Nm for demanding terrain), an off-road e-bike handles the kind of riding that would leave a road bike stranded.',
          'Beach riders benefit from the same tire properties: soft sand at 8 PSI works similarly to snow and loose dirt, requiring a motor powerful enough to maintain momentum. Riders who live in areas with harsh winters and use their bike year-round also land in this category, since the fat tire handles snow and ice far better than any narrow tire at reasonable PSI.',
          'Where off-road e-bikes are overkill: pure paved commuting. The fat tires add 10 to 15 percent more rolling resistance on asphalt, and the heavier frames (typically 60 to 80 lbs) are harder to carry up stairs. If 90 percent of your riding is smooth pavement, a lighter commuter bike will be faster, easier to handle and more efficient. The off-road bikes here are for riders whose terrain genuinely demands it.',
        ],
      },
      {
        h2: 'The specs that matter: torque, tire width and motor type',
        body: [
          'Torque is the most important number on an off-road e-bike spec sheet. Torque (measured in newton-metres) determines whether the bike can pull itself and the rider up a 15 to 25 percent grade on loose gravel, through deep sand or over rooted trail. For light off-road use (gravel, packed dirt), 65 to 80 Nm is sufficient. For demanding terrain, steep climbs or heavy riders, look for 90 Nm or more. Dual-motor AWD bikes add the front motor\'s torque to the rear motor\'s, which can deliver 110 to 130 Nm of combined output and dramatically different capability on technical climbs.',
          'Tire width determines grip and float. A 3-inch tire at 12 PSI is the entry point for real off-road capability; a 4-inch tire at 8 to 10 PSI is the standard for serious all-terrain use. The wider contact patch distributes weight over a larger area on soft surfaces, which is what prevents the tire from digging in and stalling. For dedicated beach or sand riding, 4 inches is the practical minimum; for gravel and mixed trail, 3 to 3.5 inches handles most conditions well.',
          'Motor type matters for sustained climbs. Hub motors run at a fixed RPM regardless of grade, which means they work harder and generate more heat when climbing in a high gear. Mid-drive motors route power through the bike\'s gears, letting you drop to a lower gear on steep ascents and maintain motor efficiency. For riders who tackle long, sustained climbs, a mid-drive is the more capable and durable choice. For most off-road riders whose climbs are short and varied, a powerful 750W or 1,000W rear-hub motor with strong torque output handles the terrain without the added cost and drivetrain complexity of a mid-drive.',
        ],
      },
      {
        h2: 'AWD dual-motor vs single-motor: when does the upgrade pay off',
        body: [
          'Dual-motor AWD e-bikes put a motor in both the front and rear wheel. In theory, this doubles traction and provides independent wheel spin under hard acceleration. In practice, AWD e-bikes deliver a noticeably different experience in specific conditions: soft, slippery or steep terrain where a single rear wheel would spin and lose traction. If you ride wet grass, soft sand, steep loose dirt or snow where the rear wheel regularly slips, AWD changes what the bike can do.',
          'On packed gravel and maintained trails, the single-motor bikes in this list perform almost identically to their AWD counterparts because a single rear-drive wheel has enough traction on a firm surface with a fat tire. The AWD upgrade makes a real difference in the 15 to 20 percent of conditions where traction is genuinely marginal.',
          'The trade-offs are real: AWD bikes are heavier (the second motor adds 6 to 10 lbs), more expensive (typically $200 to $400 over the single-motor equivalent), and use more battery per mile because two motors are running. On a flat, firm trail, an AWD bike will have noticeably shorter range than an equivalent single-motor bike. For riders who regularly encounter the specific conditions where AWD shines, it is a meaningful upgrade. For everyone else, a single powerful rear-hub motor with a wide tire is the better bang for the money.',
        ],
      },
    ],
    faqs: [
      { q: 'What is the best off-road e-bike?', a: `Our top-ranked off-road picks in ${YEAR} balance high torque (80 Nm or more), wide fat tires (3 to 4 inches) and a powerful 750W or stronger motor at the best price. See the ranked list above for current top picks, sorted by our overall score with extra weight on terrain performance.` },
      { q: 'Can e-bikes go off-road?', a: 'Yes, provided the bike is designed for it. Fat-tire e-bikes with 3 to 4-inch tires, high torque motors (70 Nm or more) and a sturdy frame handle gravel, dirt trails, sand and packed snow confidently. A standard commuter e-bike with narrow tires is not suited to off-road riding and will struggle on anything other than smooth packed surfaces.' },
      { q: 'How much torque do I need for off-road riding?', a: 'For light off-road use (gravel paths, packed dirt), 65 to 75 Nm is sufficient. For demanding terrain, steep grades or if you are over 200 lbs, look for 80 to 90 Nm or more. Dual-motor AWD bikes combine front and rear torque to deliver 110 Nm and above, which is the most capable option for genuinely technical terrain.' },
      { q: 'Are fat tire e-bikes good for trails?', a: 'Yes, especially for natural surface trails, fire roads and gravel. The wide tires at low pressure absorb roots, rocks and rough surfaces that would stop a narrow tire. For technical mountain bike singletracks with tight switchbacks and drops, a full-suspension trail-specific e-MTB is the better tool. For most off-road riding the bikes on this page encounter, fat tires and a powerful hub motor are the practical, affordable solution.' },
      { q: 'What is the difference between AWD and single-drive off-road e-bikes?', a: 'AWD bikes run motors in both wheels, delivering more traction on slippery, steep or loose surfaces where a single rear wheel would spin. Single-drive bikes with a strong rear-hub motor and fat tires match AWD performance on most firm off-road surfaces. AWD is worth the extra weight and cost if you regularly ride soft sand, steep loose dirt or wet grass. For most off-road users, a quality single-motor bike is the better value.' },
      { q: 'How heavy are off-road e-bikes?', a: 'Most off-road fat-tire e-bikes weigh between 60 and 80 lbs. The heavier frame, large battery and fat tires all add weight over a commuter bike. AWD models with two motors typically weigh 70 to 85 lbs. If you need to carry the bike regularly, look for lighter 20-inch wheel fat-tire models in the 55 to 65 lb range, which are more manageable.' },
      { q: 'Can off-road e-bikes handle hills?', a: 'Yes, better than almost any other e-bike type. High torque motors (80 to 110 Nm), combined with wide tires that maintain traction on steep loose slopes, make off-road e-bikes the strongest climbers in the catalog. Mid-drive models like the Eunorau Defender-S (160 Nm) are in a different league for sustained technical climbs.' },
    ],
  },
  {
    slug: 'ebikes-under-2000',
    title: `Best E-Bikes Under $2,000 (${YEAR})`,
    h1: `Best E-Bikes Under $2,000 in ${YEAR}`,
    metaDescription: `The best electric bikes under $2,000 in ${YEAR}: mid-range picks with better motors, longer range and stronger components than budget bikes. Ranked by value and real-world performance.`,
    intro:
      'The $1,000 to $2,000 price band is where e-bikes go from capable to genuinely excellent. Better motors, longer real-world range, hydraulic brakes and refined ride quality all start appearing in this range. These are the best e-bikes under $2,000, ranked by our overall score with real-world range figures — not manufacturer claims.',
    filter: (b) => b.price <= 2000,
    lastUpdated: '2026-06-29',
    relatedPosts: [
      { title: 'How to Choose an Electric Bike: The Complete Buyer\'s Guide', slug: 'how-to-choose-an-electric-bike' },
      { title: 'Best E-Bikes for Commuting in 2026', slug: 'best-ebikes-for-commuting-2026' },
    ],
    sections: [
      {
        h2: 'What the $1,000 to $2,000 range actually gets you',
        body: [
          'Budget e-bikes under $1,000 are genuinely useful, but they make visible trade-offs: basic mechanical disc brakes, smaller batteries, heavier frames and limited warranty support. At $1,000 to $2,000 most of those trade-offs disappear. You get hydraulic disc brakes with better wet-weather modulation, batteries in the 14 to 20 Ah range that deliver 40 to 60 miles of real-world range, frames made from butted aluminum that shed weight without sacrificing strength, and customer support that actually answers the phone.',
          'The sweet spot in this bracket is roughly $1,200 to $1,600. Below $1,200, you are getting the upper end of what budget brands offer. Above $1,600, you start paying for brand reputation and cosmetic polish more than raw capability. The bikes that score highest in our testing at this price range tend to have 750W motors producing 70 to 90 Nm of torque, 17 to 20 Ah batteries and integrated lighting that is actually useful rather than decorative.',
          'One thing that genuinely improves in this range: real-world range figures match the bike\'s potential more closely. Budget bikes often need aggressive assist management to hit even 70% of their claimed range. Mid-range bikes with well-tuned motor controllers and larger batteries routinely deliver 80 to 90% of the claimed figure under typical riding conditions.',
        ],
      },
      {
        h2: 'Where the extra money goes: motors, brakes and build quality',
        body: [
          'The motor is the biggest upgrade between a $800 bike and a $1,400 bike. Entry-level motors run at a fixed efficiency curve and start to struggle on sustained hills or under heavier riders. Mid-range motors use better magnets, tighter winding tolerances and more sophisticated controllers that adjust power output in real time. The result is smoother power delivery, less heat buildup on climbs and more consistent performance across the battery\'s discharge curve.',
          'Brakes are the most important safety component on any e-bike, and hydraulic disc brakes are where mid-range bikes pull sharply ahead. Hydraulic brakes require less hand force to generate strong stopping power, maintain consistent feel as they heat up and are self-adjusting as pads wear. For riders who commute in wet weather or ride any hills, the upgrade from mechanical to hydraulic brakes is meaningful.',
          'Build quality at $1,200 to $2,000 also shows in details that do not show up on a spec sheet: smoother cable routing, tighter tolerances at the headset and bottom bracket, display units that are readable in sunlight, and charging ports that seat properly. These details separate bikes that feel good to own from ones that feel assembled to a price.',
        ],
      },
      {
        h2: 'How to choose: commuter, cargo, fat tire or sport',
        body: [
          'Under $2,000 you have genuine choices across every riding style. Commuters who cover 10 to 20 miles each way should prioritize range and weight over everything else. Look for bikes in the 48 to 55 lb range with 16 to 20 Ah batteries and rack mounting points for a panniers or top bag.',
          'Heavier riders (over 200 lbs) will find the best payload-to-price ratio at this price point: several bikes under $2,000 carry 330 to 400 lbs, compared to the 265 lb limit common on budget bikes. If payload is a priority, check our dedicated picks for bikes with verified 330 lb plus ratings.',
          'Fat tire bikes under $2,000 hit a very good sweet spot: 750W motors, 4-inch tires and either dual-motor or high-torque single-motor setups that handle off-road, snow and sand without the premium price of a full-suspension trail bike. If your riding mixes streets with gravel, beach access or packed dirt trails, a fat tire e-bike in this range outperforms almost anything in the under $1,000 bracket.',
        ],
      },
    ],
    faqs: [
      { q: 'Is $2,000 enough for a good e-bike?', a: 'Yes. At $2,000 you get a genuinely excellent e-bike with hydraulic disc brakes, a 40 to 60 mile real-world range, a 750W or stronger motor and a well-built frame. Most riders find no meaningful reason to spend more unless they need a specific premium brand, dual suspension or specialty features.' },
      { q: `What is the best e-bike under $2,000 in ${YEAR}?`, a: `Our top-ranked e-bike under $2,000 in ${YEAR} balances motor power, real-world range, braking performance and build quality at the best price. The ranked list above is sorted by our overall score, so the bike at the top is our current best pick. Use the quiz to get a personalized recommendation based on your riding style.` },
      { q: 'What is the difference between a $1,000 and a $2,000 e-bike?', a: 'At $1,000 you typically get mechanical disc brakes, a 10 to 13 Ah battery, a 500 to 750W motor with basic torque output, and a heavier frame. At $2,000 you get hydraulic disc brakes, a 14 to 20 Ah battery (40 to 60+ miles real-world range), a more refined motor controller, a lighter frame and usually a stronger warranty. The ride quality difference is noticeable from the first hill.' },
      { q: 'Is a $1,500 e-bike significantly better than a $1,000 one?', a: 'Usually yes, in specific areas. The biggest jump is brakes: $1,000 bikes typically use mechanical disc brakes, $1,500 bikes are more likely to have hydraulic. Battery size also jumps: a $1,500 bike often carries a 15 to 17 Ah pack versus 10 to 12 Ah at $1,000, which translates directly to 15 to 20 more miles of real-world range. Motor refinement is the subtler upgrade: smoother, more consistent power on hills and at the top of the assist range.' },
      { q: 'Should I buy a $1,500 e-bike or save for a $2,500 one?', a: 'For most riders, the jump from $1,500 to $2,500 buys brand name recognition, cosmetics and incremental polish rather than a step-change in capability. The core specs -- motor power, range, braking -- plateau after roughly $1,800 to $2,000 in the DTC (direct-to-consumer) market. Spend more only if you need a specific brand for resale value, dealer support, or suspension that genuinely changes your off-road capability.' },
      { q: 'Do more expensive e-bikes have better range?', a: 'Generally yes, but with diminishing returns. A $2,000 bike typically has a 16 to 20 Ah battery versus 10 to 12 Ah at $1,000, which translates to 15 to 25 more miles of practical range. Above $2,000, battery size and range do not improve dramatically -- the extra cost goes to components, suspension and brand overhead rather than more battery capacity.' },
      { q: 'Are mid-range e-bikes worth it over budget models?', a: 'For most riders who use their bike more than twice a week, yes. The hydraulic brakes, longer range and better motor controller all make the riding experience noticeably better. If you ride occasionally on flat terrain and range is not a concern, a budget bike under $1,000 is perfectly adequate. But if you commute daily, ride in rain, tackle hills, or weigh over 200 lbs, the mid-range bracket delivers a meaningfully better bike.' },
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
    .filter((b) => b.available !== false)
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
            <h2 className="text-xl font-bold text-[var(--foreground)] mt-10">Quick comparison</h2>
            <SpecComparisonTable bikes={bikes.slice(0, 8)} />
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

        {/* Related reading */}
        {def.relatedPosts && def.relatedPosts.length > 0 && (
          <div className="mt-16 max-w-3xl">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Related reading</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {def.relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:shadow-md transition-shadow"
                >
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Guide</span>
                  <p className="mt-1 font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-snug text-sm">{post.title}</p>
                </Link>
              ))}
            </div>
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
