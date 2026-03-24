"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SearchBar from "@/components/SearchBar";
import DealCard from "@/components/DealCard";
import AuthModal from "@/components/AuthModal";
import type { Deal } from "@/lib/types";

function ZoekenContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [results, setResults] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (initialQuery) {
      search(initialQuery);
    }
  }, [initialQuery]);

  async function search(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    const { data } = await supabase
      .from("deals")
      .select("*")
      .eq("is_active", true)
      .or(`brand.ilike.%${q}%,product.ilike.%${q}%,category.ilike.%${q}%`)
      .order("created_at", { ascending: false })
      .limit(20);
    setResults(data || []);
    setLoading(false);
  }

  return (
    <>
      {loading && (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="mt-8">
          <p className="mb-4 text-sm text-[var(--muted)]">
            {results.length} resultaat{results.length !== 1 && "en"} gevonden
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((deal) => (
              <DealCard key={deal.id} deal={deal} onAuthRequired={() => setAuthOpen(true)} />
            ))}
          </div>
        </div>
      )}

      {!loading && initialQuery && results.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-lg text-[var(--muted)]">
            Geen resultaten gevonden voor &quot;{initialQuery}&quot;
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Probeer een andere zoekterm of browse door alle deals.
          </p>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default function ZoekenPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Zoek een kortingscode</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Zoek op merk, product of categorie en harkuhh je korting.
      </p>

      <div className="mt-6">
        <SearchBar size="large" autoFocus />
      </div>

      <Suspense
        fallback={
          <div className="mt-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
          </div>
        }
      >
        <ZoekenContent />
      </Suspense>
    </div>
  );
}
