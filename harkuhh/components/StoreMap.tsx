'use client';

import { useState, useMemo, useEffect } from 'react';
import { Store, STORES, getUniqueCountries, getUniqueBrands } from '@/lib/store-data';

const TYPE_LABELS: Record<string, string> = {
  sales: 'Sales',
  service: 'Service',
  'test-ride': 'Test Rides',
  rental: 'Rentals',
};

function StoreCard({ store, selected, onClick }: { store: Store; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        selected
          ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-md'
          : 'border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-sm text-[var(--foreground)] truncate">{store.name}</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">{store.city}, {store.country}</p>
        </div>
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--accent)]">
          {store.countryCode}
        </span>
      </div>
      <p className="text-xs text-[var(--muted)] mt-2">{store.address ? `${store.address}, ` : ''}{store.city}</p>
      <p className="text-xs text-[var(--muted)]">{store.phone || store.zip}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {store.brands.map(b => (
          <span key={b} className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: 'var(--accent)', color: 'var(--on-bordeaux)' }}>
            {b}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 mt-1.5">
        {store.types.map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted)] bg-[var(--surface)]">
            {TYPE_LABELS[t]}
          </span>
        ))}
      </div>
    </button>
  );
}

function StoreDetail({ store, onClose }: { store: Store; onClose: () => void }) {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--accent)] p-5 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg text-[var(--foreground)]">{store.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {store.brands.map(b => (
              <span key={b} className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: 'var(--accent)', color: 'var(--on-bordeaux)' }}>
                {b}
              </span>
            ))}
          </div>
        </div>
        <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--foreground)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="mt-3 space-y-1 text-sm text-[var(--muted)]">
        {store.address && <p>{store.address}</p>}
        <p>{store.city}{store.state ? `, ${store.state}` : ''} {store.zip}</p>
        <p>{store.country}</p>
        <p>{store.phone}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {store.types.map(t => (
          <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--accent)] bg-[var(--surface)] font-medium">
            {TYPE_LABELS[t]}
          </span>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.address} ${store.city} ${store.country}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-ink)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          Directions
        </a>
        {store.website && (
          <a
            href={store.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-all"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            Website
          </a>
        )}
      </div>
    </div>
  );
}

function LeafletMap({ stores, selectedStore, onSelectStore }: {
  stores: Store[];
  selectedStore: Store | null;
  onSelectStore: (store: Store | null) => void;
}) {
  const [mapReady, setMapReady] = useState(false);
  const [mapInstance, setMapInstance] = useState<{ map: L.Map; markers: L.Marker[] } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (cancelled) return;

      const container = document.getElementById('store-map');
      if (!container || container.querySelector('.leaflet-container')) return;

      const map = L.map(container, {
        center: [30.0, -20.0],
        zoom: 2,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const defaultIcon = L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;border-radius:50%;background:oklch(0.78 0.115 80);border:2.5px solid oklch(0.992 0.004 60);box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const selectedIcon = L.divIcon({
        className: '',
        html: `<div style="width:20px;height:20px;border-radius:50%;background:oklch(0.31 0.115 14);border:3px solid oklch(0.78 0.115 80);box-shadow:0 0 0 4px oklch(0.31 0.115 14 / 0.25), 0 2px 8px rgba(0,0,0,0.4);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const markers = stores.map(store => {
        const marker = L.marker([store.lat, store.lng], { icon: defaultIcon });
        marker.addTo(map);
        marker.on('click', () => onSelectStore(store));
        marker.bindTooltip(`<b>${store.name}</b><br/>${store.city}, ${store.country}`, {
          direction: 'top',
          offset: [0, -10],
          className: 'store-tooltip',
        });
        (marker as L.Marker & { _storeId: string })._storeId = store.id;
        return marker;
      });

      setMapInstance({ map, markers });
      setMapReady(true);

      // Store references for cleanup
      (container as HTMLElement & { _leafletMap?: L.Map })._leafletMap = map;
    }

    init();

    return () => {
      cancelled = true;
      const container = document.getElementById('store-map');
      if (container) {
        const existingMap = (container as HTMLElement & { _leafletMap?: L.Map })._leafletMap;
        if (existingMap) {
          existingMap.remove();
          delete (container as HTMLElement & { _leafletMap?: L.Map })._leafletMap;
        }
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update markers when stores or selection changes
  useEffect(() => {
    if (!mapInstance || !mapReady) return;

    (async () => {
      const L = (await import('leaflet')).default;

      const defaultIcon = L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;border-radius:50%;background:oklch(0.78 0.115 80);border:2.5px solid oklch(0.992 0.004 60);box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const selectedIconDef = L.divIcon({
        className: '',
        html: `<div style="width:20px;height:20px;border-radius:50%;background:oklch(0.31 0.115 14);border:3px solid oklch(0.78 0.115 80);box-shadow:0 0 0 4px oklch(0.31 0.115 14 / 0.25), 0 2px 8px rgba(0,0,0,0.4);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const storeIds = new Set(stores.map(s => s.id));

      mapInstance.markers.forEach(marker => {
        const id = (marker as L.Marker & { _storeId: string })._storeId;
        if (storeIds.has(id)) {
          marker.setOpacity(1);
          marker.setIcon(selectedStore?.id === id ? selectedIconDef : defaultIcon);
        } else {
          marker.setOpacity(0.15);
          marker.setIcon(defaultIcon);
        }
      });

      if (selectedStore) {
        mapInstance.map.flyTo([selectedStore.lat, selectedStore.lng], 10, { duration: 0.8 });
      } else if (stores.length > 0 && stores.length < STORES.length) {
        const bounds = L.latLngBounds(stores.map(s => [s.lat, s.lng] as [number, number]));
        mapInstance.map.flyToBounds(bounds.pad(0.3), { duration: 0.8 });
      }
    })();
  }, [stores, selectedStore, mapInstance, mapReady]);

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] overflow-hidden">
      <div id="store-map" className="w-full h-[400px] sm:h-[500px] lg:h-[560px]" />
    </div>
  );
}

