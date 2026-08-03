import { EvidenceClassification, EvidenceRecord, SearchResponse, TimelineEntry } from "./types";

export const DEFAULT_TIMELINE_PREVIEW_LIMIT = 5;

export const classificationLabels: Record<EvidenceClassification, string> = {
    observed: "Observed",
    reported: "Reported",
    official_event: "Official Record",
    warning: "Warning",
    modeled: "Modeled Estimate",
    radar_estimated: "Radar Estimate",
    contextual: "Context Only",
    inferred: "Inferred",
};

export function formatMeasurement(value: number | undefined, unit: string, digits = 2) {
    return typeof value === "number" && Number.isFinite(value)
        ? `${value.toFixed(digits)} ${unit}`
        : "Not available";
}

export function formatMagnitude(record?: { magnitude?: { value: number; unit: string } }) {
    if (!record?.magnitude) return "Not available";
    const digits = record.magnitude.unit === "mph" ? 1 : 2;
    return formatMeasurement(record.magnitude.value, record.magnitude.unit, digits);
}

export function isAvailableDate(value?: string) {
    return Boolean(value && !Number.isNaN(new Date(value).getTime()));
}

export function readableEvidenceDate(value?: string, timeZone?: string) {
    if (!isAvailableDate(value)) return "Not available";
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone,
        timeZoneName: "short",
    };
    try {
        return new Intl.DateTimeFormat("en-US", options).format(new Date(value as string));
    } catch (error) {
        if (!(error instanceof RangeError)) throw error;
        return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "Etc/UTC" })
            .format(new Date(value as string));
    }
}

export function hasImagery(data: SearchResponse) {
    return Boolean(data.imagery.before || data.imagery.after);
}

export function chronologicalTimelinePreview(
    entries: TimelineEntry[],
    limit = DEFAULT_TIMELINE_PREVIEW_LIMIT,
) {
    return entries.slice(0, Math.max(0, limit));
}

export function maximumRecord(
    records: EvidenceRecord[],
    category: EvidenceRecord["category"],
) {
    return records
        .filter((record) => record.category === category && record.magnitude)
        .sort((a, b) => (b.magnitude?.value ?? -Infinity) - (a.magnitude?.value ?? -Infinity))[0];
}

export function allEvidenceRecords(data: SearchResponse) {
    return Object.values(data.records).flat();
}

export function evidenceRecordById(data: SearchResponse, recordId?: string) {
    if (!recordId) return undefined;
    return allEvidenceRecords(data).find((record) => record.id === recordId);
}

export function evidenceSourceLabel(record?: EvidenceRecord) {
    if (!record) return "Source unavailable";
    const reportSource = record.attributes?.reportSource;
    if (record.attributes?.accessPath === "local_storm_report_archive" && typeof reportSource === "string") {
        return `${reportSource} via ${record.source.dataset}`;
    }
    const stationId = record.attributes?.stationId;
    if (typeof stationId === "string") return `${stationId} · ${record.source.dataset}`;
    return `${record.source.provider} · ${record.source.dataset}`;
}

export function recordProximity(record?: EvidenceRecord) {
    const distance = record?.location?.distanceMilesFromProperty;
    const direction = record?.location?.directionFromProperty;
    if (typeof distance !== "number") return undefined;
    return `${distance.toFixed(1)} miles${direction ? ` ${direction}` : ""}`;
}

export function evidenceHeadline(data: SearchResponse) {
    const substantive = data.summary.localStormReportCount
        + data.summary.warningCount
        + data.summary.officialEventCount
        + (data.summary.maximumObservedWindGustMph === undefined ? 0 : 1);
    if (substantive >= 3) return "Multiple weather records identified near the property";
    if (substantive > 0) return "Weather evidence found near the property";
    return "Limited official records found for the selected period";
}

export type EvidenceSummaryBlockId = "wind" | "hail" | "stormReports" | "warnings";

export interface EvidenceSummaryBlock {
    id: EvidenceSummaryBlockId;
    text: string;
}

export const EVIDENCE_SUMMARY_DISCLAIMER = "These records describe available evidence near the property and do not establish damage, causation, coverage, or claim outcome.";
export const EMPTY_EVIDENCE_SUMMARY = "The searched sources returned no substantive wind, hail, warning, or storm-report records for this location and window.";

export function buildEvidenceSummaryBlocks(data: SearchResponse): EvidenceSummaryBlock[] {
    const blocks: EvidenceSummaryBlock[] = [];
    const observedWind = evidenceRecordById(data, data.summary.maximumObservedWindGustRecordId);
    const reportedWind = evidenceRecordById(data, data.summary.maximumReportedWindGustRecordId);
    const windPieces: string[] = [];
    if (data.summary.maximumObservedWindGustMph !== undefined) {
        const proximity = recordProximity(observedWind);
        windPieces.push(`Event-day observations include a maximum gust of ${formatMeasurement(data.summary.maximumObservedWindGustMph, "mph", 1)}${observedWind ? ` from ${evidenceSourceLabel(observedWind)}` : ""}${proximity ? `, ${proximity} from the property` : ""}.`);
    }
    if (data.summary.maximumReportedWindGustMph !== undefined) {
        const proximity = recordProximity(reportedWind);
        windPieces.push(`Nearby storm reports include a maximum reported gust of ${formatMeasurement(data.summary.maximumReportedWindGustMph, "mph", 1)}${proximity ? `, ${proximity} from the property` : ""}.`);
    }
    if (windPieces.length) blocks.push({ id: "wind", text: windPieces.join(" ") });
    if (data.summary.maximumReportedHailInches !== undefined) {
        blocks.push({ id: "hail", text: `Nearby Local Storm Reports include hail up to ${formatMeasurement(data.summary.maximumReportedHailInches, "in")} within the searched radius.` });
    }
    if (data.summary.localStormReportCount > 0) {
        blocks.push({ id: "stormReports", text: `${data.summary.localStormReportCount} nearby Local Storm Report${data.summary.localStormReportCount === 1 ? " was" : "s were"} returned.` });
    }
    if (data.summary.warningCount > 0) {
        blocks.push({ id: "warnings", text: `${data.summary.warningCount} archived warning polygon${data.summary.warningCount === 1 ? "" : "s"} intersected the property point.` });
    }
    return blocks;
}

export function buildEvidenceSummary(data: SearchResponse) {
    const blocks = buildEvidenceSummaryBlocks(data);
    return [blocks.length ? blocks.map((block) => block.text).join(" ") : EMPTY_EVIDENCE_SUMMARY, EVIDENCE_SUMMARY_DISCLAIMER].join(" ");
}
