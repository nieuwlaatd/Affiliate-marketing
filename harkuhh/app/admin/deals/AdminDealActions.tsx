"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Deal } from "@/lib/types";

export default function AdminDealActions({ deal }: { deal: Deal }) {
  const router = useRouter();

  async function toggleActive() {
    const res = await fetch("/api/admin/deals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deal.id, is_active: !deal.is_active }),
    });
    if (res.ok) router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Weet je zeker dat je "${deal.brand} — ${deal.product}" wilt verwijderen?`)) return;
    const res = await fetch("/api/admin/deals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deal.id }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleActive}
        className="rounded-lg px-2 py-1 text-xs text-[var(--muted)] hover:bg-[var(--surface)]"
      >
        {deal.is_active ? "Deactiveer" : "Activeer"}
      </button>
      <Link
        href={`/admin/deals/${deal.id}`}
        className="rounded-lg px-2 py-1 text-xs text-[var(--muted)] hover:bg-[var(--surface)]"
      >
        Bewerk
      </Link>
      <button
        onClick={handleDelete}
        className="rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50"
      >
        Verwijder
      </button>
    </div>
  );
}
