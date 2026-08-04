"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowUpRight,
    CalendarDays,
    CloudRain,
    Database,
    FileText,
    MapPin,
    Radar,
    ShieldAlert,
    Wind,
} from "lucide-react";
import { EvidenceClassification, SearchResponse } from "@/lib/types";

type TimelineFilter = "all" | "observed" | "reported" | "warning";

const filters: { value: TimelineFilter; label: string }[] = [
    { value: "all", label: "All records" },
    { value: "observed", label: "Measured" },
    { value: "reported", label: "Reported" },
    { value: "warning", label: "Warnings" },
];

const classificationLabel: Record<EvidenceClassification, string> = {
    observed: "Measured nearby",
    reported: "Reported nearby",
    official_event: "Official record",
    warning: "Official warning",
    radar_estimated: "Radar estimate",
    modeled: "Modeled context",
    contextual: "Context only",
    inferred: "Inferred context",
};

const classificationStyle: Record<EvidenceClassification, string> = {
    observed: "border-emerald-800/20 bg-emerald-50 text-emerald-950",
    reported: "border-sky-800/20 bg-sky-50 text-sky-950",
    official_event: "border-indigo-800/20 bg-indigo-50 text-indigo-950",
    warning: "border-amber-800/20 bg-amber-50 text-amber-950",
    radar_estimated: "border-fuchsia-800/20 bg-fuchsia-50 text-fuchsia-950",
    modeled: "border-violet-800/20 bg-violet-50 text-violet-950",
    contextual: "border-zinc-500/20 bg-zinc-50 text-zinc-800",
    inferred: "border-zinc-500/20 bg-zinc-50 text-zinc-800",
};

function timelineTime(timestamp: string, timeZone: string) {
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone,
        timeZoneName: "short",
    }).format(new Date(timestamp));
}

function statusLabel(status: SearchResponse["sources"][number]["status"]) {
    if (status === "complete") return "Records returned";
    if (status === "empty") return "No records returned";
    if (status === "partial") return "Partial result";
    if (status === "failed") return "Unavailable";
    return "Not included";
}

