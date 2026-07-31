# ClaimDefender evidence data plan

Last reviewed: 2026-07-31

Implementation status: Increment 1 is implemented in the paired UI and Worker repositories. The current-state audit below intentionally records the pre-change baseline that informed the architecture; later increments remain deferred as described.

## Executive decision

ClaimDefender should return a normalized evidence package whose individual records remain inspectable. It must never collapse observed, reported, official, warned, modeled, radar-estimated, contextual, and inferred evidence into one severity or claim score.

The first production-safe release should use free, commercially usable public records that can be queried within a bounded Cloudflare Worker request:

1. NWS office, station, and timezone metadata from `api.weather.gov`.
2. Individual NWS Local Storm Reports (LSRs) through the Iowa Environmental Mesonet (IEM) historical GeoJSON service.
3. Actual ASOS/AWOS station observations through IEM's METAR archive, using the nearest NWS reporting stations.
4. Historical NWS storm-based warning polygons through IEM's point-in-polygon archive.
5. Event-day and antecedent precipitation windows calculated only from the selected station's observations.
6. A chronological timeline derived from those normalized records.
7. Sentinel-2 catalog metadata as contextual imagery availability only.

Open-Meteo must be removed from the intended paid SaaS path. Its free endpoint is limited to non-commercial use and its historical values are modeled/reanalysis values, not station observations.

NOAA Storm Events is essential to the paid evidence package, but its supported official access is annual bulk CSV rather than a small point-query API. It should be ingested asynchronously into a durable, indexed store before being enabled in synchronous searches. Downloading and decompressing a 2–16 MB annual file (often much larger uncompressed) inside each Worker request is not reliable or responsible.

## Current-state audit

### Worker

The Worker exposes `POST /initiateFreeSearch` and currently:

- validates coordinates and a date with Zod;
- sequentially calls one weather aggregation function and one imagery function;
- queries the NWS live alerts API across a historical date range even though `/alerts` retains only the past seven days;
- calls Open-Meteo Archive for gust and precipitation reanalysis;
- calls an IEM LSR endpoint and retains only maxima/booleans;
- discovers one before and one after Sentinel-2 catalog item;
- uses a per-isolate `Map` cache for one hour;
- wraps almost all weather retrieval in one broad `try/catch`;
- uses unvalidated `any` response bodies;
- returns ambiguous scalar fields such as `maxWindGustMph` and `totalPrecipitationInches`.

The imagery function also catches all failures and returns indistinguishable empty values, so callers cannot tell an empty archive result from a provider failure.

### React application

The UI has already removed claim-score framing, but its evidence content is still constrained by the old scalar contract. It:

- describes Open-Meteo reanalysis as a weather observation;
- describes the two-week precipitation sum as a seven-day total in one place;
- says an historical NWS alert archive was searched when the Worker used a seven-day live-alert endpoint;
- cannot display individual report times, station distance, warnings, or source failures;
- has no normalized timeline;
- cannot distinguish zero from missing data because the Worker initializes missing maxima to zero;
- displays a single loading state even though providers have different failure modes;
- generates a PDF from the same ambiguous aggregate fields.

### Repository and operational constraints

- The Worker has no database, R2 bucket, queue, scheduled ingestion, or persistent cache binding.
- The Worker has no automated tests and no test runner beyond TypeScript/Wrangler dependencies.
- The UI has lint/build scripts but no component test framework.
- The local Worker changes preceding this plan have not been deployed; live behavior must not be assumed.
- The current `User-Agent` contains a placeholder address and must be replaced before production.

## Problems to correct

1. **Classification collapse:** a reported gust can overwrite a modeled gust, after which the single maximum looks observed.
2. **False provenance:** Open-Meteo reanalysis is labeled as NOAA/weather observations.
3. **Historical-alert error:** NWS explicitly documents that `/alerts` contains only the past seven days.
4. **Missing record identity:** report product IDs, warning VTEC identifiers, station IDs, timestamps, remarks, coordinates, and qualifiers are discarded.
5. **Missingness encoded as zero:** no result and a measured zero are materially different facts.
6. **One-provider failure can hide another:** the broad catch and sequential flow prevent scoped error reporting.
7. **Weak cache:** per-isolate memory is neither durable nor shared and does not prevent repeated static bulk downloads.
8. **Satellite overstatement risk:** 10 m Sentinel-2, 15–30 m Landsat, and kilometer-scale GOES imagery cannot support roof-level damage conclusions.
9. **Licensing mismatch:** Open-Meteo's free endpoint does not allow commercial use.
10. **No deduplication contract:** the same NWS report can appear through IEM and SPC or in corrected LSR products.

