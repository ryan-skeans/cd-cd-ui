# ClaimDefender brand system implementation plan

## Objective

Turn the supplied art direction into an original, scalable identity built around a specific property surrounded by weather context. The result should feel objective, geospatial, calm, and evidence-led across marketing, product, and report surfaces without changing application behavior.

## Current branding inventory

### Logo and icon usage

- `src/components/brand-mark.tsx` is the only shared brand component. It uses Lucide's `ShieldCheck` in a lime-on-olive rounded tile and adds a small `Weather evidence` line.
- `src/components/public-header.tsx`, `src/components/public-footer.tsx`, and `src/components/workspace-shell.tsx` reuse that component.
- The homepage hero has no large-format ClaimDefender logo treatment.
- `src/components/loading-state.tsx` uses a generic radar animation and a shield for the warnings retrieval step.
- Functional shield icons also identify archived warning polygons and bounded report conclusions. Those are semantic icons, not brand marks, and should remain.

### Metadata and public assets

- `src/app/layout.tsx` defines title, description, and keywords but no explicit icon, manifest, Open Graph, or Twitter image metadata.
- `src/app/favicon.ico` is the only brand asset in the app metadata path. It predates the proposed identity.
- `public/` contains only fictional demo-report imagery; there is no reusable brand asset directory.

### Marketing, homeowner, and professional layouts

- The public header is shared across the homepage, homeowner, professional, and sample-report routes.
- The homepage uses a transparent-at-top header and an evidence-first hero; it is the correct location for the primary logo and restrained tagline.
- The professional landing hero uses the same public header and an evidence-package product preview.
- The professional workspace uses an olive desktop sidebar and a compact mobile header, requiring an inverted compact treatment and a small navigation treatment respectively.

### Report and PDF branding

- `src/components/official-report.tsx` renders both the on-screen report and the `@react-pdf/renderer` document.
- The on-screen cover uses a `FileCheck` icon and text but no ClaimDefender mark.
- The generated PDF uses uppercase `CLAIMDEFENDER` eyebrow text. A professional can also add a separate organization logo, which must remain distinct from the ClaimDefender publisher identity.

### Color, typography, and tokens

- Tailwind currently defines `brand.olive` (`#333629`), `oliveDark` (`#292B1F`), `lime` (`#D4F35E`), `limeLight` (`#E6F8A3`), `offWhite` (`#F8F9F5`), and `gray` (`#EBEBEB`).
- CSS semantic variables use a closely related olive/stone system but do not expose named forest, sage, charcoal, slate, or border-neutral roles.
- Geist Sans and Geist Mono are local, readable, and already consistently applied. No new font is needed.
- Tailwind enables class-based dark mode, but the application has no `.dark` token overrides and no dark-mode control. Inverted logo support should therefore target known olive surfaces rather than introduce a new theme.

## Files and components to modify

- Replace `src/components/brand-mark.tsx` usage with a brand component family under `src/components/brand/`.
- Update `src/components/public-header.tsx`, `src/components/public-footer.tsx`, `src/components/workspace-shell.tsx`, `src/components/loading-state.tsx`, and `src/components/homepage/homepage-hero.tsx`.
- Add ClaimDefender publisher branding to the on-screen report and both generated PDF pages in `src/components/official-report.tsx`.
- Normalize semantic brand values in `tailwind.config.ts` and `src/app/globals.css` while preserving existing utility aliases.
- Add explicit icon, manifest, and social metadata in `src/app/layout.tsx`.
- Add public assets under `public/brand/` and dedicated application metadata assets.
- Document usage in `docs/brand-guidelines.md`.

## Proposed logo variants

