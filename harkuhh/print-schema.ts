import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
  const { data, error } = await supabase.from('ebikes').select('*').limit(1);
  if (error) console.error(error);
  if (data && data[0]) {
    console.log('Keys in ebikes row:', Object.keys(data[0]));
    console.log('Sample row:', data[0]);
  } else {
    console.log('No data found.');
  }
}
run();
