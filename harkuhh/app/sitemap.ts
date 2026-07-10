import type { MetadataRoute } from 'next';
import { getAllBikes } from '@/lib/ebike-data';
import { getAllPosts } from '@/lib/blog-data';
import { getAllStateSlugs } from '@/lib/state-data';

const SITE_URL = 'https://bestbikeforme.com';

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
  'step-through-ebikes',
  'off-road-ebikes',
];

// Must match app/vs/[slug]/page.tsx's MATCHUPS exactly -- both sides need to be
// real catalog brands or the page 404s while still being listed in the sitemap.
const VS_MATCHUPS = [
  'engwe-vs-eunorau',
  'duotts-vs-engwe',
  'eunorau-vs-samebike',
  'vtuvia-vs-dyu',
  'walfisk-vs-engwe',
  'engwe-n1-pro-vs-duotts-s26',
  'samebike-rs-a01-pro-vs-samebike-rs-a01-men',
  'duotts-duotts-c29-k-vs-eunorau-meta-24-1',
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
    { url: `${SITE_URL}/best-ebikes`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
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

  // Echte publicatie/update-datums: Google vertrouwt lastmod alleen als die
  // niet bij elke build verspringt, en pikt nieuwe posts dan sneller op.
  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
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
