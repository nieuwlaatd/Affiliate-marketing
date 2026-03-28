import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/HeroSection";
import DealCard from "@/components/DealCard";
import Link from "next/link";
import type { Deal, Category } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();

  // Alleen deals met kortingscode tonen
  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .not("code", "is", null)
    .neq("code", "")
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  // Haal alle actieve deals met code op om te checken welke categorieën deals hebben
  const { data: allDealsWithCode } = await supabase
    .from("deals")
    .select("category")
    .eq("is_active", true)
    .not("code", "is", null)
    .neq("code", "");

  const categoriesWithDeals = new Set(
    (allDealsWithCode || []).map((d) => d.category)
  );

  // Filter categorieën: toon alleen die met minstens één deal-met-code
  const filteredCategories = (categories || []).filter((cat: Category) =>
    categoriesWithDeals.has(cat.name)
  );

  return (
    <>
      <HeroSection />

      {/* Featured Deals */}
      {deals && deals.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Nieuwste deals
            </h2>
            <Link
              href="/deals"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Bekijk alles &rarr;
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(deals as Deal[]).map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {filteredCategories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Categorieën
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {filteredCategories.map((cat: Category) => (
              <Link
                key={cat.slug}
                href={`/categorie/${cat.slug}`}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 transition-all hover:border-[var(--accent)] hover:shadow-[var(--shadow-soft)]"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Onze Labels — FietsenHarkuhh */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Onze labels
        </h2>
        <div className="mt-6">
          <Link
            href="/fietsen"
            className="group flex items-center gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 sm:p-8 transition-all hover:border-[#5A7A48] hover:shadow-lg"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl" style={{ backgroundColor: '#5A7A4820' }}>
              🚲
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                FietsenHarkuhh
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Vind jouw ideale e-bike — vergelijk modellen, gebruik de keuzehulp en ontdek de beste elektrische fietsen.
              </p>
            </div>
            <span className="hidden sm:flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors" style={{ backgroundColor: '#5A7A48' }}>
              Bekijk e-bikes →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
