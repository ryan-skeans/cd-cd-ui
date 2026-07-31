import test from "node:test";
import assert from "node:assert/strict";
import {
    buildEvidenceSummary,
    chronologicalTimelinePreview,
    classificationLabels,
    DEFAULT_TIMELINE_PREVIEW_LIMIT,
    evidenceRecordById,
    evidenceSourceLabel,
    evidenceHeadline,
    formatMagnitude,
    maximumRecord,
    readableEvidenceDate,
    recordProximity,
} from "../src/lib/evidence";
import { EvidenceRecord, SearchResponse, TimelineEntry } from "../src/lib/types";

function response(summary: Partial<SearchResponse["summary"]> = {}): SearchResponse {
    return {
        schemaVersion: "2.1",
        generatedAt: "2024-05-22T00:00:00.000Z",
        property: { latitude: 41.6, longitude: -93.6, timeZone: "America/Chicago" },
        requestedLossDate: "2024-05-21T12:00:00.000Z",
        eventDayWindow: { start: "2024-05-21T05:00:00.000Z", end: "2024-05-22T05:00:00.000Z" },
        analysisWindow: { start: "2024-05-19T05:00:00.000Z", end: "2024-05-24T05:00:00.000Z" },
        precipitationContextWindow: { start: "2024-05-14T05:00:00.000Z", end: "2024-05-22T05:00:00.000Z" },
        records: {
            localStormReports: [], stationObservations: [], officialEvents: [], warnings: [],
            radar: [], tropicalCyclones: [], disasters: [], imagery: [],
        },
        precipitation: { missingHourCount: 0 },
        imagery: {},
        timeline: [],
        summary: {
            localStormReportCount: 0,
            warningCount: 0,
            officialEventCount: 0,
            ...summary,
        },
        sources: [],
        limitations: [],
        dataQualityWarnings: [],
    };
}

function record(overrides: Partial<EvidenceRecord>): EvidenceRecord {
    return {
        id: "test-record",
        category: "wind",
        eventType: "Wind gust",
        classification: "observed",
        startTime: "2024-05-21T18:00:00.000Z",
        source: { provider: "Test", dataset: "Test", retrievedAt: "2024-05-22T00:00:00.000Z" },
        quality: { status: "verified_format", flags: [] },
        limitations: [],
        ...overrides,
    };
}

test("complete evidence gets a multi-source headline and neutral factual summary", () => {
    const data = response({
        maximumObservedWindGustMph: 51.8,
        maximumObservedWindGustRecordId: "observed-wind",
        maximumReportedWindGustMph: 70,
        maximumReportedWindGustRecordId: "reported-wind",
        maximumReportedHailInches: 1.5,
        localStormReportCount: 2,
        warningCount: 1,
    });
    data.records.stationObservations.push(record({
        id: "observed-wind",
        magnitude: { value: 51.8, unit: "mph" },
        attributes: { stationId: "KDSM" },
        location: { distanceMilesFromProperty: 5.2 },
    }));
    data.records.localStormReports.push(record({
        id: "reported-wind",
        classification: "reported",
        magnitude: { value: 70, unit: "mph" },
        location: { distanceMilesFromProperty: 2.4 },
    }));
    assert.equal(evidenceHeadline(data), "Multiple weather records identified near the property");
    const summary = buildEvidenceSummary(data);
    assert.match(summary, /51\.8 mph/);
    assert.match(summary, /70\.0 mph/);
    assert.match(summary, /1\.50 in/);
    assert.match(summary, /do not establish damage, causation, coverage, or claim outcome/);
});

test("record-backed summaries find recovered automated observations across source groups", () => {
    const recovered = record({
        id: "recovered-kcid",
        magnitude: { value: 68, unit: "mph" },
        attributes: {
            accessPath: "local_storm_report_archive",
            reportSource: "ASOS",
        },
        source: {
            provider: "Iowa Environmental Mesonet",
            dataset: "NWS Local Storm Reports archive",
            retrievedAt: "2024-05-22T00:00:00.000Z",
        },
    });
    const data = response({
        maximumObservedWindGustMph: 68,
        maximumObservedWindGustRecordId: recovered.id,
    });
    data.records.localStormReports.push(recovered);

    assert.equal(evidenceRecordById(data, recovered.id), recovered);
    assert.equal(evidenceSourceLabel(recovered), "ASOS via NWS Local Storm Reports archive");
    assert.match(buildEvidenceSummary(data), /68\.0 mph from ASOS via NWS Local Storm Reports archive/);
});

test("partial evidence remains useful without overstating completeness", () => {
    const data = response({ localStormReportCount: 1 });
    assert.equal(evidenceHeadline(data), "Weather evidence found near the property");
    assert.match(buildEvidenceSummary(data), /1 nearby Local Storm Report was returned/);
});

test("empty evidence states source absence without claiming no weather", () => {
    const data = response();
    assert.equal(evidenceHeadline(data), "Limited official records found for the selected period");
    assert.match(buildEvidenceSummary(data), /searched sources returned no substantive/);
});

test("presentation helpers preserve classification, magnitude, and proximity", () => {
    const farther = record({ id: "farther", magnitude: { value: 45, unit: "mph" } });
    const maximum = record({
        id: "maximum",
        magnitude: { value: 62.345, unit: "mph" },
        location: { distanceMilesFromProperty: 7.25, directionFromProperty: "NW" },
    });
    assert.equal(classificationLabels.radar_estimated, "Radar Estimate");
    assert.equal(maximumRecord([farther, maximum], "wind")?.id, "maximum");
    assert.equal(formatMagnitude(maximum), "62.3 mph");
    assert.equal(recordProximity(maximum), "7.3 miles NW");
});

test("formats evidence timestamps with a timezone label without incompatible Intl shortcuts", () => {
    const formatted = readableEvidenceDate("2026-06-26T18:44:58.579Z", "America/Los_Angeles");
    assert.match(formatted, /Jun 26, 2026/);
    assert.match(formatted, /11:44 AM/);
    assert.match(formatted, /PDT/);
});

test("falls back to UTC when a provider supplies an invalid timezone", () => {
    const formatted = readableEvidenceDate("2026-06-26T18:44:58.579Z", "Invalid/Timezone");
    assert.match(formatted, /Jun 26, 2026/);
    assert.match(formatted, /6:44 PM/);
    assert.match(formatted, /UTC/);
});

test("collapsed timeline preview preserves the configured number of chronological entries", () => {
    const entries: TimelineEntry[] = Array.from({ length: 12 }, (_, index) => ({
        id: `timeline-${index + 1}`,
        recordId: `record-${index + 1}`,
        timestamp: `2024-05-21T${String(index).padStart(2, "0")}:00:00.000Z`,
        title: `Event ${index + 1}`,
        explanation: `Chronological event ${index + 1}`,
        classification: "reported",
        source: "Test source",
    }));

    assert.deepEqual(
        chronologicalTimelinePreview(entries).map((entry) => entry.id),
        entries.slice(0, DEFAULT_TIMELINE_PREVIEW_LIMIT).map((entry) => entry.id),
    );
});
