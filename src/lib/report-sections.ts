import { EvidenceClassification, EvidenceRecord, SearchResponse, TimelineEntry } from "./types";

export type RequiredReportContentId =
    | "reportIdentification"
    | "propertyAndEvent"
    | "sourceAndImageryDocumentation"
    | "methodologyAndDisclaimers";

export interface RequiredReportContentDefinition {
    id: RequiredReportContentId;
    label: string;
    description: string;
}

export const REQUIRED_REPORT_CONTENT: readonly RequiredReportContentDefinition[] = [
    {
        id: "reportIdentification",
        label: "Report identification",
        description: "Include the report ID, generation date, and professional package context.",
    },
    {
        id: "propertyAndEvent",
        label: "Property and event",
        description: "Include the property, coordinates, date of loss, and observation window.",
    },
    {
        id: "sourceAndImageryDocumentation",
        label: "Source and imagery documentation",
        description: "Include source retrieval status, record counts, image capture dates, and imagery identifiers.",
    },
    {
        id: "methodologyAndDisclaimers",
        label: "Methodology and limitations",
        description: "Include data-quality notices, material limitations, and required report disclaimers.",
    },
];

export type ReportSectionId = "evidenceSummary" | "eventTimeline" | "weatherContext";

export interface ReportSectionDefinition {
    id: ReportSectionId;
    label: string;
    description: string;
    initiallyExpanded: boolean;
}

export const REPORT_SECTION_DEFINITIONS: readonly ReportSectionDefinition[] = [
    {
        id: "evidenceSummary",
        label: "Evidence summary",
        description: "Choose the headline findings shown near the beginning of the report.",
        initiallyExpanded: true,
    },
    {
        id: "eventTimeline",
        label: "Weather-event timeline",
        description: "Choose which kinds of chronological source records to include.",
        initiallyExpanded: false,
    },
    {
        id: "weatherContext",
        label: "Weather context",
        description: "Choose supporting weather context associated with the event window.",
        initiallyExpanded: false,
    },
];

export type ReportContentId =
    | "summary.wind"
    | "summary.hail"
    | "summary.precipitation"
    | "summary.warnings"
    | "summary.stormReports"
    | "timeline.observations"
    | "timeline.windReports"
    | "timeline.tornadoReports"
    | "timeline.hailReports"
    | "timeline.otherReports"
    | "timeline.warnings"
    | "timeline.officialEvents"
    | "timeline.additionalContext"
    | "weather.precipitation";

export interface ReportCustomizationInput {
    data: SearchResponse;
    eventType?: string;
}

export interface ReportContentDefinition {
    id: ReportContentId;
    sectionId: ReportSectionId;
    label: string;
    description: string;
    isAvailable: (input: ReportCustomizationInput) => boolean;
    isRecommended: (input: ReportCustomizationInput) => boolean;
}

export interface ReportPdfConfiguration {
    includedContent: ReportContentId[];
}

export interface ResolvedReportPdfConfiguration {
    includedContent: ReportContentId[];
    isCustomized: boolean;
}

export type ReportSectionSelectionState = "checked" | "unchecked" | "indeterminate";

const WIND_EVENT_PATTERN = /\b(wind|tornado|derecho|microburst|hurricane|cyclone|tropical)\b/i;
const HAIL_EVENT_PATTERN = /\bhail\b/i;
const PRECIPITATION_EVENT_PATTERN = /\b(rain|rainfall|precipitation|flood|flooding|water|snow|ice)\b/i;

function eventTypeMatches(input: ReportCustomizationInput, pattern: RegExp) {
    return Boolean(input.eventType && pattern.test(input.eventType));
}

function eventTypeSupports(input: ReportCustomizationInput, pattern: RegExp) {
    if (!input.eventType?.trim()) return true;
    const hasRecognizedFocus = [WIND_EVENT_PATTERN, HAIL_EVENT_PATTERN, PRECIPITATION_EVENT_PATTERN]
        .some((candidate) => candidate.test(input.eventType ?? ""));
    return !hasRecognizedFocus || pattern.test(input.eventType);
}

function allRecords(data: SearchResponse) {
    return Object.values(data.records).flat();
}

