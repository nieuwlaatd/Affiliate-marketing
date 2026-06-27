/**
 * Central editorial identity, reused across the About page, the How We Test
 * page, article bylines and Article/Organization schema. Keeping this in one
 * place makes the site's attribution consistent.
 *
 * This is an independent, AI-maintained project. That fact is disclosed only on
 * the /about page; everywhere else content is attributed to the brand as
 * publisher (AUTHOR.name below), with no human-team claim and no AI mention.
 * Do not add the AI disclosure to other pages, bylines or schema.
 */

export const SITE = {
  name: 'Best Bike For Me',
  url: 'https://www.bestbikeforme.com',
  foundedYear: 2026,
  contactEmail: 'hello@bestbikeforme.com',
} as const;

export const AUTHOR = {
  name: 'BestBikeForMe',
  url: '/about',
  bio: 'BestBikeForMe analyzes e-bike specifications, owner feedback and real-world range data to rank electric bikes independently. We are reader-supported and never accept payment for a higher ranking.',
} as const;

/** The six scoring axes shown on bike pages, plus how each is judged. */
export const SCORING_AXES: { key: string; label: string; what: string }[] = [
  {
    key: 'value',
    label: 'Value',
    what: 'Price measured against everything else the bike delivers, compared to direct rivals at the same price. A cheap bike with weak specs does not automatically score well, and an expensive bike can still earn a high value score if it justifies the premium.',
  },
  {
    key: 'range',
    label: 'Range',
    what: 'Based on practical, real-world range rather than the optimistic manufacturer figure. We estimate the range you will actually see on moderate assist, so a 9+ means a genuine 60+ miles, not a lab number.',
  },
  {
    key: 'power',
    label: 'Power',
    what: 'Driven by motor torque and type. Roughly: 80+ Nm scores 9 and up, 60+ Nm scores 7 and up, 40+ Nm scores 5 and up. Torque is what matters most for hills and hauling, so it is weighted above top speed.',
  },
  {
    key: 'comfort',
    label: 'Comfort',
    what: 'Suspension, frame style, tire width, saddle and riding position. A full-suspension fat-tire bike with an upright posture scores higher than a rigid commuter on narrow tires.',
  },
  {
    key: 'build',
    label: 'Build quality',
    what: 'Component brands (brakes, drivetrain, motor), frame material and warranty length. Named hydraulic brakes and a longer warranty raise the score; unbranded parts lower it.',
  },
  {
    key: 'versatility',
    label: 'Versatility',
    what: 'How many jobs the bike does well: commuting, recreation, off-road, cargo and sport. A bike that genuinely covers several use cases scores higher than a one-trick model.',
  },
];
