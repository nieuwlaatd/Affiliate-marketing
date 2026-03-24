"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DealCard from "@/components/DealCard";
import type { Deal } from "@/lib/types";

export default function SavedDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadSavedDeals();
  }, []);

  async function loadSavedDeals() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data } = await supabase
      .from("saved_deals")
      .select("deal_id, deals(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      const savedDeals = data
        .map((item: any) => item.deals)
        .filter(Boolean) as Deal[];
      setDeals(savedDeals);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Opgeslagen deals</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Alle deals die je hebt opgeslagen op een rijtje.
      </p>

      {deals.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-lg text-[var(--muted)]">Nog geen opgeslagen deals</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Klik op het hartje bij een deal om deze op te slaan.
          </p>
          <a
            href="/deals"
            className="mt-4 inline-flex h-10 items-center rounded-full bg-[var(--accent)] px-6 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
          >
            Browse deals
          </a>
        </div>
      )}
    </div>
  );
}
