"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    CalendarDays,
    Check,
    ChevronDown,
    ChevronUp,
    Clock3,
    CloudRain,
    Copy,
    Database,
    FileText,
    ImageOff,
    Lock,
    MapPin,
    Radar,
    Satellite,
    ShieldAlert,
    Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EvidenceStateNotice } from "@/components/evidence-state-notice";
import {
    buildEvidenceSummary,
    chronologicalTimelinePreview,
    classificationLabels,
    DEFAULT_TIMELINE_PREVIEW_LIMIT,
    evidenceRecordById,
    evidenceSourceLabel,
    evidenceHeadline,
    formatMagnitude,
    formatMeasurement,
    readableEvidenceDate,
    recordProximity,
} from "@/lib/evidence";
import { EvidenceClassification, SearchResponse } from "@/lib/types";

interface ResultsDashboardProps {
    data: SearchResponse;
    latitude: number;
    longitude: number;
    date: Date;
    address?: string;
    onUnlock?: () => void;
}

const badgeStyles: Record<EvidenceClassification, string> = {
    observed: "border-emerald-700/20 bg-emerald-50 text-emerald-900",
    reported: "border-sky-700/20 bg-sky-50 text-sky-900",
    official_event: "border-indigo-700/20 bg-indigo-50 text-indigo-900",
    warning: "border-amber-700/25 bg-amber-50 text-amber-950",
    modeled: "border-violet-700/20 bg-violet-50 text-violet-900",
    radar_estimated: "border-fuchsia-700/20 bg-fuchsia-50 text-fuchsia-900",
    contextual: "border-zinc-500/20 bg-zinc-50 text-zinc-700",
    inferred: "border-zinc-500/20 bg-zinc-50 text-zinc-700",
};

