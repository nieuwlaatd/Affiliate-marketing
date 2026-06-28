/**
 * PostHog behavioral insights for BestBikeForMe.
 *
 * Companion to scripts/gsc-insights.ts. Where GSC shows search *demand* (what
 * people search before arriving), PostHog shows on-site *behavior* (which pages
 * actually get traffic, where visitors come from, and where they drop off).
 * The weekly/5-hourly routines blend both.
 *
 * Queries the PostHog HogQL API with a personal API key (read scope).
 *
 * Run:
 *   npx tsx scripts/posthog-insights.ts              # last 28 days
 *   npx tsx scripts/posthog-insights.ts --days 7
 *   npx tsx scripts/posthog-insights.ts --json       # raw rows
 *
 * Env (in .env.local):
 *   POSTHOG_PERSONAL_API_KEY   phx_... (personal API key, read scope)
 *   POSTHOG_PROJECT_ID         numeric project id (default 211721)
 *   POSTHOG_API_HOST           https://eu.posthog.com (EU) or https://us.posthog.com
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function loadEnv() {
  try {
    const content = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
    for (const line of content.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      const k = t.slice(0, eq).trim();
      let v = t.slice(eq + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    /* env may be set another way */
  }
}

loadEnv();

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const daysIdx = args.indexOf('--days');
const days = daysIdx !== -1 && args[daysIdx + 1] ? parseInt(args[daysIdx + 1], 10) : 28;

const KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const PROJECT = process.env.POSTHOG_PROJECT_ID || '211721';
const HOST = (process.env.POSTHOG_API_HOST || 'https://eu.posthog.com').replace(/\/$/, '');

async function hogql<T = Record<string, unknown>>(query: string): Promise<{ columns: string[]; results: T[] }> {
  const res = await fetch(`${HOST}/api/projects/${PROJECT}/query/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PostHog API ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = (await res.json()) as { columns?: string[]; results?: unknown[][] };
  const columns = data.columns ?? [];
  const results = (data.results ?? []).map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((c, i) => (obj[c] = row[i]));
    return obj as T;
  });
  return { columns, results };
}

function table(rows: string[][], headers: string[]): string {
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => (r[i] ?? '').length)));
  const fmt = (cells: string[]) => cells.map((c, i) => (c ?? '').padEnd(widths[i])).join('  ');
  return [fmt(headers), widths.map((w) => '-'.repeat(w)).join('  '), ...rows.map(fmt)].join('\n');
}

async function main() {
  if (!KEY) {
    console.error('Missing POSTHOG_PERSONAL_API_KEY in .env.local');
    process.exit(1);
  }
  const since = `now() - INTERVAL ${days} DAY`;

  const [totals, topPages, referrers, entry] = await Promise.all([
    hogql<{ views: number; visitors: number }>(
      `SELECT count() AS views, uniq(person_id) AS visitors FROM events WHERE event = '$pageview' AND timestamp > ${since}`
    ),
    hogql<{ path: string; views: number; visitors: number }>(
      `SELECT properties.$pathname AS path, count() AS views, uniq(person_id) AS visitors
       FROM events WHERE event = '$pageview' AND timestamp > ${since}
       GROUP BY path ORDER BY views DESC LIMIT 20`
    ),
    hogql<{ ref: string; views: number }>(
      `SELECT coalesce(nullIf(properties.$referring_domain, ''), '(direct)') AS ref, count() AS views
       FROM events WHERE event = '$pageview' AND timestamp > ${since}
       GROUP BY ref ORDER BY views DESC LIMIT 15`
    ),
    hogql<{ path: string; sessions: number }>(
      `SELECT properties.$pathname AS path, uniq(properties.$session_id) AS sessions
       FROM events WHERE event = '$pageview' AND timestamp > ${since}
       GROUP BY path ORDER BY sessions DESC LIMIT 15`
    ),
  ]);

  if (asJson) {
    console.log(JSON.stringify({ days, totals: totals.results[0], topPages: topPages.results, referrers: referrers.results, entry: entry.results }, null, 2));
    return;
  }

  const t = totals.results[0] || { views: 0, visitors: 0 };
  console.error(`Project: ${PROJECT}  Host: ${HOST}  Window: last ${days} days\n`);
  console.log('=== TOTALS ===');
  console.log(`Pageviews: ${t.views}   Unique visitors: ${t.visitors}\n`);

  if (Number(t.views) === 0) {
    console.log('No pageview data yet. PostHog was just enabled, so behavioral data');
    console.log('will accumulate over the coming days. Re-run once traffic arrives.');
    return;
  }

  console.log('=== TOP PAGES (by pageviews) ===');
  console.log(table(
    topPages.results.map((r) => [String(r.path ?? '(unknown)').slice(0, 50), String(r.views), String(r.visitors)]),
    ['Path', 'Views', 'Visitors']
  ));
  console.log('');

  console.log('=== TRAFFIC SOURCES (referring domain) ===');
  console.log(table(
    referrers.results.map((r) => [String(r.ref ?? '(direct)').slice(0, 40), String(r.views)]),
    ['Source', 'Views']
  ));
  console.log('');

  console.log('=== MOST-VISITED PAGES (by sessions) ===');
  console.log(table(
    entry.results.map((r) => [String(r.path ?? '(unknown)').slice(0, 50), String(r.sessions)]),
    ['Path', 'Sessions']
  ));
  console.log('');
}

main().catch((err) => {
  console.error('\nPostHog insights failed:', err.message || err);
  if (/401|403/.test(String(err.message || err))) {
    console.error('The personal API key may lack "query:read"/project read scope. Check it in PostHog > Settings > Personal API keys.');
  }
  process.exit(1);
});