## Candidate source comparison

The rankings below are implementation decisions for the current architecture, not judgments about scientific value.

### Implement now

| Provider / dataset | Authority and exact use | Coverage, cadence, and retention | Access, limits, format, and commercial use | Reliability and limitations |
|---|---|---|---|---|
| NOAA/NWS API: Points and observation-station metadata | Authoritative metadata. Use `timeZone`, `forecastOffice`/WFO, observation-station identifiers, station name, coordinates, and elevation. Docs: https://www.weather.gov/documentation/services-web-api | United States; current station metadata; updated operationally. This API is not the historical observation archive. | No key; JSON/GeoJSON; rate limits are not numerically published, so identify the application, bound requests, and cache. U.S. government data are public; attribute NOAA/NWS and do not imply endorsement. | Provider can be slow or return maintenance errors. Cache stable point/station metadata. Never use `/observations` for old claims.
| Iowa State University IEM: NWS Local Storm Reports GeoJSON | Third-party archive of authoritative NWS reports. Preserve `product_id`, `valid`, `typetext`, `magnitude`, `qualifier`, `source`, `remark`, WFO, coordinates, city/county/state, and computed distance/bearing. Docs: https://mesonet.agron.iastate.edu/geojson/lsr.py?help= | Archive is described as dating to 2003; service accepts UTC windows and spatial bounds; ingest is near-real-time. No guaranteed retention SLA. | No key; GeoJSON; IEM explicitly permits lawful commercial use. No numeric quota is published; service is as-is. | IEM states the archive is not complete or official. LSRs are reports, not property observations. Corrected/duplicated products require deduplication. Magnitude qualifiers must be retained.
| Iowa State University IEM: ASOS/METAR archive | IEM access layer over actual surface observations. Use station ID, valid time, gust, sustained wind, direction, hourly precipitation, present-weather codes, raw METAR, and missingness. Docs: https://mesonet.agron.iastate.edu/cgi-bin/request/asos.py?help= | Historical depth varies by station; U.S. ASOS history commonly spans decades. Updates operationally. Station period of record and data gaps vary. | No key; CSV; lawful commercial use permitted by IEM. One-second per-IP throttle and a 1,000 station-year query cap are documented. Query a few stations over days, never poll rapidly. | Third-party access layer, as-is, and can return 503 under load. METAR fields contain missing/trace values and report corrections. Label as observed at the station, never at the property.
| Iowa State University IEM: Storm Based Warnings by Point | Third-party spatial archive of authoritative NWS warning products. Use WFO, phenomena/significance, event ID, issue/effective/expire times, product ID when supplied, wind/hail tags, and the explicit fact that the property point intersects the warning polygon. Docs: https://mesonet.agron.iastate.edu/json/sbw_by_point.py?help= and https://mesonet.agron.iastate.edu/geojson/sbw.py?help= | IEM VTEC records may exist from 1986; storm-based polygons generally begin in 2007, with earlier county-warning geometry not equivalent. Updated near-real-time; no retention guarantee. | No key; JSON/GeoJSON/CSV; IEM permits lawful commercial use; no published numeric request quota. | IEM is not the official NCEI archive and warns that services are as-is. Polygon coordinates can be low precision. A warning proves warning coverage, not that the warned hazard occurred at the property.
| Element 84 Earth Search: Sentinel-2 L2A STAC | Third-party free catalog over Copernicus open data. Use item ID, acquisition time, collection, cloud cover, geometry, and preview/asset URL only. Docs: https://github.com/Element84/earth-search and https://earth-search.aws.element84.com/v1/api.html | Global Sentinel-2 coverage from 2015; revisit varies; catalog updates as scenes arrive. | No key; STAC JSON; API is free but has no service guarantee. Sentinel data have free, full, open access including commercial reuse under the Copernicus notice: https://cds.climate.copernicus.eu/licences/ec-sentinel | 10 m best optical resolution, cloud obstruction, and acquisition gaps make it unsuitable for roof-damage findings. Present only as contextual capture availability.

