"use client";

import Link from "next/link";
import CopyCodeButton from "./CopyCodeButton";
import SaveButton from "./SaveButton";
import type { Deal } from "@/lib/types";

export default function DealCard({
  deal,
  onAuthRequired,
}: {
  deal: Deal;
  onAuthRequired?: () => void;
}) {
  async function trackClick() {
    // Fire-and-forget click tracking
    fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deal_id: deal.id }),
    });
  }

  return (
    <div className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-card)]">
      {/* Top row: emoji + brand + save */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {deal.emoji && <span className="text-2xl">{deal.emoji}</span>}
          <div>
            <span className="text-sm font-semibold text-[var(--foreground)]">{deal.brand}</span>
            <p className="text-xs text-[var(--muted)]">{deal.category}</p>
          </div>
        </div>
        <SaveButton dealId={deal.id} onAuthRequired={onAuthRequired} />
      </div>

      {/* Product */}
      <Link href={`/deal/${deal.slug}`} className="mt-3">
        <h3 className="text-base font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]">
          {deal.product}
        </h3>
      </Link>

      {/* Discount */}
      <p className="mt-2 text-xl font-bold text-[var(--accent)]">{deal.discount}</p>

      {/* Code + Link */}
      <div className="mt-4 flex flex-col gap-3">
        {deal.code && <CopyCodeButton code={deal.code} />}
        <a
          href={deal.affiliate_link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackClick}
          className="flex h-10 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          Naar de webshop
        </a>
      </div>

      {/* Expiry */}
      {deal.expires_at && (
        <p className="mt-3 text-xs text-[var(--muted)]">
          Geldig tot {new Date(deal.expires_at).toLocaleDateString("nl-NL")}
        </p>
      )}
    </div>
  );
}
