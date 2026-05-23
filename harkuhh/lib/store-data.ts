export interface Store {
  id: string;
  name: string;
  brands: string[];
  address: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  zip: string;
  phone: string;
  website: string;
  lat: number;
  lng: number;
  types: ('sales' | 'service' | 'test-ride' | 'rental')[];
}

export const STORES: Store[] = [
  // ──────────────── USA ────────────────

  {
    id: 'eunorau-hq',
    name: 'Eunorau HQ & Showroom',
    brands: ['Eunorau'],
    address: '10725 Ellis Ave, Unit B & C',
    city: 'Fountain Valley',
    state: 'California',
    country: 'United States',
    countryCode: 'US',
    zip: '92708',
    phone: '(714) 627-4818',
    website: 'https://eunorau-ebike.com',
    lat: 33.7092,
    lng: -117.9537,
    types: ['sales', 'test-ride', 'service'],
  },
  {
    id: 'eunorau-lv',
    name: 'Eunorau Las Vegas Showroom',
    brands: ['Eunorau'],
    address: '3111 S Valley View Blvd, Ste R101',
    city: 'Las Vegas',
    state: 'Nevada',
    country: 'United States',
    countryCode: 'US',
    zip: '89102',
    phone: '(888) 291-3151',
    website: 'https://eunorau-ebike.com',
    lat: 36.1455,
    lng: -115.1871,
    types: ['sales', 'test-ride', 'service'],
  },
  {
    id: 'ebikepros',
    name: 'EbikePros',
    brands: ['ENGWE', 'Eunorau'],
    address: '1N131 County Farm Rd',
    city: 'Winfield',
    state: 'Illinois',
    country: 'United States',
    countryCode: 'US',
    zip: '60190',
    phone: '(630) 805-3634',
    website: 'https://www.ebikeprosusa.com',
    lat: 41.8703,
    lng: -88.1590,
    types: ['sales', 'service'],
  },
  {
    id: 'ebikesupershop-ob',
    name: 'eBike Super Shop — Ocean Beach',
    brands: ['Eunorau', 'ENGWE'],
    address: '1926 Bacon St',
    city: 'San Diego',
    state: 'California',
    country: 'United States',
    countryCode: 'US',
    zip: '92107',
    phone: '(619) 848-7420',
    website: 'https://ebikesupershop.com',
    lat: 32.7480,
    lng: -117.2500,
    types: ['sales', 'test-ride', 'service', 'rental'],
  },
  {
    id: 'ebikesupershop-esc',
    name: 'eBike Super Shop — Escondido',
    brands: ['Eunorau', 'ENGWE'],
    address: '800 W Grand Ave',
    city: 'Escondido',
    state: 'California',
    country: 'United States',
    countryCode: 'US',
    zip: '92025',
    phone: '(858) 371-8796',
    website: 'https://ebikesupershop.com',
    lat: 33.1246,
    lng: -117.0918,
    types: ['sales', 'test-ride', 'service'],
  },
  {
    id: 'caebikes',
    name: 'California eBikes',
    brands: ['Eunorau'],
    address: '8522 Madison Ave',
    city: 'Fair Oaks',
    state: 'California',
    country: 'United States',
    countryCode: 'US',
    zip: '95628',
    phone: '(916) 699-7872',
    website: 'https://caebikes.com',
    lat: 38.6378,
    lng: -121.2583,
    types: ['sales', 'test-ride', 'service'],
  },
  {
    id: 'zoom-electric',
    name: 'Zoom Electric Bikes',
    brands: ['Eunorau'],
    address: '',
    city: 'Mesa',
    state: 'Arizona',
    country: 'United States',
    countryCode: 'US',
    zip: '85201',
    phone: '(888) 333-9469',
    website: 'https://zoomelectricbikes.com',
    lat: 33.4152,
    lng: -111.8315,
    types: ['sales'],
  },

  // ──────────────── EUROPE ────────────────

  // Netherlands
  {
    id: 'engwe-amstelveen',
    name: 'ENGWE Flagship — Fatbikeskopen.nl',
    brands: ['ENGWE'],
    address: 'Amsterdamseweg 162',
    city: 'Amstelveen',
    state: 'Noord-Holland',
    country: 'Netherlands',
    countryCode: 'NL',
    zip: '1182 HK',
    phone: '',
    website: 'https://www.fatbikeskopen.nl',
    lat: 52.3015,
    lng: 4.8548,
    types: ['sales', 'test-ride', 'service'],
  },

  // Denmark
  {
    id: 'engwe-esbjerg',
    name: 'ENGWE Nordic — Esbjerg',
    brands: ['ENGWE'],
    address: 'Østervangsvej 39',
    city: 'Esbjerg N',
    state: '',
    country: 'Denmark',
    countryCode: 'DK',
    zip: '6715',
    phone: '',
    website: 'https://engwenordic.dk',
    lat: 55.4904,
    lng: 8.4689,
    types: ['sales', 'test-ride', 'service'],
  },
  {
    id: 'engwe-hvidovre',
    name: 'ENGWE Denmark — CustomBike',
    brands: ['ENGWE'],
    address: 'Gammel Køge Landevej 374',
    city: 'Hvidovre',
    state: '',
    country: 'Denmark',
    countryCode: 'DK',
    zip: '2650',
    phone: '+45 81 98 43 02',
    website: 'https://custombike.dk',
    lat: 55.6336,
    lng: 12.4736,
    types: ['sales', 'test-ride', 'service'],
  },

  // Italy
  {
    id: 'engwe-roma',
    name: 'ENGWE Roma Official',
    brands: ['ENGWE'],
    address: 'Viale Spartaco 56',
    city: 'Roma',
    state: '',
    country: 'Italy',
    countryCode: 'IT',
    zip: '00174',
    phone: '+39 06 6549 8252',
    website: 'https://engweroma.it',
    lat: 41.8741,
    lng: 12.5266,
    types: ['sales', 'test-ride', 'service'],
  },
  {
    id: 'engwe-milan',
    name: 'ARK Store — ENGWE Milan',
    brands: ['ENGWE'],
    address: 'Via Luigi Canonica 40',
    city: 'Milan',
    state: '',
    country: 'Italy',
    countryCode: 'IT',
    zip: '20154',
    phone: '',
    website: 'https://www.facebook.com/arkstoreofficial/',
    lat: 45.4773,
    lng: 9.1728,
    types: ['sales', 'test-ride'],
  },
  {
    id: 'engwe-napoli',
    name: 'ENGWE Napoli',
    brands: ['ENGWE'],
    address: 'Via Largo Arso 17',
    city: 'San Giorgio a Cremano',
    state: '',
    country: 'Italy',
    countryCode: 'IT',
    zip: '80046',
    phone: '+39 338 651 2389',
    website: 'https://www.facebook.com/ENGWENAPOLI/',
    lat: 40.8283,
    lng: 14.3394,
    types: ['sales', 'test-ride', 'service'],
  },

  // Spain
  {
    id: 'engwe-valencia',
    name: 'ENGWE Spain — Electric Mobile',
    brands: ['ENGWE'],
    address: 'Guadalaviar 2',
    city: 'València',
    state: '',
    country: 'Spain',
    countryCode: 'ES',
    zip: '46009',
    phone: '+34 960 730 787',
    website: 'https://www.engwespain.es',
    lat: 39.4745,
    lng: -0.3601,
    types: ['sales', 'test-ride', 'service'],
  },

  // Croatia
  {
    id: 'engwe-zagreb',
    name: 'Rombike — ENGWE Zagreb',
    brands: ['ENGWE'],
    address: 'Savska cesta 94',
    city: 'Zagreb',
    state: '',
    country: 'Croatia',
    countryCode: 'HR',
    zip: '10000',
    phone: '',
    website: 'https://rombike-su.hr',
    lat: 45.7989,
    lng: 15.9617,
    types: ['sales', 'test-ride', 'service'],
  },

  // Hungary
  {
    id: 'engwe-budapest',
    name: 'ENGWE Budapest Showroom',
    brands: ['ENGWE'],
    address: 'Attila út 117',
    city: 'Budapest',
    state: '',
    country: 'Hungary',
    countryCode: 'HU',
    zip: '1012',
    phone: '',
    website: 'https://engwehungary.hu',
    lat: 47.4907,
    lng: 19.0285,
    types: ['sales', 'test-ride'],
  },

  // Cyprus
  {
    id: 'engwe-paphos',
    name: 'EKONET — ENGWE Cyprus',
    brands: ['ENGWE'],
    address: 'Griva Digeni 17, Chloraka',
    city: 'Paphos',
    state: '',
    country: 'Cyprus',
    countryCode: 'CY',
    zip: '8220',
    phone: '',
    website: 'https://www.ebikecy.net',
    lat: 34.7858,
    lng: 32.4102,
    types: ['sales', 'test-ride', 'service'],
  },

  // Greece
  {
    id: 'engwe-athens',
    name: 'ENGWE Greece',
    brands: ['ENGWE'],
    address: 'Leof. Thessalonikis 24',
    city: 'Nea Filadelfeia',
    state: 'Attika',
    country: 'Greece',
    countryCode: 'GR',
    zip: '14341',
    phone: '',
    website: 'https://engwe-ebikes.gr',
    lat: 38.0344,
    lng: 23.7396,
    types: ['sales', 'test-ride'],
  },

  // ──────────────── AUSTRALIA ────────────────

  {
    id: 'eazybikes-wa',
    name: 'EazyBikes — Eunorau WA',
    brands: ['Eunorau'],
    address: '1/12 Farrall Rd',
    city: 'Midvale',
    state: 'Western Australia',
    country: 'Australia',
    countryCode: 'AU',
    zip: '6056',
    phone: '',
    website: 'https://www.eazybikes.com.au',
    lat: -31.8871,
    lng: 116.0350,
    types: ['sales', 'test-ride'],
  },
  {
    id: 'ebike-superstore-braeside',
    name: 'Electric Bike Superstore — Braeside',
    brands: ['Eunorau'],
    address: '86-88 Woodlands Dr',
    city: 'Braeside',
    state: 'Victoria',
    country: 'Australia',
    countryCode: 'AU',
    zip: '3195',
    phone: '0400 999 251',
    website: 'https://electricbikesuperstore.com.au',
    lat: -37.9862,
    lng: 145.1103,
    types: ['sales', 'test-ride', 'service'],
  },
  {
    id: 'ebike-superstore-glenhuntly',
    name: 'Electric Bike Superstore — Glen Huntly',
    brands: ['Eunorau'],
    address: '1183 Glen Huntly Rd',
    city: 'Glen Huntly',
    state: 'Victoria',
    country: 'Australia',
    countryCode: 'AU',
    zip: '3163',
    phone: '0423 376 680',
    website: 'https://electricbikesuperstore.com.au',
    lat: -37.8814,
    lng: 145.0530,
    types: ['sales', 'test-ride', 'service'],
  },
];

export function getStoresByCountry(countryCode: string): Store[] {
  return STORES.filter(s => s.countryCode === countryCode);
}

export function getStoresByBrand(brand: string): Store[] {
  return STORES.filter(s => s.brands.some(b => b.toLowerCase() === brand.toLowerCase()));
}

export function getUniqueCountries(): { code: string; name: string; count: number }[] {
  const map = new Map<string, { name: string; count: number }>();
  for (const s of STORES) {
    const entry = map.get(s.countryCode);
    if (entry) entry.count++;
    else map.set(s.countryCode, { name: s.country, count: 1 });
  }
  return Array.from(map.entries())
    .map(([code, { name, count }]) => ({ code, name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getUniqueBrands(): string[] {
  const set = new Set<string>();
  for (const s of STORES) s.brands.forEach(b => set.add(b));
  return Array.from(set).sort();
}
