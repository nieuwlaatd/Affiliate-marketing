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
