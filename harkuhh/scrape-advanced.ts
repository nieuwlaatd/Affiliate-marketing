import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';

// Configuration
const SUPABASE_URL = 'https://sknxzqwxxweaxahhakhl.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbnh6cXd4eHdlYXhhaGhha2hsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY4ODk1MiwiZXhwIjoyMDg1MjY0OTUyfQ.TsSKh9aQaHH5lC68Alo_LK0P7BaV4IdGRP5RSemD02Y';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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

function parseHeightToCm(str: string): { min: number; max: number } | null {
  // Example: "5.0 (ft) - 6.0 (ft)" or "152 - 183 cm"
  const cmMatch = str.match(/(\d{3})\s?-\s?(\d{3})\s?cm/);
  if (cmMatch) {
    return { min: parseInt(cmMatch[1]), max: parseInt(cmMatch[2]) };
  }
  
  const ftMatch = str.match(/(\d\.\d)\s?\(ft\)\s?-\s?(\d\.\d)\s?\(ft\)/);
  if (ftMatch) {
    return { 
      min: Math.round(parseFloat(ftMatch[1]) * 30.48), 
      max: Math.round(parseFloat(ftMatch[2]) * 30.48) 
    };
  }

  return null;
}

function parseDimension(str: string): number | null {
  // Matches "43.3 cm", "174.3 cm", "82-94cm"
  const m = str.match(/([\d\.]+)/);
  return m ? parseFloat(m[1]) : null;
}

async function scrapeDimensions() {
  console.log('Fetching ENGWE bikes...');
  const { data: bikes, error } = await supabase.from('ebikes').select('*').eq('brand', 'ENGWE');
  if (error || !bikes) throw error;

  for (const bike of bikes) {
    const url = MAPPINGS[bike.model];
    if (!url) continue;

    console.log(`Scraping ${bike.model}...`);
    try {
      const res = await fetch(url);
      const html = await res.text();
      const $ = cheerio.load(html);

      const updateData: any = {
        dimensions: {}
      };

      // Traverse all tables in the page (drawers are usually inside the body)
      $('table').each((_, table) => {
        $(table).find('tr').each((_, row) => {
          const cells = $(row).find('td');
          if (cells.length >= 2) {
            const label = $(cells[0]).text().trim().toLowerCase();
            const value = $(cells[1]).text().trim();

            if (label.includes('rider height')) {
              const range = parseHeightToCm(value);
              if (range) {
                updateData.min_rider_height = range.min;
                updateData.max_rider_height = range.max;
              }
            } else if (label.includes('standover')) {
              updateData.dimensions.standoverHeight = parseDimension(value);
            } else if (label.includes('reach')) {
              updateData.dimensions.reach = parseDimension(value);
            } else if (label.includes('total length')) {
              updateData.dimensions.totalLength = parseDimension(value);
            } else if (label.includes('saddle height')) {
              const m = value.match(/(\d+)\s?-\s?(\d+)/);
              if (m) {
                updateData.dimensions.saddleHeightRange = [parseInt(m[1]), parseInt(m[2])];
              } else {
                updateData.dimensions.saddleHeightRange = [parseDimension(value) || 0, parseDimension(value) || 0];
              }
            } else if (label.includes('handlebar height')) {
              updateData.dimensions.handlebarHeight = parseDimension(value);
            } else if (label.includes('fold')) {
              updateData.dimensions.foldedSize = value;
            }
          }
        });
      });

      // Special case for frame sizes (Engwe often lists them in available options or one size)
      // If we found min/max height, we can estimate a frame size if not provided
      if (updateData.min_rider_height) {
        // Find nearest standard frame size for mapping
        const avgHeight = (updateData.min_rider_height + (updateData.max_rider_height || updateData.min_rider_height)) / 2;
        const estFrame = Math.round(avgHeight * 0.31);
        const commonSizes = [47, 50, 53, 57, 61];
        const closest = commonSizes.reduce((prev, curr) => 
          Math.abs(curr - estFrame) < Math.abs(prev - estFrame) ? curr : prev
        );
        updateData.available_frame_sizes = [closest];
      }

      console.log(`Update ${bike.model}:`, updateData);
      
      const { error: updateError } = await supabase
        .from('ebikes')
        .update(updateData)
        .eq('id', bike.id);

      if (updateError) console.error(`Error updating ${bike.model}:`, updateError);
      else console.log(`Success for ${bike.model}`);

    } catch (e: any) {
      console.error(`Failed ${bike.model}:`, e.message);
    }
    
    await new Promise(r => setTimeout(r, 1000));
  }
}

scrapeDimensions().catch(console.error);
