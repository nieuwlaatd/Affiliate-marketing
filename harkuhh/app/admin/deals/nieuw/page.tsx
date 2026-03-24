"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";

export default function NewDealPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    brand: "",
    product: "",
    category: "",
    code: "",
    discount: "",
    affiliate_link: "",
    commission_pct: "",
    cookie_duration: "",
    emoji: "",
    notes: "",
    expires_at: "",
  });

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .order("sort_order")
      .then(({ data }) => setCategories(data || []));
  }, []);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function generateSlug(brand: string, product: string) {
    return `${brand}-${product}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug: generateSlug(form.brand, form.product),
        commission_pct: form.commission_pct ? parseFloat(form.commission_pct) : null,
        expires_at: form.expires_at || null,
        is_active: true,
        verified_at: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      router.push("/admin/deals");
    } else {
      const data = await res.json();
      setError(data.error || "Er ging iets mis.");
    }
    setLoading(false);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--foreground)]">Nieuwe deal toevoegen</h2>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Merk *</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => updateField("brand", e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Product *</label>
            <input
              type="text"
              value={form.product}
              onChange={(e) => updateField("product", e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Categorie *</label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 text-sm focus:border-[var(--accent)] focus:outline-none"
            >
              <option value="">Selecteer...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Emoji</label>
            <input
              type="text"
              value={form.emoji}
              onChange={(e) => updateField("emoji", e.target.value)}
              placeholder="bijv. 🎧"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Kortingscode</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => updateField("code", e.target.value)}
              placeholder="KORTING20"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 text-sm font-mono focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Korting *</label>
            <input
              type="text"
              value={form.discount}
              onChange={(e) => updateField("discount", e.target.value)}
              required
              placeholder="bijv. 20% korting of €10 korting"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Affiliate link *</label>
          <input
            type="url"
            value={form.affiliate_link}
            onChange={(e) => updateField("affiliate_link", e.target.value)}
            required
            placeholder="https://..."
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 text-sm focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Commissie %</label>
            <input
              type="number"
              step="0.1"
              value={form.commission_pct}
              onChange={(e) => updateField("commission_pct", e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Cookie duur</label>
            <input
              type="text"
              value={form.cookie_duration}
              onChange={(e) => updateField("cookie_duration", e.target.value)}
              placeholder="bijv. 30 dagen"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Verloopt op</label>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => updateField("expires_at", e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Notities</label>
          <textarea
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-xl bg-[var(--accent)] px-6 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {loading ? "Publiceren..." : "Publiceren"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="h-11 rounded-xl border border-[var(--border)] px-6 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface)]"
          >
            Annuleren
          </button>
        </div>
      </form>
    </div>
  );
}
