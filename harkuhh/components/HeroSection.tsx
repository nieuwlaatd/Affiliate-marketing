"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";

export default function HeroSection() {
  return (
    <section className="bg-[var(--background)] px-4 pb-12 pt-16 text-center md:pb-16 md:pt-24">
      <div className="mx-auto max-w-3xl">


        {/* Twee grote knoppen */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/zoeken"
            className="flex items-center justify-center gap-3 rounded-2xl border-2 border-[var(--accent)] bg-[var(--accent)] px-8 py-5 text-lg font-semibold text-white transition-all hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Ik zoek een code
          </Link>
          <Link
            href="/deals"
            className="flex items-center justify-center gap-3 rounded-2xl border-2 border-[var(--accent)] bg-transparent px-8 py-5 text-lg font-semibold text-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            Ik wil browsen
          </Link>
        </div>

        {/* Zoekbalk */}
        <div className="mx-auto mt-8 max-w-xl">
          <SearchBar size="large" />
        </div>
      </div>
    </section>
  );
}
