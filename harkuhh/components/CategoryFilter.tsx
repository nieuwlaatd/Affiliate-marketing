"use client";

import type { Category } from "@/lib/types";

export default function CategoryFilter({
  categories,
  selected,
  onChange,
}: {
  categories: Category[];
  selected: string | null;
  onChange: (slug: string | null) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selected === null
            ? "bg-[var(--accent)] text-white"
            : "bg-[var(--card-bg)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--foreground)]"
        }`}
      >
        Alles
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onChange(cat.slug === selected ? null : cat.slug)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selected === cat.slug
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--card-bg)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          }`}
        >
          {cat.emoji} {cat.name}
        </button>
      ))}
    </div>
  );
}
