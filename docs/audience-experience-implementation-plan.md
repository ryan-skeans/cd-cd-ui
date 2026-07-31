# ClaimDefender audience experience implementation plan

## Objective

Split ClaimDefender into an audience-neutral public experience, a guided homeowner investigation, and a browser-local professional demo workspace while preserving one normalized weather-evidence contract and one set of evidence/report utilities.

The application remains an honest demo. This work does not add authentication, accounts, payments, email, team features, a claims CRM, cloud persistence, paid infrastructure, or production deployment.

## Current-state map

| Current module | Current responsibility | Target responsibility |
| --- | --- | --- |
| `src/app/page.tsx` | Combined marketing, navigation, and investigation entry | Audience-neutral public homepage only; preserve legacy root query links by redirecting valid `lat`, `lng`, and `date` values to `/homeowners` |
| `src/components/sidebar.tsx` | Root-page navigation and investigation hero | Replaced by a shared public header and a homeowner-specific header/hero |
| `src/components/marketing-sections.tsx` | Short evidence marketing content | Replaced by public homepage workflow, evidence credibility, audience cards, sample report, methodology, and limitation sections |
| `src/components/evidence-investigation.tsx` | Search form, URL state, evidence request, results, and unlocked report orchestration | Homeowner-specific investigation orchestrator at `/homeowners`; keep URL-backed search and featured demo behavior |
| `src/hooks/use-evidence-search.ts` | Shared normalized API request | Remains the single request hook for homeowner search, professional package search, and professional refresh |
| `src/lib/response-contract.ts` | Schema 2.1 runtime contract guard | Remains shared by both audiences |
| `src/components/results-dashboard.tsx` | Full evidence results presentation | Shared evidence presentation with an audience-density option; homeowner language remains plain and provider diagnostics stay progressively disclosed |
| `src/components/loading-state.tsx` | Progressive evidence loading | Shared loading state with audience-neutral, plain-language steps |
| `src/components/evidence-state-notice.tsx` | Partial and empty response notices | Shared evidence-state handling for both audiences |
| `src/components/demo-unlock-modal.tsx` | Honest no-payment report unlock | Homeowner demo report unlock only; professional packages open report previews directly |
| `src/components/official-report.tsx` | Homeowner-oriented browser report and PDF | One adaptive report implementation accepting homeowner or professional report context |
| `src/lib/evidence.ts` and `src/lib/types.ts` | Normalized evidence types, summaries, labels, source/proximity helpers | Shared evidence foundation; no audience-specific weather aggregation is introduced |
| Cloudflare Worker `POST /initiateFreeSearch` | Produces normalized schema 2.1 evidence | Remains the single weather-data API for both experiences; no persistence or audience branching is added to the Worker |

## Target route structure

```text
/
  Shared public homepage
/homeowners
  Guided homeowner landing, search, results, and demo report flow
/professionals
  Professional repeated-use marketing page
/professionals/workspace
  Demo workspace overview
/professionals/workspace/packages
  Searchable and filterable package history
/professionals/workspace/packages/new
  Draft and evidence-search form
/professionals/workspace/packages/[packageId]
  Package metadata, evidence navigation, and professional report preview
/professionals/workspace/organization
  Browser-local organization settings and reset controls
/sample-report
  Search-free shared sample report preview
```

The root route will inspect search parameters on the server. A valid legacy `/?lat=...&lng=...&date=...` link redirects to `/homeowners` with the exact query string. Other root visits render the new public homepage.

## Component architecture

### Shared public and brand components

- `BrandMark`: consistent ClaimDefender identity and demo indicator.
- `PublicHeader`: accessible desktop and mobile navigation.
- `PublicFooter`: methodology/limitation reminder and audience links.
- `DemoBadge` and `DemoDisclosure`: consistent, visible demo honesty.

### Shared evidence components

- Keep the normalized evidence types, response parsing, request hook, state notice, loading state, evidence helpers, and evidence results presentation shared.
- Refine results so the first view contains no more than five key findings, then the event timeline, then expandable supporting evidence and sources/limitations.
- Add a presentation/audience option only at clear component boundaries; do not scatter professional checks through evidence calculations.