### Implement next

| Provider / dataset | Authority and exact use | Coverage, cadence, and retention | Access, limits, format, and commercial use | Reliability and reason for sequencing |
|---|---|---|---|---|
| NOAA NCEI Storm Events Database bulk files | Authoritative finalized Storm Data records. Use `EVENT_ID`, `EPISODE_ID`, begin/end times, event type, magnitude/type, source, begin/end coordinates, location, county/zone, episode/event narratives, and property-damage estimate with its documented uncertainty. Docs: https://www.ncei.noaa.gov/stormevents/ and https://www.ncei.noaa.gov/stormevents/ftp.jsp | January 1950 onward, with event-type coverage changing by era; all event types are recorded only from 1996. Published files are revised as NWS records are finalized/corrected, so recent months lag. | No key; annual gzip CSV; no API quota. NOAA public data may be used commercially with attribution and no endorsement implication. | Supported access is bulk, not a stable point API. Build a scheduled downloader, checksum/version each annual file, normalize to D1/R2, and query a spatial/time index. Do not download annual files in user requests.
| NOAA NCEI GHCN Hourly / LCDv2 | Authoritative quality-controlled hourly station archive and eventual replacement for retired ISD. Use station ID/metadata, wind gust/speed/direction, precipitation, present weather, quality flags, and remarks. Docs: https://www.ncei.noaa.gov/products/global-historical-climatology-network-hourly and https://www.ncei.noaa.gov/products/land-based-station/local-climatological-data | GHCNh is global with more than 20,000 stations and source-dependent periods; LCDv2 is roughly 1,000 U.S. stations from 2005. Updated daily; data gaps vary by station/element. | No key for public downloads/services; PSV/CSV and service formats; NOAA public-data terms. | Prefer this as the long-term station source after the access workflow and quality-flag parser are validated. IEM METAR is lower-friction for the first synchronous release.
| OpenFEMA Disaster Declarations Summaries | Authoritative contextual declaration record. Use disaster number, declaration type/title, incident type, incident begin/end, declaration date, designated area, state, and program flags. Docs: https://www.fema.gov/about/openfema/disaster-declarations-summaries | 1953 onward; county data unavailable before 1964; fire-management history is partial; updated about every 20 minutes. | No registration; OData-style JSON/CSV API; no published quota in dataset docs; U.S. government open data subject to OpenFEMA terms. | Context only. Match county and overlapping dates; never imply declaration proves weather or damage at a property.
| NOAA NHC HURDAT2 and Tropical Cyclone Reports | Authoritative post-storm best track and narrative context. Use storm ID/name, status/classification, best-track points, closest approach/time/distance, maximum sustained wind at the cyclone center, and report URL. Docs: https://www.nhc.noaa.gov/data/ and https://www.nhc.noaa.gov/data/hurdat/hurdat2-format-atlantic.pdf | Atlantic 1851 onward; northeast/north-central Pacific 1949 onward; six-hourly plus some special points; updated after post-season analysis. | No key; comma-delimited text, XML/PDF/GIS archives; NOAA public data. | Download once per basin/version and cache durably. Track intensity is not a property wind observation; closest approach is contextual.
| USDA NAIP | Authoritative U.S. aerial imagery context. Use acquisition date, item ID, footprint, ground sample distance, and source URL. Docs: https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer | CONUS acquisitions from 2002; states are flown intermittently, usually leaf-on. Historic resolution 1–2 m, mostly 0.6 m since 2018, with some 0.3 m. | No key for National Map services/downloads; image service/JP2; public domain. | Higher resolution than Sentinel but not event-timed and not consistently before/after a loss. Useful contextual appendix, not automated damage detection.

### Defer