export function ClassificationBadge({ classification }: { classification: EvidenceClassification }) {
    return (
        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.11em] ${badgeStyles[classification]}`}>
            {classificationLabels[classification]}
        </span>
    );
}

function sourceStatus(status: string) {
    if (status === "complete") return "Records returned";
    if (status === "empty") return "No records found";
    if (status === "partial") return "Partial";
    if (status === "failed") return "Unavailable";
    return "Not included";
}

export default function ResultsDashboard({
    data,
    latitude,
    longitude,
    date,
    address,
    onUnlock,
}: ResultsDashboardProps) {
    const [copied, setCopied] = useState(false);
    const [timelineExpanded, setTimelineExpanded] = useState(false);
    const summary = buildEvidenceSummary(data);
    const property = address || [data.property.city, data.property.state].filter(Boolean).join(", ") || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    const maxObservedGust = evidenceRecordById(data, data.summary.maximumObservedWindGustRecordId);
    const maxReportedGust = evidenceRecordById(data, data.summary.maximumReportedWindGustRecordId);
    const maxReportedHail = evidenceRecordById(data, data.summary.maximumReportedHailRecordId);
    const localReportIds = new Set(data.records.localStormReports.map((record) => record.id));
    const closestRecoveredObservation = [...data.records.localStormReports]
        .filter((record) => record.classification === "observed" && record.category === "wind" && record.magnitude)
        .sort((left, right) => (
            (left.location?.distanceMilesFromProperty ?? Infinity)
            - (right.location?.distanceMilesFromProperty ?? Infinity)
        ))[0];
    const featuredStormRecords = [
        maxObservedGust && localReportIds.has(maxObservedGust.id) ? maxObservedGust : undefined,
        closestRecoveredObservation,
        maxReportedGust,
        maxReportedHail,
        ...data.records.localStormReports,
    ].filter((record, index, records): record is NonNullable<typeof record> => (
        Boolean(record) && records.findIndex((candidate) => candidate?.id === record?.id) === index
    )).slice(0, 8);
    const collapsedTimeline = chronologicalTimelinePreview(data.timeline);
    const canExpandTimeline = data.timeline.length > collapsedTimeline.length;
    const visibleTimeline = timelineExpanded
        ? data.timeline
        : collapsedTimeline;

    useEffect(() => {
        setTimelineExpanded(false);
    }, [data.generatedAt]);

    const copySummary = async () => {
        try {
            await navigator.clipboard.writeText(summary);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = summary;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.remove();
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    const summaryCards = [
        {
            label: "Event-day observed gust",
            value: formatMagnitude(maxObservedGust),
            detail: maxObservedGust
                ? `${evidenceSourceLabel(maxObservedGust)} · ${recordProximity(maxObservedGust) ?? "Distance unavailable"} · ${readableEvidenceDate(maxObservedGust.startTime, data.property.timeZone)}`
                : "No event-day observed gust was returned",
            classification: "observed" as const,
            icon: Wind,
        },
        {
            label: "Maximum reported gust",
            value: formatMagnitude(maxReportedGust),
            detail: maxReportedGust
                ? `${evidenceSourceLabel(maxReportedGust)} · ${recordProximity(maxReportedGust) ?? "Distance unavailable"} · ${readableEvidenceDate(maxReportedGust.startTime, data.property.timeZone)}`
                : "No nearby wind report was returned",
            classification: "reported" as const,
            icon: Wind,
        },
        {
            label: "Maximum reported hail",
            value: formatMagnitude(maxReportedHail),
            detail: maxReportedHail
                ? `${evidenceSourceLabel(maxReportedHail)} · ${recordProximity(maxReportedHail) ?? "Distance unavailable"} · ${readableEvidenceDate(maxReportedHail.startTime, data.property.timeZone)}`
                : "No nearby hail report was returned",
            classification: "reported" as const,
            icon: Radar,
        },
        {
            label: "LSR archive records",
            value: String(data.summary.localStormReportCount),
            detail: "Observed automated measurements and reported events inside the analysis window",
            classification: undefined,
            icon: Database,
        },
        {
            label: "Warnings intersecting property",
            value: String(data.summary.warningCount),
            detail: data.summary.warningCount > 0 ? "Archived storm-based warning polygons" : "No intersecting warning polygon returned",
            classification: "warning" as const,
            icon: ShieldAlert,
        },
        {
            label: "Event-day precipitation",
            value: formatMeasurement(data.precipitation.eventDayTotalInches, "in"),
            detail: data.precipitation.stationName
                ? `${data.precipitation.stationName} · ${data.precipitation.distanceMilesFromProperty?.toFixed(1)} miles away`
                : "No suitable station total was returned",
            classification: "observed" as const,
            icon: CloudRain,
        },
    ];

    return (
        <section className="mx-auto w-full max-w-4xl space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <header className="rounded-3xl border border-brand-gray/60 bg-white p-6 shadow-[0_18px_45px_-35px_rgba(51,54,41,0.45)] sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-lime/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.13em] text-brand-olive">
                            <Database className="h-3.5 w-3.5" /> Sourced evidence package
                        </div>
                        <h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-brand-olive sm:text-3xl">
                            {evidenceHeadline(data)}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-olive/60">
                            Observations, reports, and warning records are kept separate so each fact can be evaluated on its own terms.
                        </p>
                    </div>
                    <div className="shrink-0 rounded-xl border border-brand-gray/70 bg-brand-offWhite px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-olive/45">Schema</p>
                        <p className="mt-1 text-sm font-semibold text-brand-olive">Evidence model v{data.schemaVersion}</p>
                    </div>
                </div>
                <div className="mt-6 grid gap-3 border-t border-brand-gray/70 pt-5 sm:grid-cols-2">
                    <div className="flex items-start gap-2.5 text-sm text-brand-olive/70">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                        <div><p className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/45">Property</p><p className="mt-0.5 font-medium text-brand-olive">{property}</p></div>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-brand-olive/70">
                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
                        <div><p className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/45">Loss date and timezone</p><p className="mt-0.5 font-medium text-brand-olive">{format(date, "MMMM d, yyyy")} · {data.property.timeZone}</p></div>
                    </div>
                </div>
            </header>

            <EvidenceStateNotice data={data} />

            <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none">
                <CardContent className="p-5 sm:p-6">
                    <div className="mb-5"><h3 className="font-semibold">Evidence summary</h3><p className="mt-1 text-xs text-brand-olive/55">Each value retains its evidence classification, source location, and time.</p></div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {summaryCards.map(({ icon: Icon, label, value, detail, classification }) => (
                            <div key={label} className="rounded-xl border border-brand-gray/70 bg-brand-offWhite/70 p-4">
                                <div className="flex items-center justify-between gap-3"><Icon className="h-4 w-4" />{classification && <ClassificationBadge classification={classification} />}</div>
                                <p className="mt-5 text-xs text-brand-olive/55">{label}</p>
                                <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
                                <p className="mt-2 text-[11px] leading-relaxed text-brand-olive/50">{detail}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none">
                <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div><h3 className="font-semibold">Sourced event timeline</h3><p className="mt-1 text-xs text-brand-olive/55">Chronological records only; the first {DEFAULT_TIMELINE_PREVIEW_LIMIT} are shown by default.</p></div>
                        <span className="rounded-full border border-brand-gray px-2.5 py-1 text-[10px] font-semibold text-brand-olive/55">Showing {visibleTimeline.length} of {data.timeline.length}</span>
                    </div>
                    {data.timeline.length > 0 ? (
                        <>
                            <ol id="sourced-event-timeline" className="mt-5 border-l border-brand-gray/80 pl-5">
                                {visibleTimeline.map((entry) => (
                                    <li key={entry.id} className="relative pb-5 last:pb-0">
                                        <span className="absolute -left-[24.5px] top-1.5 h-2 w-2 rounded-full bg-brand-olive ring-4 ring-white" />
                                        <div className="flex flex-wrap items-center gap-2"><ClassificationBadge classification={entry.classification} /><time className="text-[10px] text-brand-olive/45">{readableEvidenceDate(entry.timestamp, data.property.timeZone)}</time></div>
                                        <p className="mt-2 text-sm font-semibold">{entry.title}</p>
                                        <p className="mt-1 text-xs leading-relaxed text-brand-olive/60">{entry.explanation}</p>
                                        <p className="mt-1 text-[10px] text-brand-olive/45">{entry.source}{typeof entry.distanceMilesFromProperty === "number" ? ` · ${entry.distanceMilesFromProperty.toFixed(1)} miles from property` : ""}</p>
                                    </li>
                                ))}
                            </ol>
                            {canExpandTimeline && (
                                <div className="mt-5 flex flex-col items-center gap-2 border-t border-brand-gray/70 pt-4">
                                    <p className="text-[10px] text-brand-olive/45" aria-live="polite">Showing {visibleTimeline.length} of {data.timeline.length} chronological events</p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        aria-controls="sourced-event-timeline"
                                        aria-expanded={timelineExpanded}
                                        onClick={() => setTimelineExpanded((expanded) => !expanded)}
                                        className="border-brand-gray bg-white text-brand-olive"
                                    >
                                        {timelineExpanded ? <ChevronUp className="mr-2 h-3.5 w-3.5" aria-hidden="true" /> : <ChevronDown className="mr-2 h-3.5 w-3.5" aria-hidden="true" />}
                                        {timelineExpanded ? "Show fewer events" : `Show all ${data.timeline.length} events`}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : <p className="mt-5 rounded-xl bg-brand-offWhite p-4 text-sm text-brand-olive/60">No timeline records were returned by the available sources for this window.</p>}
                </CardContent>
            </Card>

            <div className="grid gap-5 lg:grid-cols-2">
                <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none">
                    <CardContent className="p-5 sm:p-6">
                        <h3 className="font-semibold">Nearby storm records</h3>
                        <p className="mt-1 text-xs text-brand-olive/55">NWS Local Storm Reports within 25 miles. Recovered automated measurements remain classified as observed.</p>
                        <div className="mt-4 space-y-3">
                            {featuredStormRecords.length > 0 ? featuredStormRecords.map((record) => (
                                <article key={record.id} className="rounded-xl border border-brand-gray/70 p-3">
                                    <div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold">{record.eventType}{record.magnitude ? ` · ${formatMagnitude(record)}` : ""}</p><ClassificationBadge classification={record.classification} /></div>
                                    <p className="mt-1 text-[11px] text-brand-olive/50">{readableEvidenceDate(record.startTime, data.property.timeZone)} · {recordProximity(record) ?? "Distance unavailable"}</p>
                                    {record.description && <p className="mt-2 text-xs leading-relaxed text-brand-olive/65">{record.description}</p>}
                                    <p className="mt-2 text-[10px] text-brand-olive/45">{record.source.office ? `WFO ${record.source.office} · ` : ""}{record.source.productId ?? record.source.recordId}</p>
                                </article>
                            )) : <p className="rounded-xl bg-brand-offWhite p-3 text-sm text-brand-olive/55">No nearby reports returned.</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none">
                    <CardContent className="p-5 sm:p-6">
                        <h3 className="font-semibold">Observed measurement context</h3>
                        <p className="mt-1 text-xs text-brand-olive/55">Wind and precipitation may come from different stations or official access paths.</p>
                        {maxObservedGust || data.precipitation.stationName ? (
                            <div className="mt-4 space-y-3">
                                {maxObservedGust && <div className="rounded-xl border border-brand-gray/70 p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold">Event-day gust · {formatMagnitude(maxObservedGust)}</p><ClassificationBadge classification="observed" /></div><p className="mt-1 text-[11px] text-brand-olive/50">{evidenceSourceLabel(maxObservedGust)} · {recordProximity(maxObservedGust) ?? "Distance unavailable"}</p></div>}
                                {data.precipitation.stationName && <div className="rounded-xl border border-brand-gray/70 p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold">Precipitation · {data.precipitation.stationName}</p><ClassificationBadge classification="observed" /></div><p className="mt-1 text-[11px] text-brand-olive/50">{data.precipitation.stationId} · {data.precipitation.distanceMilesFromProperty?.toFixed(1)} miles from property</p></div>}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {[
                                        ["Prior 24 hours", data.precipitation.prior24HoursInches],
                                        ["Prior 72 hours", data.precipitation.prior72HoursInches],
                                        ["Prior seven days", data.precipitation.priorSevenDaysInches],
                                        ["Max three hours", data.precipitation.maximumThreeHourInches],
                                    ].map(([label, value]) => <div key={String(label)} className="rounded-lg bg-brand-offWhite p-3"><p className="text-brand-olive/50">{label}</p><p className="mt-1 font-semibold">{formatMeasurement(value as number | undefined, "in")}</p></div>)}
                                </div>
                                <p className="text-[10px] leading-relaxed text-brand-olive/45">{data.precipitation.wetHourCount ?? 0} wet hours · {data.precipitation.missingHourCount} returned rows lacked precipitation values.</p>
                            </div>
                        ) : <p className="mt-4 rounded-xl bg-brand-offWhite p-3 text-sm text-brand-olive/55">Nearby station observations were not available.</p>}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none">
                <CardContent className="p-5 sm:p-6">
                    <h3 className="font-semibold">Warnings and finalized records</h3>
                    <p className="mt-1 text-xs text-brand-olive/55">Warnings describe an area at risk. Finalized Storm Events require NOAA bulk-data ingestion and are shown separately.</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                            {data.records.warnings.length > 0 ? data.records.warnings.map((warning) => (
                                <div key={warning.id} className="rounded-xl border border-brand-gray/70 p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold">{warning.eventType}</p><ClassificationBadge classification="warning" /></div><p className="mt-1 text-[11px] text-brand-olive/50">{readableEvidenceDate(warning.startTime, data.property.timeZone)} · WFO {warning.source.office}</p><p className="mt-2 text-xs text-brand-olive/65">Property inside archived warning geometry. Product {warning.source.productId}.</p></div>
                            )) : <p className="rounded-xl bg-brand-offWhite p-3 text-sm text-brand-olive/55">No intersecting warning polygons returned.</p>}
                        </div>
                        <div className="rounded-xl border border-dashed border-brand-gray p-4"><ClassificationBadge classification="official_event" /><p className="mt-3 text-sm font-semibold">NOAA finalized Storm Events</p><p className="mt-2 text-xs leading-relaxed text-brand-olive/55">Not yet included in synchronous results. The official annual CSV files need scheduled, versioned ingestion before they can be queried safely.</p></div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none">
                <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">Modeled and radar-estimated conditions</h3><p className="mt-1 text-xs text-brand-olive/55">No estimate is substituted for a direct observation.</p></div><Radar className="h-4 w-4 text-brand-olive/50" /></div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-brand-offWhite p-4"><ClassificationBadge classification="modeled" /><p className="mt-3 text-sm font-semibold">No modeled values included</p><p className="mt-1 text-xs text-brand-olive/55">Open-Meteo was removed because its free endpoint does not permit commercial use.</p></div>
                        <div className="rounded-xl bg-brand-offWhite p-4"><ClassificationBadge classification="radar_estimated" /><p className="mt-3 text-sm font-semibold">No radar estimate included</p><p className="mt-1 text-xs text-brand-olive/55">NEXRAD/MRMS processing is deferred until a validated offline geospatial pipeline is available.</p></div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none">
                <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3"><div><h3 className="flex items-center gap-2 font-semibold"><Satellite className="h-4 w-4" /> Contextual imagery availability</h3><p className="mt-1 text-xs text-brand-olive/55">Sentinel-2 catalog records; not analyzed for damage.</p></div><ClassificationBadge classification="contextual" /></div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                        {[
                            { label: "Before event", item: data.imagery.before },
                            { label: "After event", item: data.imagery.after },
                        ].map(({ label, item }) => {
                            return <figure key={String(label)} className="overflow-hidden rounded-lg border border-brand-gray/70"><div className="grid aspect-[4/3] place-items-center bg-brand-offWhite">{item?.thumbnailUrl ? <img src={item.thumbnailUrl} alt={`${label} Sentinel-2 preview`} className="h-full w-full object-cover" /> : <ImageOff className="h-6 w-6 text-brand-olive/25" />}</div><figcaption className="p-3 text-[10px] text-brand-olive/55"><span className="font-semibold text-brand-olive">{label}</span><br />{readableEvidenceDate(item?.capturedAt, data.property.timeZone)}</figcaption></figure>;
                        })}
                    </div>
                    <p className="mt-3 text-[10px] leading-relaxed text-brand-olive/45">Sentinel-2&apos;s approximately 10 m best optical resolution cannot establish roof-level damage.</p>
                </CardContent>
            </Card>

            <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none">
                <CardContent className="p-5 sm:p-6">
                    <h3 className="font-semibold">Sources, methodology, and limitations</h3>
                    <div className="mt-4 divide-y divide-brand-gray/70 border-y border-brand-gray/70">
                        {data.sources.map((source) => (
                            <div key={source.id} className="grid gap-1 py-4 text-sm sm:grid-cols-[1fr_.75fr_1.6fr] sm:gap-4">
                                <div><p className="font-semibold">{source.provider}</p><a href={source.sourceUrl} target="_blank" rel="noreferrer" className="text-[10px] text-brand-olive/45 underline underline-offset-2">{source.dataset}</a></div>
                                <p className="text-xs font-semibold text-brand-olive/70">{sourceStatus(source.status)} · {source.recordCount}</p>
                                <div><p className="text-xs leading-relaxed text-brand-olive/55">{source.message ?? source.limitations[0]}</p>{source.status === "complete" && source.limitations[0] && <p className="mt-1 text-[10px] text-brand-olive/40">{source.limitations[0]}</p>}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-brand-gray/60 bg-brand-olive text-white shadow-none">
                <CardContent className="p-0">
                    <div className="grid md:grid-cols-[1.35fr_.65fr]">
                        <div className="p-6 sm:p-7"><div className="flex items-center gap-2 text-brand-lime"><Lock className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-[0.14em]">Professional package preview</span></div><h3 className="mt-4 text-xl font-semibold">Organize the complete evidence trail.</h3><p className="mt-2 text-sm leading-relaxed text-white/60">The package adds report-ready formatting, a source appendix, record identifiers, timeline, methodology, and limitations.</p><Button onClick={onUnlock} className="mt-5 bg-brand-lime font-bold text-brand-olive hover:bg-brand-limeLight"><FileText className="mr-2 h-4 w-4" /> Preview evidence package</Button></div>
                        <div className="border-t border-white/10 bg-white/5 p-6 md:border-l md:border-t-0"><p className="text-[10px] font-bold uppercase tracking-wider text-white/45">Included</p><ul className="mt-4 space-y-3 text-xs text-white/70">{["Chronological evidence timeline", "Detailed source appendix", "Professional PDF formatting", "Methodology and limitations"].map((item) => <li key={item} className="flex gap-2"><Check className="h-3.5 w-3.5 shrink-0 text-brand-lime" />{item}</li>)}</ul></div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-brand-gray/60 bg-brand-offWhite text-brand-olive shadow-none">
                <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold">Evidence summary</h3><p className="mt-3 text-sm leading-relaxed text-brand-olive/70">{summary}</p></div><Button variant="outline" size="sm" onClick={copySummary} className="shrink-0 border-brand-gray bg-white text-brand-olive"><Copy className="mr-2 h-3.5 w-3.5" />{copied ? "Copied" : "Copy"}</Button></div>
                    <p className="mt-4 flex items-start gap-2 border-t border-brand-gray/60 pt-4 text-[11px] leading-relaxed text-brand-olive/50"><Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />Package generated {readableEvidenceDate(data.generatedAt, data.property.timeZone)}. Retrieval timing and source limitations are retained in the report.</p>
                </CardContent>
            </Card>
        </section>
    );
}
