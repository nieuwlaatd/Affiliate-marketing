import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import DealCard from "@/components/DealCard";
import CopyCodeButton from "@/components/CopyCodeButton";
import type { Deal } from "@/lib/types";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: deal } = await supabase
    .from("deals")
    .select("brand, product, discount")
    .eq("slug", slug)
    .single();

  if (!deal) return { title: "Deal niet gevonden — Harkuhh" };

  return {
    title: `${deal.brand} — ${deal.discount} korting | Harkuhh`,
    description: `${deal.discount} korting op ${deal.product} bij ${deal.brand}. Harkuhh je korting!`,
  };
}

export default async function DealDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: deal } = await supabase
    .from("deals")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!deal) notFound();

  // Get similar deals from same category
  const { data: similar } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .eq("category", deal.category)
    .neq("id", deal.id)
    .limit(3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--muted)]">
        <a href="/deals" className="hover:text-[var(--foreground)]">Deals</a>
        <span className="mx-2">/</span>
        <a href={`/categorie/${deal.category.toLowerCase().replace(/ /g, "-")}`} className="hover:text-[var(--foreground)]">{deal.category}</a>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{deal.brand}</span>
      </nav>

      {/* Deal detail */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow-soft)] md:p-8">
        <div className="flex items-start gap-4">
          {deal.emoji && <span className="text-4xl">{deal.emoji}</span>}
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">{deal.brand}</h1>
            <p className="mt-1 text-[var(--muted)]">{deal.product}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-3xl font-bold text-[var(--accent)]">{deal.discount}</p>
        </div>

        {deal.code && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">Kortingscode:</p>
            <CopyCodeButton code={deal.code} />
          </div>
        )}

        <a
          href={deal.affiliate_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[var(--accent)] text-base font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] sm:w-auto sm:px-8"
        >
          Naar de webshop
        </a>

        {/* Meta info */}
        <div className="mt-6 flex flex-wrap gap-4 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
          <span>Categorie: {deal.category}</span>
          <span>
            {deal.expires_at
              ? `Geldig tot: ${new Date(deal.expires_at).toLocaleDateString("nl-NL")}`
              : "Altijd geldig"}
          </span>
        </div>

        {deal.notes && (
          <div className="mt-4 rounded-lg bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
            {deal.notes}
          </div>
        )}
      </div>

      {/* Similar deals */}
      {similar && similar.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Vergelijkbare deals
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(similar as Deal[]).map((d) => (
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
