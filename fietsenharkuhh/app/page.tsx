import Link from 'next/link';
import BikeCard from '@/components/BikeCard';
import { bikes } from '@/lib/ebike-data';
import { EBike } from '@/lib/types';

export default function Home() {
  const popularBikes: EBike[] = [...bikes].sort((a, b) => b.scoreOverall - a.scoreOverall).slice(0, 6);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-orange-50 opacity-80"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Vind jouw ideale elektrische fiets
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
              Ontdek welke e-bike perfect bij jou past met onze intelligente keuzehulp. In slechts enkele stappen vinden we de juiste match voor jouw behoeften en budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/keuzehulp" className="inline-flex items-center justify-center px-8 py-4 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl" style={{ backgroundColor: '#5A7A48' }}>
                Start de Keuzehulp
              </Link>
              <Link href="/e-bikes" className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 font-bold rounded-lg hover:bg-green-50 transition-colors" style={{ borderColor: '#5A7A48', color: '#5A7A48' }}>
                Bekijk alle e-bikes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Zo werkt het</h2>
            <p className="text-gray-600 text-lg">Onze keuzehulp maakt het gemakkelijk om de perfecte e-bike te vinden</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Vertel ons wat je zoekt', desc: 'Beantwoord enkele vragen over jouw wensen en budget' },
              { step: '2', title: 'Wij filteren op jouw wensen', desc: 'Ons algoritme vindt de beste matches voor jouw situatie' },
              { step: '3', title: 'Vind jouw perfecte match', desc: 'Ontdek de ideale e-bike voor jouw behoeften en budget' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: '#5A7A4820' }}>
                  <span className="text-2xl font-bold" style={{ color: '#5A7A48' }}>{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Bikes */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Populaire e-bikes</h2>
            <p className="text-gray-600 text-lg">De best beoordeelde elektrische fietsen</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {popularBikes.map(bike => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
          <div className="text-center">
            <Link href="/e-bikes" className="inline-flex items-center px-6 py-3 text-white font-bold rounded-lg transition-colors" style={{ backgroundColor: '#5A7A48' }}>
              Bekijk alle modellen →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Naar gebruiksdoel</h2>
            <p className="text-gray-600 text-lg">Vind e-bikes voor jouw favoriete manier van fietsen</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Woon-werk', icon: '🚴', href: '/e-bikes?doel=woon-werk', desc: 'Voor dagelijks pendelen' },
              { name: 'Recreatief', icon: '🌳', href: '/e-bikes?doel=recreatief', desc: 'Ontspannen uitstapjes' },
              { name: 'Sportief', icon: '⚡', href: '/e-bikes?doel=sportief', desc: 'Actief en snel' },
              { name: 'Transport', icon: '📦', href: '/e-bikes?doel=transport', desc: 'Voor boodschappen' },
            ].map(cat => (
              <Link key={cat.name} href={cat.href} className="group p-8 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all bg-white">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-600">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Vertrouwde merken</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Gazelle', 'Batavus', 'Stella', 'Giant', 'Cube', 'Trek', 'Specialized', 'Cortina', 'Sparta', 'Tenways'].map(brand => (
              <div key={brand} className="flex items-center justify-center p-5 rounded-lg border border-gray-200 bg-white">
                <span className="font-bold text-gray-700">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: '#5A7A48' }}>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Nog twijfels?</h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Onze keuzehulp helpt je in slechts 2 minuten om de perfecte elektrische fiets te vinden.
          </p>
          <Link href="/keuzehulp" className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 font-bold rounded-lg transition-colors shadow-lg" style={{ color: '#5A7A48' }}>
            Start de Keuzehulp →
          </Link>
        </div>
      </section>
    </div>
  );
}