export default function StoreMap() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const countries = useMemo(() => getUniqueCountries(), []);
  const brands = useMemo(() => getUniqueBrands(), []);

  const filteredStores = useMemo(() => {
    return STORES.filter(s => {
      if (filterCountry !== 'all' && s.countryCode !== filterCountry) return false;
      if (filterBrand !== 'all' && !s.brands.some(b => b.toLowerCase() === filterBrand.toLowerCase())) return false;
      return true;
    });
  }, [filterCountry, filterBrand]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Map */}
      <div className="flex-1 min-w-0">
        <LeafletMap
          stores={filteredStores}
          selectedStore={selectedStore}
          onSelectStore={setSelectedStore}
        />

        {/* Selected store detail (mobile) */}
        {selectedStore && (
          <div className="mt-4 lg:hidden">
            <StoreDetail store={selectedStore} onClose={() => setSelectedStore(null)} />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 xl:w-96 shrink-0">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mb-4">
          <div className="flex-1">
            <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1.5 block">Country</label>
            <select
              value={filterCountry}
              onChange={e => { setFilterCountry(e.target.value); setSelectedStore(null); }}
              className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="all">All Countries ({STORES.length})</option>
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name} ({c.count})</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1.5 block">Brand</label>
            <select
              value={filterBrand}
              onChange={e => { setFilterBrand(e.target.value); setSelectedStore(null); }}
              className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="all">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Store count */}
        <p className="text-xs text-[var(--muted)] mb-3">
          {filteredStores.length} {filteredStores.length === 1 ? 'store' : 'stores'} found
        </p>

        {/* Store list */}
        <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1 scrollbar-hide">
          {filteredStores.map(store => (
            <StoreCard
              key={store.id}
              store={store}
              selected={selectedStore?.id === store.id}
              onClick={() => setSelectedStore(selectedStore?.id === store.id ? null : store)}
            />
          ))}
          {filteredStores.length === 0 && (
            <div className="text-center py-12 text-[var(--muted)]">
              <p className="text-sm">No stores found for these filters.</p>
              <button
                onClick={() => { setFilterCountry('all'); setFilterBrand('all'); }}
                className="text-sm text-[var(--accent)] font-medium mt-2 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Selected store detail (desktop) */}
        {selectedStore && (
          <div className="hidden lg:block mt-4">
            <StoreDetail store={selectedStore} onClose={() => setSelectedStore(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
