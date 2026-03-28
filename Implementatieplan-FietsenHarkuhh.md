# Implementatieplan fietsenharkuhh.nl

## Het concept in het kort

Een keuzehulp-website voor elektrische fietsen die bezoekers begeleidt op basis van hun kennisniveau en gebruiksdoel. De site verdient via affiliate commissies op directe verkopen, lead-vergoedingen voor proefritaanvragen, en e-mailnurturing met cookie-refresh. De architectuur is schaalbaar naar andere niches onder het Harkuhh-merk.

---

## Fase 1: Fundament (week 1-3)

### 1.1 Tech stack opzetten

**Framework: Next.js (App Router)**
Next.js is de beste keuze omdat het server-side rendering biedt (cruciaal voor SEO), snelle laadtijden heeft, en goed schaalt naar meerdere niches later. Gebruik de App Router structuur zodat je route groups kunt maken per niche (bijv. `/ebikes/`, later `/warmtepompen/`).

**CMS: Strapi (self-hosted, open source)**
Strapi is gratis, je hebt volledige controle over je data, en het is perfect voor het opzetten van productdatabases met custom velden (specificaties per productcategorie). Je definieert content types zoals "E-bike" met velden als merk, model, motortype, accucapaciteit, prijs, etc.

**Database: PostgreSQL**
Draait achter Strapi en slaat alle productdata, gebruikersvoorkeuren en wishlist-items op.

**Hosting: Vercel (frontend) + Railway of DigitalOcean (Strapi backend)**
Vercel is gratis voor kleine projecten en optimaliseert Next.js automatisch. De backend draai je apart.

**Mappenstructuur:**
```
fietsenharkuhh/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── keuzehulp/
│   │   ├── page.tsx                # Start keuzehulp
│   │   ├── kennisniveau/page.tsx   # Stap 1: kennisniveau
│   │   ├── gebruiksdoel/page.tsx   # Stap 2: waarvoor
│   │   └── resultaten/page.tsx     # Gefilterde resultaten
│   ├── fietsen/
│   │   ├── page.tsx                # Overzicht alle e-bikes
│   │   ├── [merk]/page.tsx         # Merkpagina
│   │   └── [merk]/[model]/page.tsx # Productpagina
│   ├── vergelijk/page.tsx          # Vergelijkingstool
│   ├── blog/
│   │   └── [slug]/page.tsx         # Artikelen
│   └── api/
│       ├── wishlist/               # Wishlist endpoints
│       └── email/                  # E-mail signup
├── components/
│   ├── FilterSidebar.tsx
│   ├── ProductCard.tsx
│   ├── CompareTable.tsx
│   ├── KeuzeWizard.tsx
│   └── WishlistButton.tsx
└── lib/
    ├── strapi.ts                   # CMS connectie
    ├── affiliate.ts                # Link tracking
    └── analytics.ts                # Event tracking
```

### 1.2 Productdatabase inrichten

Maak in Strapi een content type "E-bike" met deze velden:

**Basisinfo:** merknaam, modelnaam, modeljaar, productafbeeldingen, prijs (adviesprijs), prijscategorie (budget/midden/premium)

**Motor & aandrijving:** motortype (midden/naaf-voor/naaf-achter), motormerk (Bosch, Shimano, Brose, etc.), koppel (Nm), ondersteuningsniveaus

**Accu:** capaciteit (Wh), bereik (km, fabrikantopgave), bereik (km, praktijktest), laadtijd, afneembaar (ja/nee)

**Frame & comfort:** frametype (hoog instap/laag instap/sportief), framemateriaal, wielmaat, gewicht (kg), maximaal toelaatbaar gewicht

**Versnellingen:** type (derailleur/naaf/CVT), aantal versnellingen, merk versnelling

**Geschikt voor:** woon-werkverkeer, recreatief, sportief, transport/bakfiets, off-road

**Affiliate:** affiliate link (per partner), cookie-duur partner, commissiepercentage, proefrit-link (indien beschikbaar)

**Scores:** totaalscore, prijs-kwaliteit score, comfort score, bereik score

Begin met het handmatig invoeren van de 30-40 populairste modellen in Nederland (Gazelle, Batavus, Stella, Giant, Cube, Trek, Specialized). Focus op fietsen in het segment €1.500-€4.000.

