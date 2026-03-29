'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShortlistProvider } from '@/lib/shortlist-context';
import ShortlistBar from '@/components/ShortlistBar';

export default function FietsenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/e-bikes', label: 'Home', exact: true },
    { href: '/e-bikes/overzicht', label: 'Overzicht', exact: false },
    { href: '/e-bikes/vergelijk', label: 'Vergelijk', exact: false },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* FietsenHarkuhh sub-navigatiebalk */}
      <nav
        className="sticky top-16 z-40 border-b"
        style={{ backgroundColor: '#5A7A48', borderColor: '#4A6A38' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href, item.exact)
                    ? 'text-white border-b-2 border-white'
                    : 'text-green-100 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-green-100 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Harkuhh
          </Link>
        </div>
      </nav>
      <ShortlistProvider>
        {children}
        <ShortlistBar />
      </ShortlistProvider>
    </>
  );
}

