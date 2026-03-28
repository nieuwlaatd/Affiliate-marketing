"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("email_subscribers").insert({ email });
      if (error) {
        if (error.code === "23505") {
          setStatus("success"); // Already subscribed
        } else {
          setStatus("error");
        }
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <span className="text-lg font-bold text-[var(--accent)]">HARKUHH</span>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Harkuhh je korting. Alle werkende kortingscodes op één rustige plek.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Navigatie</h3>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/zoeken" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Zoeken</Link>
              <Link href="/deals" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Alle deals</Link>
              <Link href="/fietsen" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">E-bikes</Link>
              <Link href="/account" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Mijn account</Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Nieuwsbrief</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Ontvang de beste deals wekelijks in je inbox.
            </p>
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="je@email.nl"
                required
                className="h-10 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-10 rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
              >
                {status === "loading" ? "..." : "Aanmelden"}
              </button>
            </form>
            {status === "success" && (
              <p className="mt-2 text-sm text-[var(--accent)]">Je bent aangemeld!</p>
            )}
            {status === "error" && (
              <p className="mt-2 text-sm text-red-500">Er ging iets mis. Probeer het opnieuw.</p>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
          <p>
            Harkuhh bevat affiliate links. Als je via onze links bestelt, ontvangen wij een kleine vergoeding — zonder extra kosten voor jou.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Harkuhh. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
}
