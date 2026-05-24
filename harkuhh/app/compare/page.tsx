import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ShortlistProvider } from '@/lib/shortlist-context';
import { getAllBikes } from '@/lib/ebike-data';
import VergelijkClient from '../e-bikes/vergelijk/VergelijkClient';

export const metadata: Metadata = {
  title: 'Compare E-Bikes Side by Side | Specs, Scores & Price',
  description:
    'Compare up to 3 electric bikes side by side on motor, battery, range, weight, scores and price. Unbiased, data-driven reviews to help you pick.',
  alternates: { canonical: '/compare' },
};

export default async function ComparePage() {
  const allBikes = await getAllBikes();
  return (
    <ShortlistProvider>
      <Suspense>
        <VergelijkClient initialBikes={allBikes} />
      </Suspense>
    </ShortlistProvider>
  );
}
