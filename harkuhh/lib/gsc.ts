/**
 * Google Search Console (GSC) integration.
 *
 * Server-to-server access via a Google Cloud **service account** (no browser
 * consent flow). Credentials are read from env vars so they work both locally
 * (.env.local) and on Vercel (project env vars):
 *
 *   GSC_CLIENT_EMAIL   service account email (xxx@yyy.iam.gserviceaccount.com)
 *   GSC_PRIVATE_KEY    service account private key (PEM, may contain \n escapes)
 *   GSC_SITE_URL       the verified property, e.g.
 *                        "sc-domain:bestbikeforme.com"        (Domain property)
 *                        "https://bestbikeforme.com/"          (URL-prefix property)
 *
 * Setup (one time, done by Dylan — see scripts/gsc-insights.ts header):
 *   1. Google Cloud > enable "Google Search Console API".
 *   2. Create a service account, add a JSON key.
 *   3. In Search Console > Settings > Users and permissions, add the service
 *      account email as a user (Restricted is enough for read access).
 */

import { JWT } from 'google-auth-library';

const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const API_BASE = 'https://searchconsole.googleapis.com/webmasters/v3';

export type SearchAnalyticsRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type QueryDimension = 'query' | 'page' | 'country' | 'device' | 'date' | 'searchAppearance';

export interface QueryOptions {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dimensions?: QueryDimension[];
  rowLimit?: number;
  startRow?: number;
  /** Restrict to a search type. Default 'web'. */
  type?: 'web' | 'image' | 'video' | 'news' | 'discover' | 'googleNews';
  /** Filter groups passed straight through to the API. */
  dimensionFilterGroups?: unknown[];
}

function getCredentials(): { clientEmail: string; privateKey: string; siteUrl: string } {
  const clientEmail = process.env.GSC_CLIENT_EMAIL;
  const rawKey = process.env.GSC_PRIVATE_KEY;
  const siteUrl = process.env.GSC_SITE_URL;

  if (!clientEmail || !rawKey || !siteUrl) {
    throw new Error(
      'Missing GSC env vars. Set GSC_CLIENT_EMAIL, GSC_PRIVATE_KEY and GSC_SITE_URL in .env.local'
    );
  }

  // Vercel/.env often store the key with literal "\n" — normalize to real newlines.
  const privateKey = rawKey.replace(/\\n/g, '\n');
  return { clientEmail, privateKey, siteUrl };
}

let cachedClient: JWT | null = null;

function getClient(): JWT {
  if (cachedClient) return cachedClient;
  const { clientEmail, privateKey } = getCredentials();
  cachedClient = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: [GSC_SCOPE],
  });
  return cachedClient;
}

/** The verified property identifier from env (sc-domain:... or a URL prefix). */
export function getSiteUrl(): string {
  return getCredentials().siteUrl;
}

/**
 * Run a Search Analytics query against the configured property.
 * Returns the rows sorted by clicks descending (GSC default).
 */
export async function querySearchAnalytics(opts: QueryOptions): Promise<SearchAnalyticsRow[]> {
  const client = getClient();
  const siteUrl = getSiteUrl();
  const endpoint = `${API_BASE}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;

  const body = {
    startDate: opts.startDate,
    endDate: opts.endDate,
    dimensions: opts.dimensions ?? ['query'],
    rowLimit: opts.rowLimit ?? 1000,
    startRow: opts.startRow ?? 0,
    type: opts.type ?? 'web',
    dataState: 'all',
    ...(opts.dimensionFilterGroups ? { dimensionFilterGroups: opts.dimensionFilterGroups } : {}),
  };

  const res = await client.request<{ rows?: SearchAnalyticsRow[] }>({
    url: endpoint,
    method: 'POST',
    data: body,
  });

  return res.data.rows ?? [];
}

/** List the properties (sites) the service account can access. */
export async function listSites(): Promise<{ siteUrl: string; permissionLevel: string }[]> {
  const client = getClient();
  const res = await client.request<{ siteEntry?: { siteUrl: string; permissionLevel: string }[] }>({
    url: `${API_BASE}/sites`,
    method: 'GET',
  });
  return res.data.siteEntry ?? [];
}
