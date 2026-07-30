export interface SearchPayload {
    longitude: number;
    latitude: number;
    estimatedDateOfDamage: string; // ISO 8601
}

export interface NOAAData {
    maxWindGustMph: number;
    maxHailSizeInches: number;
    totalPrecipitationInches: number;
    hasSevereAlerts: boolean;
    tornadoReported: boolean;
    obfuscatedWind: string;
    obfuscatedHail: string;
}

export interface SatelliteData {
    beforeDate: string;
    afterDate: string;
    beforeThumbnailUrl: string;
    afterThumbnailUrl: string;
}

export interface SearchResponse {
    viabilityScore: number;
    evidenceTemplate: string;
    noaa: NOAAData;
    satellite: SatelliteData;
}
