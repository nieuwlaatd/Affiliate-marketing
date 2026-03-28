# Implementatieplan — Fase 2: Structuur & Filters

## Context

Harkuhh is het overkoepelende merk. Vanuit de Harkuhh homepage navigeer je naar twee onderdelen:
- **Kortingscodes** (het bestaande deals-gedeelte)
- **FietsenHarkuhh** (e-bikes label)

Dit plan beschrijft 4 wijzigingen die de site-structuur, navigatie en datakwaliteit verbeteren.

---

## Wijziging 1 — Keuzehulp als top-navigatiemenu

### Huidige situatie
De keuzehulp is een aparte pagina (`/fietsen/keuzehulp`) met een 3-stappen wizard. Dit is een dood eindpunt — gebruikers moeten er actief naartoe navigeren.

### Gewenste situatie
De keuzehulp wordt een **horizontale filterbalk** boven de fietsenoverzicht-pagina. Bezoekers kiezen direct hun doel, budget en frametype zonder een aparte pagina te bezoeken.

### Uitvoering

**1. Nieuwe component: `components/KeuzehulpBar.tsx`**
- Horizontale balk met 3 inline filters:
  - **Gebruiksdoel**: pill-knoppen (Woon-werk, Recreatief, Sportief, Transport, Off-road)
  - **Budget**: range-slider (€1.000 – €5.000)
  - **Frametype**: 3 knoppen (Laag instap, Hoog instap, Geen voorkeur)
- De staat van de balk wordt als `FilterState` doorgegeven aan de bestaande `filterBikes()` functie
- Optioneel inklapbaar op mobiel (één "Verfijn zoekopdracht" knop)

**2. Integreer `KeuzehulpBar` in `/fietsen/overzicht/page.tsx`**
- Voeg de balk toe boven de huidige filterzijbalk
- De zijbalk (merk, motortype, bereik) blijft als aanvullende filter

**3. Verwijder of redirect `/fietsen/keuzehulp`**
- De wizard-pagina verwijzen we door naar `/fietsen/overzicht`
- Of we behouden hem als "deep link" maar voegen geen prominente navigatie meer toe

### Betrokken bestanden
| Bestand | Actie |
|---------|-------|
| `components/KeuzehulpBar.tsx` | Nieuw aanmaken |
| `app/fietsen/overzicht/page.tsx` | KeuzehulpBar bovenaan integreren |
| `app/fietsen/keuzehulp/page.tsx` | Redirect naar `/fietsen/overzicht` |
| `components/Header.tsx` | "Keuzehulp" link vervangen door "E-bikes" |

---

## Wijziging 2 — Homepage links fixen

### Huidige situatie
De Harkuhh homepage heeft:
- HeroSection met knoppen "Ik zoek een code" (`/zoeken`) en "Ik wil browsen" (`/deals`)
- Sectie met nieuwste deals
- Sectie met categorieën

**Probleem**: Geen enkele link verwijst naar het e-bikes gedeelte (`/fietsen`).

### Gewenste situatie
De homepage krijgt een derde sectie die FietsenHarkuhh introduceert als label, met een duidelijke call-to-action naar `/fietsen`.

### Uitvoering

**1. Derde knop in HeroSection**
In `components/HeroSection.tsx`: voeg een derde grote knop toe:
```
"Zoek een e-bike" → /fietsen
```

**2. Labelblok op homepage**
In `app/page.tsx`: voeg na de categorieën een sectie "Onze labels" toe:
```
┌──────────────────────────────────┐
│  🚲 FietsenHarkuhh               │
│  Vind jouw ideale e-bike         │
│  [Bekijk e-bikes →]              │
└──────────────────────────────────┘
```

**3. Link in footer**
In `components/Footer.tsx`: voeg "E-bikes" toe aan de navigatielinks.

### Betrokken bestanden
| Bestand | Actie |
|---------|-------|
| `components/HeroSection.tsx` | Derde knop toevoegen |
| `app/page.tsx` | "Onze labels" sectie toevoegen |
| `components/Footer.tsx` | E-bikes link toevoegen |

---

## Wijziging 3 — Sitestructuur: Harkuhh als overkoepelend merk

### Gewenste structuur

