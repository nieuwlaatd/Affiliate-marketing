"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import DealCard from "@/components/DealCard";
import CategoryFilter from "@/components/CategoryFilter";
import SortDropdown, { type SortValue } from "@/components/SortDropdown";
import AuthModal from "@/components/AuthModal";
import type { Deal, Category } from "@/lib/types";

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortValue>("newest");
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadDeals();
  }, [selectedCategory, sort]);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    setCategories(data || []);
  }

  async function loadDeals() {
    setLoading(true);
    let query = supabase
      .from("deals")
      .select("*")
      .eq("is_active", true);

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) {
        query = query.eq("category", cat.name);
      }
    }

    switch (sort) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "az":
        query = query.order("brand", { ascending: true });
        break;
      case "popular":
        query = query.order("created_at", { ascending: false }); // Placeholder
        break;
      case "discount":
        query = query.order("created_at", { ascending: false }); // Placeholder
        break;
    }

    const { data } = await query.limit(50);
    setDeals(data || []);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Alle deals</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Browse door alle kortingscodes en harkuhh de beste deals.
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {/* Results */}
      {loading ? (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
        </div>
      ) : deals.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onAuthRequired={() => setAuthOpen(true)} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-lg text-[var(--muted)]">Geen deals gevonden</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Probeer een andere categorie of verwijder het filter.
          </p>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
