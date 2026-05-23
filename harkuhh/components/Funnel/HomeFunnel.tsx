'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useCallback } from 'react';

type TerrainId = 'city' | 'hills' | 'trails' | 'beach' | 'mixed';
type PurposeId = 'commuting' | 'recreation' | 'sport' | 'cargo';
type BudgetId = 'b1' | 'b2' | 'b3' | 'b4';
type DistanceId = 'd1' | 'd2' | 'd3' | 'd4';
type FrameId = 'step-through' | 'step-over' | 'sport' | 'no-preference';
type ClassId = 'class-1' | 'class-2' | 'class-3' | 'no-preference';

interface TerrainDef {
  id: TerrainId;
  label: string;
  verb: string;
  feel: string;
  filterTerrain: string; // maps to overview ?terrain
  icon: React.ReactNode;
}

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const TERRAINS: TerrainDef[] = [
  {
    id: 'city', label: 'City streets', verb: 'Glide', filterTerrain: 'flat',
    feel: 'Smooth tarmac, beating the traffic, pure momentum.',
    icon: <svg viewBox="0 0 32 32" width="34" height="34" {...stroke}><path d="M4 27h24M7 27V11l6-4 6 4v16M22 27V15l4-2 0 14M10 13h2M16 13h2M10 18h2M16 18h2M10 23h2M16 23h2" /></svg>,
  },
  {
    id: 'hills', label: 'Hills & climbs', verb: 'Conquer', filterTerrain: 'hilly',
    feel: 'Long climbs that melt away under power.',
    icon: <svg viewBox="0 0 32 32" width="34" height="34" {...stroke}><path d="M3 26 13 9l6 9 4-6 6 14zM13 9l3 5" /><circle cx="24" cy="7" r="2.4" /></svg>,
  },
  {
    id: 'trails', label: 'Trails & gravel', verb: 'Escape', filterTerrain: 'mixed',
    feel: 'Gravel, dust and the freedom of no road.',
    icon: <svg viewBox="0 0 32 32" width="34" height="34" {...stroke}><path d="M5 28c4-1 5-6 9-6s5 6 9 6 4-4 4-4M6 20c3 1 5-3 8-3M18 14c2 1 4-2 6-2M9 9c2 0 3 2 5 2" /></svg>,
  },
  {
    id: 'beach', label: 'Beach & boardwalk', verb: 'Cruise', filterTerrain: 'mixed',
    feel: 'Soft sand, sea air, nowhere to be.',
    icon: <svg viewBox="0 0 32 32" width="34" height="34" {...stroke}><circle cx="16" cy="11" r="4" /><path d="M16 4v2M16 16v2M9 11H7M25 11h-2M11 6 9.5 4.5M21 6l1.5-1.5M4 25c4-2 6 2 10 0s6 2 10 0M4 29c4-2 6 2 10 0s6 2 10 0" /></svg>,
  },
  {
    id: 'mixed', label: 'A bit of everything', verb: 'Roam', filterTerrain: '',
    feel: 'Ready for all of it, whatever the day brings.',
    icon: <svg viewBox="0 0 32 32" width="34" height="34" {...stroke}><circle cx="16" cy="16" r="12" /><path d="M16 4c4 4 4 20 0 24M16 4c-4 4-4 20 0 24M4 16h24M6 9c6 4 14 4 20 0M6 23c6-4 14-4 20 0" /></svg>,
  },
];

const PURPOSES: { id: PurposeId; label: string; hint: string }[] = [
  { id: 'commuting', label: 'Getting to work', hint: 'Daily, rain or shine' },
  { id: 'recreation', label: 'Weekend rides', hint: 'For the joy of it' },
  { id: 'sport', label: 'Fitness & speed', hint: 'Push harder, go faster' },
  { id: 'cargo', label: 'Hauling & family', hint: 'Kids, groceries, gear' },
];

const BUDGETS: { id: BudgetId; label: string; max: number; hint: string }[] = [
  { id: 'b1', label: 'Under $1,000', max: 1000, hint: 'Smart on a budget' },
  { id: 'b2', label: '$1,000 – $1,500', max: 1500, hint: 'The value sweet spot' },
  { id: 'b3', label: '$1,500 – $2,500', max: 2500, hint: 'Refined and capable' },
  { id: 'b4', label: '$2,500 and up', max: 6000, hint: 'No compromises' },
];

