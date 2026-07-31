import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { EvidenceStateNotice } from "../src/components/evidence-state-notice";
import { SearchResponse, SourceResult } from "../src/lib/types";

function source(status: SourceResult["status"], message?: string): SourceResult {
    return {
        id: "test-source",
        provider: "Test Provider",
        dataset: "Test Dataset",
        status,
        recordCount: status === "complete" ? 1 : 0,
        retrievedAt: "2024-05-22T00:00:00.000Z",
        sourceUrl: "https://example.test/source",
        message,
        limitations: ["Test limitation"],
    };
}

function response(status: SourceResult["status"], count: number): SearchResponse {
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
        summary: { localStormReportCount: count, warningCount: 0, officialEventCount: 0 },
        sources: [source(status, status === "failed" ? "Station observations were temporarily unavailable." : undefined)],
        limitations: [],
        dataQualityWarnings: [],
    };
}

test("complete evidence renders no warning notice", () => {
    assert.equal(renderToStaticMarkup(<EvidenceStateNotice data={response("complete", 1)} />), "");
});

test("partial evidence renders its scoped provider failure", () => {
    const markup = renderToStaticMarkup(<EvidenceStateNotice data={response("failed", 1)} />);
    assert.match(markup, /Partial evidence package/);
    assert.match(markup, /Station observations were temporarily unavailable/);
});

test("empty evidence renders an honest bounded absence state", () => {
    const markup = renderToStaticMarkup(<EvidenceStateNotice data={response("empty", 0)} />);
    assert.match(markup, /No substantive weather records were returned/);
    assert.match(markup, /does not mean no weather occurred/);
});
