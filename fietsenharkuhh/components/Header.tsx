'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#5A7A48' }}>
              <span className="text-white font-bold text-sm">FH</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              Fietsen<span style={{ color: '#5A7A48' }}>Harkuhh</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/keuzehulp" className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors" style={{ backgroundColor: '#5A7A48' }}>
              Keuzehulp
            </Link>
            <Link href="/fietsen" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Alle e-bikes
            </Link>
            <Link href="/vergelijk" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Vergelijken
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <nav className="flex flex-col gap-2 pt-4">
              <Link
                href="/keuzehulp"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold px-4 py-3 rounded-lg text-white text-center transition-colors"
                style={{ backgroundColor: '#5A7A48' }}
              >
                Keuzehulp
              </Link>
              <Link
                href="/fietsen"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Alle e-bikes
              </Link>
              <Link
                href="/vergelijk"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Vergelijken
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
