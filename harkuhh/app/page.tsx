import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/HeroSection";
import DealCard from "@/components/DealCard";
import Link from "next/link";
import type { Deal, Category } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

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
      {categories && categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Categorieën
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {(categories as Category[]).map((cat) => (
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
    </>
  );
}
