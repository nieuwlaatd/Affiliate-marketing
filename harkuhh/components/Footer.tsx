"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Logo from "./Logo";

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
            <Logo className="h-9 w-auto text-[var(--foreground)]" />
            <p className="mt-2 text-sm text-[var(--muted)]">
              Find your perfect e-bike. Data-driven reviews, comparisons & the best deals — all in one calm place.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Navigation</h3>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Find My E-Bike</Link>
              <Link href="/e-bikes" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">All E-Bikes</Link>
              <Link href="/compare" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Compare</Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Newsletter</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Get the best e-bike deals and price drops weekly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="h-10 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-10 rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>
            </form>
            {status === "success" && (
              <p className="mt-2 text-sm text-[var(--accent)]">You&apos;re subscribed!</p>
            )}
            {status === "error" && (
              <p className="mt-2 text-sm text-red-500">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
          <p>
            <strong>Affiliate disclosure:</strong> Harkuhh is reader-supported. When you buy through links on
            our site, we may earn an affiliate commission at no extra cost to you. This never affects our
            rankings or recommendations.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Harkuhh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
