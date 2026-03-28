export interface EBike {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  priceCategory: 'budget' | 'midden' | 'premium';
  images: string[];

  // Motor
  motorType: 'midden' | 'naaf-voor' | 'naaf-achter';
  motorBrand: string;
  torque: number;
  supportLevels: number;

  // Battery
  batteryCapacity: number;
  rangeManufacturer: number;
  rangePractical: number;
  chargeTime: number;
  batteryRemovable: boolean;

  // Frame
  frameType: 'laag-instap' | 'hoog-instap' | 'sportief';
  frameMaterial: string;
  wheelSize: number;
  weight: number;
  maxWeight: number;

  // Gears
  gearType: 'derailleur' | 'naaf' | 'cvt';
  gearCount: number;
  gearBrand: string;

  // Usage
  suitableFor: ('woon-werk' | 'recreatief' | 'sportief' | 'transport' | 'off-road')[];

  // Scores (1-10)
  scoreOverall: number;
  scorePriceQuality: number;
  scoreComfort: number;
  scoreRange: number;

  // Affiliate
  affiliateUrl: string;
  testRideUrl: string;

  // SEO
  description: string;
  highlights: string[];
}

export type KennisNiveau = 'beginner' | 'gemiddeld' | 'expert';
export type GebruiksDoel = 'woon-werk' | 'recreatief' | 'sportief' | 'transport' | 'off-road';

export interface KeuzeHulpState {
  stap: number;
  kennisNiveau: KennisNiveau | null;
  gebruiksDoel: GebruiksDoel[];
  budget: [number, number];
  frameVoorkeur: 'laag-instap' | 'hoog-instap' | 'geen-voorkeur' | null;
  woonWerkAfstand: number | null;
}

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  motorTypes: string[];
  frameTypes: string[];
  suitableFor: string[];
  minRange: number;
  sortBy: 'price-asc' | 'price-desc' | 'score' | 'range' | 'newest';
}

export interface CompareItem {
  bikeId: string;
}
