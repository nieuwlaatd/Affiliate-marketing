import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllBikes } from '@/lib/ebike-data';
import VergelijkClient from './VergelijkClient';

export const metadata: Metadata = {
  title: 'Compare E-Bikes Side by Side | Specs, Scores & Price',
  description:
    'Compare up to 3 electric bikes side by side on motor, battery, range, weight, scores and price. Unbiased, data-driven reviews to help you pick.',
  alternates: { canonical: '/e-bikes/vergelijk' },
};

export default async function VergelijkPage() {
  const allBikes = await getAllBikes();

  return (
    <Suspense>
      <VergelijkClient initialBikes={allBikes} />
    </Suspense>
  );
}
