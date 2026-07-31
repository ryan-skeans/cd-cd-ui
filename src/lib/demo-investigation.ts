export const FEATURED_DEMO_INVESTIGATION = {
    address: "101 1st Street Southwest, Cedar Rapids, Iowa 52405, United States",
    shortLocation: "Cedar Rapids, Iowa",
    dateLabel: "August 10, 2020",
    latitude: 41.976339,
    longitude: -91.673068,
    estimatedDateOfDamage: "2020-08-10T07:00:00.000Z",
} as const;

export function featuredDemoDisplayDate() {
    return new Date(2020, 7, 10, 12);
}
