import { SearchResponse } from "./types";

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function parseEvidenceResponse(value: unknown): SearchResponse {
    if (isObject(value) && value.schemaVersion !== "2.1" && ("noaa" in value || "satellite" in value)) {
        throw new Error(
            "The local Worker is serving the retired v1 response. Stop the process on port 8787 and restart cd-cf-middleware with npm run dev.",
        );
    }

    if (isObject(value) && value.schemaVersion === "2.0") {
        throw new Error(
            "The local Worker is serving evidence schema 2.0. Restart cd-cf-middleware to load schema 2.1 with separated event and precipitation windows.",
        );
    }

    if (
        !isObject(value)
        || value.schemaVersion !== "2.1"
        || !isObject(value.property)
        || !isObject(value.eventDayWindow)
        || !isObject(value.analysisWindow)
        || !isObject(value.precipitationContextWindow)
        || !isObject(value.records)
        || !isObject(value.precipitation)
        || !isObject(value.summary)
        || !Array.isArray(value.timeline)
        || !Array.isArray(value.sources)
    ) {
        throw new Error("Invalid response: missing normalized evidence records");
    }

    return value as unknown as SearchResponse;
}
