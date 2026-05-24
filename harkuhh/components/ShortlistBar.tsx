'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useShortlist } from '@/lib/shortlist-context';
import { usePathname } from 'next/navigation';

export default function ShortlistBar() {
  const { shortlist, removeFromShortlist, clearShortlist } = useShortlist();
  const pathname = usePathname();

  if (shortlist.length === 0 || pathname === '/compare' || pathname === '/e-bikes/vergelijk') {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {shortlist.map((bike) => (
            <div key={bike.slug} className="relative group shrink-0">
              <div className="w-12 h-12 rounded-lg bg-[var(--surface)] border border-[var(--border)] overflow-hidden relative">
                {bike.image ? (
                  <Image src={bike.image} alt={bike.model} fill className="object-contain p-1" sizes="48px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--muted)]">🚲</div>
                )}
              </div>
              <button 
                onClick={() => removeFromShortlist(bike.slug)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] shadow-sm hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>
          ))}
          {shortlist.length < 3 && (
            <div className="w-12 h-12 rounded-lg border-2 border-dashed border-[var(--border)] flex items-center justify-center text-[var(--muted)] opacity-40">
              <span className="text-xl">+</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block text-right">
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={clearShortlist}
                className="text-[10px] text-red-600 hover:underline uppercase font-bold tracking-tight"
              >
                Clear
              </button>
              <p className="text-xs font-bold text-[var(--foreground)]">
                {shortlist.length} {shortlist.length === 1 ? 'bike' : 'bikes'}
              </p>
            </div>
            <p className="text-[10px] text-[var(--muted)]">Compare for the best choice</p>
          </div>
          <Link
            href="/e-bikes/vergelijk"
            className="cta-primary px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg active:scale-95"
            style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}
          >
            Compare {shortlist.length >= 2 ? '' : '(min. 2)'}
          </Link>
        </div>
      </div>
    </div>
  );
}
