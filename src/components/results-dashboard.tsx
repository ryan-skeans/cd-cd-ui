"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    CalendarDays,
    ChevronDown,
    ChevronUp,
    CloudRain,
    Database,
    ImageOff,
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
    evidenceHeadline,
    evidenceRecordById,
    evidenceSourceLabel,
    formatMagnitude,
    formatMeasurement,
    readableEvidenceDate,
    recordProximity,
} from "@/lib/evidence";
import { EvidenceClassification, EvidenceRecord, SearchResponse } from "@/lib/types";

export interface EvidenceViewProps {
    data: SearchResponse;
    audience?: "homeowner" | "professional";
}

interface ResultsDashboardProps extends EvidenceViewProps {
    latitude: number;
    longitude: number;
    date: Date;
    address?: string;
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

const homeownerLabels: Record<EvidenceClassification, string> = {
    observed: "Measured nearby",
    reported: "Reported nearby",
    official_event: "Official record",
    warning: "Official warning",
    modeled: "Modeled context",
    radar_estimated: "Radar estimate",
    contextual: "Contextual record",
    inferred: "Contextual record",
};

export function ClassificationBadge({ classification, audience = "professional" }: { classification: EvidenceClassification; audience?: "homeowner" | "professional" }) {
    return <span className={`inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-center text-[9px] font-bold uppercase leading-[1.35] tracking-[.09em] ${badgeStyles[classification]}`}>{audience === "homeowner" ? homeownerLabels[classification] : classificationLabels[classification]}</span>;
}

function sourceStatus(status: string) {
    if (status === "complete") return "Records returned";
    if (status === "empty") return "No records found";
    if (status === "partial") return "Partial";
    if (status === "failed") return "Unavailable";
    return "Not included";
}

function evidenceCards(data: SearchResponse) {
    const observed = evidenceRecordById(data, data.summary.maximumObservedWindGustRecordId);
    const hail = evidenceRecordById(data, data.summary.maximumReportedHailRecordId);
    return [
        {
            label: "Observed wind gust",
            value: formatMagnitude(observed),
            detail: observed ? `${evidenceSourceLabel(observed)} · ${recordProximity(observed) ?? "Distance unavailable"} · ${readableEvidenceDate(observed.startTime, data.property.timeZone)}` : "No event-day observed gust was returned",
            classification: "observed" as const,
            icon: Wind,
        },
        {
            label: "Nearest reported hail",
            value: formatMagnitude(hail),
            detail: hail ? `${evidenceSourceLabel(hail)} · ${recordProximity(hail) ?? "Distance unavailable"} · ${readableEvidenceDate(hail.startTime, data.property.timeZone)}` : "No nearby hail report was returned",
            classification: "reported" as const,
            icon: Radar,
        },
        {
            label: "Warning coverage",
            value: String(data.summary.warningCount),
            detail: data.summary.warningCount ? "Archived NWS warning polygon intersecting the property point" : "No intersecting archived warning polygon was returned",
            classification: "warning" as const,
            icon: ShieldAlert,
        },
        {
            label: "Event-day precipitation",
            value: formatMeasurement(data.precipitation.eventDayTotalInches, "in"),
            detail: data.precipitation.stationName ? `${data.precipitation.stationName} · ${data.precipitation.distanceMilesFromProperty?.toFixed(1) ?? "Unknown"} miles away` : "No suitable station total was returned",
            classification: "observed" as const,
            icon: CloudRain,
        },
        {
            label: "Nearby storm reports",
            value: String(data.summary.localStormReportCount),
            detail: "NWS Local Storm Reports archive inside the analysis radius and window",
            classification: "reported" as const,
            icon: Database,
        },
    ];
}

export function EvidenceSummary({ data, audience = "homeowner" }: EvidenceViewProps) {
    return <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none"><CardContent className="p-5 sm:p-6"><div className="mb-5"><h3 className="font-semibold">Key findings</h3><p className="mt-1 text-xs text-brand-olive/55">Each value retains its classification, source context, distance, and time when available.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{evidenceCards(data).map(({ icon: Icon, label, value, detail, classification }) => <article key={label} className="rounded-xl border border-brand-gray/70 bg-brand-offWhite/70 p-4"><div className="flex items-center justify-between gap-3"><Icon className="h-4 w-4" /><ClassificationBadge classification={classification} audience={audience} /></div><p className="mt-5 text-xs text-brand-olive/55">{label}</p><p className="mt-1 text-xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-[11px] leading-relaxed text-brand-olive/50">{detail}</p></article>)}</div><p className="mt-5 border-t border-brand-gray/70 pt-5 text-sm leading-relaxed text-brand-olive/65">{buildEvidenceSummary(data)}</p></CardContent></Card>;
}

export function EvidenceTimeline({ data, audience = "homeowner", initiallyExpanded = false }: EvidenceViewProps & { initiallyExpanded?: boolean }) {
    const [expanded, setExpanded] = useState(initiallyExpanded);
    useEffect(() => setExpanded(initiallyExpanded), [data.generatedAt, initiallyExpanded]);
    const preview = chronologicalTimelinePreview(data.timeline);
    const visible = expanded ? data.timeline : preview;
    return <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none"><CardContent className="p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">Event timeline</h3><p className="mt-1 text-xs text-brand-olive/55">What happened, when it was recorded, where it was relative to the property, and by which source.</p></div><span className="rounded-full border border-brand-gray px-2.5 py-1 text-[10px] font-semibold text-brand-olive/55">{visible.length} of {data.timeline.length}</span></div>{data.timeline.length ? <><ol id="evidence-timeline" className="mt-5 border-l border-brand-gray/80 pl-5">{visible.map((entry) => <li key={entry.id} className="relative pb-5 last:pb-0"><span className="absolute -left-[24.5px] top-1.5 h-2 w-2 rounded-full bg-brand-olive ring-4 ring-white" /><div className="flex flex-wrap items-center gap-2"><ClassificationBadge classification={entry.classification} audience={audience} /><time className="text-[10px] text-brand-olive/45">{readableEvidenceDate(entry.timestamp, data.property.timeZone)}</time></div><p className="mt-2 text-sm font-semibold">{entry.title}</p><p className="mt-1 text-xs leading-relaxed text-brand-olive/60">{entry.explanation}</p><p className="mt-1 text-[10px] text-brand-olive/45">{entry.source}{typeof entry.distanceMilesFromProperty === "number" ? ` · ${entry.distanceMilesFromProperty.toFixed(1)} miles from property` : ""}</p></li>)}</ol>{data.timeline.length > preview.length && <div className="mt-5 flex justify-center border-t border-brand-gray/70 pt-4"><Button type="button" variant="outline" size="sm" aria-controls="evidence-timeline" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)} className="border-brand-gray bg-white text-brand-olive">{expanded ? <ChevronUp className="mr-2 h-3.5 w-3.5" /> : <ChevronDown className="mr-2 h-3.5 w-3.5" />}{expanded ? "Show concise timeline" : "Show Full Timeline"}</Button></div>}</> : <p className="mt-5 rounded-xl bg-brand-offWhite p-4 text-sm text-brand-olive/60">No timeline records were returned by the available sources for this window.</p>}</CardContent></Card>;
}

function RecordList({ records, data, audience }: { records: EvidenceRecord[]; data: SearchResponse; audience: "homeowner" | "professional" }) {
    if (!records.length) return <p className="rounded-xl bg-brand-offWhite p-3 text-sm text-brand-olive/55">No records were returned for this category.</p>;
    return <div className="space-y-3">{records.slice(0, audience === "homeowner" ? 8 : 20).map((record) => <article key={record.id} className="rounded-xl border border-brand-gray/70 p-3"><div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold">{record.eventType}{record.magnitude ? ` · ${formatMagnitude(record)}` : ""}</p><ClassificationBadge classification={record.classification} audience={audience} /></div><p className="mt-1 text-[11px] text-brand-olive/50">{readableEvidenceDate(record.startTime, data.property.timeZone)}{recordProximity(record) ? ` · ${recordProximity(record)}` : ""}</p>{record.description && <p className="mt-2 text-xs leading-relaxed text-brand-olive/65">{record.description}</p>}<p className="mt-2 text-[10px] text-brand-olive/45">{evidenceSourceLabel(record)}</p></article>)}</div>;
}

function SupportingSection({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
    return <details open={open} className="group rounded-2xl border border-brand-gray/70 bg-white"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold text-brand-olive [&::-webkit-details-marker]:hidden">{title}<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" /></summary><div className="border-t border-brand-gray/70 p-5">{children}</div></details>;
}

export function SupportingEvidence({ data, audience = "homeowner" }: EvidenceViewProps) {
    return <section aria-labelledby="supporting-evidence-heading"><div className="mb-4"><h3 id="supporting-evidence-heading" className="font-semibold text-brand-olive">Supporting evidence</h3><p className="mt-1 text-xs text-brand-olive/55">Open a category to review its detailed records.</p></div><div className="space-y-3"><SupportingSection title={`Weather-station observations (${data.records.stationObservations.length})`} open={audience === "professional"}><RecordList records={data.records.stationObservations} data={data} audience={audience} /></SupportingSection><SupportingSection title={`Nearby storm reports (${data.records.localStormReports.length})`} open={audience === "professional"}><RecordList records={data.records.localStormReports} data={data} audience={audience} /></SupportingSection><SupportingSection title={`Warning coverage (${data.records.warnings.length})`}><RecordList records={data.records.warnings} data={data} audience={audience} /></SupportingSection><SupportingSection title="Precipitation context"><div className="grid gap-3 sm:grid-cols-3">{[["Event day", data.precipitation.eventDayTotalInches], ["Prior 24 hours", data.precipitation.prior24HoursInches], ["Prior 72 hours", data.precipitation.prior72HoursInches], ["Prior seven days", data.precipitation.priorSevenDaysInches], ["Maximum hour", data.precipitation.maximumHourlyInches], ["Maximum three hours", data.precipitation.maximumThreeHourInches]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-brand-offWhite p-3"><p className="text-xs text-brand-olive/50">{label}</p><p className="mt-1 font-semibold">{formatMeasurement(value as number | undefined, "in")}</p></div>)}</div><p className="mt-4 text-xs text-brand-olive/50">{data.precipitation.stationName ?? "No precipitation station returned"}{data.precipitation.distanceMilesFromProperty ? ` · ${data.precipitation.distanceMilesFromProperty.toFixed(1)} miles from property` : ""}</p></SupportingSection><SupportingSection title="Imagery availability"><div className="grid gap-3 sm:grid-cols-2">{[["Before", data.imagery.before], ["After", data.imagery.after]].map(([label, capture]) => { const item = capture as SearchResponse["imagery"]["before"]; return <div key={String(label)} className="rounded-xl border border-brand-gray/70 p-4"><div className="flex items-center gap-2"><Satellite className="h-4 w-4" /><p className="text-sm font-semibold">{String(label)} event window</p></div>{item ? <><p className="mt-3 text-xs">{readableEvidenceDate(item.capturedAt, data.property.timeZone)}</p><p className="mt-1 text-[10px] text-brand-olive/45">{item.itemId} · {item.cloudCoverPercent ?? "Unknown"}% cloud cover</p></> : <p className="mt-3 flex items-center gap-2 text-xs text-brand-olive/55"><ImageOff className="h-4 w-4" />No suitable capture returned</p>}</div>; })}</div><p className="mt-4 text-[11px] leading-relaxed text-brand-olive/50">Imagery is contextual. Its resolution and cloud cover generally cannot establish roof-level damage.</p></SupportingSection></div></section>;
}

export function SourcesAndLimitations({ data, expanded = false }: { data: SearchResponse; expanded?: boolean }) {
    return <details open={expanded} className="group rounded-2xl border border-brand-gray/70 bg-white"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold text-brand-olive [&::-webkit-details-marker]:hidden">Sources and limitations <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" /></summary><div className="border-t border-brand-gray/70 p-5"><div className="divide-y divide-brand-gray/70 border-y border-brand-gray/70">{data.sources.map((source) => <div key={source.id} className="grid gap-1 py-4 sm:grid-cols-[1fr_.65fr_1.5fr] sm:gap-4"><div><p className="text-sm font-semibold">{source.provider}</p><a href={source.sourceUrl} target="_blank" rel="noreferrer" className="text-[10px] text-brand-olive/45 underline">{source.dataset}</a></div><p className="text-xs text-brand-olive/65">{sourceStatus(source.status)} · {source.recordCount}<br />{readableEvidenceDate(source.retrievedAt, data.property.timeZone)}</p><p className="text-xs leading-relaxed text-brand-olive/50">{source.message ?? source.limitations[0]}</p></div>)}</div>{data.dataQualityWarnings.length > 0 && <div className="mt-5 rounded-xl bg-amber-50 p-4"><p className="text-xs font-semibold">Missing-data and quality notices</p><ul className="mt-2 space-y-1 pl-4 text-xs text-brand-olive/60">{data.dataQualityWarnings.map((warning) => <li key={warning} className="list-disc">{warning}</li>)}</ul></div>}<h4 className="mt-6 text-sm font-semibold">Methodology and limitations</h4><ul className="mt-3 space-y-2 pl-4 text-xs leading-relaxed text-brand-olive/60">{data.limitations.map((limitation) => <li key={limitation} className="list-disc">{limitation}</li>)}</ul><p className="mt-5 border-t border-brand-gray pt-4 text-[11px] text-brand-olive/45">Evidence generated {readableEvidenceDate(data.generatedAt, data.property.timeZone)}. Retrieval times and record identifiers are retained in the report.</p></div></details>;
}

export default function ResultsDashboard({ data, latitude, longitude, date, address, audience = "homeowner" }: ResultsDashboardProps) {
    const property = address || [data.property.city, data.property.state].filter(Boolean).join(", ") || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    return <section className="mx-auto w-full max-w-5xl space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"><header className="rounded-3xl border border-brand-gray/60 bg-white p-6 shadow-[0_18px_45px_-35px_rgba(51,54,41,0.45)] sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><div className="inline-flex items-center gap-2 rounded-full bg-brand-lime/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.13em] text-brand-olive"><Database className="h-3.5 w-3.5" /> Available weather evidence</div><h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-brand-olive sm:text-3xl">{evidenceHeadline(data)}</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-olive/60">The summary reflects the returned records. Nearby weather evidence does not establish conditions or damage at a structure.</p></div>{audience === "professional" && <span className="rounded-xl border border-brand-gray bg-brand-offWhite px-3 py-2 text-[10px] font-semibold text-brand-olive/55">Evidence model {data.schemaVersion}</span>}</div><div className="mt-6 grid gap-3 border-t border-brand-gray/70 pt-5 sm:grid-cols-2"><div className="flex items-start gap-2.5 text-sm text-brand-olive/70"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/45">Property</p><p className="mt-0.5 font-medium text-brand-olive">{property}</p></div></div><div className="flex items-start gap-2.5 text-sm text-brand-olive/70"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/45">Approximate date</p><p className="mt-0.5 font-medium text-brand-olive">{format(date, "MMMM d, yyyy")} · {data.property.timeZone}</p></div></div></div></header><EvidenceStateNotice data={data} /><EvidenceSummary data={data} audience={audience} /><EvidenceTimeline data={data} audience={audience} /><SupportingEvidence data={data} audience={audience} /><SourcesAndLimitations data={data} /></section>;
}