const DISTANCES: { id: DistanceId; label: string; miles: number; hint: string }[] = [
  { id: 'd1', label: 'Under 5 miles', miles: 5, hint: 'Quick neighborhood trips' },
  { id: 'd2', label: '5 – 15 miles', miles: 15, hint: 'Solid daily commute' },
  { id: 'd3', label: '15 – 30 miles', miles: 30, hint: 'Long rides, big range' },
  { id: 'd4', label: '30+ miles', miles: 50, hint: 'All-day adventures' },
];

const FRAMES: { id: FrameId; label: string; hint: string }[] = [
  { id: 'step-through', label: 'Step-through', hint: 'Easy on, easy off' },
  { id: 'step-over', label: 'Step-over', hint: 'Classic diamond frame' },
  { id: 'sport', label: 'Sport', hint: 'Aggressive and fast' },
  { id: 'no-preference', label: 'No preference', hint: 'Show me everything' },
];

const CLASSES: { id: ClassId; label: string; hint: string }[] = [
  { id: 'class-1', label: 'Class 1', hint: 'Pedal-assist only, 20 mph' },
  { id: 'class-2', label: 'Class 2', hint: 'Throttle + assist, 20 mph' },
  { id: 'class-3', label: 'Class 3', hint: 'Pedal-assist only, 28 mph' },
  { id: 'no-preference', label: 'Not sure', hint: 'We\'ll show all classes' },
];

const QUESTIONS = [
  'Where will you ride?',
  "What's it mostly for?",
  "What's your budget?",
  'How far do you typically ride?',
  'How tall are you?',
  'Frame & class preference',
];