function hasRecordCategory(data: SearchResponse, category: "wind" | "hail") {
    return allRecords(data).some((record) => record.category === category);
}

function hasWindContent(input: ReportCustomizationInput) {
    const { summary } = input.data;
    return summary.maximumObservedWindGustMph !== undefined
        || summary.maximumReportedWindGustMph !== undefined
        || summary.maximumModeledWindGustMph !== undefined
        || hasRecordCategory(input.data, "wind")
        || eventTypeMatches(input, WIND_EVENT_PATTERN);
}

function hasHailContent(input: ReportCustomizationInput) {
    const { summary } = input.data;
    return summary.maximumReportedHailInches !== undefined
        || summary.maximumRadarEstimatedHailInches !== undefined
        || hasRecordCategory(input.data, "hail")
        || eventTypeMatches(input, HAIL_EVENT_PATTERN);
}

function windIsRecommended(input: ReportCustomizationInput) {
    return hasWindContent(input) && eventTypeSupports(input, WIND_EVENT_PATTERN);
}

function hailIsRecommended(input: ReportCustomizationInput) {
    return hasHailContent(input) && eventTypeSupports(input, HAIL_EVENT_PATTERN);
}

function hasPrecipitationContent(input: ReportCustomizationInput) {
    const precipitation = input.data.precipitation;
    return [
        precipitation.eventDayTotalInches,
        precipitation.prior24HoursInches,
        precipitation.prior72HoursInches,
        precipitation.priorSevenDaysInches,
        precipitation.maximumHourlyInches,
        precipitation.maximumThreeHourInches,
    ].some((value) => typeof value === "number" && Number.isFinite(value))
        || Boolean(precipitation.stationId || precipitation.stationName)
        || eventTypeMatches(input, PRECIPITATION_EVENT_PATTERN);
}

function precipitationIsRecommended(input: ReportCustomizationInput) {
    if (!hasPrecipitationContent(input)) return false;
    if (!input.eventType?.trim()) return true;
    return eventTypeMatches(input, PRECIPITATION_EVENT_PATTERN);
}

export function reportContentIdForTimelineClassification(classification: EvidenceClassification): ReportContentId {
    if (classification === "observed") return "timeline.observations";
    if (classification === "reported") return "timeline.otherReports";
    if (classification === "warning") return "timeline.warnings";
    if (classification === "official_event") return "timeline.officialEvents";
    return "timeline.additionalContext";
}

function recordForTimelineEntry(data: SearchResponse, entry: TimelineEntry): EvidenceRecord | undefined {
    return allRecords(data).find((record) => record.id === entry.recordId);
}

export function reportContentIdForTimelineEntry(data: SearchResponse, entry: TimelineEntry): ReportContentId {
    if (entry.classification !== "reported") return reportContentIdForTimelineClassification(entry.classification);
    const category = recordForTimelineEntry(data, entry)?.category;
    if (category === "wind") return "timeline.windReports";
    if (category === "tornado") return "timeline.tornadoReports";
    if (category === "hail") return "timeline.hailReports";
    return "timeline.otherReports";
}

export function timelineEntriesForContent(data: SearchResponse, contentId: ReportContentId): TimelineEntry[] {
    return data.timeline.filter((entry) => reportContentIdForTimelineEntry(data, entry) === contentId);
}

