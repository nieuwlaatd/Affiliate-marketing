# DESIGN.md — Harkuhh

## Color strategy
**Committed → Drenched** on brand surfaces (homepage funnel: bordeaux is the
surface, not an accent). **Restrained** on product surfaces (overview, compare,
detail: tinted neutrals + bordeaux/gold accents, calm so specs read clearly).

All colors OKLCH. No pure `#000`/`#fff`; every neutral tinted toward the
bordeaux hue (~14°).

### Core palette
| Token | OKLCH | Role |
|---|---|---|
| `--bordeaux` | `oklch(0.31 0.115 14)` | Brand primary surface |
| `--bordeaux-deep` | `oklch(0.23 0.095 12)` | Hero drench, footer |
| `--bordeaux-raised` | `oklch(0.36 0.110 15)` | Cards on bordeaux |
| `--ink` | `oklch(0.19 0.030 14)` | Text on light, near-black |
| `--paper` | `oklch(0.975 0.006 60)` | Light page background |
| `--card` | `oklch(0.992 0.004 60)` | Light card |
| `--muted` | `oklch(0.47 0.030 14)` | Secondary text on light |
| `--muted-on-dark` | `oklch(0.78 0.025 30)` | Secondary text on bordeaux |
| `--border` | `oklch(0.88 0.012 30)` | Hairlines on light |
| `--border-on-dark` | `oklch(0.44 0.050 14)` | Hairlines on bordeaux |
| `--gold` | `oklch(0.78 0.115 80)` | Accent + primary CTA on dark |
| `--gold-hover` | `oklch(0.72 0.115 74)` | CTA hover |

CTA rule: on bordeaux surfaces the CTA is **gold** with ink text. On light
surfaces the CTA is **bordeaux fill** with paper text. Gold is accent only,
never a large fill except the CTA pill.

### Terrain tones (funnel "ride feeling")
Each terrain modulates the funnel mood within the bordeaux family. Expressed
through a signature verb, icon, and a tonal overlay shift, never a clashing new
hue.

| Terrain | Signature word | Hue shift | Feel |
|---|---|---|---|
| City | "Glide" | base 14° | brisk, gold-forward, momentum |
| Hills | "Conquer" | 10° deeper | high-contrast, powerful |
| Trails / off-road | "Escape" | warm 28° | earthy, adventurous |
| Beach / sand | "Cruise" | light 40° | airy, sunlit, relaxed |
| Mixed / anywhere | "Roam" | base 14° | balanced, versatile |

## Typography
- Display: a strong editorial sans/serif for funnel headlines (weight 700+),
  scale ratio ≥1.3. Existing Inter stays for body/UI.
- Body cap 65–75ch. Hierarchy via scale + weight, not color.

## Motion
- Funnel question transitions: slide in from the **right**, ease-out-expo,
  ~420ms, opacity + transform only. No bounce.
- Answered steps collapse left into compact summary chips.
- Auto-advance after single-select: ~260ms confirm beat, then advance.

## Layout
- Funnel is the homepage hero, full-bleed bordeaux. Deals/sections live below
  as secondary, on paper.
- Avoid identical card grids. Bike results use a ranked list rhythm, not a
  uniform 3-col card wall, where it improves scanning.

## Bans (project-specific, on top of skill bans)
- No eco-green anywhere. The legacy `#5A7A48` is fully retired.
- No gradient text, no glass, no side-stripe borders, no hero-metric template.