| Provider / dataset | Decision and verified constraints |
|---|---|
| NOAA NEXRAD Level II archive | Authoritative radar volumes are freely available without an AWS account from `s3://unidata-nexrad-level2`; docs: https://registry.opendata.aws/noaa-nexrad/. Files require nearest-radar selection, binary decoding, beam geometry, quality control, and defensible sampling. A Worker request is the wrong compute path. Build an offline processor that retains radar/site/scan/product identifiers and labels reflectivity as radar evidence, not hail observed at a property.
| NOAA MRMS operational archive / MESH | NOAA's open MRMS bucket is documented at https://registry.opendata.aws/noaa-mrms-pds/ and MESH is radar/model-derived. Operational web directories are rolling, while practical historical depth and product continuity need validation before claims use. GRIB2 parsing and subsetting should be asynchronous. Any value must be `radar_estimated`; MESH is never an observed hailstone size.
| NOAA MYRORSS | The research reanalysis at https://registry.opendata.aws/noaa-oar-myrorss-pds/ provides quality-controlled derived radar products for a fixed historical period and may support a later hail-history backfill. It is too large and specialized for synchronous Worker parsing.
| NOAA SPC preliminary storm reports | Daily preliminary report files are useful for rapid situational review, but their reports substantially overlap NWS LSRs. Do not count them as independent corroboration. Add only with a cross-provider identity/deduplication strategy and label them preliminary.
| Landsat | Official USGS archive is free, public domain, and spans 1972 onward: https://www.usgs.gov/landsat-missions/data. Its common 30 m optical resolution (15 m panchromatic on some missions) cannot establish roof-level damage. Use only for broad contextual change where Sentinel/NAIP are unavailable.
| GOES imagery | NOAA archives offer excellent storm evolution context but kilometer-scale imagery cannot resolve roofs. GridSat GOES is about 4 km and covers 1994–2017: https://www.ncei.noaa.gov/products/satellite/gridded-goes-conus. File volume and meteorological interpretation make this an offline/contextual product.

### Reject for the required paid SaaS path

| Source | Reason |
|---|---|
| Open-Meteo free API | Free tier explicitly prohibits commercial use: https://open-meteo.com/en/terms. Historical data are ERA5/ERA5-Land/IFS modeled reanalysis at roughly 9–25 km, not station observations: https://open-meteo.com/en/docs/historical-weather-api. A paid Open-Meteo plan would also violate this project's all-new-data-must-be-free rule.
| Live NWS `/alerts` for old claims | Official NWS docs state `/alerts` contains only the past seven days: https://www.weather.gov/documentation/services-web-api. It cannot be treated as a historical warning source.
| Scraped commercial weather/imagery sites | Terms, provenance, redistribution rights, stability, or historical access are unsuitable.
| Free-tier commercial APIs with later paid quotas | They do not satisfy the non-negotiable free-access rule and create a migration/dependency trap.
| Automated roof-damage conclusions from Sentinel, Landsat, GOES, or NAIP | Their resolution, cadence, clouds, angle, and change ambiguity do not support that conclusion. Free imagery does not replace licensed high-resolution imagery or an inspection.

## Normalized data model

The API should use a versioned envelope and explicit classifications:

```ts
type EvidenceClassification =
  | "observed"
  | "reported"
  | "official_event"
  | "warning"
  | "radar_estimated"
  | "modeled"
  | "contextual"
  | "inferred";

type ProviderStatus = "complete" | "partial" | "empty" | "failed" | "unavailable";

interface EvidenceRecord {
  id: string;                         // stable internal ID
  category: "wind" | "hail" | "precipitation" | "tornado" | "warning" | "storm_event" | "imagery" | "tropical" | "disaster";
  eventType: string;                  // provider event name, normalized only for display
  classification: EvidenceClassification;
  startTime: string;                  // ISO-8601 UTC
  endTime?: string;
  magnitude?: { value: number; unit: string; qualifier?: "measured" | "estimated" | "unknown" };
  description?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    distanceMilesFromProperty?: number;
    directionFromProperty?: string;
    propertyInsideGeometry?: boolean;
  };
  source: {
    provider: string;
    dataset: string;
    recordId?: string;
    productId?: string;
    office?: string;
    sourceUrl?: string;
    retrievedAt: string;
  };
  quality: {
    status: "verified_format" | "provider_flagged" | "missing_fields" | "unverified";
    flags: string[];
  };
  limitations: string[];
}
```

