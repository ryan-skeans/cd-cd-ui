export type SearchParamValue = string | string[] | undefined;

function first(value: SearchParamValue) {
    return Array.isArray(value) ? value[0] : value;
}

export function legacyHomeownerQuery(searchParams: Record<string, SearchParamValue>) {
    const lat = first(searchParams.lat);
    const lng = first(searchParams.lng);
    const date = first(searchParams.date);
    if (!lat || !lng || !date) return null;
    const latitude = Number(lat);
    const longitude = Number(lng);
    const parsedDate = new Date(date);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return null;
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return null;
    if (Number.isNaN(parsedDate.getTime())) return null;
    const query = new URLSearchParams({ lat, lng, date });
    return `/homeowners?${query.toString()}`;
}