### 1.3 Keuzehulp wizard bouwen

Dit is het hart van de site. De wizard bestaat uit 3-4 stappen:

**Stap 1 — Kennisniveau**
"Hoeveel weet je al over elektrische fietsen?"
- "Ik begin net met oriënteren" → Toon uitleg bij elke specificatie, gebruik eenvoudige taal, focus op gebruiksscenario's
- "Ik weet ongeveer wat ik zoek" → Toon specificaties met korte uitleg, laat filteren op technische kenmerken
- "Ik ben een kenner" → Directe toegang tot alle filters, vergelijkingstool, technische details

**Stap 2 — Gebruiksdoel**
"Waar ga je de fiets vooral voor gebruiken?"
- Dagelijks woon-werkverkeer (afstand invulveld)
- Recreatief fietsen
- Sportief/mountainbike
- Boodschappen en transport
- Combinatie (meerdere selecteerbaar)

**Stap 3 — Voorkeuren**
- Budgetrange (slider: €1.000 - €5.000+)
- Instaphoogte voorkeur (laag/hoog/geen voorkeur)
- Merkenvoorkeur (optioneel, multi-select)

**Stap 4 — Resultaten**
Toon gefilterde e-bikes gesorteerd op "beste match" score. Bij elke fiets:
- Waarom deze fiets bij jou past (gepersonaliseerde uitleg op basis van antwoorden)
- Kernspecificaties (aangepast aan kennisniveau)
- "Bewaar in mijn lijst" button
- "Boek proefrit" button (affiliate lead)
- "Bekijk beste prijs" button (affiliate link)

### 1.4 Customer journey pagina-indeling

De site moet vier duidelijke ingangen hebben, passend bij de fase waarin de bezoeker zich bevindt:

**"Ik weet nog niks" → Keuzehulp**
Prominente CTA op homepage: "Vind jouw ideale e-bike in 2 minuten". Leidt naar de wizard.

**"Ik ben aan het vergelijken" → Vergelijkingstool + Overzichtspagina**
Filter- en sorteeropties, side-by-side vergelijking van 2-3 modellen, met duidelijke uitleg van de verschillen.

**"Ik weet wat ik wil" → Productpagina's**
Gedetailleerde productpagina per model met alle specs, reviews, pro's/con's, en directe affiliate links naar de beste prijs.

**"Ik wil kopen" → Wishlist + Deals**
Persoonlijke lijst van opgeslagen fietsen met prijsgeschiedenis en notificatie wanneer een fiets in de aanbieding is.

---

## Fase 2: Verdienmodel & e-mailflow (week 3-5)

### 2.1 Affiliate tracking systeem

Bouw een simpel tracking systeem dat:
- Unieke tracking parameters toevoegt aan alle uitgaande links (`?ref=harkuhh&utm_source=...`)
- Kliks logt per product, per pagina, per bron
- Onderscheid maakt tussen "bekijk prijs" kliks en "boek proefrit" kliks

Meld je aan bij affiliate netwerken (dit doe jij zelf, zie onderaan). In de code bouw ik een flexibel systeem waar je per product meerdere affiliate links kunt opslaan met prioriteit.

### 2.2 Wishlist functionaliteit

De wishlist is cruciaal voor het cookie-refresh probleem:
- Bezoeker slaat fietsen op → moet e-mailadres invullen om wishlist te bewaren
- Wishlist wordt opgeslagen in de database (niet in localStorage, want dat verliest de gebruiker)
- Bij elk bezoek aan de wishlist wordt de affiliate cookie ververst
- De bezoeker krijgt een persoonlijke link: `fietsenharkuhh.nl/mijn-lijst/[unieke-code]`

### 2.3 E-mail capture en nurturing

