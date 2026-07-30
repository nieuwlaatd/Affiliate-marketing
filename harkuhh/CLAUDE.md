## Terminology

- "Bovenste filters" = KeuzehulpBar (`components/KeuzehulpBar.tsx`), 6 filter blocks on /e-bikes/overzicht. NOT a questionnaire; order must match the quiz questions.
- "De vragenlijst" = the Find My E-Bike quiz (/e-bikes/quiz).
- "Sidebar filters" = left filter panel on /e-bikes/overzicht.

## Skills (defined in .claude/skills/)

- `/add-brand [name] [url] [affiliate code?]` - onboard brand: scrape bikes to Supabase, dealers to store-data.ts, configure affiliate tracking
- `/sync-brands` - process Status="New" rows in affiliate-partners.xlsx (scrape + affiliate config), update Excel with results