export const REPORT_CONTENT_DEFINITIONS: readonly ReportContentDefinition[] = [
    {
        id: "summary.wind",
        sectionId: "evidenceSummary",
        label: "Wind findings",
        description: "Include observed and nearby reported wind measurements with their classifications.",
        isAvailable: hasWindContent,
        isRecommended: windIsRecommended,
    },
    {
        id: "summary.hail",
        sectionId: "evidenceSummary",
        label: "Hail findings",
        description: "Include available hail measurements, or a meaningful negative finding for a hail-related event.",
        isAvailable: hasHailContent,
        isRecommended: hailIsRecommended,
    },
    {
        id: "summary.precipitation",
        sectionId: "evidenceSummary",
        label: "Precipitation finding",
        description: "Include the event-day precipitation total in the headline findings.",
        isAvailable: hasPrecipitationContent,
        isRecommended: precipitationIsRecommended,
    },
    {
        id: "summary.warnings",
        sectionId: "evidenceSummary",
        label: "Warning finding",
        description: "Include the number of archived warning polygons intersecting the property.",
        isAvailable: ({ data }) => data.summary.warningCount > 0 || data.records.warnings.length > 0,
        isRecommended: ({ data }) => data.summary.warningCount > 0 || data.records.warnings.length > 0,
    },
    {
        id: "summary.stormReports",
        sectionId: "evidenceSummary",
        label: "Nearby storm-report inventory",
        description: "Include the count of nearby Local Storm Reports returned for the event window.",
        isAvailable: ({ data }) => data.summary.localStormReportCount > 0 || data.records.localStormReports.length > 0,
        isRecommended: ({ data }) => data.summary.localStormReportCount > 0 || data.records.localStormReports.length > 0,
    },
    {
        id: "timeline.observations",
        sectionId: "eventTimeline",
        label: "Observed measurements",
        description: "Include timeline entries classified as measurements from identified locations.",
        isAvailable: ({ data }) => timelineEntriesForContent(data, "timeline.observations").length > 0,
        isRecommended: ({ data }) => timelineEntriesForContent(data, "timeline.observations").length > 0,
    },
    {
        id: "timeline.windReports",
        sectionId: "eventTimeline",
        label: "Nearby wind reports",
        description: "Include reported wind events near the property in the timeline.",
        isAvailable: ({ data }) => timelineEntriesForContent(data, "timeline.windReports").length > 0,
        isRecommended: (input) => timelineEntriesForContent(input.data, "timeline.windReports").length > 0 && eventTypeSupports(input, WIND_EVENT_PATTERN),
    },
    {
        id: "timeline.tornadoReports",
        sectionId: "eventTimeline",
        label: "Nearby tornado reports",
        description: "Include reported tornado events near the property in the timeline.",
        isAvailable: ({ data }) => timelineEntriesForContent(data, "timeline.tornadoReports").length > 0,
        isRecommended: (input) => timelineEntriesForContent(input.data, "timeline.tornadoReports").length > 0 && eventTypeSupports(input, /\btornado\b/i),
    },
    {
        id: "timeline.hailReports",
        sectionId: "eventTimeline",
        label: "Nearby hail reports",
        description: "Include reported hail events near the property in the timeline.",
        isAvailable: ({ data }) => timelineEntriesForContent(data, "timeline.hailReports").length > 0,
        isRecommended: (input) => timelineEntriesForContent(input.data, "timeline.hailReports").length > 0 && eventTypeSupports(input, HAIL_EVENT_PATTERN),
    },
    {
        id: "timeline.otherReports",
        sectionId: "eventTimeline",
        label: "Other nearby reports",
        description: "Include other reported events near the property in the timeline.",
        isAvailable: ({ data }) => timelineEntriesForContent(data, "timeline.otherReports").length > 0,
        isRecommended: ({ data }) => timelineEntriesForContent(data, "timeline.otherReports").length > 0,
    },
    {
        id: "timeline.warnings",
        sectionId: "eventTimeline",
        label: "Weather warnings",
        description: "Include archived warning entries that intersect the property point.",
        isAvailable: ({ data }) => timelineEntriesForContent(data, "timeline.warnings").length > 0,
        isRecommended: ({ data }) => timelineEntriesForContent(data, "timeline.warnings").length > 0,
    },
    {
        id: "timeline.officialEvents",
        sectionId: "eventTimeline",
        label: "Official event records",
        description: "Include timeline entries classified as official event records.",
        isAvailable: ({ data }) => timelineEntriesForContent(data, "timeline.officialEvents").length > 0,
        isRecommended: ({ data }) => timelineEntriesForContent(data, "timeline.officialEvents").length > 0,
    },
    {
        id: "timeline.additionalContext",
        sectionId: "eventTimeline",
        label: "Additional weather context",
        description: "Include modeled, radar-estimated, contextual, or inferred timeline entries.",
        isAvailable: ({ data }) => timelineEntriesForContent(data, "timeline.additionalContext").length > 0,
        isRecommended: ({ data }) => timelineEntriesForContent(data, "timeline.additionalContext").length > 0,
    },
    {
        id: "weather.precipitation",
        sectionId: "weatherContext",
        label: "Detailed precipitation context",
        description: "Include event-day and preceding precipitation totals from the identified station.",
        isAvailable: hasPrecipitationContent,
        isRecommended: precipitationIsRecommended,
    },
];

