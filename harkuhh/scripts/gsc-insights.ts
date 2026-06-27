/**
 * Google Search Console insights for BestBikeForMe.
 *
 * Pulls Search Analytics data and surfaces actionable SEO opportunities:
 *   - Top queries / pages by clicks and impressions
 *   - "Striking distance" queries (position 5-20, high impressions, low CTR)
 *     — these are the fastest wins: small ranking gains = big traffic gains
 *   - Pages with many impressions but few clicks (title/meta to improve)
 *
 * Run:
 *   npx tsx scripts/gsc-insights.ts                 # last 28 days
 *   npx tsx scripts/gsc-insights.ts --days 90       # custom window
 *   npx tsx scripts/gsc-insights.ts --json          # raw JSON for further analysis
 *   npx tsx scripts/gsc-insights.ts --sites         # list accessible properties
 *
 * SETUP (one time):
 *   1. Go to https://console.cloud.google.com → create/select a project.
 *   2. APIs & Services → enable "Google Search Console API".
 *   3. APIs & Services → Credentials → Create credentials → Service account.
 *      Give it a name; no roles needed. Open it → Keys → Add key → JSON. Download.
 *   4. Open https://search.google.com/search-console → your property →
 *      Settings → Users and permissions → Add user → paste the service account
 *      email (client_email from the JSON), permission "Restricted".
 *   5. Put these in harkuhh/.env.local (values from the downloaded JSON):
 *        GSC_CLIENT_EMAIL=...@...iam.gserviceaccount.com
 *        GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *        GSC_SITE_URL=sc-domain:bestbikeforme.com
 *      (GSC_PRIVATE_KEY is the JSON "private_key" field verbatim, in quotes.)
 *   6. Run `npx tsx scripts/gsc-insights.ts --sites` to confirm access.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { querySearchAnalytics, listSites, getSiteUrl, type SearchAnalyticsRow } from '../lib/gsc';

// --- Load .env.local (standalone scripts don't get Next's env loading) ---
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const content = readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      // Strip surrounding quotes (private key is usually quoted).
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // No .env.local — env may already be set another way.
  }
}

loadEnv();

// --- Args ---
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const showSites = args.includes('--sites');
const daysIdx = args.indexOf('--days');
const days = daysIdx !== -1 && args[daysIdx + 1] ? parseInt(args[daysIdx + 1], 10) : 28;

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

// GSC data lags ~2-3 days; end the window a few days back for complete data.
const endDate = isoDaysAgo(3);
const startDate = isoDaysAgo(3 + days);

function pct(n: number): string {
  return (n * 100).toFixed(1) + '%';
}

function table(rows: string[][], headers: string[]): string {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] ?? '').length))
  );
  const fmt = (cells: string[]) =>
    cells.map((c, i) => c.padEnd(widths[i])).join('  ');
  const sep = widths.map((w) => '-'.repeat(w)).join('  ');
  return [fmt(headers), sep, ...rows.map(fmt)].join('\n');
}

async function main() {
  if (showSites) {
    const sites = await listSites();
    console.log('\nProperties accessible to this service account:\n');
    if (sites.length === 0) {
      console.log('  (none — did you add the service account email as a user in Search Console?)');
    }
    for (const s of sites) {
      console.log(`  ${s.permissionLevel.padEnd(12)} ${s.siteUrl}`);
    }
    console.log('');
    return;
  }

  console.error(`Property:  ${getSiteUrl()}`);
  console.error(`Window:    ${startDate} → ${endDate} (${days} days)\n`);

  const [byQuery, byPage] = await Promise.all([
    querySearchAnalytics({ startDate, endDate, dimensions: ['query'], rowLimit: 1000 }),
    querySearchAnalytics({ startDate, endDate, dimensions: ['page'], rowLimit: 1000 }),
  ]);

  if (asJson) {
    console.log(JSON.stringify({ startDate, endDate, byQuery, byPage }, null, 2));
    return;
  }

  if (byQuery.length === 0 && byPage.length === 0) {
    console.log('No data returned for this window. Either the property has no traffic yet,');
    console.log('or the service account lacks access. Run with --sites to verify access.');
    return;
  }

  // --- Totals ---
  const totalClicks = byQuery.reduce((s, r) => s + r.clicks, 0);
  const totalImpr = byQuery.reduce((s, r) => s + r.impressions, 0);
  console.log('=== TOTALS ===');
  console.log(`Clicks: ${totalClicks}   Impressions: ${totalImpr}   ` +
    `CTR: ${totalImpr ? pct(totalClicks / totalImpr) : '0%'}\n`);

  // --- Top queries ---
  console.log('=== TOP QUERIES (by clicks) ===');
  console.log(table(
    byQuery.slice(0, 15).map((r) => [
      r.keys[0].slice(0, 45),
      String(r.clicks),
      String(r.impressions),
      pct(r.ctr),
      r.position.toFixed(1),
    ]),
    ['Query', 'Clicks', 'Impr', 'CTR', 'Pos'],
  ));
  console.log('');

  // --- Top pages ---
  console.log('=== TOP PAGES (by clicks) ===');
  console.log(table(
    byPage.slice(0, 15).map((r) => [
      r.keys[0].replace(/^https?:\/\/[^/]+/, '').slice(0, 50) || '/',
      String(r.clicks),
      String(r.impressions),
      pct(r.ctr),
      r.position.toFixed(1),
    ]),
    ['Page', 'Clicks', 'Impr', 'CTR', 'Pos'],
  ));
  console.log('');

  // --- Striking distance: position 5-20, decent impressions ---
  const striking = byQuery
    .filter((r) => r.position >= 5 && r.position <= 20 && r.impressions >= 30)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20);
  console.log('=== STRIKING DISTANCE (pos 5-20, fastest ranking wins) ===');
  console.log('These rank on page 1-2 already. Strengthening the matching page can');
  console.log('push them up and capture a lot more clicks.\n');
  console.log(table(
    striking.map((r) => [
      r.keys[0].slice(0, 45),
      String(r.impressions),
      String(r.clicks),
      r.position.toFixed(1),
    ]),
    ['Query', 'Impr', 'Clicks', 'Pos'],
  ));
  console.log('');

  // --- Low CTR pages: lots of impressions, weak click-through ---
  const lowCtr = byPage
    .filter((r) => r.impressions >= 100 && r.ctr < 0.02 && r.position <= 15)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15);
  console.log('=== HIGH IMPRESSIONS, LOW CTR (improve title/meta) ===');
  console.log('Ranking but not getting clicked — usually a weak title tag or meta');
  console.log('description. Rewriting these is a cheap, high-leverage fix.\n');
  console.log(table(
    lowCtr.map((r) => [
      r.keys[0].replace(/^https?:\/\/[^/]+/, '').slice(0, 50) || '/',
      String(r.impressions),
      String(r.clicks),
      pct(r.ctr),
      r.position.toFixed(1),
    ]),
    ['Page', 'Impr', 'Clicks', 'CTR', 'Pos'],
  ));
  console.log('');
}

main().catch((err) => {
  console.error('\nGSC insights failed:', err.message || err);
  if (String(err.message || err).includes('Missing GSC env vars')) {
    console.error('\nSee the SETUP block at the top of this file.');
  }
  process.exit(1);
});
