import { getAllBikes } from '@/lib/ebike-data';
import OverzichtClient from './OverzichtClient';

export default async function FietsenOverzichtPage() {
  const allBikes = await getAllBikes();

  return <OverzichtClient initialBikes={allBikes} />;
}
