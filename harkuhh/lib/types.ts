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

// ---- E-bike types (US market) ----

export type UsageType = 'commuting' | 'recreation' | 'sport' | 'cargo' | 'off-road';
export type FrameType = 'step-through' | 'step-over' | 'sport';
export type MotorType = 'mid-drive' | 'front-hub' | 'rear-hub';
export type PriceCategory = 'budget' | 'mid-range' | 'premium';
export type BikeClass = 'class-1' | 'class-2' | 'class-3';
export type GearType = 'derailleur' | 'internal-hub' | 'cvt' | 'single-speed';
export type SuspensionType = 'none' | 'front' | 'full';
export type AffiliateNetwork =
  | 'shareasale'
  | 'impact'
  | 'avantlink'
  | 'rakuten'
  | 'goaffpro'
  | 'direct';

export interface EBike {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number; // USD
  priceCategory: PriceCategory;
  images: string[];

  motorType: MotorType;
  motorBrand: string;
  torque: number; // Nm
  supportLevels: number;

  batteryCapacity: number; // Ah
  rangeManufacturer: number; // miles (claimed)
  rangePractical: number; // miles (realistic)
  chargeTime: number; // hours
  batteryRemovable: boolean;

  frameType: FrameType;
  frameMaterial: string;
  wheelSize: number; // inches
  weight: number; // lbs
  maxWeight: number; // lbs (max payload)

  gearType: GearType;
  gearCount: number;
  gearBrand: string;

  suitableFor: UsageType[];

  scoreOverall: number;
  scoreValue: number;
  scoreRange: number;
  scorePower: number;
  scoreComfort: number;
  scoreBuildQuality: number;
  scoreVersatility: number;

  affiliateUrl: string;
  testRideUrl: string;

  // US-specific fields
  bikeClass?: BikeClass;
  hasThrottle?: boolean;
  hasSuspension?: SuspensionType;
  maxSpeedMph?: number;
  affiliateNetwork?: AffiliateNetwork;
  affiliateProgramId?: string;
  commissionPct?: number;
  cookieDays?: number;
  brandCountry?: string;
  shipsToUs?: boolean;
  /** False when the vendor no longer sells this bike (DB column `available`).
   *  Kept separate from is_active so the page stays publicly visible (RLS
   *  filters is_active=true) while showing a "no longer available" notice. */
  available?: boolean;
  warrantyYears?: number;

  description: string;
  highlights: string[];
  availableFrameSizes?: number[];
  minRiderHeight?: number; // inches
  maxRiderHeight?: number; // inches
  dimensions?: {
    standoverHeight?: number; // inches
    reach?: number;
    totalLength?: number;
    saddleHeightRange?: [number, number];
    handlebarHeight?: number;
    foldedSize?: string;
  };
  fullSpecs?: Record<string, string>;
}

export type Terrain = 'flat' | 'hilly' | 'mixed';

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  motorTypes: string[];
  frameTypes: string[];
  suitableFor: string[];
  minRange: number; // miles
  sortBy: 'price-asc' | 'price-desc' | 'score' | 'range' | 'newest';
  distancePerRide?: number; // miles
  terrain?: Terrain;
  riderHeight?: number; // inches
  heightRanges: string[];
  foldable?: boolean;
  removableBattery?: boolean;
  maxBikeWeight?: number; // lbs
  bikeClasses?: string[];
  hasThrottle?: boolean;
  suspensionTypes?: string[];
  minTopSpeed?: number; // mph
  wheelSizes?: number[];
}