The aggregate envelope should be:

```ts
interface EvidencePackageResponse {
  schemaVersion: "2.1";
  generatedAt: string;
  property: { latitude: number; longitude: number; timeZone: string };
  requestedLossDate: string;
  eventDayWindow: { start: string; end: string };
  analysisWindow: { start: string; end: string };
  precipitationContextWindow: { start: string; end: string };
  records: {
    localStormReports: EvidenceRecord[];
    stationObservations: EvidenceRecord[];
    officialEvents: EvidenceRecord[];
    warnings: EvidenceRecord[];
    radar: EvidenceRecord[];
    tropicalCyclones: EvidenceRecord[];
    disasters: EvidenceRecord[];
  };
  precipitation: {
    stationId?: string;
    eventDayTotalInches?: number;
    prior24HoursInches?: number;
    prior72HoursInches?: number;
    priorSevenDaysInches?: number;
    maximumHourlyInches?: number;
    maximumThreeHourInches?: number;
    wetHourCount?: number;
    missingHourCount: number;
  };
  timeline: TimelineEntry[];
  summary: {
    maximumObservedWindGustMph?: number;
    maximumObservedWindGustRecordId?: string;
    maximumModeledWindGustMph?: number;
    maximumModeledWindGustRecordId?: string;
    maximumReportedWindGustMph?: number;
    maximumReportedWindGustRecordId?: string;
    maximumReportedHailInches?: number;
    maximumReportedHailRecordId?: string;
    maximumRadarEstimatedHailInches?: number;
    maximumRadarEstimatedHailRecordId?: string;
    localStormReportCount: number;
    warningCount: number;
    officialEventCount: number;
  };
  sources: SourceResult[];
  limitations: string[];
  dataQualityWarnings: string[];
}
```

Empty numeric evidence is omitted, never represented as zero. `0` is returned only when a source observation explicitly reported zero.

## Provenance rules

1. Every record carries provider, dataset, provider record/product identifier, retrieval time, classification, and limitations.
2. The access layer and originating authority are both named (for example, “NWS Local Storm Report via Iowa Environmental Mesonet”).
3. Station values say “observed at [station], [distance] miles away,” never “at the property.”
4. LSRs say “reported,” retaining the source and measured/estimated qualifier, except measured ASOS/AWOS observations recovered through the LSR archive; those remain `observed` and name the archive as their access path.
5. Storm Events rows say “finalized official event” and retain narrative and event/episode IDs.
6. Warning entries say whether the property point intersected the archived polygon. A warning is not evidence that the hazard occurred.
7. Modeled and radar-derived values are never promoted to observed/reported categories.
8. Derived summaries include only the matching classification. Reported gusts cannot populate `maximumObservedWindGustMph`.
9. Derived timeline entries retain a reference to their source record ID and cannot be created when the source field is absent.
10. Absence language is bounded: “No records were returned by the searched sources and window,” never “no weather occurred.”
11. Event wind and radar-hail summaries use the event-day window; report summaries, counts, station records, and timeline use the analysis window; antecedent rows are retained only for precipitation aggregation.

## Deduplication

- Prefer provider-native `product_id`/record IDs.
- For LSR corrections without a stable ID, create a fingerprint from rounded coordinates, valid time, normalized type, magnitude, WFO, and normalized remark.
- Prefer the latest corrected record and retain a quality note that duplicates/corrections were consolidated.
- Do not count SPC and IEM copies of the same NWS report independently.
- Never deduplicate an observed station record against a reported LSR; they are different evidence classifications even if times/magnitudes match.

## Failure and fallback strategy

- Run independent providers concurrently with their own 6–10 second timeout.
- Validate response shape before normalization.
- Return `200` with partial results when at least the request is valid and the envelope can be built.
- Populate a `SourceResult` for every attempted source: `complete`, `empty`, `partial`, `failed`, or `unavailable`, plus a user-safe message and record count.
- Retry once only for idempotent `429`, `502`, `503`, or `504` responses and honor `Retry-After` when it fits the overall budget. Do not retry validation errors or broad 4xx responses.
- Station fallback: attempt the nearest suitable station, then the next one if the first has no usable records; retain which stations were attempted.
- Metadata fallback: use `Etc/UTC` and report a quality warning when NWS point metadata is unavailable.
- Imagery failure must not fail weather evidence.
- Provider error details belong in logs; the client receives scoped, non-sensitive messages.

