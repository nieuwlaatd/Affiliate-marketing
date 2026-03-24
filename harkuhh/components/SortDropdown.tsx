"use client";

const sortOptions = [
  { value: "newest", label: "Nieuwste" },
  { value: "discount", label: "Hoogste korting" },
  { value: "popular", label: "Populairst" },
  { value: "az", label: "A-Z" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

export default function SortDropdown({
  value,
  onChange,
}: {
  value: SortValue;
  onChange: (value: SortValue) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortValue)}
      className="h-10 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
