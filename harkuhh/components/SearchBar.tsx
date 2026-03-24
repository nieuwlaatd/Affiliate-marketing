"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Deal } from "@/lib/types";

export default function SearchBar({
  size = "default",
  autoFocus = false,
}: {
  size?: "default" | "large";
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Deal[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  function handleChange(value: string) {
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (value.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from("deals")
        .select("*")
        .eq("is_active", true)
        .or(`brand.ilike.%${value}%,product.ilike.%${value}%`)
        .limit(6);
      setResults(data || []);
      setOpen(true);
    }, 300);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/zoeken?q=${encodeURIComponent(query.trim())}`);
    }
  }

  const sizeClasses =
    size === "large"
      ? "h-14 text-base px-5"
      : "h-10 text-sm px-4";

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Zoek op merk, product of webshop..."
            className={`w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] pl-10 pr-4 placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none ${sizeClasses}`}
          />
        </div>
      </form>

      {/* Dropdown results */}
      {open && results.length > 0 && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-2 shadow-[var(--shadow-card)]">
          {results.map((deal) => (
            <button
              key={deal.id}
              onClick={() => {
                setOpen(false);
                setQuery("");
                router.push(`/deal/${deal.slug}`);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[var(--surface)]"
            >
              {deal.emoji && <span className="text-lg">{deal.emoji}</span>}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {deal.brand} — {deal.product}
                </p>
                <p className="text-xs text-[var(--accent)]">{deal.discount}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
