"use client";

import { trackAffiliateClick } from "@/lib/analytics";

interface AffiliateLinkProps {
  href: string;
  brand: string;
  model: string;
  slug: string;
  price?: number;
  network?: string;
  /** Which button this is: "check_price" (primary) or "official_site". */
  cta: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Outbound affiliate link that fires the `affiliate_link_clicked` PostHog event
 * before navigating. Used on the bike detail page (a server component), so this
 * client wrapper carries the click tracking.
 */
export default function AffiliateLink({
  href,
  brand,
  model,
  slug,
  price,
  network,
  cta,
  className,
  style,
  children,
}: AffiliateLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => trackAffiliateClick({ brand, model, slug, price, network, cta })}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