## Caching recommendations

1. Use Cloudflare Cache API for normalized historical package responses, keyed by rounded coordinates, requested date, schema version, and provider-version token. Suggested TTL: 24 hours for recent events, 30 days for events older than 90 days.
2. Cache NWS point/station metadata for 30 days.
3. Cache IEM historical source responses for 7–30 days once the window is no longer changing.
4. Do not rely on a per-isolate `Map` as the authoritative cache; it is only an optional hot cache.
5. Ingest NCEI Storm Events annually/monthly through a scheduled job into D1 or R2-derived indexes. Store source filename, creation date, checksum, and retrieval time.
6. Store raw provider responses only where retention and privacy policies permit; normalized weather data do not need the user's entered address.
7. Include schema/provider version in cache keys so corrected parsing cannot return old shapes.

## Testing strategy

### Pure unit tests

- haversine distance and compass bearing;
- UTC and property-timezone day boundaries, including daylight-saving transitions;
- precipitation windows, traces, rolling three-hour maxima, wet hours, and missing hours;
- knots/mph, millimeters/inches, and provider magnitude mappings;
- warning point-in-polygon including holes and boundary points;
- classification mapping and classification-specific summary fields;
- stable IDs and LSR correction/deduplication;
- chronological timeline sorting and time ranges.

### Provider contract tests

- valid, empty, and malformed GeoJSON/JSON/CSV fixtures;
- timeout, 429/503, and non-retryable 4xx behavior;
- missing station gust/precipitation fields;
- IEM magnitude qualifiers and warning metadata;
- source-level partial failures.

### API and UI tests

- complete, partial, and all-empty evidence packages;
- records remain usable when imagery fails;
- observed versus reported values never share an ambiguous label;
- source status/limitation messages render accessibly;
- keyboard-accessible timeline/source details;
- mobile layouts and long remarks/narratives;
- report/PDF includes sources, identifiers, limitations, and retrieval date.

Keep live-provider smoke tests separate from deterministic CI fixtures. A passing live test is not a substitute for schema validation.

## Incremental implementation plan

### Increment 1 — implement now

- Introduce the versioned normalized model, geometry/date/precipitation utilities, timeline builder, and source-result type.
- Replace Open-Meteo and live-alert history with NWS station discovery + IEM ASOS, IEM LSR GeoJSON, and IEM warning-by-point.
- Fetch providers concurrently with bounded timeouts and scoped failures.
- Keep Sentinel discovery independent and label it contextual.
- Return classification-specific summaries and omit missing numeric values.
- Update the React dashboard, loading copy, empty/partial states, timeline, provenance, and report.
- Add deterministic unit/provider tests and run typecheck, tests, lint, and builds.

### Increment 2 — implement next

- Add scheduled NCEI Storm Events ingestion with durable versioned storage and a spatial/time index.
- Replace the IEM station access layer with, or corroborate it against, GHCNh/LCDv2 once its station-search and quality-flag parser is production-tested.
- Add HURDAT2 closest-approach context and OpenFEMA county declaration context.
- Add NAIP acquisition metadata where it improves the contextual imagery appendix.

### Increment 3 — defer until an offline geospatial pipeline exists

- Process NEXRAD/MRMS/MYRORSS asynchronously, validate against known cases, and expose only traceable radar-estimated products.
- Add broad-scale GOES/Landsat context only when it answers a specific evidence question.
- Evaluate paid high-resolution imagery separately; it is outside this all-free integration plan.

## Release gates

- No Open-Meteo free endpoint in the commercial request path.
- No historical claim relies on the live NWS alerts endpoint.
- No ambiguous `maxWind`, `maxHail`, score, claim-strength, or causation field.
- A one-source outage still returns and renders other evidence.
- Each visible key value exposes classification, source, time, and distance when applicable.
- Local Worker response is exercised directly before UI completion is claimed.
- Deployment and live endpoint verification are a separate, explicit step.