1. **Primary** — a 96 px-or-larger detailed contour mark, wordmark, and optional `Weather evidence. Clearly documented.` tagline. Use on the homepage hero, large report cover contexts, and brand documentation.
2. **Navigation** — the approved master mark and wordmark at 28–40 px, with no tagline. Use in public navigation and the footer.
3. **Compact** — the approved master mark alone, with an optional compact wordmark only where width permits. Use in the workspace sidebar, mobile product header, loading state, and compact surfaces.
4. **App icon** — an olive rounded square with a strong off-white mark, no text, no gradient, and fewer contour paths.
5. **Favicon** — the approved master mark rendered as a dedicated SVG/PNG/ICO asset at browser sizes.

After the initial implementation, the user supplied the definitive compound SVG path. All variants now preserve that exact path, use `currentColor` where appropriate, and contain no filters or embedded raster data.

## Proposed design tokens

The existing palette is cohesive, so the implementation should normalize it rather than copy the reference swatches literally.

| Semantic role | Token | Value | Purpose |
| --- | --- | --- | --- |
| Deep forest | `brand.forest` / `brand.olive` | `#333629` | Primary mark, dark surfaces, main text accents |
| Deep forest hover | `brand.forestDark` / `brand.oliveDark` | `#292B1F` | Hover and high-contrast dark surface |
| Secondary olive | `brand.oliveSoft` | `#5D684F` | Secondary brand text and metadata |
| Muted sage | `brand.sage` | `#A7B38A` | Supporting illustration and quiet accents |
| Warm off-white | `brand.offWhite` | `#F8F9F5` | Page background |
| Stone surface | `brand.stone` | `#F1F2EC` | Secondary panels and inset surfaces |
| Charcoal text | `brand.charcoal` | `#1A1D1B` | Highest-emphasis editorial text |
| Slate text | `brand.slate` | `#687065` | Secondary copy and metadata |
| Border neutral | `brand.border` / `brand.gray` | `#E3E6DC` | Rules and component borders |
| Lime action | `brand.lime` | `#D4F35E` | Calls to action and active state only |

Existing `olive`, `oliveDark`, and `gray` aliases will remain to avoid an unrelated class migration; new code will prefer the semantic names.

## Accessibility considerations

- Meaningful logo instances will have an accessible `ClaimDefender` label; decorative marks will use `aria-hidden="true"`.
- The wordmark is real HTML text in application components, so it remains selectable, readable at zoom, and independent of SVG text rendering.
- Inverted variants will use warm off-white on deep forest. Lime remains an action accent and will not become the main logo color.
- The supplied master path remains unchanged across sizes; each rendered size is checked for practical legibility.
- The dedicated favicon will be validated independently at 16 px and 32 px.
- Focus styling remains on the enclosing link rather than the decorative SVG.
- The system will preserve reduced-motion behavior; the loading mark will not require rotation to be identifiable.

## Rollout plan

1. Build the reusable mark, wordmark, logo, and PDF-mark components around the user-supplied master SVG path.
2. Create static primary, navigation, compact, app-icon, favicon, touch-icon, and social assets.
3. Normalize semantic color tokens without changing the existing layout system.
4. Replace legacy brand marks in navigation, footer, workspace, homepage, loading, on-screen report, and generated PDF.
5. Add metadata and a manifest, then verify every referenced public asset exists.
6. Render the mark family at requested sizes, inspect responsive application routes, and generate a representative PDF.
7. Run type checking, unit tests, lint, production build, SVG checks, and visual screenshot validation.

## Reference-image inconsistencies not to copy literally

- The app icon in the reference appears to use a textured or shaded olive field; production assets will be flat color with no gradient or gloss.
- The reference varied contour and pin proportions between examples. The later user-supplied SVG resolves that ambiguity and is now preserved exactly across variants.
- The reference calls for `Inter / Manrope` without defining which face owns the wordmark. ClaimDefender will retain Geist and use weight/spacing to create a deliberate wordmark.
- The favicon examples read more like a generic dot target than a location symbol. The production favicon will retain a minimal pin silhouette inside the ring while prioritizing negative space.
- The user-supplied master geometry is authoritative; no optical path edits are applied in code.
- Approximate colors in the raster reference are not authoritative. Existing olive and lime values will anchor the normalized semantic palette.
