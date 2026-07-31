export interface SearchPayload {
    longitude: number;
    latitude: number;
    estimatedDateOfDamage: string; // ISO 8601
}

export interface NOAAData {
    maxWindGustMph?: number;
    maxHailSizeInches?: number;
    totalPrecipitationInches?: number;
    hasSevereAlerts: boolean;
    tornadoReported: boolean;
}

export interface SatelliteData {
    beforeDate?: string;
    afterDate?: string;
    beforeThumbnailUrl?: string;
    afterThumbnailUrl?: string;
}

export interface SearchResponse {
    noaa: NOAAData;
    satellite: SatelliteData;
}