export default function HomeFunnel() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [terrain, setTerrain] = useState<TerrainDef | null>(null);
  const [purpose, setPurpose] = useState<(typeof PURPOSES)[number] | null>(null);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number] | null>(null);
  const [distance, setDistance] = useState<(typeof DISTANCES)[number] | null>(null);
  const [height, setHeight] = useState<string>('');
  const [frame, setFrame] = useState<(typeof FRAMES)[number] | null>(null);
  const [bikeClass, setBikeClass] = useState<(typeof CLASSES)[number] | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const advance = useCallback((to: number, picked: string) => {
    setPending(picked);
    setTimeout(() => {
      setPending(null);
      setStep(to);
    }, 300);
  }, []);

  const go = () => {
    const p = new URLSearchParams();
    if (terrain?.filterTerrain) p.set('terrain', terrain.filterTerrain);
    if (terrain) p.set('ride', terrain.id);
    if (purpose) p.set('purpose', purpose.id);
    if (budget) p.set('budget', String(budget.max));
    if (distance) p.set('distance', String(distance.miles));
    if (height) p.set('height', height);
    if (frame && frame.id !== 'no-preference') p.set('frame', frame.id);
    if (bikeClass && bikeClass.id !== 'no-preference') p.set('class', bikeClass.id);
    router.push(`/e-bikes/overzicht?${p.toString()}`);
  };

  const ready = step >= 6;

  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden"
      style={{ backgroundColor: 'var(--bordeaux-deep)', color: 'var(--on-bordeaux)' }}
    >
      {/* Terrain contour texture */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ color: 'var(--gold)', opacity: terrain ? 0.10 : 0.055, transition: 'opacity 0.6s ease' }}
        preserveAspectRatio="none"
        viewBox="0 0 1200 600"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d={`M-50 ${90 + i * 58} C 200 ${40 + i * 58}, 420 ${150 + i * 58}, 640 ${90 + i * 58} S 1050 ${30 + i * 58}, 1260 ${110 + i * 58}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        ))}
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full"
        style={{ background: 'radial-gradient(circle, var(--gold-soft) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-12 md:min-h-[calc(100vh-4rem)] md:grid-cols-12 md:items-center md:py-0 lg:px-8">
        {/* Left: brand + answered chips + the felt verb */}
        <div className="md:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--muted-on-bordeaux)' }}>
            The e-bike finder
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-[1.05] sm:text-4xl">
            {terrain ? (
              <>
                You ride to{' '}
                <span style={{ color: 'var(--gold)' }} className="hk-rise inline-block">
                  {terrain.verb}.
                </span>
              </>
            ) : (
              <>It starts with the road under you.</>
            )}
          </h1>
          {terrain && (
            <p className="hk-rise mt-3 max-w-xs text-sm leading-relaxed" style={{ color: 'var(--muted-on-bordeaux)' }}>
              {terrain.feel}
            </p>
          )}

          {/* Answered chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              terrain && { k: 'Terrain', v: terrain.label, at: 0 },
              purpose && { k: 'Use', v: purpose.label, at: 1 },
              budget && { k: 'Budget', v: budget.label, at: 2 },
              distance && { k: 'Distance', v: distance.label, at: 3 },
              height && { k: 'Height', v: `${height}"`, at: 4 },
              frame && { k: 'Frame', v: frame.label, at: 5 },
              bikeClass && { k: 'Class', v: bikeClass.label, at: 5 },
            ]
              .filter(Boolean)
              .map((c) => {
                const chip = c as { k: string; v: string; at: number };
                return (
                  <button
                    key={chip.k}
                    onClick={() => setStep(chip.at)}
                    className="group flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{ backgroundColor: 'var(--bordeaux-raised)', color: 'var(--on-bordeaux)' }}
                  >
                    <span style={{ color: 'var(--gold)' }}>{chip.k}</span>
                    <span style={{ color: 'var(--muted-on-bordeaux)' }}>{chip.v}</span>
                    <span className="opacity-0 transition-opacity group-hover:opacity-100" style={{ color: 'var(--muted-on-bordeaux)' }}>edit</span>
                  </button>
                );
              })}
          </div>

          {/* Progress ticks */}
          <div className="mt-8 flex items-center gap-2" aria-hidden>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: i === Math.min(step, 5) && !ready ? 40 : 14,
                  backgroundColor: i < step || ready ? 'var(--gold)' : 'var(--border-on-bordeaux)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: active question + next peek */}
        <div className="md:col-span-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            {/* Active */}
            <div key={step} className="hk-slide-in">
              {!ready ? (
                <>
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--gold)' }}>
                      0{step + 1}
                    </span>
                    <h2 className="text-2xl font-bold sm:text-3xl">{QUESTIONS[step]}</h2>
                  </div>

                  <div className="mt-6 space-y-2.5">
                    {step === 0 &&
                      TERRAINS.map((t) => {
                        const active = pending === `t:${t.id}`;
                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              setTerrain(t);
                              advance(1, `t:${t.id}`);
                            }}
                            className="group flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-200"
                            style={{
                              backgroundColor: active ? 'var(--gold)' : 'var(--bordeaux)',
                              color: active ? 'var(--cta-ink)' : 'var(--on-bordeaux)',
                              boxShadow: active ? '0 10px 30px oklch(0.23 0.095 12 / 0.45)' : 'none',
                            }}
                          >
                            <span
                              className="shrink-0 transition-colors"
                              style={{ color: active ? 'var(--cta-ink)' : 'var(--gold)' }}
                            >
                              {t.icon}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-bold">{t.label}</span>
                              <span
                                className="block truncate text-sm"
                                style={{ color: active ? 'var(--cta-ink)' : 'var(--muted-on-bordeaux)' }}
                              >
                                {t.feel}
                              </span>
                            </span>
                            <span
                              className="hidden text-lg font-extrabold italic sm:block"
                              style={{ color: active ? 'var(--cta-ink)' : 'var(--gold)', opacity: active ? 1 : 0.55 }}
                            >
                              {t.verb}
                            </span>
                          </button>
                        );
                      })}

                    {step === 1 &&
                      PURPOSES.map((o) => {
                        const active = pending === `p:${o.id}`;
                        return (
                          <button
                            key={o.id}
                            onClick={() => {
                              setPurpose(o);
                              advance(2, `p:${o.id}`);
                            }}
                            className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-all duration-200"
                            style={{
                              backgroundColor: active ? 'var(--gold)' : 'var(--bordeaux)',
                              color: active ? 'var(--cta-ink)' : 'var(--on-bordeaux)',
                            }}
                          >
                            <span className="font-bold">{o.label}</span>
                            <span className="text-sm" style={{ color: active ? 'var(--cta-ink)' : 'var(--muted-on-bordeaux)' }}>
                              {o.hint}
                            </span>
                          </button>
                        );
                      })}

                    {step === 2 &&
                      BUDGETS.map((o) => {
                        const active = pending === `b:${o.id}`;
                        return (
                          <button
                            key={o.id}
                            onClick={() => {
                              setBudget(o);
                              advance(3, `b:${o.id}`);
                            }}
                            className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-all duration-200"
                            style={{
                              backgroundColor: active ? 'var(--gold)' : 'var(--bordeaux)',
                              color: active ? 'var(--cta-ink)' : 'var(--on-bordeaux)',
                            }}
                          >
                            <span className="font-bold">{o.label}</span>
                            <span className="text-sm" style={{ color: active ? 'var(--cta-ink)' : 'var(--muted-on-bordeaux)' }}>
                              {o.hint}
                            </span>
                          </button>
                        );
                      })}

                    {step === 3 &&
                      DISTANCES.map((o) => {
                        const active = pending === `d:${o.id}`;
                        return (
                          <button
                            key={o.id}
                            onClick={() => {
                              setDistance(o);
                              advance(4, `d:${o.id}`);
                            }}
                            className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-all duration-200"
                            style={{
                              backgroundColor: active ? 'var(--gold)' : 'var(--bordeaux)',
                              color: active ? 'var(--cta-ink)' : 'var(--on-bordeaux)',
                            }}
                          >
                            <span className="font-bold">{o.label}</span>
                            <span className="text-sm" style={{ color: active ? 'var(--cta-ink)' : 'var(--muted-on-bordeaux)' }}>
                              {o.hint}
                            </span>
                          </button>
                        );
                      })}

                    {step === 4 && (
                      <div className="space-y-4">
                        <p className="text-sm" style={{ color: 'var(--muted-on-bordeaux)' }}>
                          We&apos;ll recommend bikes that fit your body.
                        </p>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="e.g. 69"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full rounded-2xl px-5 py-4 text-lg font-bold outline-none transition-all"
                            style={{
                              backgroundColor: 'var(--bordeaux)',
                              color: 'var(--on-bordeaux)',
                              border: '2px solid var(--border-on-bordeaux)',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
                            onBlur={(e) => (e.target.style.borderColor = 'var(--border-on-bordeaux)')}
                          />
                          <span
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none"
                            style={{ color: 'var(--muted-on-bordeaux)' }}
                          >
                            inches
                          </span>
                        </div>
                        <button
                          onClick={() => { if (height) advance(5, `h:${height}`); }}
                          disabled={!height}
                          className="w-full rounded-2xl px-5 py-4 text-center font-bold transition-all disabled:opacity-30"
                          style={{ backgroundColor: 'var(--gold)', color: 'var(--cta-ink)' }}
                        >
                          Continue
                        </button>
                      </div>
                    )}

                    {step === 5 && (
                      <div className="space-y-2.5">
                        <p className="text-sm mb-4" style={{ color: 'var(--muted-on-bordeaux)' }}>
                          Pick a frame style, then a class.
                        </p>
                        {!frame ? (
                          <>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] mb-2" style={{ color: 'var(--gold)' }}>Frame type</p>
                            {FRAMES.map((o) => {
                              const active = pending === `f:${o.id}`;
                              return (
                                <button
                                  key={o.id}
                                  onClick={() => {
                                    setFrame(o);
                                    setPending(`f:${o.id}`);
                                    setTimeout(() => setPending(null), 300);
                                  }}
                                  className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-all duration-200"
                                  style={{
                                    backgroundColor: active ? 'var(--gold)' : 'var(--bordeaux)',
                                    color: active ? 'var(--cta-ink)' : 'var(--on-bordeaux)',
                                  }}
                                >
                                  <span className="font-bold">{o.label}</span>
                                  <span className="text-sm" style={{ color: active ? 'var(--cta-ink)' : 'var(--muted-on-bordeaux)' }}>
                                    {o.hint}
                                  </span>
                                </button>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] mb-2" style={{ color: 'var(--gold)' }}>Bike class</p>
                            {CLASSES.map((o) => {
                              const active = pending === `c:${o.id}`;
                              return (
                                <button
                                  key={o.id}
                                  onClick={() => {
                                    setBikeClass(o);
                                    advance(6, `c:${o.id}`);
                                  }}
                                  className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-all duration-200"
                                  style={{
                                    backgroundColor: active ? 'var(--gold)' : 'var(--bordeaux)',
                                    color: active ? 'var(--cta-ink)' : 'var(--on-bordeaux)',
                                  }}
                                >
                                  <span className="font-bold">{o.label}</span>
                                  <span className="text-sm" style={{ color: active ? 'var(--cta-ink)' : 'var(--muted-on-bordeaux)' }}>
                                    {o.hint}
                                  </span>
                                </button>
                              );
                            })}
                            <button
                              onClick={() => setFrame(null)}
                              className="mt-2 text-sm font-medium"
                              style={{ color: 'var(--muted-on-bordeaux)', opacity: 0.8 }}
                            >
                              &larr; Change frame
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {step > 0 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="mt-6 text-sm font-medium transition-opacity hover:opacity-100"
                      style={{ color: 'var(--muted-on-bordeaux)', opacity: 0.8 }}
                    >
                      &larr; Back
                    </button>
                  )}
                </>
              ) : (
                /* Payoff */
                <div className="hk-rise">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--gold)' }}>
                    Your ride is ready
                  </p>
                  <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
                    Built to {terrain?.verb.toLowerCase()}{purpose ? ` for ${purpose.label.toLowerCase()}` : ''},
                    <br className="hidden sm:block" /> within {budget?.label.toLowerCase()}.
                  </h2>
                  {(distance || height || frame || bikeClass) && (
                    <p className="mt-2 text-sm" style={{ color: 'var(--muted-on-bordeaux)' }}>
                      {[
                        distance && `${distance.label} rides`,
                        height && `${height}" tall`,
                        frame && frame.id !== 'no-preference' && frame.label,
                        bikeClass && bikeClass.id !== 'no-preference' && bikeClass.label,
                      ].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <p className="mt-4 max-w-md text-sm leading-relaxed" style={{ color: 'var(--muted-on-bordeaux)' }}>
                    We&apos;ll open your matched lineup, ranked by value and real-world range.
                    Fine-tune the small stuff with filters there.
                  </p>
                  <button
                    onClick={go}
                    className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: 'var(--gold)', color: 'var(--cta-ink)' }}
                  >
                    See your matches
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                  <div className="mt-5">
                    <button
                      onClick={() => setStep(5)}
                      className="text-sm font-medium"
                      style={{ color: 'var(--muted-on-bordeaux)' }}
                    >
                      &larr; Adjust answers
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Next peek (desktop only) */}
            {!ready && step < 5 && (
              <aside
                key={`peek-${step}`}
                className="hk-slide-in hidden w-52 select-none rounded-2xl border p-5 lg:block"
                style={{
                  borderColor: 'var(--border-on-bordeaux)',
                  backgroundColor: 'var(--bordeaux)',
                  opacity: 0.5,
                }}
                aria-hidden
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>
                  Next
                </span>
                <p className="mt-3 text-lg font-bold leading-snug">{QUESTIONS[step + 1]}</p>
                <p className="mt-2 text-xs" style={{ color: 'var(--muted-on-bordeaux)' }}>
                  {[
                    'Commute, weekends, fitness or hauling.',
                    'Four honest price brackets.',
                    'We match range to your trips.',
                    'For the perfect frame fit.',
                    'Style and speed rules.',
                  ][step]}
                </p>
              </aside>
            )}
          </div>

          {/* Skip */}
          {!ready && (
            <Link
              href="/e-bikes/overzicht"
              className="mt-10 inline-block text-sm transition-opacity hover:opacity-100"
              style={{ color: 'var(--muted-on-bordeaux)', opacity: 0.7 }}
            >
              Skip and browse all e-bikes
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
