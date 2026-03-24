"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "./ThemeToggle";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Harkuhh Logo" className="h-14 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/zoeken" className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
            Zoeken
          </Link>
          <Link href="/deals" className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
            Deals
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link
              href="/account"
              className="flex h-9 items-center rounded-full bg-[var(--accent)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Mijn account
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex h-9 items-center rounded-full bg-[var(--accent)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Inloggen
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] md:hidden"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/zoeken" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]">
              Zoeken
            </Link>
            <Link href="/deals" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]">
              Deals
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
