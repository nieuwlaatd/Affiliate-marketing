import posthog from "posthog-js";

/**
 * Custom PostHog events for the three key funnel actions.
 *
 * `capture` is a no-op unless PostHog actually initialized (production only, see
 * app/providers.tsx), so calling these in dev is safe and sends nothing.
 */
function capture(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}

/** The money event: a click on an outbound affiliate link to a vendor. */
export function trackAffiliateClick(p: {
  brand: string;
  model: string;
  slug: string;
  price?: number;
  network?: string;
  /** Which button: "check_price" (primary) or "official_site". */
  cta: string;
}) {
  capture("affiliate_link_clicked", p);
}

/** The user finished the Find My E-Bike quiz and went to their matches. */
export function trackQuizCompleted(p: {
  terrain?: string;
  purpose?: string;
  budget?: number;
  distance?: number;
  frame?: string;
  bike_class?: string;
}) {
  capture("quiz_completed", p);
}

/** A bike was added to the comparison shortlist (purchase intent). */
export function trackBikeAddedToComparison(p: {
  brand: string;
  model: string;
  slug: string;
}) {
  capture("bike_added_to_comparison", p);
}
