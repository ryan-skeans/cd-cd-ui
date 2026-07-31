"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

import { Document, Image, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import { format } from "date-fns";
import {
    AlertTriangle,
    Database,
    Download,
    FileCheck,
    ImageOff,
    MapPin,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    buildEvidenceSummary,
    displayHail,
    displayWind,
    formatMeasurement,
    readableEvidenceDate,
} from "@/lib/evidence";
import { SearchResponse } from "@/lib/types";

export interface ReportDetails {
    data: SearchResponse;
    latitude: number;
    longitude: number;
    date: Date;
    address?: string;
}

const styles = StyleSheet.create({
    page: { padding: 36, fontSize: 9, color: "#333629", lineHeight: 1.45 },
    eyebrow: { color: "#68705b", fontSize: 8, letterSpacing: 1.2, marginBottom: 6 },
    title: { fontSize: 22, fontWeight: 700, marginBottom: 6 },
    sub: { color: "#5d6852", marginBottom: 14 },
    disclosure: { padding: 9, backgroundColor: "#f2f6db", marginBottom: 16 },
    section: { marginTop: 16 },
    heading: { fontSize: 12, fontWeight: 700, marginBottom: 7 },
    row: { flexDirection: "row", gap: 8 },
    box: { flexGrow: 1, flexBasis: 0, padding: 9, backgroundColor: "#f4f5f0" },
    label: { color: "#68705b", fontSize: 7, marginBottom: 3 },
    value: { fontSize: 10, fontWeight: 700 },
    sourceRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e7df", paddingVertical: 6 },
    sourceName: { width: "22%", fontWeight: 700 },
    sourceCoverage: { width: "33%" },
    sourceCaveat: { width: "45%", color: "#68705b" },
    image: { width: "100%", height: 150, objectFit: "cover" },
    note: { color: "#68705b", fontSize: 7, marginTop: 5 },
    footer: { marginTop: 20, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#e5e7df", color: "#68705b", fontSize: 7 },
});

function reportId({ latitude, longitude, date }: ReportDetails) {
    return `CD-${format(date, "yyyyMMdd")}-${Math.abs(latitude).toFixed(2).replace(".", "")}${Math.abs(longitude).toFixed(2).replace(".", "")}`;
}

function propertyLabel(report: ReportDetails) {
    return report.address || `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`;
}

function imageUrl(value?: string) {
    if (!value || value.startsWith("http")) return value;
    return typeof window !== "undefined" && window.location.hostname === "localhost"
        ? `http://localhost:8787${value.startsWith("/") ? "" : "/"}${value}`
        : value;
}

function PdfDocument({ report }: { report: ReportDetails }) {
    const { data } = report;
    const metrics = [
        ["Peak wind gust", displayWind(data.noaa), "Weather archive"],
        ["Reported hail", displayHail(data.noaa), "NWS local reports"],
        ["Precipitation", formatMeasurement(data.noaa.totalPrecipitationInches, "in"), "Weather archive"],
        ["Severe alerts", data.noaa.hasSevereAlerts ? "Available" : "None found", "NWS"],
    ];

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <Text style={styles.eyebrow}>CLAIMDEFENDER · DEMO EVIDENCE PACKAGE</Text>
                <Text style={styles.title}>Property weather evidence</Text>
                <Text style={styles.sub}>{reportId(report)} · Generated {format(new Date(), "MMM d, yyyy")}</Text>
                <Text style={styles.disclosure}>
                    DEMO DISCLOSURE — This sample package is generated without payment. Imagery in this PDF is illustrative. No coverage, causation, or damage conclusion is provided.
                </Text>

                <View style={styles.section}>
                    <Text style={styles.heading}>Investigation context</Text>
                    <Text>Property: {propertyLabel(report)}</Text>
                    <Text>Approximate date of loss: {format(report.date, "MMMM d, yyyy")}</Text>
                    <Text>Search coordinates: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>Weather observations</Text>
                    <View style={styles.row}>
                        {metrics.map(([label, value, source]) => (
                            <View key={label} style={styles.box}>
                                <Text style={styles.label}>{source} · {label}</Text>
                                <Text style={styles.value}>{value}</Text>
                            </View>
                        ))}
                    </View>
                    {data.noaa.tornadoReported && (
                        <Text style={styles.note}>
                            A tornado report was found in the search area. Confirm the report location and time before relying on it.
                        </Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>Sources and coverage</Text>
                    {[
                        ["Weather archive", "Wind and precipitation observations", "Archive values describe the search area and do not establish conditions at a structure."],
                        ["NWS local reports", "Nearby hail and storm reports", "Reports may be within the search radius rather than at the property boundary."],
                        ["NWS alerts", "Archived severe-alert context", "An alert describes a warned area and does not establish conditions at a structure."],
                        ["Imagery archive", "Capture availability around the event date", "Imagery is contextual and is not a property inspection or damage finding."],
                    ].map(([source, coverage, caveat]) => (
                        <View key={source} style={styles.sourceRow}>
                            <Text style={styles.sourceName}>{source}</Text>
                            <Text style={styles.sourceCoverage}>{coverage}</Text>
                            <Text style={styles.sourceCaveat}>{caveat}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>Illustrative imagery comparison</Text>
                    <View style={styles.row}>
                        <View style={styles.box}>
                            <Image style={styles.image} src="/demo-report-assets/roof-before.svg" />
                            <Text style={styles.note}>Before · Demo placeholder, not archived imagery</Text>
                        </View>
                        <View style={styles.box}>
                            <Image style={styles.image} src="/demo-report-assets/roof-after.svg" />
                            <Text style={styles.note}>After · Demo placeholder, not archived imagery</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>Evidence summary</Text>
                    <Text>{buildEvidenceSummary(data)}</Text>
                </View>

                <Text style={styles.footer}>
                    This package organizes available evidence for review. It does not determine coverage, cause of loss, damage, or claim outcome and does not replace an inspection, policy review, or professional advice.
                </Text>
            </Page>
        </Document>
    );
}

export default function OfficialReport({
    report,
    onStartNewSearch,
}: {
    report: ReportDetails;
    onStartNewSearch: () => void;
}) {
    const [preparing, setPreparing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data } = report;
    const metrics = [
        ["Peak wind", displayWind(data.noaa), "Weather archive"],
        ["Reported hail", displayHail(data.noaa), "NWS local reports"],
        ["Precipitation", formatMeasurement(data.noaa.totalPrecipitationInches, "in"), "Weather archive"],
        ["Severe alerts", data.noaa.hasSevereAlerts ? "Available" : "None found", "NWS"],
    ];
    const imagery = [
        ["Before event", data.satellite.beforeThumbnailUrl, readableEvidenceDate(data.satellite.beforeDate)],
        ["After event", data.satellite.afterThumbnailUrl, readableEvidenceDate(data.satellite.afterDate)],
    ];

    const download = async () => {
        setPreparing(true);
        setError(null);
        try {
            const blob = await pdf(<PdfDocument report={report} />).toBlob();
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${reportId(report)}.pdf`;
            anchor.click();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch {
            setError("Unable to generate the PDF. Please try again.");
        } finally {
            setPreparing(false);
        }
    };

    return (
        <section className="mx-auto w-full max-w-4xl space-y-6 animate-in fade-in-0 slide-in-from-bottom-6 duration-500">
            <div className="rounded-3xl bg-brand-olive p-6 text-white shadow-xl sm:p-8">
                <div className="flex flex-col items-start justify-between gap-5 sm:flex-row">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-brand-lime">
                            <FileCheck className="h-5 w-5" />
                            <span className="text-xs font-bold uppercase tracking-[.16em]">Demo package unlocked</span>
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">ClaimDefender Evidence Package</h2>
                        <p className="mt-2 text-sm text-white/65">{reportId(report)} · Generated {format(new Date(), "MMM d, yyyy")}</p>
                    </div>
                    <Button onClick={download} disabled={preparing} className="bg-brand-lime font-bold text-brand-olive hover:bg-brand-limeLight">
                        <Download className="mr-2 h-4 w-4" />
                        {preparing ? "Preparing PDF…" : "Download demo PDF"}
                    </Button>
                </div>
                <div className="mt-6 flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-white/65">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-brand-lime" />
                    This is a sample report unlocked without payment. It organizes available records and does not provide a coverage, causation, or damage conclusion.
                </div>
            </div>

            {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600">{error}</p>}

            <div className="grid gap-5 md:grid-cols-[1.45fr_.75fr]">
                <div className="rounded-2xl border border-brand-gray/60 bg-white p-5">
                    <h3 className="font-semibold text-brand-olive">Investigation context</h3>
                    <p className="mt-3 flex items-start gap-2 text-sm text-brand-olive/70">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {propertyLabel(report)}
                    </p>
                    <p className="mt-2 text-sm text-brand-olive/70">Approximate loss date: {format(report.date, "MMMM d, yyyy")}</p>
                    <p className="mt-1 text-xs text-brand-olive/45">Coordinates: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</p>
                </div>
                <div className="rounded-2xl border border-brand-lime/40 bg-brand-lime/20 p-5 text-brand-olive">
                    <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <p className="text-xs font-bold uppercase tracking-wider">Sources searched</p>
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-relaxed">Weather archive records<br />NWS local reports and alerts<br />Imagery archive</p>
                </div>
            </div>

            <div className="rounded-2xl border border-brand-gray/60 bg-white p-5 sm:p-6">
                <div>
                    <h3 className="font-semibold text-brand-olive">Weather observations</h3>
                    <p className="mt-1 text-xs text-brand-olive/50">Returned measurements are observations, not conclusions about the property.</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {metrics.map(([label, value, source]) => (
                        <div key={label} className="rounded-xl border border-brand-gray/60 bg-brand-offWhite p-3">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-brand-olive/55">{label}</p>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-olive/45">{source}</span>
                            </div>
                            <p className="mt-2 font-semibold text-brand-olive">{value}</p>
                        </div>
                    ))}
                </div>
                {data.noaa.tornadoReported && (
                    <p className="mt-4 flex gap-2 text-sm text-amber-800">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        A tornado report was found in the search area. Review its time and location before relying on it.
                    </p>
                )}
            </div>

            <div className="rounded-2xl border border-brand-gray/60 bg-white p-5 sm:p-6">
                <h3 className="font-semibold text-brand-olive">Source methodology and limits</h3>
                <div className="mt-4 divide-y divide-brand-gray/70 border-y border-brand-gray/70">
                    {[
                        ["Weather archive", "Wind and precipitation observations", "Archive values describe the search area and do not establish conditions at a structure."],
                        ["NWS local reports", "Nearby hail and storm reports", "Reports may be within the search radius rather than at the property boundary."],
                        ["NWS alerts", "Severe-alert archive context", "A warned area does not establish conditions at an individual structure."],
                        ["Imagery archive", "Capture availability around the event", "Imagery is contextual and is not a property inspection or damage finding."],
                    ].map(([source, coverage, caveat]) => (
                        <div key={source} className="grid gap-1 py-4 text-sm sm:grid-cols-[.75fr_1.25fr_2fr] sm:gap-4">
                            <p className="font-semibold text-brand-olive">{source}</p>
                            <p className="text-brand-olive/70">{coverage}</p>
                            <p className="text-xs leading-relaxed text-brand-olive/50">{caveat}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-brand-gray/60 bg-white p-5 sm:p-6">
                <h3 className="font-semibold text-brand-olive">Imagery comparison</h3>
                <p className="mt-1 text-sm text-brand-olive/55">Archive previews are provided as visual context and are not analysed for damage.</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {imagery.map(([label, src, imageDate]) => (
                        <figure key={label} className="overflow-hidden rounded-xl border border-brand-gray/60">
                            <div className="grid aspect-[4/3] place-items-center bg-brand-offWhite text-brand-olive/30">
                                {src ? (
                                    <img src={imageUrl(src)} alt={`${label} archive preview`} className="h-full w-full object-cover" />
                                ) : (
                                    <ImageOff className="h-7 w-7" />
                                )}
                            </div>
                            <figcaption className="p-3 text-xs text-brand-olive/60">
                                <span className="font-semibold text-brand-olive">{label}</span> · {imageDate} · Imagery archive
                            </figcaption>
                        </figure>
                    ))}
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-brand-olive/45">
                    The downloaded demo PDF uses clearly labelled illustrative placeholders so external imagery is not presented as embedded report evidence.
                </p>
            </div>

            <div className="rounded-2xl border border-brand-gray/60 bg-white p-5 sm:p-6">
                <h3 className="font-semibold text-brand-olive">Evidence summary</h3>
                <p className="mt-3 leading-relaxed text-brand-olive/75">{buildEvidenceSummary(data)}</p>
                <p className="mt-4 border-t border-brand-gray/50 pt-4 text-xs leading-relaxed text-brand-olive/50">
                    This package documents available evidence only. It does not determine coverage, cause of loss, damage, or claim outcome and does not replace an inspection, policy review, or professional advice.
                </p>
            </div>

            <Button onClick={onStartNewSearch} variant="outline" className="mx-auto flex border-brand-gray text-brand-olive">
                <RefreshCw className="mr-2 h-4 w-4" /> Start new search
            </Button>
        </section>
    );
}
