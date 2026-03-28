import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const sbLive = createClient(
  'https://sknxzqwxxweaxahhakhl.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbnh6cXd4eHdlYXhhaGhha2hsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY4ODk1MiwiZXhwIjoyMDg1MjY0OTUyfQ.TsSKh9aQaHH5lC68Alo_LK0P7BaV4IdGRP5RSemD02Y'
);

async function migrate() {
  console.log('1. Lezen van de Engwe bikes uit output.txt...');
  const text = fs.readFileSync('C:/Users/Dylan/.gemini/antigravity/brain/6ba98a43-8cfa-4b05-8a04-a892b3dcead0/.system_generated/steps/338/output.txt', 'utf8');
  
  // The file itself contains a JSON object: {"result": "Below is the result..."}
  const envelope = JSON.parse(text);
  const resultStr = envelope.result;
  
  const startIndex = resultStr.indexOf('[');
  const endIndex = resultStr.lastIndexOf(']');
  
  if (startIndex === -1 || endIndex === -1) {
    console.error('Kon geen array vinden.');
    return;
  }
  
  const arrayStr = resultStr.substring(startIndex, endIndex + 1);
  const engweBikes = JSON.parse(arrayStr);

  console.log(`Gevonden: ${engweBikes.length} Engwe fietsen.`);

  console.log('2. Verwijderen van oude dummy data op sknxzqwxxweaxahhakhl (de live app db)...');
  const { error: delError } = await sbLive.from('ebikes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (delError) {
    console.error('Fout bij verwijderen:', delError);
    return;
  }
  console.log('Oude data successvol verwijderd.');

  console.log('3. Invoegen van de ' + engweBikes.length + ' Engwe fietsen...');
  const { error: insError } = await sbLive.from('ebikes').insert(engweBikes);

  if (insError) {
    console.error('Fout bij invoegen:', insError);
    return;
  }

  console.log('Migratie succesvol! De app db heeft nu alleen de nieuwe Engwe fietsen.');
}

migrate();
