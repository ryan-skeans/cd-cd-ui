export type EvidenceClassification =
    | "observed"
    | "reported"
    | "official_event"
    | "warning"
    | "radar_estimated"
    | "modeled"
    | "contextual"
    | "inferred";

export type ProviderStatus = "complete" | "partial" | "empty" | "failed" | "unavailable";

export interface SearchPayload {
    longitude: number;
    latitude: number;
    estimatedDateOfDamage: string;
}

export interface EvidenceMagnitude {
    value: number;
    unit: string;
    qualifier?: "measured" | "estimated" | "unknown";
}

export interface EvidenceRecord {
    id: string;
    category: "wind" | "hail" | "precipitation" | "tornado" | "warning" | "storm_event" | "imagery" | "tropical" | "disaster";
    eventType: string;
    classification: EvidenceClassification;
    startTime: string;
    endTime?: string;
    magnitude?: EvidenceMagnitude;
    description?: string;
    location?: {
        latitude?: number;
        longitude?: number;
        distanceMilesFromProperty?: number;
        directionFromProperty?: string;
        propertyInsideGeometry?: boolean;
    };
    attributes?: Record<string, string | number | boolean | null>;
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

export interface TimelineEntry {
    id: string;
    recordId: string;
    timestamp: string;
    endTime?: string;
    title: string;
    explanation: string;
    classification: EvidenceClassification;
    source: string;
    distanceMilesFromProperty?: number;
    magnitude?: EvidenceMagnitude;
    limitation?: string;
}

export interface SourceResult {
    id: string;
    provider: string;
    dataset: string;
    status: ProviderStatus;
    recordCount: number;
    retrievedAt: string;
    sourceUrl: string;
    message?: string;
    limitations: string[];
}

export interface ImageryCapture {
    itemId: string;
    capturedAt: string;
    thumbnailUrl?: string;
    cloudCoverPercent?: number;
    sourceUrl?: string;
}

export interface SearchResponse {
    schemaVersion: "2.1";
    generatedAt: string;
    property: {
        latitude: number;
        longitude: number;
        timeZone: string;
        city?: string;
        state?: string;
        countyCode?: string;
    };
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
        imagery: EvidenceRecord[];
    };
    precipitation: {
        stationId?: string;
        stationName?: string;
        distanceMilesFromProperty?: number;
        eventDayTotalInches?: number;
        prior24HoursInches?: number;
        prior72HoursInches?: number;
        priorSevenDaysInches?: number;
        maximumHourlyInches?: number;
        maximumThreeHourInches?: number;
        wetHourCount?: number;
        missingHourCount: number;
    };
    imagery: { before?: ImageryCapture; after?: ImageryCapture };
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
