# ClaimDefender brand guidelines

## Brand positioning

ClaimDefender organizes the weather record surrounding a specific property and point in time. The identity should make objective evidence, provenance, and professional documentation feel clear and inspectable. It should never imply that the product determines causation, coverage, damage, or claim outcome.

The brand is scientific, geospatial, calm, editorial, and evidence-driven. It is not a cybersecurity identity, an adversarial claims badge, or an AI product identity.

## Logo concept

The circular mark is an investigation area. Its contour paths represent weather and topographic context. The centered location point represents the subject property. Together they express the organizing idea: a specific property surrounded by weather context.

The compound path in `claim-defender-path.ts` is the exact master geometry supplied by the user. Do not redraw, simplify, trace, or optically alter it in code.

## Logo variants

### Primary

Use the detailed mark with the ClaimDefender wordmark at 96 px or larger. The tagline may appear below the wordmark on homepage heroes, report covers, large empty states, and brand documentation.

Asset: `public/brand/claim-defender-primary.svg`

### Navigation

Use the approved master mark and wordmark at a 28–40 px mark height. Do not include the tagline. This is the default public header and footer treatment.

Asset: `public/brand/claim-defender-navigation.svg`

### Compact

Use the approved master mark at 24–32 px. A compact wordmark is allowed when horizontal space is proven, as in the desktop workspace sidebar. Prefer the mark alone for loading and very narrow UI.

Asset: `public/brand/claim-defender-compact.svg`

Use `public/brand/claim-defender-compact-inverted.svg` when a static off-white mark is required on deep forest.

### App icon

Use only at 64 px or larger. It places the off-white compact mark on a flat deep-forest rounded square. Do not add text, gradients, texture, gloss, or shadows to the artwork.

Asset: `public/brand/claim-defender-app-icon.svg`

### Favicon

Use the dedicated SVG, PNG, or ICO export of the approved master mark at 16 px and 32 px.

Assets: `public/brand/favicon.svg` and `public/brand/favicon-32.png`

## Clear space

Keep clear space equal to at least one-quarter of the circular mark's diameter on all sides of a standalone mark. For a lockup, keep the same unit around the complete mark-and-wordmark bounds. UI focus rings and intentional container boundaries may sit outside this clear-space area.

## Minimum recommended sizes

| Variant | Minimum |
| --- | --- |
| Primary mark | 96 px |
| Navigation mark | 28 px |
| Compact mark | 24 px |
| App icon | 64 px |
| Favicon | Dedicated 16 px or 32 px asset |

Below 24 px, use the dedicated favicon export rather than an application component.

## Incorrect usage

- Do not stretch, rotate, skew, crop, or rearrange the mark.
- Do not add shields, checkmarks, houses, clouds, sparkles, or other icons to the identity.
- Do not place lime as the primary logo color. Lime signals an action or active state.
- Do not add gradients, filters, glow, gloss, texture, or drop shadows to the SVG artwork.
- Do not edit, remove, or add paths to the supplied master geometry.
- Do not change `ClaimDefender` capitalization or split it into two words.
- Do not use the tagline in navigation, sidebars, app icons, favicons, or compact cards.
- Do not use the mark as a seal that implies verification, certification, or a claim decision.

## Color tokens

| Role | Tailwind token | Hex | Usage |
| --- | --- | --- | --- |
| Deep forest | `brand-forest` | `#333629` | Logo ink, dark surfaces, primary controls |
| Deep forest hover | `brand-forestDark` | `#292B1F` | Dark hover state |
| Secondary olive | `brand-oliveSoft` | `#5D684F` | Secondary brand copy |
| Muted sage | `brand-sage` | `#A7B38A` | Quiet editorial accents |
| Warm off-white | `brand-offWhite` | `#F8F9F5` | Page field and reversed mark |
| Stone | `brand-stone` | `#F1F2EC` | Inset and secondary surfaces |
| Charcoal | `brand-charcoal` | `#1A1D1B` | Highest-emphasis text |
| Slate | `brand-slate` | `#687065` | Secondary text and metadata |
| Border neutral | `brand-border` | `#E3E6DC` | Rules and borders |
| Lime action | `brand-lime` | `#D4F35E` | Calls to action and current state |

The legacy utility aliases `brand-olive`, `brand-oliveDark`, and `brand-gray` resolve to forest, forest-dark, and border-neutral respectively.

## Typography

ClaimDefender uses the repository's local Geist Sans and Geist Mono families.

- **Wordmark:** Geist Sans semibold, tight tracking, exact capitalization `ClaimDefender`.
- **Marketing display:** Geist Sans medium or semibold with restrained negative tracking.
- **Product headings:** Geist Sans semibold.
- **Body:** Geist Sans regular with comfortable line height.
- **Labels and source metadata:** Geist Sans medium or bold, often uppercase only for short classification labels.
- **Evidence values and record identifiers:** Geist Mono where tabular alignment, coordinates, timestamps, or identifiers benefit from it.

Do not introduce a custom wordmark font or substitute novelty geospatial lettering.

## Tagline guidance

The approved tagline is:

> Weather evidence. Clearly documented.

Use it sparingly in large-format marketing, report-cover, social, or brand-documentation contexts. Do not shorten it to `Weather evidence` as a recurring micro-tagline in navigation.

## Voice principles

- Lead with records, measurements, classifications, sources, and limitations.
- Use precise verbs such as `organizes`, `documents`, `classifies`, and `preserves`.
- Distinguish observed, reported, warned, and contextual information.
- State what a source does not establish when that boundary matters.
- Prefer calm, plain language over combative claim framing.
- Never frame ClaimDefender as an AI judge, automated claim scorer, certification authority, or causation engine.

## Homeowner and professional application

### Homeowner

Use approachable explanations, a clear property/date starting point, and explicit source labels. Keep the brand supportive and avoid legal or adversarial language. The main outcome is an understandable property weather record and report preview.

### Professional

Use denser source metadata, package context, repeatable workflow language, and client-ready reporting. Preserve the user's organization logo as a separate identity from the ClaimDefender publisher mark. Do not imply a full claims CRM or system of record.

## Evidence-first language examples

Prefer:

- `Maximum observed gust at the identified station: 51.8 mph.`
- `The property point was inside an archived NWS warning polygon.`
- `A 1.25 in hail report was recorded 2.7 miles from the property.`
- `The report preserves provider, dataset, retrieval status, proximity, and limitations.`

Avoid:

- `AI confirms storm damage.`
- `Your claim is valid.`
- `ClaimDefender proves causation.`
- `Guaranteed claim reversal.`

## Component and asset locations

- React logo system: `src/components/brand/claim-defender-logo.tsx`
- React mark: `src/components/brand/claim-defender-mark.tsx`
- React wordmark: `src/components/brand/claim-defender-wordmark.tsx`
- PDF mark: `src/components/brand/claim-defender-pdf-mark.tsx`
- Static assets: `public/brand/`
- PWA manifest: `public/manifest.webmanifest`
- Metadata configuration: `src/app/layout.tsx`
- Semantic color tokens: `tailwind.config.ts` and `src/app/globals.css`
