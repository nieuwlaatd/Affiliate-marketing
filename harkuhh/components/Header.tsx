"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const NAV = [
  { href: "/e-bikes", label: "All E-Bikes" },
  { href: "/compare", label: "Compare" },
  { href: "/blog", label: "Blog" },
  { href: "/stores", label: "Stores" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Wordmark */}
        <Link href="/" aria-label="BestBikeForMe home">
          <Logo className="h-12 w-auto text-[var(--foreground)]" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/e-bikes/quiz"
            className="cta-primary hidden h-9 items-center rounded-full px-5 text-sm font-bold sm:flex"
            style={{ backgroundColor: "var(--cta)", color: "var(--cta-ink)" }}
          >
            Find My E-Bike
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] md:hidden"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 12h16M4 6h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/e-bikes/quiz" onClick={() => setMenuOpen(false)} className="text-sm font-bold text-[var(--accent)]">
              Find My E-Bike
            </Link>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
