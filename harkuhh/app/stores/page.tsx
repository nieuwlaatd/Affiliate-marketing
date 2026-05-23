import type { Metadata } from 'next';
import StoreMap from '@/components/StoreMap';

export const metadata: Metadata = {
  title: 'E-Bike Stores Near You — Find a Dealer',
  description:
    'Find e-bike dealers and test-ride locations worldwide. Browse our interactive map to locate sales, service, rentals and test rides near you.',
  alternates: { canonical: '/stores' },
};

export default function StoresPage() {
  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Find a Store</h1>
          <p className="text-[var(--muted)] mt-2 max-w-2xl">
            Browse e-bike dealers worldwide. Click a marker on the map or select a store from the list to see details and get directions.
          </p>
        </div>
        <StoreMap />
      </div>
    </div>
  );
}
