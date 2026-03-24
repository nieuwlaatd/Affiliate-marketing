import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Deal } from "@/lib/types";
import AdminDealActions from "./AdminDealActions";

export default async function AdminDealsPage() {
  const supabase = await createClient();

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Deals beheren</h2>
        <Link
          href="/admin/deals/nieuw"
          className="flex h-10 items-center rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          + Nieuwe deal
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="pb-3 font-medium text-[var(--muted)]">Merk</th>
              <th className="pb-3 font-medium text-[var(--muted)]">Product</th>
              <th className="pb-3 font-medium text-[var(--muted)]">Code</th>
              <th className="pb-3 font-medium text-[var(--muted)]">Korting</th>
              <th className="pb-3 font-medium text-[var(--muted)]">Status</th>
              <th className="pb-3 font-medium text-[var(--muted)]">Acties</th>
            </tr>
          </thead>
          <tbody>
            {(deals as Deal[] | null)?.map((deal) => (
              <tr key={deal.id} className="border-b border-[var(--border)]">
                <td className="py-3 font-medium text-[var(--foreground)]">
                  {deal.emoji} {deal.brand}
                </td>
                <td className="py-3 text-[var(--muted)]">{deal.product}</td>
                <td className="py-3 font-mono text-xs text-[var(--accent)]">
                  {deal.code || "—"}
                </td>
                <td className="py-3 font-semibold text-[var(--accent)]">{deal.discount}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      deal.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {deal.is_active ? "Actief" : "Inactief"}
                  </span>
                </td>
                <td className="py-3">
                  <AdminDealActions deal={deal} />
                </td>
              </tr>
            ))}
            {(!deals || deals.length === 0) && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[var(--muted)]">
                  Nog geen deals. Voeg je eerste deal toe!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
