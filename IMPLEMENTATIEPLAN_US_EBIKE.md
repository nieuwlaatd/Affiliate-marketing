# Implementatieplan: E-Bike Keuzehulp VS Markt

> **Legenda:**
> - 🤖 = Claude kan dit uitvoeren (code, content, automatisering)
> - 👤 = Dylan moet dit zelf doen (accounts, platforms, creatief, juridisch)
> - 🤝 = Samenwerking (Claude bereidt voor, Dylan voert uit)

## Huidige situatie

**Project:** Harkuhh (Next.js + Supabase + Brevo)
**Stack:** Next.js 16, Supabase, Brevo email, Vercel hosting
**Features:** E-bike overzicht, filters, vergelijktool, shortlist, deal-systeem, admin panel, click tracking
**Probleem:** Slechts 1 affiliate partner (Engwe), te weinig NL e-bike programma's
**Oplossing:** Herpositioneren naar de Amerikaanse markt (30+ affiliate programma's beschikbaar)

---

## Fase 0: Voorbereiding & Strategie (Week 1)

### 0.1 Merknaam & Domein

| Taak | Wie | Details |
|------|-----|---------|
| Nieuwe merknaam brainstormen | 🤝 | Claude genereert opties, Dylan kiest |
| Domeinnaam registreren | 👤 | .com domein kopen via registrar (bijv. Namecheap, Cloudflare) |
| Logo ontwerpen/aanpassen | 👤 | Hergebruik design-stijl met Engelse naam (Canva/Krita) |
| Vercel project aanmaken | 👤 | Nieuw project aanmaken, domein koppelen, environment variables instellen |
| Vercel environment variables configureren | 👤 | SUPABASE_URL, SUPABASE_ANON_KEY, BREVO_API_KEY etc. |

### 0.2 Affiliate Programma Aanmeldingen (parallel starten)

Meld je direct aan bij alle programma's. Goedkeuring duurt 1-14 dagen.

**Prioriteit 1 - Direct aanmelden (grote netwerken):**

| Merk | Netwerk | Commissie | Aanmeld-URL | Wie |
|------|---------|-----------|-------------|-----|
| Aventon | AvantLink | 4% | aventon.com/pages/affiliate-program | 👤 |
| Velotric | Impact | 7% | velotricbike.com/pages/affiliate | 👤 |
| Lectric | ShareASale | ~5% | Via ShareASale zoeken | 👤 |
| Rad Power Bikes | Impact Radius | ~5% | Via Impact zoeken | 👤 |
| Ride1Up | Direct | ~5% | ride1up.com/affiliate-program | 👤 |
| ENGWE | ShareASale/GoAffPro | 5% | Al aangemeld! | ✅ |

**Prioriteit 2 - Hoog commissie:**

| Merk | Netwerk | Commissie | Aanmeld-URL | Wie |
|------|---------|-----------|-------------|-----|
| Velowave | ShareASale | 7-10% | Via ShareASale | 👤 |
| Blix Bike | Direct | 10% | blix.com | 👤 |
| VIVI | Direct | 12-15% | viviebikes.com/pages/affiliate-program | 👤 |
| Leoguar | Direct | 15% | leoguarbikes.com/pages/affiliate-program | 👤 |
| CEMOTO | Direct | 8-15% | cemotoride.com/pages/affiliate-program | 👤 |
| Vvolt | Direct | 10%+ | vvolt.com/pages/affiliate | 👤 |
| Juiced Bikes | Direct | 4-10% | juicedbikes.com | 👤 |

**Prioriteit 3 - Breed assortiment:**

| Merk | Netwerk | Commissie | Wie |
|------|---------|-----------|-----|
| Himiway | UpPromote | 5%+ | 👤 |
| Heybike | GoAffPro | 3% | 👤 |
| Trek | AvantLink | 4-8% | 👤 |
| Specialized | Rakuten | 3-12% | 👤 |
| Mokwheel | Direct | ~5% | 👤 |
| KBO | Direct | ~5% | 👤 |
| Magicycle | Direct | ~5% | 👤 |
| Super73 | Direct | ~5% | 👤 |
| Retrospec | Direct | ~5% | 👤 |
| Buzz Bicycles | Direct | ~5% | 👤 |
| Wallke | GoAffPro | ~5% | 👤 |
| Andsky | Direct | ~5% | 👤 |

**Benodigde accounts op affiliate netwerken:**

| Netwerk | URL | Dekking | Wie |
|---------|-----|---------|-----|
| ShareASale | shareasale.com | Lectric, Velowave, ENGWE, ICAN | 👤 Account aanmaken |
| Impact Radius | impact.com | Rad Power, Velotric, Competitive Cyclist | 👤 Account aanmaken |
| AvantLink | avantlink.com | Aventon, Trek, WOOM, Tern | 👤 Account aanmaken |
| Rakuten | rakutenadvertising.com | Specialized | 👤 Account aanmaken |
| GoAffPro | goaffpro.com | Heybike, Wallke, ENGWE EU | 👤 Account aanmaken |

**Na goedkeuring:**

| Taak | Wie | Details |
|------|-----|---------|
| Affiliate IDs/tokens verzamelen | 👤 | Noteer per merk: affiliate ID, tracking URL format, cookie duration |
| Affiliate IDs in code invoeren | 🤝 | Dylan geeft IDs door, Claude bouwt ze in ebike-data.ts |
| W-8BEN belastingformulier invullen | 👤 | Vereist door US netwerken voor non-US affiliates |

### 0.3 Concurrentie-analyse

| Taak | Wie | Details |
|------|-----|---------|
| Concurrenten analyseren | 🤖 | Claude analyseert sites op structuur, content, features |
| Positioneringsstrategie bepalen | 🤝 | Claude stelt voor, Dylan beslist |

**Referentiesites:**

| Site | Sterk punt | Jouw differentiatie |
|------|-----------|---------------------|
| electricbikereview.com | Diepgaande hands-on reviews | Jij: interactieve quiz/keuzehulp |
| electricbikereport.com | 10+ jaar reviews, 130+ bikes/jaar | Jij: data-driven vergelijking, niet hands-on |
| ebikeescape.com | Kortingscodes + reviews | Jij: betere UX, quiz funnel |
| ebikes.org | Breed overzicht | Jij: gepersonaliseerde aanbeveling |

**Jouw USP:** Geen van deze sites heeft een echte interactieve keuzehulp/quiz die merk-onafhankelijk adviseert. Dat is jouw gat in de markt.

---

## Fase 1: Technische Ombouw (Week 2-3)

### 1.1 Internationalisatie / Vertaling

**Alle onderstaande codewijzigingen worden door Claude uitgevoerd 🤖:**

| Bestand | Wat moet er gebeuren | Wie |
|---------|---------------------|-----|
| `lib/types.ts` | NL types vertalen naar EN + nieuwe types (QuizState, QuizLead, BikeClass) | 🤖 |
| `lib/ebike-filters.ts` | Engelse filter-labels, miles/lbs/USD logica | 🤖 |
| `lib/ebike-data.ts` | Multi-affiliate URL tagging systeem bouwen | 🤖 |
| `lib/brevo.ts` | Engelse email templates (quiz results, welcome, deals) | 🤖 |
| `components/BikeCard.tsx` | Engelse labels, USD prijzen, miles/lbs | 🤖 |
| `components/HeroSection.tsx` | Engelse UI, quiz CTA | 🤖 |
| `components/Header.tsx` | Engelse navigatie, nieuwe sitename | 🤖 |
| `components/Footer.tsx` | Engelse footer, affiliate disclosure (FTC compliant) | 🤖 |
| `app/layout.tsx` | `lang="en"`, Engelse metadata, nieuwe titel | 🤖 |
| `app/page.tsx` | Engelse homepage met quiz CTA | 🤖 |
| `app/e-bikes/**` | Alle e-bike pagina's vertalen | 🤖 |

**Concrete codewijzigingen:**

**types.ts - Nieuwe types toevoegen:** 🤖
```typescript
// Vervang NL types
export type UsageType = 'commuting' | 'recreation' | 'sport' | 'cargo' | 'off-road';
export type FrameType = 'step-through' | 'step-over' | 'sport';
export type MotorType = 'mid-drive' | 'front-hub' | 'rear-hub';
export type PriceCategory = 'budget' | 'mid-range' | 'premium';
export type BikeClass = 'class-1' | 'class-2' | 'class-3';

export interface QuizState {
  step: number;
  ridingPurpose: UsageType[];
  budget: [number, number];
  terrain: 'flat' | 'hilly' | 'mixed' | null;
  distance: number | null;
  riderHeight: number | null;
  riderWeight: number | null;
  framePreference: FrameType | null;
  bikeClass: BikeClass | null;
  foldable: boolean | null;
  mustHaves: ('removable-battery' | 'throttle' | 'suspension' | 'cargo-rack')[];
}

export interface QuizLead {
  id: string;
  email: string;
  name: string | null;
  quiz_answers: QuizState;
  recommended_bikes: string[];
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
}
```

**ebike-data.ts - Multi-affiliate URL logica:** 🤖
```typescript
const AFFILIATE_TAGS: Record<string, (url: string) => string> = {
  'engwe':    (url) => appendParam(url, 'ref', 'uzjsbqmm'),
  'aventon':  (url) => replaceHost(url, 'aventon.com', 'avantlink-tracking-url'),
  'velotric': (url) => appendParam(url, 'irclickid', 'YOUR_IMPACT_ID'),
  'lectric':  (url) => appendParam(url, 'sscid', 'YOUR_SHAREASALE_ID'),
  'rad':      (url) => appendParam(url, 'irclickid', 'YOUR_RAD_IMPACT_ID'),
  // Dylan vult IDs in na goedkeuring affiliateprogramma's
};
```

### 1.2 Database Schema Uitbreiden (Supabase)

| Taak | Wie | Details |
|------|-----|---------|
| SQL migratie schrijven | 🤖 | Claude schrijft alle ALTER TABLE en CREATE TABLE statements |
| SQL uitvoeren in Supabase dashboard | 👤 | Dylan opent Supabase SQL Editor en voert de queries uit |
| Row Level Security policies instellen | 🤖 | Claude schrijft RLS policies |
| RLS policies activeren | 👤 | Dylan voert uit in Supabase dashboard |

**SQL migratie (geschreven door Claude 🤖, uitgevoerd door Dylan 👤):**

```sql
-- Nieuwe kolommen voor ebikes tabel
ALTER TABLE ebikes ADD COLUMN bike_class TEXT;
ALTER TABLE ebikes ADD COLUMN has_throttle BOOLEAN;
ALTER TABLE ebikes ADD COLUMN has_suspension TEXT;
ALTER TABLE ebikes ADD COLUMN max_speed_mph INTEGER;
ALTER TABLE ebikes ADD COLUMN range_miles INTEGER;
ALTER TABLE ebikes ADD COLUMN price_usd NUMERIC;
ALTER TABLE ebikes ADD COLUMN affiliate_network TEXT;
ALTER TABLE ebikes ADD COLUMN affiliate_program_id TEXT;
ALTER TABLE ebikes ADD COLUMN commission_pct NUMERIC;
ALTER TABLE ebikes ADD COLUMN cookie_days INTEGER;
ALTER TABLE ebikes ADD COLUMN brand_country TEXT;
ALTER TABLE ebikes ADD COLUMN ships_to_us BOOLEAN DEFAULT TRUE;
ALTER TABLE ebikes ADD COLUMN warranty_years INTEGER;
ALTER TABLE ebikes ADD COLUMN weight_lbs NUMERIC;

-- Nieuwe tabel: quiz_leads
CREATE TABLE quiz_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  quiz_answers JSONB NOT NULL,
  recommended_bikes TEXT[] NOT NULL,
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  converted BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_leads_email ON quiz_leads(email);
CREATE INDEX idx_quiz_leads_created ON quiz_leads(created_at);

-- Nieuwe tabel: email_sequences
CREATE TABLE email_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES quiz_leads(id),
  sequence_name TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.3 URL Structuur (SEO)

| Taak | Wie | Details |
|------|-----|---------|
| Nieuwe pagina's en routes aanmaken | 🤖 | Claude maakt alle app/ directories en page.tsx bestanden |
| Redirects van oude NL routes | 🤖 | Claude schrijft next.config.js redirects |
| Sitemap.xml genereren | 🤖 | Claude bouwt dynamische sitemap |
| robots.txt aanpassen | 🤖 | Claude past aan voor nieuwe structuur |

**Nieuwe structuur (US) - gebouwd door Claude 🤖:**
```
/                                    -> Homepage met quiz CTA
/quiz                                -> E-bike Finder Quiz (lead gen)
/ebikes                              -> Overzicht alle e-bikes
/ebikes/[brand]/[model]              -> Individuele bike pagina
/compare                             -> Vergelijktool
/best/[category]                     -> "Best ebike for commuting" etc. (SEO)
/vs/[brand1]-vs-[brand2]             -> "Aventon vs Rad Power" (SEO)
/deals                               -> Actuele kortingscodes
/guides/[slug]                       -> Buyer guides (content)
/blog/[slug]                         -> Blog posts (SEO content)
/api/quiz/submit                     -> Quiz resultaat + email capture
/api/track-click                     -> Affiliate click tracking (bestaand)
```

### 1.4 Nieuwe Componenten Bouwen

**Alle componenten worden door Claude gebouwd 🤖:**

| Component | Bestand | Details |
|-----------|---------|---------|
| Quiz Wizard | `app/quiz/page.tsx` + `components/Quiz/` | 7-staps wizard met animaties |
| Quiz Results | `components/Quiz/QuizResults.tsx` | Top 3 bikes met affiliate links |
| Best-of Page | `app/best/[category]/page.tsx` | Dynamische SEO lijstpagina's |
| VS Comparison | `app/vs/[slug]/page.tsx` | "X vs Y" vergelijkingspagina's |
| Exit Intent Popup | `components/ExitIntentPopup.tsx` | Quiz CTA bij verlaten site |
| Price Alert CTA | `components/PriceAlertCTA.tsx` | Email capture voor prijsdaling |
| PDF Comparison | `components/ComparisonPDF.tsx` | Downloadbare vergelijking |
| Schema Markup | Per pagina-type | Product, Review, FAQ structured data |
| FTC Disclosure | `components/AffiliateDisclosure.tsx` | Wettelijk vereiste affiliate vermelding |

**Quiz Stappen (gebouwd door Claude 🤖):**

| Stap | Vraag | UI Element |
|------|-------|------------|
| 1 | What will you use your e-bike for? | Multi-select cards |
| 2 | What's your budget? | Range slider ($500 - $5,000) |
| 3 | What terrain will you ride on? | Single-select cards |
| 4 | How far do you typically ride? | Slider (1-50+ miles) |
| 5 | What's your height and weight? | Input fields (ft/in + lbs) |
| 6 | Any must-have features? | Multi-select chips |
| 7 | Where should we send your results? | Email input (LEAD CAPTURE) |

---

## Fase 2: Content & Data Vulling (Week 3-5)

### 2.1 E-Bike Database Vullen

**Doel:** Minimaal 80 e-bikes van 20+ merken in de database

| Taak | Wie | Details |
|------|-----|---------|
| Data scraper schrijven voor US bikes | 🤖 | Aanpassen bestaande scrape-advanced.ts voor US specs |
| Bike data verzamelen en structureren | 🤖 | Claude scrapet manufacturer websites voor specs |
| Data valideren en aanvullen | 🤝 | Claude vult in, Dylan checkt steekproeven |
| Data importeren in Supabase | 👤 | Dylan voert INSERT queries uit of importeert CSV |
| Afbeeldingen verzamelen | 🤝 | Claude zoekt URLs, Dylan controleert op copyright |

**Prioriteit bikes toevoegen per merk:**

| Merk | Aantal modellen | Prijsrange |
|------|----------------|------------|
| Aventon | 6-8 | $1,099 - $1,999 |
| Rad Power Bikes | 6-8 | $999 - $1,999 |
| Lectric | 4-6 | $799 - $1,799 |
| Velotric | 4-6 | $999 - $1,799 |
| Ride1Up | 4-6 | $1,095 - $1,895 |
| Himiway | 4-6 | $999 - $2,499 |
| Heybike | 4-6 | $599 - $1,699 |
| ENGWE | 4-6 | $699 - $1,799 |
| Trek | 4-6 | $1,999 - $5,999 |
| Specialized | 3-5 | $2,500 - $6,500 |
| Blix | 3-4 | $1,099 - $1,999 |
| Velowave | 3-4 | $999 - $1,599 |
| Juiced | 3-4 | $999 - $2,499 |
| VIVI | 3-4 | $499 - $899 |
| Leoguar | 2-3 | $699 - $1,299 |
| Super73 | 3-4 | $1,495 - $3,495 |
| Mokwheel | 2-3 | $1,299 - $2,699 |
| KBO | 2-3 | $999 - $1,599 |
| Vvolt | 2-3 | $1,499 - $2,499 |
| Retrospec | 2-3 | $999 - $1,499 |

### 2.2 Scoring Systeem

| Taak | Wie | Details |
|------|-----|---------|
| Scoring algoritme ontwikkelen | 🤖 | Claude bouwt gewogen score-berekening |
| Score gewichten fine-tunen | 🤝 | Claude stelt voor, Dylan past aan op basis van marktkennis |

**Scoring model (gebouwd door Claude 🤖):**

| Score | Weging | Bron |
|-------|--------|------|
| Overall Score | Gewogen gemiddelde | Berekend |
| Value Score | 25% | Prijs vs specs ratio |
| Range Score | 20% | Bereik per dollar |
| Power Score | 15% | Koppel, motor type, bike class |
| Comfort Score | 15% | Vering, zadel, frame type |
| Build Quality | 15% | Merk reputatie, garantie, materialen |
| Versatility | 10% | Hoeveel use-cases het dekt |

### 2.3 SEO Content Schrijven

| Taak | Wie | Details |
|------|-----|---------|
| Best-of pagina content schrijven | 🤖 | Claude schrijft SEO-geoptimaliseerde content per categorie |
| VS vergelijkingspagina's genereren | 🤖 | Claude genereert dynamisch op basis van bike data |
| Buyer guides schrijven | 🤖 | Claude schrijft uitgebreide guides |
| Meta titles & descriptions | 🤖 | Claude schrijft per pagina |
| Content reviewen | 👤 | Dylan leest en keurt goed |

**Pagina's die bij launch klaar moeten zijn (geschreven door Claude 🤖):**

| Pagina | Zoekvolume (est.) | Prioriteit |
|--------|-------------------|------------|
| /best/ebikes-under-1000 | 8.100/maand | Hoog |
| /best/ebikes-under-1500 | 5.400/maand | Hoog |
| /best/commuter-ebikes | 4.400/maand | Hoog |
| /best/folding-ebikes | 3.600/maand | Hoog |
| /vs/aventon-vs-rad-power-bikes | 2.900/maand | Hoog |
| /best/ebikes-for-seniors | 2.400/maand | Medium |
| /vs/lectric-vs-rad-power | 1.900/maand | Medium |
| /best/class-3-ebikes | 1.600/maand | Medium |
| /guides/ebike-buying-guide-2026 | 1.300/maand | Medium |
| /guides/ebike-classes-explained | 1.000/maand | Medium |

---

## Fase 3: Lead Generation Flows (Week 4-6)

### 3.1 Primaire Lead Flow: E-Bike Finder Quiz

| Taak | Wie | Details |
|------|-----|---------|
| Quiz UI bouwen (7 stappen) | 🤖 | React component met animaties en progress bar |
| Quiz matching algoritme | 🤖 | Bike matching op basis van quiz antwoorden |
| API route `/api/quiz/submit` | 🤖 | Opslaan in Supabase + triggeren Brevo |
| Quiz resultaat pagina | 🤖 | Top 3 bikes met affiliate links + email bevestiging |
| A/B test varianten | 🤖 | Claude bouwt meerdere CTA varianten |

**Flow:**
```
[YouTube/Pinterest/SEO Traffic]
         |
         v
  [Landing Page: "Find Your Perfect E-Bike in 60 Seconds"]
         |
         v
  [Quiz Stap 1-6: Geen email nodig]
         |
         v
  [Stap 7: "Enter your email to get your personalized top 3"]
         |
    [Email opslaan in Supabase + Brevo]
         |
         v
  [Resultaat pagina: Top 3 bikes + affiliate links]
         |
         v
  [Email Sequence start (zie 3.3)]
```

### 3.2 Secundaire Lead Flows

| Flow | Wie bouwt het | Wie configureert |
|------|--------------|-----------------|
| Price Drop Alert popup | 🤖 Claude bouwt component | 🤖 Werkt automatisch via Supabase |
| Comparison PDF download | 🤖 Claude bouwt PDF generator | 🤖 Werkt automatisch |
| Buyer's Guide lead magnet | 🤖 Claude bouwt CTA + email flow | 👤 Dylan maakt PDF in Canva |
| Exit Intent Popup | 🤖 Claude bouwt component | 🤖 Werkt automatisch |

### 3.3 Email Sequences (Brevo)

| Taak | Wie | Details |
|------|-----|---------|
| Email templates schrijven (HTML) | 🤖 | Claude schrijft alle templates in brevo.ts |
| Brevo account configureren | 👤 | Dylan logt in en stelt in |
| SPF/DKIM records instellen | 👤 | Dylan voegt DNS records toe bij domeinregistrar |
| Brevo lijsten aanmaken | 👤 | quiz_leads, newsletter, price_alerts, guide_downloads |
| Brevo automations instellen | 👤 | Dylan maakt workflows in Brevo UI |
| API integratie bouwen | 🤖 | Claude bouwt Brevo API calls in de code |

**Sequence 1: Quiz Follow-up (7 emails, content door Claude 🤖, setup door Dylan 👤)**

| Dag | Email | Inhoud |
|-----|-------|--------|
| 0 | Quiz Results | Top 3 bikes + links + specs vergelijking |
| 1 | Deep Dive #1 | Review van #1 aanbeveling |
| 3 | Deep Dive #2 | Review van #2 aanbeveling |
| 5 | Buyer's Guide | "5 things to check before buying an e-bike" |
| 7 | Deal Alert | Kortingscodes voor aanbevolen bikes |
| 10 | Social Proof | "Why 5,000+ riders used our quiz to find their bike" |
| 14 | Last Chance | "Still looking? Here's what's new this week" |

**Sequence 2: Weekly Newsletter (content door Claude 🤖, setup door Dylan 👤)**
- Wekelijks (dinsdag): Nieuwe deals, prijsdalingen, nieuwe bikes, seizoenstips

**Sequence 3: Price Alert (automatisch via code 🤖)**
- Trigger bij prijsdaling of sale period

---

## Fase 4: Content Strategie & Social Media (Week 4-8+)

### 4.1 YouTube Strategie

| Taak | Wie | Details |
|------|-----|---------|
| YouTube kanaal aanmaken | 👤 | Business account, naam, bio, banner |
| Video scripts schrijven | 🤖 | Claude schrijft volledige scripts per video |
| Thumbnails ontwerpen | 👤 | Dylan maakt in Canva (of DaVinci) |
| Video's produceren & editen | 👤 | Dylan gebruikt CapCut/DaVinci + manufacturer beelden |
| Video beschrijvingen + SEO tags | 🤖 | Claude schrijft beschrijvingen met affiliate links |
| Upload timing bepalen | 🤖 | 18:00-20:00 NL = 12:00-14:00 EST |
| Video's uploaden | 👤 | Dylan uploadt naar YouTube |

**Content kalender (scripts door Claude 🤖, productie door Dylan 👤):**

| Week | Video | Type | Zoekwoord target |
|------|-------|------|------------------|
| 1 | "Best E-Bikes Under $1,000 in 2026" | Listicle | 8.100 zoekvolume |
| 1 | "E-Bike Classes Explained (Class 1 vs 2 vs 3)" | Educational | 3.200 |
| 2 | "Aventon vs Rad Power Bikes - Which Should You Buy?" | Vergelijking | 2.900 |
| 2 | "5 Mistakes to Avoid When Buying an E-Bike" | Tips | 1.800 |
| 3 | "Lectric XP 3.0 vs Rad Power RadRunner" | Vergelijking | 1.500 |
| 3 | "Best Folding E-Bikes 2026" | Listicle | 3.600 |
| 4 | "Best E-Bikes Under $1,500" | Listicle | 5.400 |
| 4 | "I Compared 50 E-Bikes So You Don't Have To" | Data-driven | Viral potentie |
| 5 | "Best E-Bikes for Commuting 2026" | Listicle | 4.400 |
| 5 | "Velotric vs Aventon - The Ultimate Comparison" | Vergelijking | 1.200 |
| 6 | "E-Bike Buying Guide - Everything You Need to Know" | Pillar | 1.300 |
| 6 | "Best E-Bikes for Heavy Riders (300+ lbs)" | Niche | 2.400 |
| 7 | "Best E-Bikes for Seniors 2026" | Niche | 2.400 |
| 7 | "Is a $500 E-Bike Worth It? Budget vs Premium Compared" | Educational | Viral |
| 8 | "Best Class 3 E-Bikes (28mph)" | Listicle | 1.600 |
| 8 | "Monthly E-Bike Deals Roundup" | Recurring | Subscriber retention |

**Video productie tips (zonder fysieke bikes):**
- Gebruik manufacturer afbeeldingen en spec sheets
- Screen recordings van je vergelijkingstool
- Talking head of AI voiceover met spec overlays
- Tools: CapCut (heb je al), DaVinci Resolve (heb je al)

### 4.2 Pinterest Strategie

| Taak | Wie | Details |
|------|-----|---------|
| Business account aanmaken | 👤 | Pinterest business account + website claimen |
| Boards aanmaken | 👤 | Dylan maakt boards aan (namen hieronder) |
| Pin templates ontwerpen | 🤝 | Claude levert teksten, Dylan maakt in Canva |
| Pins plannen & posten | 👤 | Dylan plant via Tailwind of Pinterest scheduler |
| Pin SEO teksten schrijven | 🤖 | Claude schrijft beschrijvingen met keywords |

**Boards (aangemaakt door Dylan 👤):**

| Board | Inhoud |
|-------|--------|
| Best E-Bikes 2026 | Elke bike als pin met specs |
| E-Bikes Under $1,000 | Budget picks |
| E-Bikes Under $1,500 | Mid-range picks |
| E-Bike Comparisons | Vergelijkingsinfographics |
| E-Bike Buying Tips | Tips en guides |
| Commuter E-Bikes | Specifieke categorie |
| Folding E-Bikes | Specifieke categorie |
| E-Bike Deals & Discounts | Actuele deals |

**Pin types & frequentie:**

| Type | Formaat | Frequentie | Wie |
|------|---------|------------|-----|
| Product Pin | 1000x1500px | 2-3 per dag | 👤 Dylan ontwerpt & post |
| Infographic Pin | 1000x2000px | 1 per dag | 👤 Dylan ontwerpt & post |
| Blog/Guide Pin | 1000x1500px | 1 per dag | 👤 Dylan ontwerpt & post |
| Video Pin | 1080x1920px | 2-3 per week | 👤 Dylan maakt & post |
| Pin teksten/beschrijvingen | - | Per pin | 🤖 Claude schrijft |

**Posting schema:** 5-8 pins per dag, gepland via Tailwind
**Timing:** 20:00-23:00 EST = 02:00-05:00 NL (voorinplannen!)

### 4.3 TikTok Strategie (Fase 2 - na initieel succes)

| Taak | Wie | Details |
|------|-----|---------|
| US SIM card kopen | 👤 | T-Mobile Tourist Plan (~$30) |
| Budget Android toestel kopen | 👤 | Factory reset, US instellingen |
| US residential proxy instellen | 👤 | ~$15/maand |
| TikTok account maken & opwarmen | 👤 | 3 dagen US content kijken |
| Video scripts schrijven | 🤖 | Claude schrijft scripts per video |
| Video's opnemen & editen | 👤 | Dylan produceert met CapCut |
| Captions & hashtags schrijven | 🤖 | Claude schrijft teksten |
| Video's uploaden | 👤 | Dylan post op US-geconfigureerd toestel |

**Content formaat:**

| Type | Lengte | Voorbeeld |
|------|--------|-----------|
| Quick Compare | 15-30s | "This $999 ebike vs this $2,999 one" |
| Myth Bust | 15-30s | "Stop believing this about ebikes" |
| POV | 30-60s | Manufacturer footage + voiceover |
| Listicle | 30-60s | "3 ebikes that are actually worth it under $1,500" |

### 4.4 Instagram Reels (Bonus kanaal)

| Taak | Wie | Details |
|------|-----|---------|
| Account aanmaken | 👤 | Business account |
| Content hergebruiken van TikTok | 👤 | Dylan past aan per platform |
| Captions schrijven | 🤖 | Claude schrijft |
| Posten | 👤 | 4-5 Reels per week |

---

## Fase 5: SEO & Organische Groei (Doorlopend)

### 5.1 On-Page SEO

| Taak | Wie | Details |
|------|-----|---------|
| Title tags & meta descriptions | 🤖 | Claude schrijft per pagina-type |
| Schema markup (Product, Review, FAQ) | 🤖 | Claude implementeert JSON-LD |
| Internal linking structuur | 🤖 | Claude bouwt automatische crosslinks |
| OpenGraph & Twitter cards | 🤖 | Claude implementeert social previews |
| Core Web Vitals optimalisatie | 🤖 | Claude optimaliseert performance |

**Per e-bike pagina (door Claude 🤖):**
- Title: "[Brand] [Model] Review 2026 - Specs, Price & Where to Buy"
- H1: "[Brand] [Model] - Complete Review & Buyer's Guide"
- Schema markup: Product, Review, FAQ

**Per best-of pagina (door Claude 🤖):**
- Title: "Best [Category] E-Bikes 2026 - Expert Picks & Comparison"
- FAQ schema met veelgestelde vragen
- Internal links naar individuele bike pagina's

### 5.2 Link Building Strategie

| Methode | Wie | Moeite | Impact |
|---------|-----|--------|--------|
| HARO / Connectively responses | 👤 Dylan schrijft & verstuurt | Medium | Hoog |
| Guest posts op cycling blogs | 👤 Dylan pitcht & plaatst | Medium | Medium |
| Reddit participatie (r/ebikes) | 👤 Dylan post & reageert | Laag | Medium |
| Quora antwoorden | 🤝 Claude schrijft, Dylan post | Laag | Laag-Medium |
| YouTube beschrijvingen met backlinks | 🤖 Claude schrijft | Laag | Medium |
| Outreach templates schrijven | 🤖 Claude schrijft email templates | - | - |

### 5.3 Content Kalender (Maandelijks)

| Content Type | Frequentie | Wie |
|-------------|------------|-----|
| Nieuwe bike toevoegen aan database | 4-8 per maand | 🤖 Claude scrapet & importeert |
| Best-of pagina (nieuw of update) | 2 per maand | 🤖 Claude schrijft |
| Vergelijkingspagina | 2-4 per maand | 🤖 Claude genereert |
| Buyer guide / blog post | 2 per maand | 🤖 Claude schrijft |
| YouTube video script | 4-8 per maand | 🤖 Claude schrijft |
| YouTube video productie | 4-8 per maand | 👤 Dylan produceert |
| Pinterest pins | 150-240 per maand | 👤 Dylan ontwerpt & post |
| Email newsletter | 4 per maand | 🤖 Claude schrijft content |
| Deal updates | Doorlopend | 🤖 Claude monitort & update |

---

## Fase 6: Monetisatie & Tracking (Week 5-6)

### 6.1 Revenue Streams

| Stream | Verwachte bijdrage | Wanneer |
|--------|-------------------|---------|
| Affiliate commissies (primair) | 70-80% | Vanaf launch |
| Display ads (Mediavine/AdThrive) | 10-20% | Na 10K+ sessions/maand |
| Sponsored reviews | 5-10% | Na 6+ maanden |
| Email sponsored content | 2-5% | Na 1.000+ subscribers |

### 6.2 Affiliate Link Tracking

| Taak | Wie | Details |
|------|-----|---------|
| Click tracking API uitbreiden | 🤖 | Claude breidt bestaande route.ts uit |
| Tracking dashboard bouwen | 🤖 | Claude bouwt admin dashboard |
| Revenue rapportage per netwerk | 👤 | Dylan checkt affiliate dashboards |

**Tracking interface (gebouwd door Claude 🤖):**
```typescript
interface AffiliateClick {
  bike_id: string;
  brand: string;
  affiliate_network: string;
  source_page: string;
  source_component: string;
  utm_source: string | null;
  utm_medium: string | null;
  user_agent: string;
  country: string;
  created_at: string;
}
```

### 6.3 Analytics Setup

| Tool | Doel | Wie |
|------|------|-----|
| Google Analytics 4 | Traffic, conversies, user flow | 👤 Dylan maakt account + property |
| GA4 tracking code integreren | Pageview & event tracking | 🤖 Claude implementeert |
| Google Search Console | SEO performance, rankings | 👤 Dylan verifieert domein |
| Affiliate dashboards | Revenue, EPC, conversion rates | 👤 Dylan monitort |
| Brevo analytics | Email open/click rates | 👤 Dylan checkt in Brevo |
| Vercel Analytics | Performance, Core Web Vitals | 👤 Dylan activeert in Vercel dashboard |

---

## Fase 7: Schaalvergroting (Maand 3+)

### 7.1 Content Schalen

| Taak | Wie | Details |
|------|-----|---------|
| AI-assisted vergelijkingspagina's | 🤖 | Claude genereert, Dylan reviewt |
| Automatische deal-monitoring | 🤖 | Claude bouwt prijs-scraper |
| User-generated reviews toevoegen | 🤖 | Claude bouwt review component |
| Community forum/comments | 🤖 | Claude implementeert |

### 7.2 Nieuwe Revenue Streams

| Stream | Wie | Details |
|--------|-----|---------|
| Display ads (Mediavine) aanvragen | 👤 | Na 10K+ monthly sessions |
| Sponsored placement outreach | 👤 | Dylan benadert merken |
| Premium vergelijkingstool | 🤖 | Claude bouwt betaalde features |
| E-bike accessories affiliate | 👤 | Dylan meldt aan bij nieuwe programma's |
| Accessories pagina's bouwen | 🤖 | Claude bouwt pagina's |

### 7.3 Internationaal Uitbreiden

| Taak | Wie | Details |
|------|-----|---------|
| i18n framework implementeren | 🤖 | Claude bouwt multi-language support |
| Canadese variant | 🤖 | Claude past content aan |
| UK variant | 🤖 | Claude past aan voor Britse markt |
| Nieuwe domeinen registreren | 👤 | Dylan koopt .ca, .co.uk |
| Lokale affiliate programma's | 👤 | Dylan meldt aan per regio |

---

## Tijdlijn Samenvatting

| Week | Mijlpaal | Claude 🤖 | Dylan 👤 |
|------|----------|-----------|----------|
| **1** | Voorbereiding | Concurrentie-analyse, naamopties | Domein, accounts, affiliate aanmeldingen |
| **2** | Technisch - Basis | Vertaling, URL structuur, DB schema | SQL uitvoeren, Vercel setup |
| **3** | Technisch - Features | Quiz, vergelijking, email templates | Brevo configuratie, DNS records |
| **4** | Data & Content | 40+ bikes scrapen, 5 best-of pagina's | Data validatie, affiliate IDs invoeren |
| **5** | Lead Gen & Email | Quiz live, lead capture flows | Brevo automations, SPF/DKIM |
| **6** | Launch + Social | Website code af, video scripts | YouTube kanaal, Pinterest account, eerste video's |
| **7-8** | Content Push | 80+ bikes, 10 best-of pagina's, scripts | 8+ video's produceren, pins ontwerpen |
| **9-12** | Groei | SEO content, nieuwe features | Reddit/Quora, link building, TikTok setup |
| **13+** | Schalen | Internationaal, premium features | Display ads, sponsored deals |

---

## KPI's & Doelstellingen

### Maand 1-3 (Launch fase)

| KPI | Doel | Wie monitort |
|-----|------|-------------|
| Bikes in database | 80+ | 🤖 |
| Affiliate programma's actief | 15+ | 👤 |
| Website sessies / maand | 2.000+ | 👤 (GA4) |
| Quiz completions / maand | 200+ | 🤖 (Supabase) |
| Email leads verzameld | 300+ | 👤 (Brevo) |
| YouTube subscribers | 100+ | 👤 |
| Pinterest maandelijks bereik | 10.000+ | 👤 |
| Eerste affiliate revenue | $100-500 | 👤 |

### Maand 4-6 (Groei fase)

| KPI | Doel | Wie monitort |
|-----|------|-------------|
| Website sessies / maand | 10.000+ | 👤 |
| Email lijst | 1.500+ | 👤 |
| YouTube subscribers | 500+ | 👤 |
| Pinterest bereik | 50.000+ | 👤 |
| Maandelijkse affiliate revenue | $500-2.000 | 👤 |
| Google rankings top 10 | 5+ keywords | 👤 (GSC) |

### Maand 7-12 (Schaal fase)

| KPI | Doel | Wie monitort |
|-----|------|-------------|
| Website sessies / maand | 30.000+ | 👤 |
| Email lijst | 5.000+ | 👤 |
| YouTube subscribers | 2.000+ | 👤 |
| Maandelijkse revenue (affiliate + ads) | $2.000-5.000 | 👤 |
| Google rankings top 10 | 20+ keywords | 👤 (GSC) |

---

## Budget Overzicht

| Item | Kosten | Frequentie | Wie betaalt/regelt |
|------|--------|------------|-------------------|
| Domein (.com) | ~$12 | Per jaar | 👤 |
| Vercel hosting (Pro) | $20 | Per maand | 👤 |
| Supabase (Free tier voldoet) | $0 | - | 👤 |
| Brevo (Free tot 300 emails/dag) | $0-25 | Per maand | 👤 |
| US SIM voor TikTok | ~$30 | Eenmalig | 👤 |
| US Residential Proxy | ~$15 | Per maand | 👤 |
| Budget Android (TikTok) | ~$80 | Eenmalig | 👤 |
| Canva Pro (voor pins/thumbnails) | $13 | Per maand | 👤 |
| **Totaal opstartkosten** | **~$125** | **Eenmalig** | |
| **Totaal maandelijks** | **~$50-75** | **Per maand** | |

---

## Samenvatting Taakverdeling

### Claude 🤖 kan direct uitvoeren:
1. **Volledige codebase vertalen** van NL naar EN (alle componenten, pagina's, types)
2. **Quiz component bouwen** (7-staps wizard + matching algoritme + API route)
3. **Nieuwe pagina's bouwen** (best-of, vs vergelijkingen, guides, blog)
4. **Database schema schrijven** (SQL migraties, tabellen, indexes)
5. **Multi-affiliate URL systeem** bouwen in ebike-data.ts
6. **Email templates** schrijven in het Engels (quiz results, newsletter, alerts)
7. **SEO optimalisatie** (schema markup, meta tags, sitemap, internal linking)
8. **E-bike data scrapen** van manufacturer websites
9. **Scoring algoritme** ontwikkelen
10. **Lead capture componenten** (exit intent, price alert, PDF comparison)
11. **Click tracking** uitbreiden
12. **Content schrijven** (best-of pagina's, guides, video scripts, pin teksten)
13. **Admin dashboard** bouwen voor tracking

### Dylan 👤 moet zelf doen:
1. **Domein registreren** en DNS configureren
2. **Accounts aanmaken** op alle affiliate netwerken (5 netwerken + 20+ directe programma's)
3. **Vercel project** aanmaken en deployen
4. **SQL migraties uitvoeren** in Supabase dashboard
5. **Brevo configureren** (lijsten, automations, SPF/DKIM)
6. **Google Analytics 4** en Search Console instellen
7. **YouTube kanaal** aanmaken en video's produceren/uploaden
8. **Pinterest business account** aanmaken en pins ontwerpen/posten
9. **TikTok setup** (US SIM, proxy, device) als je dat kanaal wilt
10. **Affiliate IDs/tokens** doorgeven aan Claude na goedkeuring
11. **W-8BEN belastingformulier** invullen
12. **Logo ontwerpen**
13. **Link building** (Reddit, Quora, HARO, guest posts)
14. **Affiliate dashboards monitoren** voor revenue
15. **Content goedkeuren** die Claude schrijft
