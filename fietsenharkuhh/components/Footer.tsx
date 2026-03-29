import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#5A7A48' }}>
                <span className="text-white font-bold text-sm">FH</span>
              </div>
              <span className="text-lg font-bold text-white">FietsenHarkuhh</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md mb-4">
              FietsenHarkuhh helpt je de perfecte elektrische fiets te vinden. Onze keuzehulp en vergelijkingstool maken het makkelijk om de juiste keuze te maken.
            </p>
            <p className="text-xs text-gray-500">
              * FietsenHarkuhh bevat affiliate links. Als je via onze links koopt, ontvangen wij een commissie zonder extra kosten voor jou.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Navigatie</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/keuzehulp" className="hover:text-white transition-colors">Keuzehulp</Link></li>
              <li><Link href="/e-bikes" className="hover:text-white transition-colors">Alle e-bikes</Link></li>
              <li><Link href="/vergelijk" className="hover:text-white transition-colors">Vergelijken</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Informatie</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-500">Over ons</span></li>
              <li><span className="text-gray-500">Privacy</span></li>
              <li><span className="text-gray-500">Contact</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} FietsenHarkuhh — Onderdeel van Harkuhh</p>
        </div>
      </div>
    </footer>
  );
}

