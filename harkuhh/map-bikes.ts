import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const sbLive = createClient(
  'https://sknxzqwxxweaxahhakhl.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbnh6cXd4eHdlYXhhaGhha2hsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY4ODk1MiwiZXhwIjoyMDg1MjY0OTUyfQ.TsSKh9aQaHH5lC68Alo_LK0P7BaV4IdGRP5RSemD02Y'
);

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function scrapeAllLinks() {
  const res = await fetch('https://engwe-bikes-eu.com/collections/all-ebikes');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const links = new Set<string>();
  $('a[href^="/products/"]').each((i, el) => {
    links.add($(el).attr('href')!);
  });
  
  return Array.from(links).map(l => 'https://engwe-bikes-eu.com' + l);
}

function matchModelToUrl(model: string, urls: string[]): string | null {
  const modelSlug = slugify(model);
  const possibleMatches = urls.filter(u => u.includes(modelSlug) || modelSlug.includes(u.split('/products/')[1]));
  
  if (possibleMatches.length > 0) {
    // Return longest match usually the actual product, avoid combo / bundle pages unless necessary
    const nonCombo = possibleMatches.filter(u => !u.includes('-combo') && !u.includes('-bundle'));
    return nonCombo.length > 0 ? nonCombo[0] : possibleMatches[0];
  }

  // Backup logic for tricky ones (e.g., M1, T14)
  const exact = urls.find(u => u.endsWith(`/${modelSlug}`) || u.endsWith(`/engwe-${modelSlug}`));
  if (exact) return exact;

  return null;
}

async function run() {
  console.log('1. Fetching all DB bikes...');
  const { data: bikes, error } = await sbLive.from('ebikes').select('*').eq('brand', 'ENGWE');
  if (error || !bikes) throw error;
  console.log(`Found ${bikes.length} bikes in DB.`);

  console.log('2. Fetching Engwe product links...');
  const urls = await scrapeAllLinks();
  
  console.log('3. Matching bikes to URLs...');
  const mappings = [];
  for (const bike of bikes) {
    const url = matchModelToUrl(bike.model, urls);
    mappings.push({ model: bike.model, url });
  }

  console.log('Mappings:', JSON.stringify(mappings, null, 2));
}

run().catch(console.error);