### Homeowner components

- `HomeownerHeader` and homeowner landing copy are composed on `/homeowners`.
- `EvidenceInvestigation` becomes the homeowner orchestrator and updates URL state under `/homeowners`.
- The form requires only location coordinates/address and approximate date.
- Existing featured demo, partial/empty/error handling, report unlock, and PDF download remain functional.

### Professional components

- `WorkspaceShell`: persistent demo disclosure, desktop sidebar, and mobile navigation.
- `WorkspaceOverview`: metrics derived from package records and recent packages.
- `PackageHistory`: search, status filter, duplicate, confirmed delete, and reset.
- `NewPackageForm`: client, property/date, and optional report context; supports incomplete draft or shared evidence search.
- `ProfessionalPackageView`: metadata actions and tabbed evidence/report presentation.
- `OrganizationSettings`: browser-local organization fields and size-limited local logo data URL.

### Report architecture

`OfficialReport` will accept a `ReportContext` with `audience: "homeowner" | "professional"`. Professional context adds organization, prepared-by, client, claim/reference, carrier, package ID, and logo metadata. The underlying evidence summary, timeline, source appendix, methodology, limitations, and PDF generation remain shared.

## Demo persistence design

- Add `src/lib/demo-workspace.ts` for types, sample data, validation/recovery, pure package operations, derived metrics, and the storage key.
- Add `src/lib/demo-workspace-repository.ts` as the only `localStorage` boundary.
- Add `DemoWorkspaceProvider` for client subscription/update state and friendly storage errors.
- Seed fictional `Harbor Property Claims` data only when the storage key does not exist.
- Do not reseed after deletion; explicit reset restores samples.
- Cap records at 25 packages and handle corrupt JSON, unavailable storage, and quota failures without crashing.
- Store the logo as a local data URL only, with MIME and file-size validation before reading.

## Package lifecycle

```text
partial form -> Save Draft -> draft
complete form -> Run Evidence Search -> searching
successful normalized response -> evidence_ready
failed request -> needs_refresh (metadata preserved)
open report preview -> report_previewed
duplicate -> new independent draft without evidence
refresh -> searching -> evidence_ready or needs_refresh
```

All professional evidence calls use `useEvidenceSearch`; the package stores the returned `SearchResponse` without modifying or re-aggregating it.

## Analytics abstraction

Add a small `trackDemoEvent` helper with typed event names. It logs only in development, sends no network request, and accepts no client or property data.

## Testing and verification

- Routing: legacy-query helper, audience routes, missing package state.
- Storage/domain: first seed, persistence serialization, corrupted data recovery, cap, draft save, duplicate independence, delete, reset, metrics, search and status filtering.
- Homeowner regression: required inputs, featured demo values, complete/partial/empty evidence helpers, report entry points.
- Professional flow: sample records, package status transitions, metadata/report context, organization validation.
- Accessibility: semantic labels, dialog titles/descriptions, keyboard-operable navigation, text status labels, live loading/errors, and mobile table fallback/overflow.
- Run `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build` in the UI.
- Run the Worker typecheck/tests and inspect its endpoint contract. Change the Worker only if the shared schema is missing a requirement; do not deploy.

## Incremental implementation sequence

1. Add route-neutral brand/navigation primitives and public/homeowner/sample-report routes, including legacy redirect.
2. Refine the homeowner investigation and adaptive report context without changing the shared API contract.
3. Add the browser-local workspace domain, repository, provider, and shell.
4. Add overview, history, new package, detail, organization settings, and professional report context.
5. Add domain/routing tests, complete the responsive/accessibility sweep, and run all verification commands.

## Guardrails

- No claim score, claim conclusion, coverage conclusion, or assertion of property damage.
- No login, checkout, purchase, email, invitation, delivery, certification, or cloud-storage fiction.
- No client terminology in the homeowner journey.
- No homeowner terminology inside professional package workflows.
- No direct `localStorage` calls outside the repository.
- No duplicate weather aggregation or PDF implementation.
- No deployment in this task.