export default function WeatherTimelineDemo({ data }: { data: SearchResponse }) {
    const [activeFilter, setActiveFilter] = useState<TimelineFilter>("all");
    const timelineId = useId();
    const visibleEntries = useMemo(
        () => data.timeline.filter((entry) => activeFilter === "all" || entry.classification === activeFilter),
        [activeFilter, data.timeline],
    );
    const observed = data.timeline.find((entry) => entry.classification === "observed");
    const reported = data.timeline.find((entry) => entry.classification === "reported");

    return (
        <div className="overflow-hidden rounded-[1.75rem] border border-brand-olive/15 bg-white shadow-[0_28px_80px_-48px_rgba(51,54,41,0.55)]">
            <header className="border-b border-brand-gray bg-brand-offWhite/80 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-olive text-brand-lime">
                            <Database className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-olive/75">Property evidence timeline</p>
                            <p className="mt-1 text-sm font-semibold text-brand-olive">1450 Sample Ridge Road</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 grid gap-2 border-t border-brand-olive/10 pt-4 text-xs text-brand-olive/70 sm:grid-cols-2">
                    <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Cedar Rapids, Iowa</p>
                    <p className="flex items-center gap-2 sm:justify-end"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> Approximate date · May 21, 2024</p>
                </div>
            </header>

            <div className="p-4 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-brand-gray bg-brand-offWhite/70 p-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-olive/75"><Wind className="h-3.5 w-3.5" aria-hidden="true" /> Measured nearby</div>
                        <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-brand-olive">{observed?.magnitude?.value.toFixed(1) ?? "—"} <span className="text-xs font-medium tracking-normal text-brand-olive/75">mph</span></p>
                        <p className="mt-1 text-[11px] text-brand-olive/75">KCID station · 7.2 mi south</p>
                    </div>
                    <div className="rounded-2xl border border-brand-gray bg-brand-offWhite/70 p-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-olive/75"><Radar className="h-3.5 w-3.5" aria-hidden="true" /> Reported nearby</div>
                        <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-brand-olive">{reported?.magnitude?.value.toFixed(2) ?? "—"} <span className="text-xs font-medium tracking-normal text-brand-olive/75">in hail</span></p>
                        <p className="mt-1 text-[11px] text-brand-olive/75">Local report · 2.7 mi northeast</p>
                    </div>
                    <div className="rounded-2xl border border-brand-gray bg-brand-offWhite/70 p-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-olive/75"><CloudRain className="h-3.5 w-3.5" aria-hidden="true" /> Event-day total</div>
                        <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-brand-olive">{data.precipitation.eventDayTotalInches?.toFixed(2) ?? "—"} <span className="text-xs font-medium tracking-normal text-brand-olive/75">in rain</span></p>
                        <p className="mt-1 text-[11px] text-brand-olive/75">KCID station · 7.2 mi south</p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-b border-brand-gray pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-brand-olive">Weather-event chronology</h3>
                        <p className="mt-1 text-xs leading-relaxed text-brand-olive/70">Record types stay distinct even when they occur minutes apart.</p>
                    </div>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter sample timeline">
                        {filters.map((filter) => (
                            <button
                                key={filter.value}
                                type="button"
                                aria-pressed={activeFilter === filter.value}
                                aria-controls={timelineId}
                                onClick={() => setActiveFilter(filter.value)}
                                className={`min-h-10 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2 ${activeFilter === filter.value ? "border-brand-olive bg-brand-olive text-white" : "border-brand-gray bg-white text-brand-olive hover:border-brand-olive/35"}`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="sr-only" aria-live="polite">Showing {visibleEntries.length} of {data.timeline.length} sample timeline records.</p>
                <ol id={timelineId} className="relative mt-5 space-y-2 before:absolute before:bottom-5 before:left-[17px] before:top-5 before:w-px before:bg-brand-olive/15">
                    {visibleEntries.map((entry) => (
                        <li key={entry.id} className="relative grid grid-cols-[36px_1fr] gap-3 rounded-2xl border border-transparent p-2 transition-colors hover:border-brand-gray hover:bg-brand-offWhite/70 sm:gap-4 sm:p-3">
                            <span className="relative z-10 mt-1 grid h-9 w-9 place-items-center rounded-full border border-brand-olive/15 bg-white text-brand-olive shadow-sm">
                                {entry.classification === "warning" ? <ShieldAlert className="h-4 w-4" aria-hidden="true" /> : entry.classification === "reported" ? <Radar className="h-4 w-4" aria-hidden="true" /> : <Wind className="h-4 w-4" aria-hidden="true" />}
                            </span>
                            <div className="min-w-0 pb-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.09em] ${classificationStyle[entry.classification]}`}>{classificationLabel[entry.classification]}</span>
                                    <time className="text-[10px] font-medium text-brand-olive/75">{timelineTime(entry.timestamp, data.property.timeZone)}</time>
                                </div>
                                <p className="mt-2 text-sm font-semibold leading-snug text-brand-olive">{entry.title}</p>
                                <p className="mt-1 text-xs leading-relaxed text-brand-olive/70">{entry.explanation}</p>
                                <p className="mt-2 text-[10px] leading-relaxed text-brand-olive/75">{entry.source}{typeof entry.distanceMilesFromProperty === "number" ? ` · ${entry.distanceMilesFromProperty.toFixed(1)} miles from property` : ""}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="mt-6 border-t border-brand-gray pt-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold text-brand-olive">Source status travels with the output</p>
                            <p className="mt-1 text-[11px] text-brand-olive/75">Provider, dataset, record count, and limitations remain attached.</p>
                        </div>
                        <FileText className="h-5 w-5 shrink-0 text-brand-olive/70" aria-hidden="true" />
                    </div>
                    <div className="mt-4 divide-y divide-brand-gray border-y border-brand-gray">
                        {data.sources.slice(0, 3).map((source) => (
                            <div key={source.id} className="grid gap-1 py-3 text-xs sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4">
                                <p className="font-medium text-brand-olive">{source.provider} · <span className="font-normal text-brand-olive/70">{source.dataset}</span></p>
                                <p className="text-brand-olive/75">{statusLabel(source.status)} · {source.recordCount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="flex flex-col gap-3 border-t border-brand-gray bg-brand-offWhite/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-[11px] leading-relaxed text-brand-olive/75">Classifications and source context travel with each record.</p>
                <Link href="/sample-report" className="inline-flex min-h-11 items-center justify-center rounded-xl text-sm font-semibold text-brand-olive underline decoration-brand-olive/25 underline-offset-4 transition-colors hover:decoration-brand-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2">
                    Open the sample report <ArrowUpRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Link>
            </footer>
        </div>
    );
}
