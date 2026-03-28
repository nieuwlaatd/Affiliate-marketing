import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sknxzqwxxweaxahhakhl.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbnh6cXd4eHdlYXhhaGhha2hsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY4ODk1MiwiZXhwIjoyMDg1MjY0OTUyfQ.TsSKh9aQaHH5lC68Alo_LK0P7BaV4IdGRP5RSemD02Y';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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
