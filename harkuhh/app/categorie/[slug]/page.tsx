import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import DealCard from "@/components/DealCard";
import type { Deal, Category } from "@/lib/types";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name, emoji")
    .eq("slug", slug)
    .single();

  if (!category) return { title: "Categorie niet gevonden — Harkuhh" };

  return {
    title: `${category.emoji} ${category.name} deals — Harkuhh`,
    description: `Alle ${category.name.toLowerCase()} kortingscodes en deals. Harkuhh je korting!`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .eq("category", category.name)
    .not("code", "is", null)
    .neq("code", "")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-4 text-sm text-[var(--muted)]">
        <a href="/deals" className="hover:text-[var(--foreground)]">Deals</a>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{category.name}</span>
      </nav>

      <div className="flex items-center gap-3">
        <span className="text-3xl">{category.emoji}</span>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">{category.name}</h1>
      </div>

      {deals && deals.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(deals as Deal[]).map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-lg text-[var(--muted)]">
            Nog geen deals in deze categorie
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Houd deze pagina in de gaten, er komen snel nieuwe deals bij!
          </p>
        </div>
      )}
    </div>
  );
}
