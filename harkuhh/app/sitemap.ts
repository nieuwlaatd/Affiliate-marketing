import type { MetadataRoute } from 'next';
import { getAllBikes } from '@/lib/ebike-data';

const SITE_URL = 'https://harkuhh.vercel.app';

const BEST_CATEGORIES = [
  'ebikes-under-1000',
  'ebikes-under-1500',
  'commuter-ebikes',
  'folding-ebikes',
  'cargo-ebikes',
  'class-3-ebikes',
  'ebikes-for-seniors',
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
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
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

  return [...staticRoutes, ...bestRoutes, ...vsRoutes, ...bikeRoutes];
}
