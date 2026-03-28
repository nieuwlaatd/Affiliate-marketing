import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const sbLive = createClient(
  'https://sknxzqwxxweaxahhakhl.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbnh6cXd4eHdlYXhhaGhha2hsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY4ODk1MiwiZXhwIjoyMDg1MjY0OTUyfQ.TsSKh9aQaHH5lC68Alo_LK0P7BaV4IdGRP5RSemD02Y'
);

const MAPPINGS: Record<string, string> = {
  "Engine Pro 3.0 Boost": "https://engwe-bikes-eu.com/products/engine-pro-3-0-boost",
  "EP-2 3.0 Boost": "https://engwe-bikes-eu.com/products/ep-2-3-0-boost",
  "Engine Pro 2.0": "https://engwe-bikes-eu.com/products/engwe-engine-pro-2-0",
  "EP-2 Boost": "https://engwe-bikes-eu.com/products/ep-2-boost",
  "EP-2 Pro": "https://engwe-bikes-eu.com/products/ep-2-pro-upgraded-version-750w-folding-electric-mountain-bike",
  "M1": "https://engwe-bikes-eu.com/products/engwe-m1",
  "M20": "https://engwe-bikes-eu.com/products/m20",
  "L20 Boost": "https://engwe-bikes-eu.com/products/l20-boost",
  "L20": "https://engwe-bikes-eu.com/products/l20",
  "L20 3.0 Pro": "https://engwe-bikes-eu.com/products/l20-3-0-pro",
  "L20 3.0 Boost": "https://engwe-bikes-eu.com/products/l20-3-0-boost",
  "LE20": "https://engwe-bikes-eu.com/products/engwe-le20-international-version",
  "E26": "https://engwe-bikes-eu.com/products/engwe-e26",
  "X20/X24/X26": "https://engwe-bikes-eu.com/products/engwe-x26-x24-x20",
  "Engine X": "https://engwe-bikes-eu.com/products/engine-x-250w-high-performance-electric-bike",
  "P275 SE": "https://engwe-bikes-eu.com/products/engwe-p275se",
  "P275 Pro": "https://engwe-bikes-eu.com/products/p275-pro",
  "P275 ST": "https://engwe-bikes-eu.com/products/p275-st",
  "P20": "https://engwe-bikes-eu.com/products/engwe-p20",
  "N1 Air": "https://engwe-bikes-eu.com/products/engwe-n1-air",
  "N1 Pro": "https://engwe-bikes-eu.com/products/engwe-n1-pro",
  "T14": "https://engwe-bikes-eu.com/products/engwe-t14-folding-electric-bike"
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log('Fetching live bikes from DB...');
  const { data: bikes, error } = await sbLive.from('ebikes').select('*').eq('brand', 'ENGWE');
  if (error || !bikes) throw error;
  
  console.log(`Found ${bikes.length} bikes. Starting scrape...`);

  for (const bike of bikes) {
      const url = MAPPINGS[bike.model];
      if (!url) {
          console.warn(`No mapping found for ${bike.model}, skipping.`);
          continue;
      }
      
      console.log(`\nScraping ${bike.model} at ${url}`);
      try {
          const res = await fetch(url);
          const html = await res.text();
          const $ = cheerio.load(html);

          const images = new Set<string>();
          let productDescription = '';

          $('script[type="application/ld+json"]').each((i, el) => {
              try {
                  const json = JSON.parse($(el).html()!);
                  // Sometimes Shopify puts it in an array
                  const items = Array.isArray(json) ? json : [json];
                  for (const item of items) {
                      if (item['@type'] === 'Product') {
                          if (item.image) {
                              if (Array.isArray(item.image)) item.image.forEach((img: any) => images.add(typeof img === 'string' ? img : img.url || ''));
                              else if (typeof item.image === 'string') images.add(item.image);
                              else if (item.image.url) images.add(item.image.url);
                          }
                          if (item.description) productDescription = item.description;
                      }
                  }
              } catch(e) {}
          });

          // Fallback images
          if (images.size === 0) {
              $('meta[property="og:image"]').each((i, el) => {
                  images.add($(el).attr('content')!);
              });
          }

          const textContent = $('body').text();
          const extract = (regex: RegExp) => {
              const m = textContent.match(regex);
              return m ? Number(m[1].replace(/,/, '.')) : null;
          };

          const battery = extract(/(\d{1,2}(?:\.\d+)?)\s?[Aa]h/);
          const range = extract(/(\d{2,3})\s?(?:km|kilometers)\b/i);
          const motor = extract(/(\d{3,4})\s?[Ww]\b/);
          const torque = extract(/(\d{2,3})\s?(?:N[\.\s]?m)/i);
          const weight = extract(/([\d\.]+)\s?kg/i);
          const maxWeight = extract(/(?:max|payload).{0,20}?(\d{2,3})\s?kg/i);
          
          // Basic wheel size check if size is wrong
          let wheel_size = bike.wheel_size;
          const wheelMatch = textContent.match(/(20|24|26|27\.5|28|29)\s?(?:x|inch|\")/i);
          if (wheelMatch) {
              wheel_size = Number(wheelMatch[1]);
          }

          const updateData: any = {};
          if (battery) updateData.battery_capacity = battery;
          if (range) {
              updateData.range_practical = Math.floor(range * 0.75); // realistic assumption
              updateData.range_manufacturer = range;
          }
          if (motor) {
              // Engine power isn't directly a field, but torque is
          }
          if (torque) updateData.torque = torque;
          if (weight) updateData.weight = weight;
          if (maxWeight) updateData.max_weight = maxWeight;
          if (wheel_size) updateData.wheel_size = wheel_size;
          
          const imgsArr = Array.from(images).filter(i => i.startsWith('http') || i.startsWith('//')).map(i => i.startsWith('//') ? 'https:' + i : i);
          if (imgsArr.length > 0) {
              updateData.images = imgsArr;
          }

          if (productDescription) {
              updateData.description = productDescription.substring(0, 1000); // truncate if too long
          }

          console.log('Updating with:', updateData);
          const { error: updateError } = await sbLive.from('ebikes')
              .update(updateData)
              .eq('id', bike.id);

          if (updateError) {
              console.error('Failed to update:', updateError);
          } else {
              console.log('Success!');
          }
      } catch (e: any) {
          console.error('Error processing', bike.model, e.message);
      }
      
      await delay(1000); // Be respectful to the server
  }
}

run().catch(console.error);
