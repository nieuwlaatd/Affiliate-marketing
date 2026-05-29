export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  coverAlt: string;
  content: string;
  relatedSlugs?: string[];
}

const POSTS: BlogPost[] = [
  {
    slug: 'how-to-choose-an-electric-bike',
    title: 'How to Choose an Electric Bike: The Complete Buyer\'s Guide',
    description: 'Everything you need to know before buying your first e-bike, from motor types and battery range to frame styles and bike classes.',
    category: 'Guides',
    publishedAt: '2026-05-15',
    readingTime: 12,
    coverAlt: 'Person test-riding an electric bike on a city street',
    relatedSlugs: ['ebike-classes-explained', 'ebike-battery-range-guide'],
    content: `
Buying an electric bike is one of the best decisions you can make for your commute, fitness and wallet. But with hundreds of models on the market, choosing the right one can feel overwhelming.

This guide breaks it down into the decisions that actually matter.

## Start with how you'll ride

Before looking at specs, answer three questions:

1. **Where will you ride?** Flat city streets, hilly suburbs, gravel trails or a mix of everything? This determines the motor power and tire type you need.
2. **How far is your typical trip?** A 5-mile commute and a 30-mile weekend adventure need very different battery sizes.
3. **What's your budget?** Great e-bikes exist at every price point, but the sweet spot for most riders is $1,000–$2,000.

## Motor types: hub vs. mid-drive

There are two main motor placements:

**Hub motors** sit in the front or rear wheel. They're simpler, cheaper to maintain and perfectly fine for flat to moderate terrain. Most e-bikes under $2,000 use rear hub motors.

**Mid-drive motors** sit at the cranks (pedals). They use your gears, which makes them more efficient on hills. They also feel more natural because power flows through the chain. The trade-off: higher price and more drivetrain wear.

**Our take:** If you ride mostly flat ground or gentle hills, a rear hub motor is the smart choice. If you tackle serious climbs regularly, invest in a mid-drive.

## Battery and range: ignore the marketing number

Manufacturers love to claim "60+ mile range." In reality, you'll get 50–70% of the advertised figure when riding at moderate assist on mixed terrain.

Here's what affects real-world range:

- **Assist level:** Eco mode doubles your range vs. full power.
- **Terrain:** Hills drain batteries fast.
- **Rider weight:** A heavier rider uses more energy.

We test and estimate practical range for every bike on our site, so you always know what to actually expect.

## Understanding e-bike classes

In the US, e-bikes fall into three classes:

- **Class 1:** Pedal-assist only, up to 20 mph. Allowed almost everywhere, including bike paths.
- **Class 2:** Pedal-assist plus throttle, up to 20 mph. Great if you want a boost from a stop or up a hill without pedaling.
- **Class 3:** Pedal-assist only, up to 28 mph. Fastest legal option, ideal for longer commutes. Restricted from some multi-use paths.

Not sure which class you need? Take our [Find My E-Bike quiz](/e-bikes/quiz) and we'll match you.

## Frame type matters more than you think

- **Step-through:** Low top tube, easy to mount and dismount. Ideal for city riding, shorter riders, or anyone with mobility concerns.
- **Step-over:** Traditional diamond frame. Stiffer and often lighter.
- **Sport:** Aggressive geometry for speed and trail riding.

## What to look for in the spec sheet

| Spec | Why it matters |
|------|---------------|
| Torque (Nm) | Higher torque = better hill climbing. 40–60 Nm is solid for commuting. |
| Battery (Ah/Wh) | Bigger battery = longer range. 10+ Ah is the minimum for useful range. |
| Weight (lbs) | Matters if you carry it upstairs or load it on a rack. Most e-bikes are 45–70 lbs. |
| Brakes | Hydraulic disc brakes are strongly preferred. Mechanical disc brakes are adequate on budget bikes. |
| Gears | More gears help on varied terrain. 7-speed is fine for flat; 8–10 speed for hills. |

## Our recommendation

Don't overthink it. The best e-bike is the one that matches your actual riding, not the one with the most impressive spec sheet.

Use our [Find My E-Bike quiz](/e-bikes/quiz) to get a personalized top-3 in 60 seconds, or [browse all e-bikes](/e-bikes/overzicht) with filters.
`,
  },
  {
    slug: 'ebike-classes-explained',
    title: 'E-Bike Classes Explained: Class 1 vs. Class 2 vs. Class 3',
    description: 'What do e-bike classes mean, where can you ride each one, and which class is right for you? A clear, no-jargon breakdown.',
    category: 'Guides',
    publishedAt: '2026-05-18',
    readingTime: 7,
    coverAlt: 'Three electric bikes parked side by side representing different classes',
    relatedSlugs: ['how-to-choose-an-electric-bike', 'best-ebikes-for-commuting-2026'],
    content: `
If you've shopped for an e-bike in the US, you've seen "Class 1," "Class 2," and "Class 3" labels. These aren't marketing gimmicks. They're legal categories that determine how fast the motor assists you and where you're allowed to ride.

## The three classes at a glance

| | Class 1 | Class 2 | Class 3 |
|---|---------|---------|---------|
| **Assist type** | Pedal-assist only | Pedal-assist + throttle | Pedal-assist only |
| **Max assisted speed** | 20 mph | 20 mph | 28 mph |
| **Bike paths** | Usually allowed | Usually allowed | Often restricted |
| **Best for** | Recreation, bike paths | Casual riders, stop-and-go | Fast commuters |

## Class 1: the universal pass

Class 1 e-bikes only provide motor assistance when you pedal, and the motor cuts out at 20 mph. They're accepted virtually everywhere regular bikes are allowed: bike lanes, multi-use paths, national parks (where e-bikes are permitted), and roads.

**Choose Class 1 if:** you ride bike paths frequently, want the simplest legal situation, or prefer a natural pedaling feel.

## Class 2: the throttle option

Class 2 adds a thumb or twist throttle, letting you ride without pedaling up to 20 mph. The pedal-assist also works just like Class 1. Most jurisdictions treat Class 2 the same as Class 1, though some bike path systems restrict throttle use.

**Choose Class 2 if:** you want a throttle for starting from stops, climbing short hills, or riding when you're tired. It's popular with commuters and older riders.

## Class 3: speed for commuters

Class 3 e-bikes assist up to 28 mph with pedal-assist only (no throttle in most states). The extra speed is a real advantage on longer commutes. You keep up with traffic and arrive faster.

The downside: Class 3 bikes are restricted from many multi-use paths and bike trails. You're generally limited to roads and bike lanes.

**Choose Class 3 if:** your primary use is commuting on roads and you want to maximize speed. Check your local trail rules first.

## State-by-state: it varies

Most US states follow the three-class system, but enforcement and path access rules differ. A few tips:

- **National parks** increasingly allow Class 1 (and sometimes Class 2) where regular bikes are permitted.
- **City bike-share paths** often restrict Class 3.
- **Private trails** set their own rules regardless of state law.

When in doubt, check your local municipality's e-bike ordinance or ask at a nearby bike shop.

## Which class should you pick?

If you're still unsure, our [Find My E-Bike quiz](/e-bikes/quiz) factors in your riding style and routes to recommend the right class. Or compare [all Class 3 e-bikes](/best/class-3-ebikes) if speed is your priority.
`,
  },
  {
    slug: 'ebike-battery-range-guide',
    title: 'E-Bike Battery Range: What to Really Expect (And How to Maximize It)',
    description: 'Manufacturer range claims are optimistic. Here\'s what actually affects your e-bike range and how to get the most miles per charge.',
    category: 'Guides',
    publishedAt: '2026-05-22',
    readingTime: 8,
    coverAlt: 'Close-up of an e-bike battery being removed from the frame',
    relatedSlugs: ['how-to-choose-an-electric-bike', 'ebike-maintenance-tips'],
    content: `
The number-one question every e-bike buyer asks is "how far can I ride on a single charge?" And the number-one frustration is that the manufacturer's answer is almost always too optimistic.

Here's the real story on e-bike range.

## Why manufacturer range claims are inflated

When a brand says "60 miles of range," they typically tested with:
- A lightweight rider (around 150 lbs)
- The lowest assist level
- Flat terrain with no wind
- Moderate speed (12–15 mph)

In the real world, most riders use medium-to-high assist, ride on varied terrain, and weigh more than 150 lbs. That's why we publish **practical range** for every bike: our estimate of what you'll actually get under normal conditions.

## The six factors that determine your range

### 1. Assist level
This is the biggest variable. Eco/low mode can double your range compared to turbo/high mode. If range matters, ride in a lower assist level on flat sections and save the power for hills.

### 2. Terrain
Climbing a hill at full power can drain 3–5x more energy per mile than cruising on flat ground. If your commute has significant elevation, budget for 30–40% less range.

### 3. Rider weight
Every extra 20 lbs of rider + cargo weight reduces range by roughly 5–8%. This is one reason the manufacturer's test conditions are unrealistic.

### 4. Speed
Air resistance increases exponentially with speed. Riding at 20 mph uses significantly more energy than riding at 15 mph, even on flat ground.

### 5. Temperature
Lithium batteries lose capacity in cold weather. Expect 10–20% less range below 40°F (5°C). Store and charge your battery indoors during winter.

### 6. Tire pressure and type
Under-inflated tires create more rolling resistance, reducing range. Fat tires (4"+) are inherently less efficient than standard tires. Great for comfort and traction, but they cost range.

## How to read battery specs

Two numbers matter:

- **Amp-hours (Ah):** Think of this as the "size of the fuel tank." Higher Ah = more capacity. Most e-bikes range from 10 Ah to 20 Ah.
- **Watt-hours (Wh):** This is Ah × voltage. A 48V 14Ah battery = 672 Wh. Watt-hours is the most accurate way to compare batteries across different voltages.

**Rule of thumb:** Expect roughly 1 mile per 15–20 Wh under normal riding conditions.

## Tips to maximize your range

1. **Start in eco mode** and only boost on hills or headwinds.
2. **Keep your tires inflated** to the recommended pressure.
3. **Pedal actively.** The motor supplements your effort, so more pedaling = less battery drain.
4. **Plan your route** to avoid unnecessary hills.
5. **Charge between 20% and 80%** for daily use to extend long-term battery life.

## Bottom line

Don't buy an e-bike based on the marketing range. Look at battery capacity (Wh), check our practical range estimates, and think about your actual riding conditions.

Need help picking a bike with enough range? Our [Find My E-Bike quiz](/e-bikes/quiz) asks about your typical distance and recommends bikes that can handle it.
`,
  },
  {
    slug: 'best-ebikes-for-commuting-2026',
    title: 'Best E-Bikes for Commuting in 2026: What Actually Matters',
    description: 'What makes a great commuter e-bike? We break down the features that matter for daily riding, and the ones that don\'t.',
    category: 'Buying Advice',
    publishedAt: '2026-05-25',
    readingTime: 9,
    coverAlt: 'Commuter riding an electric bike through a city bike lane',
    relatedSlugs: ['ebike-classes-explained', 'how-to-choose-an-electric-bike'],
    content: `
A commuter e-bike has one job: get you to work and back, reliably, comfortably, and without showing up drenched in sweat. But "commuter e-bike" means different things depending on your commute.

Here's how to think about it.

## The three commuter profiles

### The short commuter (under 5 miles)
You don't need a huge battery or blazing speed. Prioritize **comfort, weight, and ease of storage**. A folding e-bike might be ideal if you combine biking with public transit or have limited parking.

### The medium commuter (5–15 miles)
This is where most commuters land. You want **reliable range, decent speed (Class 2 or 3), integrated lights, fenders, and a rack**. A rear hub motor with 10+ Ah battery handles this easily.

### The long commuter (15+ miles)
Range becomes critical. Look for **14+ Ah batteries (or dual battery options), Class 3 speed to keep your ride time reasonable, and a comfortable riding position** since you'll be in the saddle a while.

## Features that matter for commuting

### Integrated lights
Non-negotiable. Built-in front and rear lights powered by the main battery are far more reliable than clip-on lights you'll forget to charge.

### Fenders
Unless you never ride in rain (lucky you), full-coverage fenders keep road spray off your clothes and drivetrain.

### Rack and cargo capacity
Even if you don't haul groceries, a rear rack for a pannier bag makes carrying a laptop, change of clothes, or lunch effortless.

### Puncture-resistant tires
A flat tire on your commute ruins your morning. Look for bikes with puncture-resistant tires or plan to upgrade.

### Hydraulic disc brakes
In wet conditions and when riding at speed, hydraulic discs provide dramatically better stopping power than mechanical brakes. For daily commuting, this is a safety feature, not a luxury.

## Features that matter less than you think

- **Suspension:** On paved roads, a suspension fork adds weight and maintenance for minimal benefit. Save it for trail riding.
- **Top speed:** The difference between 20 mph (Class 1/2) and 28 mph (Class 3) matters less on a 5-mile commute than on a 15-mile one.
- **Carbon frame:** For commuting, aluminum is lighter on your wallet with negligible real-world difference in ride quality.

## Our top commuter picks

We rank the [best commuter e-bikes](/best/commuter-ebikes) using our scoring model that weighs range, comfort, build quality, and value. The list updates as we add new bikes.

If your commute has specific constraints (budget, hills, storage), take our [Find My E-Bike quiz](/e-bikes/quiz) for a personalized recommendation.
`,
  },
  {
    slug: 'ebike-maintenance-tips',
    title: '7 E-Bike Maintenance Tips That Actually Extend Its Life',
    description: 'Keep your electric bike running smoothly with these essential maintenance habits. Most take under 5 minutes.',
    category: 'Tips',
    publishedAt: '2026-05-28',
    readingTime: 6,
    coverAlt: 'Person cleaning an electric bike chain with a brush',
    relatedSlugs: ['ebike-battery-range-guide', 'how-to-choose-an-electric-bike'],
    content: `
An e-bike is a bigger investment than a regular bicycle, but the maintenance isn't much harder. These seven habits will keep your e-bike running well for years.

## 1. Keep the chain clean and lubed

A dirty chain wears out your drivetrain faster, and drivetrain replacements are expensive. Wipe the chain with a rag every few rides and apply chain lube every 100–200 miles (or after riding in rain).

**Pro tip:** Use wet lube in rainy conditions and dry lube in dry weather. Dry lube attracts less dirt.

## 2. Check tire pressure weekly

Under-inflated tires reduce range, make pedaling harder, and increase the risk of pinch flats. Check pressure with a gauge (not just by squeezing) and inflate to the PSI listed on the tire sidewall.

## 3. Charge your battery smart

Lithium-ion batteries last longest when you:
- **Avoid storing at 0% or 100%.** Aim for 20-80% for daily use.
- **Charge at room temperature.** Don't charge a frozen battery.
- **Use the original charger.** Third-party chargers can damage cells.

If storing the bike for more than a month, leave the battery at around 50% and check it monthly.

## 4. Inspect brake pads every month

E-bikes are heavier and faster than regular bikes, so brake pads wear faster. Check pad thickness monthly. If they're thinner than 1mm, replace them. Hydraulic brake fluid should be bled once a year or when the lever feels spongy.

## 5. Keep bolts tight (but not too tight)

Vibration loosens bolts over time. Every few weeks, check:
- Handlebar stem bolts
- Seat post clamp
- Axle nuts or thru-axle
- Rack and fender mounts

Use a torque wrench if your bike has carbon components. Over-tightening cracks carbon.

## 6. Clean the bike (carefully)

Wash your e-bike with a damp cloth or low-pressure hose. **Never use a pressure washer.** High-pressure water forces its way into sealed bearings, the motor, and electrical connections.

Remove the battery before washing and make sure all ports and connectors are dry before reinstalling.

## 7. Get an annual professional tune-up

Even with good home maintenance, have a bike shop do a full tune-up once a year. They'll check spoke tension, wheel trueness, headset and bottom bracket bearings, and the electrical system. These are things that are hard to inspect at home.

## When to worry

Take your e-bike to a shop immediately if:
- The motor makes unusual grinding or clicking sounds
- The battery won't hold a charge or takes much longer to charge
- Brakes feel spongy or don't stop the bike effectively
- You notice play (wobbling) in the wheels or headset

Catching problems early is always cheaper than fixing them late.

Regular maintenance keeps your ride safe and your e-bike's resale value high. A well-maintained battery can last 500 to 1,000+ charge cycles, which means potentially 5+ years of riding.
`,
  },
];

export function getAllPosts(): BlogPost[] {
  return POSTS.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  if (!post.relatedSlugs) return [];
  return post.relatedSlugs
    .map((s) => POSTS.find((p) => p.slug === s))
    .filter((p): p is BlogPost => !!p);
}

export function getAllSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}
