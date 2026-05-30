import './load-env';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function test() {
  const { data, error } = await sb.from('ebikes').select('brand');
  console.log('Error?', error);
  console.log('Bikes count:', data?.length);
  const brands = new Set(data?.map(b => b.brand));
  console.log('Brands:', Array.from(brands));
}

test();
