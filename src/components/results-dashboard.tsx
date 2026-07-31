"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { format } from "date-fns";
import {
    AlertTriangle,
    CalendarDays,
    Check,
    CheckCircle2,
    CloudHail,
    Copy,
    Eye,
    FileText,
    ImageOff,
    Lock,
    MapPin,
    Radar,
    Satellite,
    Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    buildEvidenceSummary,
    displayHail,
    displayWind,
    formatMeasurement,
    hasImagery,
    readableEvidenceDate,
} from "@/lib/evidence";
import { SearchResponse } from "@/lib/types";

interface ResultsDashboardProps {
    data: SearchResponse;
    latitude: number;
    longitude: number;
    date: Date;
    address?: string;
    onUnlock?: () => void;
}

function imageUrl(value?: string) {
    if (!value || value.startsWith("http")) return value;
    return typeof window !== "undefined" && window.location.hostname === "localhost"
        ? `http://localhost:8787${value.startsWith("/") ? "" : "/"}${value}`
        : value;
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
    const summary = buildEvidenceSummary(data);
    const imageryAvailable = hasImagery(data);
    const property = address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

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

    const observations = [
        {
            icon: Wind,
            label: "Peak wind gust",
            value: displayWind(data.noaa),
            detail: "Maximum returned in the search window",
            source: "Weather archive",
        },
        {
            icon: CloudHail,
            label: "Reported hail",
            value: displayHail(data.noaa),
            detail: "Storm-report context near the property",
            source: "NWS local reports",
        },
        {
            icon: Radar,
            label: "Precipitation",
            value: formatMeasurement(data.noaa.totalPrecipitationInches, "in"),
            detail: "Total returned for the seven-day window",
            source: "Weather archive",
        },
        {
            icon: AlertTriangle,
            label: "Severe alerts",
            value: data.noaa.hasSevereAlerts ? "Available" : "None found",
            detail: "Archived alert search result",
            source: "NWS",
        },
    ];

    const availability = [
        {
            label: "Weather observations",
            status: "Available",
            detail: "Wind, hail, and precipitation records returned",
        },
        {
            label: "Alert context",
            status: data.noaa.hasSevereAlerts ? "Available" : "None found",
            detail: "NWS severe-alert archive searched",
        },
        {
            label: "Imagery pair",
            status: imageryAvailable ? "Available" : "Incomplete",
            detail: imageryAvailable
                ? "Before- and after-event captures located"
                : "A complete comparison pair was not located",
        },
    ];

    return (
        <section className="mx-auto w-full max-w-4xl space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <header className="rounded-3xl border border-brand-gray/60 bg-white p-6 shadow-[0_18px_45px_-35px_rgba(51,54,41,0.45)] sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-lime/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.13em] text-brand-olive">
                            <Radar className="h-3.5 w-3.5" /> Evidence snapshot
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-brand-olive sm:text-3xl">
                            Available records for review
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-olive/60">
                            Source-oriented observations for the selected property and loss date. They are not a coverage decision or damage finding.
                        </p>
                    </div>
                    <div className="shrink-0 rounded-xl border border-brand-gray/70 bg-brand-offWhite px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-olive/45">
                            Records searched
                        </p>
                        <p className="mt-1 text-sm font-semibold text-brand-olive">Weather archive · NWS · imagery archive</p>
                    </div>
                </div>

                <div className="mt-6 grid gap-3 border-t border-brand-gray/70 pt-5 sm:grid-cols-2">
                    <div className="flex items-start gap-2.5 text-sm text-brand-olive/70">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-olive" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/45">Property</p>
                            <p className="mt-0.5 font-medium text-brand-olive">{property}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-brand-olive/70">
                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-brand-olive" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/45">Approximate loss date</p>
                            <p className="mt-0.5 font-medium text-brand-olive">{format(date, "MMMM d, yyyy")}</p>
                        </div>
                    </div>
                </div>
            </header>

            <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none">
                <CardContent className="p-5 sm:p-6">
                    <div className="mb-5">
                        <h3 className="font-semibold">Evidence availability</h3>
                        <p className="mt-1 text-xs text-brand-olive/55">
                            A search result describes record availability, not whether damage occurred.
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {availability.map((item) => (
                            <div key={item.label} className="rounded-xl border border-brand-gray/70 bg-brand-offWhite/70 p-4">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold text-brand-olive">{item.label}</p>
                                    {item.status === "Available" ? (
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-olive" />
                                    ) : (
                                        <span className="h-2 w-2 shrink-0 rounded-full bg-brand-olive/25" />
                                    )}
                                </div>
                                <p className="mt-3 text-sm font-semibold text-brand-olive">{item.status}</p>
                                <p className="mt-1 text-[11px] leading-relaxed text-brand-olive/50">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none">
                <CardContent className="p-5 sm:p-6">
                    <div className="mb-5 flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-semibold">Weather observations</h3>
                            <p className="mt-1 text-xs text-brand-olive/55">Measurements and archive results returned by the search.</p>
                        </div>
                        <span className="rounded-full border border-brand-gray/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-olive/55">
                            Source data
                        </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {observations.map(({ icon: Icon, label, value, detail, source }) => (
                            <div key={label} className="rounded-xl border border-brand-gray/70 bg-brand-offWhite/70 p-4">
                                <div className="mb-5 flex items-center justify-between">
                                    <Icon className="h-4 w-4 text-brand-olive" />
                                    <span className="rounded-full border border-brand-gray bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-olive/50">
                                        {source}
                                    </span>
                                </div>
                                <p className="text-xs text-brand-olive/55">{label}</p>
                                <p className="mt-1 text-lg font-semibold tracking-tight text-brand-olive">{value}</p>
                                <p className="mt-1 text-[11px] leading-relaxed text-brand-olive/45">{detail}</p>
                            </div>
                        ))}
                    </div>
                    {data.noaa.tornadoReported && (
                        <div className="mt-4 flex gap-3 rounded-xl border border-amber-500/25 bg-amber-50 p-3 text-sm text-brand-olive">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" />
                            <span>
                                <strong>Tornado report context:</strong> a report was found in the search area. Review its location and time before relying on it.
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
                <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none">
                    <CardContent className="p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="flex items-center gap-2 font-semibold">
                                    <Satellite className="h-4 w-4" /> Imagery availability
                                </h3>
                                <p className="mt-1 text-xs text-brand-olive/55">
                                    Archived captures are shown for visual context only.
                                </p>
                            </div>
                            <span className="rounded-full border border-brand-gray px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-brand-olive/50">
                                Imagery archive
                            </span>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            {[
                                ["Before event", data.satellite?.beforeThumbnailUrl, readableEvidenceDate(data.satellite?.beforeDate)],
                                ["After event", data.satellite?.afterThumbnailUrl, readableEvidenceDate(data.satellite?.afterDate)],
                            ].map(([label, image, imageDate]) => (
                                <div key={label}>
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-brand-gray/70 bg-brand-offWhite">
                                        {image ? (
                                            <img src={imageUrl(image)} alt={`${label} imagery preview`} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="grid h-full place-items-center text-brand-olive/30">
                                                <ImageOff className="h-6 w-6" />
                                            </div>
                                        )}
                                        {image && <div className="absolute inset-0 bg-gradient-to-t from-brand-olive/35 to-transparent" />}
                                    </div>
                                    <p className="mt-2 text-xs font-medium text-brand-olive">{label}</p>
                                    <p className="mt-0.5 text-[11px] text-brand-olive/50">{imageDate}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-brand-gray/60 bg-brand-olive text-white shadow-none">
                    <CardContent className="flex h-full flex-col p-5 sm:p-6">
                        <Lock className="h-5 w-5 text-brand-lime" />
                        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-lime">Evidence package preview</p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight">A structured investigation file.</h3>
                        <ul className="mt-4 space-y-2 text-sm text-white/70">
                            <li>• Source-labelled weather observations</li>
                            <li>• Property and date-of-loss record</li>
                            <li>• Imagery availability and caveats</li>
                            <li>• Downloadable demo report</li>
                        </ul>
                        <Button onClick={onUnlock} className="mt-6 bg-brand-lime text-brand-olive hover:bg-brand-limeLight lg:mt-auto">
                            Preview evidence package <Eye className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-brand-gray/60 bg-white text-brand-olive shadow-none">
                <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h3 className="flex items-center gap-2 font-semibold">
                                <FileText className="h-4 w-4" /> Evidence summary
                            </h3>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-olive/70">{summary}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={copySummary} className="shrink-0 border-brand-gray text-brand-olive">
                            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                            {copied ? "Copied" : "Copy summary"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
