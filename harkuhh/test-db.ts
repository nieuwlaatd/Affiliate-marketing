import { createClient } from '@supabase/supabase-js';

const sb = createClient('https://sknxzqwxxweaxahhakhl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbnh6cXd4eHdlYXhhaGhha2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2ODg5NTIsImV4cCI6MjA4NTI2NDk1Mn0.ffncQksvzPGFoo5barfHRyhFM1YTWcWz6exCvPgWMOU');

async function test() {
  const { data, error } = await sb.from('ebikes').select('brand');
  console.log('Error?', error);
  console.log('Bikes count:', data?.length);
  const brands = new Set(data?.map(b => b.brand));
  console.log('Brands:', Array.from(brands));
}

test();
