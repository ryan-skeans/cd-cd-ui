import { format } from "date-fns";
import { NOAAData, SearchResponse } from "@/lib/types";

export function formatMeasurement(
    value: number | undefined,
    unit: string,
    digits = 2,
) {
    return typeof value === "number" && Number.isFinite(value)
        ? `${value.toFixed(digits)} ${unit}`
        : "Not available";
}

export function displayWind(noaa: NOAAData) {
    return formatMeasurement(noaa.maxWindGustMph, "mph");
}

export function displayHail(noaa: NOAAData) {
    return formatMeasurement(noaa.maxHailSizeInches, "in");
}

export function isAvailableDate(value?: string) {
    if (!value || value === "Unknown" || value.includes("Not available")) return false;
    return !Number.isNaN(new Date(value).getTime());
}

export function readableEvidenceDate(value?: string) {
    return isAvailableDate(value)
        ? format(new Date(value as string), "MMM d, yyyy 'at' h:mm a")
        : "Not available";
}

export function hasImagery(data: SearchResponse) {
    return Boolean(
        data.satellite?.beforeThumbnailUrl &&
        data.satellite?.afterThumbnailUrl &&
        isAvailableDate(data.satellite.beforeDate) &&
        isAvailableDate(data.satellite.afterDate),
    );
}

export function buildEvidenceSummary(data: SearchResponse) {
    const observations = [
        `The evidence search returned a peak wind observation of ${displayWind(data.noaa)}`,
        `reported hail of ${displayHail(data.noaa)}`,
        `and precipitation of ${formatMeasurement(data.noaa.totalPrecipitationInches, "in")}.`,
    ];
    const alertContext = data.noaa.hasSevereAlerts
        ? "NWS alert context is available for review."
        : "No NWS severe alerts were found in the searched records.";
    const imageryContext = hasImagery(data)
        ? "Archived imagery captures were located before and after the selected event date."
        : "A complete before-and-after imagery pair was not available.";

    return `${observations.join(" ")} ${alertContext} ${imageryContext}`;
}
