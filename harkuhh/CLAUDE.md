@AGENTS.md

## Terminology

- **"Bovenste filters"** = De KeuzehulpBar component (`components/KeuzehulpBar.tsx`), het blok met 6 filterblokken onder "Find your perfect e-bike" op de overzichtspagina (`/e-bikes/overzicht`). Dit is GEEN vragenlijst.
- **"De vragenlijst"** = De echte Find My E-Bike quiz die je bereikt via de "Find My E-Bike" knop in de navigatie (`/e-bikes/quiz`). De bovenste filters moeten in dezelfde volgorde staan als de vragen in deze quiz.
- **"Sidebar filters"** = Het filterpaneel links op de overzichtspagina onder het kopje "Filters".

## Skills

- `/add-brand` — Onboard a new e-bike brand: scrape all bikes from their website into Supabase, scrape dealer locations into store-data.ts, and configure affiliate tracking. Usage: `/add-brand [brand name] [website URL] [optional affiliate code]`
- `/sync-brands` — Read `affiliate-partners.xlsx`, find all rows with Status="New", and automatically scrape bikes + stores + configure affiliate tracking for each. Updates the Excel file with results.
