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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <Logo className="h-12 w-auto text-[var(--foreground)]" />
            <p className="mt-2 text-sm text-[var(--muted)]">
              Unbiased, data-driven e-bike reviews and comparison tools to help you find the right electric bike.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Tools</h3>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/e-bikes/quiz" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">E-Bike Finder Quiz</Link>
              <Link href="/e-bikes/overzicht" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">All E-Bikes</Link>
              <Link href="/e-bikes/vergelijk" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Compare E-Bikes</Link>
              <Link href="/stores" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Find a Dealer</Link>
              <Link href="/best-ebikes" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">E-Bikes by State</Link>
            </nav>
          </div>

          {/* Blog */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Learn</h3>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">All Articles</Link>
              <Link href="/blog/how-to-choose-an-electric-bike" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Buyer&apos;s Guide</Link>
              <Link href="/blog/ebike-classes-explained" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">E-Bike Classes Explained</Link>
              <Link href="/blog/ebike-battery-range-guide" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Battery &amp; Range Guide</Link>
              <Link href="/blog/ebike-maintenance-tips" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Maintenance Tips</Link>
            </nav>
          </div>

          {/* Best E-Bikes */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Best E-Bikes</h3>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/best/commuter-ebikes" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Best Commuter E-Bikes</Link>
              <Link href="/best/ebikes-under-1000" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Best Under $1,000</Link>
              <Link href="/best/ebikes-under-1500" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Best Under $1,500</Link>
              <Link href="/best/folding-ebikes" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Best Folding E-Bikes</Link>
              <Link href="/best/cargo-ebikes" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Best Cargo E-Bikes</Link>
              <Link href="/best/class-3-ebikes" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Best Class 3 E-Bikes</Link>
              <Link href="/best/ebikes-for-seniors" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Best for Seniors</Link>
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
                className="cta-primary h-10 rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-white disabled:opacity-50"
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
            <strong>Affiliate disclosure:</strong> Best Bike For Me is reader-supported. When you buy through links on
            our site, we may earn an affiliate commission at no extra cost to you. This never affects our
            rankings or recommendations. <Link href="/affiliate-disclosure" className="underline hover:text-[var(--foreground)]">Learn more</Link>.
          </p>
          <nav className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-[var(--foreground)]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--foreground)]">Terms of Service</Link>
            <Link href="/affiliate-disclosure" className="hover:text-[var(--foreground)]">Affiliate Disclosure</Link>
            <Link href="/disclaimer" className="hover:text-[var(--foreground)]">Disclaimer</Link>
          </nav>
          <p className="mt-3">&copy; {new Date().getFullYear()} Best Bike For Me. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
