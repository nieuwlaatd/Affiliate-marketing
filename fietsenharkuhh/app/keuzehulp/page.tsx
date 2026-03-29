'use client';

import { useState } from 'react';
import Link from 'next/link';
import BikeCard from '@/components/BikeCard';
import { getRecommendations } from '@/lib/ebike-data';
import { KeuzeHulpState, KennisNiveau, GebruiksDoel, EBike } from '@/lib/types';

const initialState: KeuzeHulpState = {
  stap: 1,
  kennisNiveau: null,
  gebruiksDoel: [],
  budget: [1000, 4000],
  frameVoorkeur: null,
  woonWerkAfstand: null,
};

export default function KeuzehulpPage() {
  const [state, setState] = useState<KeuzeHulpState>(initialState);
  const [results, setResults] = useState<EBike[]>([]);

  const updateState = (updates: Partial<KeuzeHulpState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (state.stap === 3) {
      const recs = getRecommendations(state);
      setResults(recs);
    }
    updateState({ stap: state.stap + 1 });
  };

  const prevStep = () => updateState({ stap: Math.max(1, state.stap - 1) });

  const toggleDoel = (doel: GebruiksDoel) => {
    const current = state.gebruiksDoel;
    const updated = current.includes(doel)
      ? current.filter(d => d !== doel)
      : [...current, doel];
    updateState({ gebruiksDoel: updated });
  };

  const canProceed = () => {
    switch (state.stap) {
      case 1: return state.kennisNiveau !== null;
      case 2: return state.gebruiksDoel.length > 0;
      case 3: return state.frameVoorkeur !== null;
      default: return true;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Progress bar */}
        {state.stap <= 3 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Stap {state.stap} van 3</span>
              <span>{Math.round((state.stap / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${(state.stap / 3) * 100}%`, backgroundColor: '#5A7A48' }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Knowledge Level */}
        {state.stap === 1 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoeveel weet je over e-bikes?</h1>
            <p className="text-gray-600 mb-8">Dit helpt ons om de informatie aan te passen aan jouw niveau.</p>
            <div className="space-y-4">
              {([
                { value: 'beginner' as KennisNiveau, title: 'Ik begin net met oriënteren', desc: 'Ik weet nog niet zoveel over e-bikes en wil graag begeleid worden' },
                { value: 'gemiddeld' as KennisNiveau, title: 'Ik weet ongeveer wat ik zoek', desc: 'Ik ken de basis maar wil hulp bij het kiezen van het juiste model' },
                { value: 'expert' as KennisNiveau, title: 'Ik ben een kenner', desc: 'Ik ken de specificaties en wil direct vergelijken op details' },
              ]).map(option => (
                <button
                  key={option.value}
                  onClick={() => updateState({ kennisNiveau: option.value })}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    state.kennisNiveau === option.value
                      ? 'border-green-600 bg-green-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <h3 className="font-bold text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Usage */}
        {state.stap === 2 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Waar ga je de fiets voor gebruiken?</h1>
            <p className="text-gray-600 mb-8">Je kunt meerdere opties selecteren.</p>
            <div className="space-y-4">
              {([
                { value: 'woon-werk' as GebruiksDoel, title: 'Woon-werkverkeer', desc: 'Dagelijks pendelen naar je werk', icon: '🚴' },
                { value: 'recreatief' as GebruiksDoel, title: 'Recreatief fietsen', desc: 'Ontspannen tochtjes en uitstapjes', icon: '🌳' },
                { value: 'sportief' as GebruiksDoel, title: 'Sportief fietsen', desc: 'Actief en snel, voor de sportieve fietser', icon: '⚡' },
                { value: 'transport' as GebruiksDoel, title: 'Transport & boodschappen', desc: 'Boodschappen doen en spullen vervoeren', icon: '📦' },
                { value: 'off-road' as GebruiksDoel, title: 'Off-road / mountainbike', desc: 'Onverharde paden en bosgebied', icon: '🏔️' },
              ]).map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleDoel(option.value)}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    state.gebruiksDoel.includes(option.value)
                      ? 'border-green-600 bg-green-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{option.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Commute distance */}
            {state.gebruiksDoel.includes('woon-werk') && (
              <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
                <label className="block font-bold text-gray-900 mb-2">Hoe ver is je woon-werkafstand (enkele reis)?</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={state.woonWerkAfstand || 15}
                    onChange={(e) => updateState({ woonWerkAfstand: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold w-16 text-right" style={{ color: '#5A7A48' }}>
                    {state.woonWerkAfstand || 15} km
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Preferences */}
        {state.stap === 3 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Jouw voorkeuren</h1>
            <p className="text-gray-600 mb-8">Stel je budget en framevoorkeur in.</p>

            {/* Budget slider */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
              <label className="block font-bold text-gray-900 mb-4">Budget</label>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm text-gray-500">€{state.budget[0].toLocaleString('nl-NL')}</span>
                <input
                  type="range"
                  min={1000}
                  max={5000}
                  step={100}
                  value={state.budget[1]}
                  onChange={(e) => updateState({ budget: [state.budget[0], Number(e.target.value)] })}
                  className="flex-1"
                />
                <span className="text-lg font-bold" style={{ color: '#5A7A48' }}>
                  max €{state.budget[1].toLocaleString('nl-NL')}
                </span>
              </div>
            </div>

            {/* Frame preference */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <label className="block font-bold text-gray-900 mb-4">Frametype voorkeur</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {([
                  { value: 'laag-instap' as const, title: 'Laag instap', desc: 'Gemakkelijk op- en afstappen' },
                  { value: 'hoog-instap' as const, title: 'Hoog instap', desc: 'Klassiek herenframe' },
                  { value: 'geen-voorkeur' as const, title: 'Geen voorkeur', desc: 'Laat me alles zien' },
                ]).map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateState({ frameVoorkeur: option.value })}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      state.frameVoorkeur === option.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-bold text-sm text-gray-900">{option.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {state.stap === 4 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Jouw aanbevelingen</h1>
            <p className="text-gray-600 mb-8">Op basis van jouw antwoorden hebben we de beste matches gevonden.</p>

            {results.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {results.map((bike, i) => (
                  <div key={bike.id} className="relative">
                    {i === 0 && (
                      <div className="absolute -top-3 left-4 z-10 px-3 py-1 text-xs font-bold text-white rounded-full" style={{ backgroundColor: '#5A7A48' }}>
                        Beste match
                      </div>
                    )}
                    <BikeCard bike={bike} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Geen resultaten gevonden. Probeer andere voorkeuren.</p>
            )}

            <div className="flex gap-4">
              <button onClick={() => setState(initialState)} className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Opnieuw beginnen
              </button>
              <Link href="/e-bikes" className="px-6 py-3 text-white font-bold rounded-lg transition-colors" style={{ backgroundColor: '#5A7A48' }}>
                Bekijk alle e-bikes
              </Link>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        {state.stap <= 3 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              className={`px-6 py-3 border border-gray-300 rounded-lg font-medium transition-colors ${
                state.stap === 1 ? 'invisible' : 'hover:bg-gray-50'
              }`}
            >
              Vorige
            </button>
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="px-8 py-3 text-white font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: canProceed() ? '#5A7A48' : '#9ca3af' }}
            >
              {state.stap === 3 ? 'Toon resultaten' : 'Volgende'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

