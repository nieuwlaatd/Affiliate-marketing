import { ShortlistProvider } from '@/lib/shortlist-context';
import ShortlistBar from '@/components/ShortlistBar';

export default function EBikesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShortlistProvider>
      {children}
      <ShortlistBar />
    </ShortlistProvider>
  );
}
