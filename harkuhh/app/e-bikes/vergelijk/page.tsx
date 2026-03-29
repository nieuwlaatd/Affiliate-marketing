import { getAllBikes } from '@/lib/ebike-data';
import VergelijkClient from './VergelijkClient';

export default async function VergelijkPage() {
  const allBikes = await getAllBikes();

  return <VergelijkClient initialBikes={allBikes} />;
}