```
harkuhh.nl/              → Harkuhh (umbrella brand homepage)
harkuhh.nl/deals         → Kortingscodes & deals
harkuhh.nl/zoeken        → Zoekfunctie
harkuhh.nl/fietsen       → FietsenHarkuhh (label landing page)
harkuhh.nl/fietsen/overzicht    → Alle e-bikes
harkuhh.nl/fietsen/[brand]/[model] → Fiets detailpagina
harkuhh.nl/fietsen/vergelijk   → Vergelijktool
```

### Uitvoering

**1. Header aanpassen**
De huidige Header toont: Zoeken | Deals | E-bikes

Nieuwe structuur:
- Op `/` en kortingscode-pagina's: toon Harkuhh logo + `Zoeken` | `Deals`
- Op `/fietsen/*` pagina's: toon `← Harkuhh` broodkruimel + FietsenHarkuhh subnav (`Overzicht` | `Vergelijk`)

Of eenvoudiger: maak een **aparte sub-layout** voor `/fietsen/*` die een groene sub-navigatiebalk toont boven de bestaande Header.

**2. Nieuwe sub-layout voor fietsen: `app/fietsen/layout.tsx`**
```tsx
// Groene sub-navigatiebalk
<nav> Overzicht | Vergelijk | ← Terug naar Harkuhh </nav>
{children}
```
Dit geeft het e-bikes gedeelte een eigen identiteit zonder de hoofd-Header te vervangen.

### Betrokken bestanden
| Bestand | Actie |
|---------|-------|
| `app/fietsen/layout.tsx` | Nieuw aanmaken (sub-navigatiebalk) |
| `components/Header.tsx` | Eventueel actieve-link styling |

---

## Wijziging 4 — Alleen deals met kortingscode tonen

### Huidige situatie
De homepage, deals-pagina en categoriepagina's tonen **alle actieve deals**, ook die zonder kortingscode (enkel een affiliate link).

### Gewenste situatie
Toon alleen deals waarbij het `code` veld **niet leeg** is. Dit geldt voor:
- Homepage (nieuwste deals)
- `/deals` overzichtspagina
- `/categorie/[slug]` pagina
- Categoriesectie op homepage (verberg categorieën zonder deals met code)

### Uitvoering

**1. Homepage (`app/page.tsx`)**
Voeg `.not('code', 'is', null).neq('code', '')` toe aan de deals-query:
```ts
// Voor:
.eq("is_active", true)

// Na:
.eq("is_active", true)
.not("code", "is", null)
.neq("code", "")
```

Categorieën: gebruik een subquery of aparte fetch om alleen categorieën te tonen die minstens één deal-met-code hebben.

**2. Deals-pagina (`app/deals/page.tsx`)**
Zelfde filterlogica toevoegen aan de Supabase-query.

**3. Categoriepagina (`app/categorie/[slug]/page.tsx`)**
Zelfde filterlogica.

**4. Zoekopdracht (`app/zoeken/page.tsx`)**
Zelfde filterlogica (zoekresultaten mogen ook alleen deals met code tonen).

### Betrokken bestanden
| Bestand | Actie |
|---------|-------|
| `app/page.tsx` | Filter deals op code aanwezig, filter categorieën |
| `app/deals/page.tsx` | Filter deals op code aanwezig |
| `app/categorie/[slug]/page.tsx` | Filter deals op code aanwezig |
| `app/zoeken/page.tsx` | Filter zoekresultaten op code aanwezig |

---

## Prioriteitvolgorde

| # | Wijziging | Complexiteit | Impact |
|---|-----------|-------------|--------|
| 1 | Alleen deals met kortingscode tonen | Laag | Hoog — datakwaliteit direct beter |
| 2 | Homepage links fixen | Laag | Hoog — e-bikes zijn nu bereikbaar |
| 3 | Fietsen sub-layout (merkidentiteit) | Laag | Middel |
| 4 | Keuzehulp als top-navigatiemenu | Middel | Middel — UX verbetering |

---

## Niet in scope (volgende fase)

- Keuzehulp koppelen aan URL-parameters (voor deelbare zoekresultaten)
- Aparte FietsenHarkuhh domeinnaam of subdomain
- Meer e-bike labels toevoegen aan het Harkuhh umbrella
