import type { MetadataRoute } from 'next';
import { getAllBikes } from '@/lib/ebike-data';
import { getAllSlugs } from '@/lib/blog-data';
import { getAllStateSlugs } from '@/lib/state-data';

const SITE_URL = 'https://www.bestbikeforme.com';

const BEST_CATEGORIES = [
  'ebikes-under-1000',
  'ebikes-under-1500',
  'commuter-ebikes',
  'folding-ebikes',
  'cargo-ebikes',
  'class-3-ebikes',
  'ebikes-for-seniors',
  'fat-tire-ebikes',
  'long-range-ebikes',
  'ebikes-under-2000',
];

const VS_MATCHUPS = [
  'aventon-vs-rad-power-bikes',
  'lectric-vs-rad-power-bikes',
  'velotric-vs-aventon',
  'ride1up-vs-aventon',
  'himiway-vs-heybike',
  'lectric-vs-aventon',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/e-bikes`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/e-bikes/overzicht`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/e-bikes/vergelijk`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/stores`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/e-bikes/quiz`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/how-we-test`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/affiliate-disclosure`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const bestRoutes: MetadataRoute.Sitemap = BEST_CATEGORIES.map((c) => ({
    url: `${SITE_URL}/best/${c}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const vsRoutes: MetadataRoute.Sitemap = VS_MATCHUPS.map((m) => ({
    url: `${SITE_URL}/vs/${m}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  let bikeRoutes: MetadataRoute.Sitemap = [];
  try {
    const bikes = await getAllBikes();
    bikeRoutes = bikes.map((b) => ({
      url: `${SITE_URL}/e-bikes/${b.brand.toLowerCase().replace(/\s+/g, '-')}/${b.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch {
    // DB unavailable at build time — static routes still ship
  }

  const blogRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const stateRoutes: MetadataRoute.Sitemap = getAllStateSlugs().map((slug) => ({
    url: `${SITE_URL}/best-ebikes/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...bestRoutes, ...vsRoutes, ...blogRoutes, ...stateRoutes, ...bikeRoutes];
}