const validContentIds = new Set<ReportContentId>(REPORT_CONTENT_DEFINITIONS.map((content) => content.id));

export function getAvailableReportContent(input: ReportCustomizationInput, sectionId?: ReportSectionId) {
    return REPORT_CONTENT_DEFINITIONS.filter((content) => (!sectionId || content.sectionId === sectionId) && content.isAvailable(input));
}

export function getAvailableReportSections(input: ReportCustomizationInput) {
    return REPORT_SECTION_DEFINITIONS.filter((section) => getAvailableReportContent(input, section.id).length > 0);
}

export function getRecommendedReportContent(input: ReportCustomizationInput): ReportContentId[] {
    return REPORT_CONTENT_DEFINITIONS
        .filter((content) => content.isAvailable(input) && content.isRecommended(input))
        .map((content) => content.id);
}

export function createRecommendedReportPdfConfiguration(input: ReportCustomizationInput): ReportPdfConfiguration {
    return { includedContent: getRecommendedReportContent(input) };
}

export function resolveReportPdfConfiguration(
    input: ReportCustomizationInput,
    configuration?: ReportPdfConfiguration,
): ResolvedReportPdfConfiguration {
    if (!configuration) {
        return {
            // The complete-report path intentionally retains every standard renderer block.
            includedContent: REPORT_CONTENT_DEFINITIONS.map((content) => content.id),
            isCustomized: false,
        };
    }

    const availableIds = new Set(getAvailableReportContent(input).map((content) => content.id));
    const requested = new Set(configuration.includedContent.filter((id) => validContentIds.has(id) && availableIds.has(id)));
    return {
        includedContent: REPORT_CONTENT_DEFINITIONS.filter((content) => requested.has(content.id)).map((content) => content.id),
        isCustomized: true,
    };
}

export function includesReportContent(configuration: ResolvedReportPdfConfiguration, contentId: ReportContentId) {
    return configuration.includedContent.includes(contentId);
}

export function setReportContent(
    input: ReportCustomizationInput,
    configuration: ReportPdfConfiguration,
    contentId: ReportContentId,
    included: boolean,
): ReportPdfConfiguration {
    const definition = REPORT_CONTENT_DEFINITIONS.find((content) => content.id === contentId);
    if (!definition?.isAvailable(input)) return configuration;

    const selected = new Set(configuration.includedContent);
    if (included) selected.add(contentId);
    else selected.delete(contentId);
    return {
        includedContent: REPORT_CONTENT_DEFINITIONS.filter((content) => selected.has(content.id)).map((content) => content.id),
    };
}

export function setReportSectionContent(
    input: ReportCustomizationInput,
    configuration: ReportPdfConfiguration,
    sectionId: ReportSectionId,
    included: boolean,
): ReportPdfConfiguration {
    const sectionContent = getAvailableReportContent(input, sectionId);
    const selected = new Set(configuration.includedContent);
    sectionContent.forEach((content) => {
        if (included) selected.add(content.id);
        else selected.delete(content.id);
    });
    return {
        includedContent: REPORT_CONTENT_DEFINITIONS.filter((content) => selected.has(content.id)).map((content) => content.id),
    };
}

export function getReportSectionSelection(
    input: ReportCustomizationInput,
    configuration: ReportPdfConfiguration,
    sectionId: ReportSectionId,
) {
    const sectionContent = getAvailableReportContent(input, sectionId);
    const selectedCount = sectionContent.filter((content) => configuration.includedContent.includes(content.id)).length;
    const state: ReportSectionSelectionState = selectedCount === 0
        ? "unchecked"
        : selectedCount === sectionContent.length
            ? "checked"
            : "indeterminate";
    return { state, selectedCount, totalCount: sectionContent.length };
}

export function customizedReportDisclosure(reportId: string) {
    return `Customized report containing selected sections from ClaimDefender report ${reportId}.`;
}