**Capture momenten (op de site):**
1. Na het doorlopen van de keuzehulp: "Wil je je resultaten bewaren? Vul je e-mail in"
2. Bij het opslaan van een fiets in de wishlist
3. Blog-sidebar: "Ontvang e-bike tips en aanbiedingen"
4. Exit-intent popup (alleen op productpagina's): "Twijfel je nog? We helpen je verder"

**E-mailsequentie na keuzehulp:**
- Dag 0: "Hier zijn jouw resultaten" (link terug naar site = cookie refresh)
- Dag 3: "Dit moet je weten over [motortype dat bij hun keuze past]" (educatieve content)
- Dag 7: "Vergelijking: [top 2 modellen uit hun resultaten]" (link terug = cookie refresh)
- Dag 14: "Proefrit tip: hier kun je [merk] testen bij jou in de buurt"
- Dag 21: "Prijsupdate: [model] is nu €X goedkoper" (alleen als er echt een prijswijziging is)
- Dag 30+: Maandelijkse nieuwsbrief met nieuwe modellen, tests en aanbiedingen

Elke e-mail bevat links terug naar de site, waardoor de affiliate cookie steeds wordt ververst. Zo blijft de commissie geldig, ook als iemand pas na 3 maanden koopt.

### 2.4 Proefrit leadgeneratie

Bouw een "Boek een proefrit" flow:
- Bezoeker klikt op "Proefrit" bij een model
- Wordt doorgestuurd naar de dealer/webshop proefritpagina via affiliate link
- Alternatief: bouw een eigen formulier dat de aanvraag doorstuurt (hogere conversie, maar complexer qua partnerships)

De lead-vergoeding (bijv. €5-€8 bij Fietsenwinkel.nl) wordt direct uitbetaald, ongeacht of de klant later koopt.

---

## Fase 3: Content & SEO (week 4-8)

### 3.1 Kernpagina's voor SEO

Maak landingspagina's die ranken op zoektermen in elke fase van de customer journey:

**Oriëntatiefase (hoog zoekvolume):**
- "Elektrische fiets kopen: waar moet je op letten?" (`/blog/elektrische-fiets-kopen-tips`)
- "Middenmotor vs naafmotor: wat is het verschil?" (`/blog/middenmotor-vs-naafmotor`)
- "Hoeveel kost een goede elektrische fiets?" (`/blog/kosten-elektrische-fiets`)

**Vergelijkingsfase (gericht zoekvolume):**
- "Beste elektrische fiets onder €2000" (`/fietsen/budget/onder-2000`)
- "Gazelle vs Batavus vergelijking" (`/vergelijk/gazelle-vs-batavus`)
- "Beste e-bike voor woon-werkverkeer" (`/fietsen/woon-werkverkeer`)

**Koopfase (hoge koopintentie):**
- "[Merk] [Model] review 2026" (`/fietsen/[merk]/[model]`)
- "[Merk] [Model] beste prijs" (productpagina met affiliate links)
- "Elektrische fiets aanbiedingen" (`/aanbiedingen`)

### 3.2 Blogstrategie

Publiceer 2 artikelen per week gericht op long-tail zoektermen:
- Week 1-4: Fundamentele "pillar" artikelen (koopgidsen, vergelijkingen)
- Week 5-8: Merkspecifieke en modelspecifieke reviews
- Doorlopend: Seizoensgebonden content (voorjaar = piekseizoen e-bikes)

### 3.3 Technische SEO

- Structured data (JSON-LD) voor producten: prijs, beschikbaarheid, reviews, specificaties
- Sitemap genereren via Next.js
- Canonical URLs per product (voorkom duplicaat content met webshops)
- Open Graph tags voor social media sharing
- Core Web Vitals optimalisatie (Next.js Image component, lazy loading)

---

## Fase 4: Social media integratie (week 6-10)

### 4.1 YouTube-geoptimaliseerde content

De site moet content bieden die goed werkt als basis voor YouTube video's:
- Vergelijkingsartikelen vertalen naar "vs" video scripts
- Keuzehulp-resultaten als basis voor "Top 5 e-bikes voor..." video's
- Embed YouTube video's op productpagina's (zodra je die hebt)

Ik kan voor elke vergelijkingspagina een video-script template genereren met de juiste structuur (hook, vergelijking, conclusie, CTA naar site).

### 4.2 Social sharing optimalisatie

- Open Graph afbeeldingen automatisch genereren per productpagina (met Next.js OG image generation)
- "Deel je resultaat" functie na de keuzehulp (deelbare link met infographic van de top 3 match)
- Pinterest-optimalisatie op productafbeeldingen (grote afbeeldingen, beschrijvende alt-tekst)

### 4.3 TikTok/Instagram Reels content hooks

Bouw op de site "snackable" content blokken die makkelijk te vertalen zijn naar korte video's:
- "Wist je dat..." feiten per productcategorie
- "Mythes over e-bikes" reeks
- Quick comparison cards (afbeelding-formaat voor Instagram)

---

## Fase 5: Schaalbaarheid naar andere niches (week 8+)

### 5.1 Multi-niche architectuur

De codebase is zo opgezet dat je een nieuwe niche kunt toevoegen door:
1. Een nieuw content type in Strapi aan te maken (bijv. "Warmtepomp" met eigen specificatievelden)
2. Een nieuwe route group in Next.js toe te voegen (`/warmtepompen/`)
3. De keuzehulp-wizard te dupliceren met niche-specifieke vragen
4. Het branding-thema aan te passen per subdomein of sectie

**Domeinstructuur opties:**
- Optie A: Subdomeinen → `fietsen.harkuhh.nl`, `warmtepompen.harkuhh.nl`
- Optie B: Losse domeinen → `fietsenharkuhh.nl`, `warmtepompenharkuhh.nl`
- Optie C: Secties op hoofddomein → `harkuhh.nl/fietsen`, `harkuhh.nl/warmtepompen`

Optie B (jouw huidige plan) geeft de meeste SEO-flexibiliteit per niche en voelt als een gespecialiseerde site voor de bezoeker. Optie C is het makkelijkst technisch en bouwt domeinautoriteit sneller op.

### 5.2 Gedeelde componenten

Deze componenten werken voor elke niche en hoeven maar één keer gebouwd te worden:
- KeuzeWizard (configureerbaar per niche)
- Vergelijkingstabel
- Wishlist systeem
- E-mail capture flows
- Affiliate link management
- Review/rating systeem

---

## Wat jij zelf moet regelen

De volgende zaken kan ik niet voor je doen en moet je zelf oppakken:

### Domein & hosting
- Domein `fietsenharkuhh.nl` registreren (bijv. via TransIP of Versio)
- Vercel account aanmaken voor frontend hosting
- Server huren voor Strapi backend (Railway, DigitalOcean of Hetzner, vanaf ~€5/maand)

### Affiliate partnerships
- Aanmelden bij affiliate netwerken: Daisycon, TradeTracker, Awin (deze hebben fietsenpartners)
- Direct contact leggen met: Fietsenwinkel.nl, Stella, Mantel, 12GO
- Bij elk programma specifiek vragen naar: cookie-duur, commissiepercentage, en of ze lead-vergoedingen bieden voor proefritten

### E-mailservice
- Account aanmaken bij een e-mailplatform: Mailchimp (gratis tot 500 contacten), Brevo (gratis tot 300 mails/dag), of MailerLite
- E-mailtemplates instellen in de huisstijl

### Content & productdata
- Productfoto's verzamelen (rechtenvrij via fabrikanten/perskits of zelf fotograferen)
- Eerste 30-40 e-bikes handmatig invoeren in Strapi (specs van fabrikantwebsites)
- Blogartikelen schrijven of laten schrijven (ik kan templates en outlines maken)

### Juridisch
- Privacyverklaring (AVG/GDPR) opstellen (gebruik bijv. iubenda.com)
- Cookiemelding implementeren
- Disclaimer dat je affiliate commissies ontvangt (wettelijk verplicht)
- KvK-registratie als je inkomsten gaat genereren

### Social media
- YouTube kanaal aanmaken en inrichten
- TikTok en Instagram accounts aanmaken onder Harkuhh branding
- Content planning en video opnames (ik kan scripts en templates leveren)

### Analytics
- Google Analytics 4 account aanmaken
- Google Search Console instellen voor het domein
- Affiliate dashboard(s) monitoren

---

## Tijdlijn samenvatting

| Week | Mijlpaal |
|------|----------|
| 1-2 | Tech stack opgezet, database structuur klaar, eerste productdata ingevoerd |
| 2-3 | Keuzehulp wizard werkend, basispagina's live |
| 3-4 | Wishlist, e-mail capture, affiliate links geïntegreerd |
| 4-6 | Eerste 10 blogartikelen live, SEO-basis gelegd |
| 6-8 | Social media templates, video scripts, vergelijkingspagina's |
| 8-10 | Optimalisatie op basis van eerste data, voorbereiding tweede niche |
