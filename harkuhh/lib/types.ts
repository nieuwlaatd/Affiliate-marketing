export interface Deal {
  id: string;
  brand: string;
  product: string;
  slug: string;
  category: string;
  code: string | null;
  discount: string;
  affiliate_link: string;
  commission_pct: number | null;
  cookie_duration: string | null;
  emoji: string | null;
  notes: string | null;
  is_active: boolean;
  verified_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  sort_order: number;
}

export interface SavedDeal {
  id: string;
  user_id: string;
  deal_id: string;
  created_at: string;
  deal?: Deal;
}

export interface Profile {
  id: string;
  display_name: string | null;
  email_notifications: boolean;
  created_at: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  is_verified: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface DealCheck {
  id: string;
  deal_id: string;
  checked_at: string;
  is_valid: boolean;
  error_message: string | null;
}

// ---- E-bike types (FietsenHarkuhh) ----

export interface EBike {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  priceCategory: 'budget' | 'midden' | 'premium';
  images: string[];

  motorType: 'midden' | 'naaf-voor' | 'naaf-achter';
  motorBrand: string;
  torque: number;
  supportLevels: number;

  batteryCapacity: number;
  rangeManufacturer: number;
  rangePractical: number;
  chargeTime: number;
  batteryRemovable: boolean;

  frameType: 'laag-instap' | 'hoog-instap' | 'sportief';
  frameMaterial: string;
  wheelSize: number;
  weight: number;
  maxWeight: number;

  gearType: 'derailleur' | 'naaf' | 'cvt';
  gearCount: number;
  gearBrand: string;

  suitableFor: ('woon-werk' | 'recreatief' | 'sportief' | 'transport' | 'off-road')[];

  scoreOverall: number;
  scorePriceQuality: number;
  scoreComfort: number;
  scoreRange: number;

  affiliateUrl: string;
  testRideUrl: string;

  description: string;
  highlights: string[];
  availableFrameSizes?: number[];
  minRiderHeight?: number;
  maxRiderHeight?: number;
  dimensions?: {
    standoverHeight?: number;
    reach?: number;
    totalLength?: number;
    saddleHeightRange?: [number, number];
    handlebarHeight?: number;
    foldedSize?: string;
  };
  fullSpecs?: Record<string, string>;
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
  afstandPerRit?: number;
  omgeving?: 'stad' | 'heuvelachtig' | 'onverhard';
  lichaamslengte?: number;
  heightRanges: string[];
  foldable?: boolean;
  removableBattery?: boolean;
  maxBikeWeight?: number;
}
