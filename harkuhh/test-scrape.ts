import * as cheerio from 'cheerio';

async function run() {
  const res = await fetch('https://engwe-bikes-eu.com/products/engwe-e26');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const scripts: string[] = [];
  $('script[type="application/ld+json"]').each((i, el) => {
    scripts.push($(el).html()!);
  });
  
  const images = new Set<string>();
  let productDescription = '';

  scripts.forEach(s => {
      try {
          const json = JSON.parse(s);
          if (json['@type'] === 'Product') {
              console.log('Found Product Schema!');
              if (json.image) {
                if (Array.isArray(json.image)) json.image.forEach(i => images.add(i));
                else if (typeof json.image === 'string') images.add(json.image);
                else if (json.image.url) images.add(json.image.url);
              }
              if (json.description) productDescription = json.description;
          }
      } catch (e) {}
  });

  // If schema doesn't have images, let's grab meta tags
  if (images.size === 0) {
      $('meta[property="og:image"]').each((i, el) => {
          images.add($(el).attr('content')!);
      });
  }

  console.log('HD Images:', Array.from(images));
  console.log('Description:', productDescription.substring(0, 200));

  // Specs extraction
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

  console.log({ battery, range, motor, torque, weight });
}

run().catch(console.error);
