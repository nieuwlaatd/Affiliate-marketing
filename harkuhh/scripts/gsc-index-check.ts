/**
 * Google Search Console index coverage check for BestBikeForMe.
 *
 * Unlike gsc-insights.ts (Search Analytics — clicks/impressions), this hits the
 * URL Inspection API, which reflects Google's actual crawl/index decision for
 * each URL (the same data behind GSC's "Page indexing" report).
 *
 * Fetches every URL from the live sitemap.xml and inspects each one. Quota is
 * generous (2,000/day) but calls are throttled to be polite.
 *
 * Run:
 *   npx tsx scripts/gsc-index-check.ts                # all sitemap URLs
 *   npx tsx scripts/gsc-index-check.ts --limit 20      # just the first N (quick check)
 *   npx tsx scripts/gsc-index-check.ts --json          # raw JSON for further analysis
 *   npx tsx scripts/gsc-index-check.ts --url https://www.bestbikeforme.com/some-page
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inspectUrl, type UrlInspectionResult } from '../lib/gsc';

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
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // No .env.local
  }
}
loadEnv();

const SITE_URL = 'https://bestbikeforme.com';
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const limitIdx = args.indexOf('--limit');
const limit = limitIdx !== -1 && args[limitIdx + 1] ? parseInt(args[limitIdx + 1], 10) : undefined;
const urlIdx = args.indexOf('--url');
const singleUrl = urlIdx !== -1 ? args[urlIdx + 1] : undefined;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getSitemapUrls(): Promise<string[]> {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap.xml: ${res.status}`);
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((m) => m[1].trim());
}

async function main() {
  const urls = singleUrl ? [singleUrl] : await getSitemapUrls();
  const toCheck = limit ? urls.slice(0, limit) : urls;

  console.error(`Site: ${SITE_URL}`);
  console.error(`Inspecting ${toCheck.length} of ${urls.length} sitemap URLs...\n`);

  const results: (UrlInspectionResult & { error?: string })[] = [];
  for (let i = 0; i < toCheck.length; i++) {
    const url = toCheck[i];
    try {
      const r = await inspectUrl(url);
      results.push(r);
      console.error(`[${i + 1}/${toCheck.length}] ${r.coverageState ?? 'UNKNOWN'} — ${url}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ inspectionUrl: url, error: msg });
      console.error(`[${i + 1}/${toCheck.length}] ERROR (${msg}) — ${url}`);
    }
    await sleep(300);
  }

  if (asJson) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  // --- Summary by coverage state ---
  const byState = new Map<string, number>();
  for (const r of results) {
    const key = r.error ? `ERROR: ${r.error}` : (r.coverageState ?? 'UNKNOWN');
    byState.set(key, (byState.get(key) ?? 0) + 1);
  }
  console.log('\n=== COVERAGE STATE SUMMARY ===');
  for (const [state, count] of [...byState.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(4)}  ${state}`);
  }

  // --- Not indexed: the pages worth investigating ---
  const notIndexed = results.filter(
    (r) => !r.error && r.coverageState && !r.coverageState.toLowerCase().includes('submitted and indexed') && !r.coverageState.toLowerCase().includes('indexed, though')
  );
  console.log(`\n=== NOT INDEXED (${notIndexed.length} of ${results.length}) ===\n`);
  for (const r of notIndexed) {
    console.log(`${r.inspectionUrl}`);
    console.log(`  coverageState: ${r.coverageState}`);
    console.log(`  verdict: ${r.verdict}   robotsTxtState: ${r.robotsTxtState}   pageFetchState: ${r.pageFetchState}`);
    if (r.userCanonical && r.googleCanonical && r.userCanonical !== r.googleCanonical) {
      console.log(`  ⚠ canonical mismatch — user: ${r.userCanonical}  google-picked: ${r.googleCanonical}`);
    }
    if (r.lastCrawlTime) console.log(`  lastCrawlTime: ${r.lastCrawlTime}`);
    console.log('');
  }

  if (results.some((r) => r.error)) {
    console.log('=== ERRORS ===');
    for (const r of results.filter((r) => r.error)) {
      console.log(`  ${r.inspectionUrl}: ${r.error}`);
    }
  }
}

main().catch((err) => {
  console.error('\ngsc-index-check failed:', err.message || err);
  process.exit(1);
});
