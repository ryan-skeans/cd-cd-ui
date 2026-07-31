# ClaimDefender

ClaimDefender is an evidence-first historical weather research interface. A user selects a property and estimated loss date; the app presents the available observations, reports, warnings, precipitation windows, imagery catalog records, source status, and limitations returned by the paired Cloudflare Worker.

The product deliberately does not score claims, predict coverage, generate rebuttals, or treat a nearby report as proof of conditions at a structure. The source architecture and commercial-use evaluation are in [`docs/evidence-data-plan.md`](docs/evidence-data-plan.md).

## Local development

Use Node 20, configure the existing Mapbox and Worker environment variables, then run:

```bash
npm install
npm run dev
```

The paired Worker lives in `../cd-cf-middleware` and exposes `POST /initiateFreeSearch` using evidence schema `2.1`.

## Verification

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

The UI tests cover complete, partial, and empty evidence presentation logic. The production build verifies the complete Next.js rendering graph. Provider and HTTP contract tests live in the Worker repository.

## Evidence experience

The results dashboard includes:

- explicit badges for observed, reported, official, warning, radar-estimated, modeled, contextual, and inferred evidence;
- station names and distances for actual observations;
- exact supporting record provenance for headline maximum values;
- distinct event-day, analysis, and antecedent-precipitation windows;
- report source and distance/direction for Local Storm Reports;
- a source-backed event timeline;
- warning polygon context kept separate from confirmed event records;
- partial-provider, no-record, and unavailable-data states;
- a professional report preview and PDF source appendix.

Deployment is intentionally separate from local verification. Neither `npm run build` nor the changes in this repository publish the UI or Worker.
