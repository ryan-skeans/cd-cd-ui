"use client";
/* eslint-disable @next/next/no-img-element */

import { Document, Image as PdfImage, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import { format } from "date-fns";
import { AlertTriangle, Database, Download, FileCheck, MapPin, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { buildEvidenceSummary, classificationLabels, formatMeasurement, readableEvidenceDate } from "@/lib/evidence";
import { trackDemoEvent } from "@/lib/demo-analytics";
import { DemoClaimContext, DemoClientContext, DemoOrganization } from "@/lib/demo-workspace";
import { EvidenceClassification, SearchResponse } from "@/lib/types";

export interface ReportDetails {
    data: SearchResponse;
    latitude: number;
    longitude: number;
    date: Date;
    address?: string;
}

export interface ReportContext {
    audience: "homeowner" | "professional";
    organization?: DemoOrganization;
    client?: DemoClientContext;
    claim?: DemoClaimContext;
    packageId?: string;
}

const styles = StyleSheet.create({
    page: { padding: 36, fontSize: 8.5, color: "#333629", lineHeight: 1.45 },
    eyebrow: { color: "#68705b", fontSize: 7.5, letterSpacing: 1.1, marginBottom: 6 },
    // The page's body line height is inherited as a fixed point value by react-pdf.
    // Recalculate it for the larger heading so the subtitle cannot enter its line box.
    title: { fontSize: 21, fontWeight: 700, lineHeight: 1.15, marginBottom: 8 },
    sub: { color: "#5d6852", marginBottom: 13 },
    disclosure: { padding: 9, backgroundColor: "#f2f6db", marginBottom: 14 },
    logo: { width: 72, maxHeight: 32, objectFit: "contain", marginBottom: 8 },
    section: { marginTop: 15 },
    heading: { fontSize: 11, fontWeight: 700, marginBottom: 7 },
    row: { flexDirection: "row", gap: 7 },
    box: { flexGrow: 1, flexBasis: 0, padding: 8, backgroundColor: "#f4f5f0" },
    label: { color: "#68705b", fontSize: 6.8, marginBottom: 3 },
    value: { fontSize: 10, fontWeight: 700 },
    timelineRow: { borderLeftWidth: 1, borderLeftColor: "#cfd3c5", paddingLeft: 8, paddingBottom: 7 },
    timelineMeta: { color: "#68705b", fontSize: 6.5, marginBottom: 2 },
    sourceRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e7df", paddingVertical: 6 },
    sourceName: { width: "25%", fontWeight: 700 },
    sourceStatus: { width: "18%" },
    sourceCaveat: { width: "57%", color: "#68705b" },
    note: { color: "#68705b", fontSize: 7, marginTop: 4 },
    footer: { marginTop: 18, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#e5e7df", color: "#68705b", fontSize: 7 },
});

function fallbackReportId({ latitude, longitude, date }: ReportDetails) {
    return `CD-${format(date, "yyyyMMdd")}-${Math.abs(latitude).toFixed(2).replace(".", "")}${Math.abs(longitude).toFixed(2).replace(".", "")}`;
}

export function reportId(report: ReportDetails, context: ReportContext) {
    return context.packageId ?? fallbackReportId(report);
}

function propertyLabel(report: ReportDetails) {
    return report.address || [report.data.property.city, report.data.property.state].filter(Boolean).join(", ") || `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`;
}

function sourceStatus(status: string) {
    if (status === "complete") return "Returned";
    if (status === "empty") return "None found";
    if (status === "partial") return "Partial";
    if (status === "failed") return "Unavailable";
    return "Not included";
}

function reportMetrics(data: SearchResponse) {
    return [
        ["Event-day observed gust", formatMeasurement(data.summary.maximumObservedWindGustMph, "mph", 1), "Observed"],
        ["Nearby reported gust", formatMeasurement(data.summary.maximumReportedWindGustMph, "mph", 1), "Reported"],
        ["Nearby reported hail", formatMeasurement(data.summary.maximumReportedHailInches, "in"), "Reported"],
        ["Warnings at property", String(data.summary.warningCount), "Warning"],
        ["Event-day precipitation", formatMeasurement(data.precipitation.eventDayTotalInches, "in"), "Observed"],
    ];
}

function professionalContextRows(context: ReportContext) {
    return [
        ["Organization", context.organization?.name],
        ["Prepared by", context.organization?.preparedBy],
        ["Client", context.client?.displayName],
        ["Client reference", context.client?.reference],
        ["Claim / internal reference", context.claim?.claimReference],
        ["Insurance carrier", context.claim?.carrier],
    ].filter((row): row is [string, string] => Boolean(row[1]));
}

function PdfDocument({ report, context }: { report: ReportDetails; context: ReportContext }) {
    const { data } = report;
    const professional = context.audience === "professional";
    return <Document>
        <Page size="LETTER" style={styles.page}>
            {professional && context.organization?.logoDataUrl && <PdfImage src={context.organization.logoDataUrl} style={styles.logo} />}
            <Text style={styles.eyebrow}>CLAIMDEFENDER · {professional ? "DEMO EVIDENCE PACKAGE" : "DEMO PROPERTY EVIDENCE REPORT"}</Text>
            <Text style={styles.title}>{professional ? `${context.organization?.name ?? "Professional"} evidence package` : "Property weather evidence"}</Text>
            <Text style={styles.sub}>{reportId(report, context)} · Generated {readableEvidenceDate(data.generatedAt, data.property.timeZone)}</Text>
            <Text style={styles.disclosure}>DEMO DISCLOSURE — This package organizes available records. It does not determine coverage, cause, property damage, or claim outcome.</Text>
            {professional && <View style={styles.section}><Text style={styles.heading}>Package context</Text>{professionalContextRows(context).map(([label, value]) => <Text key={label}>{label}: {value}</Text>)}{context.claim?.notes && <Text>Internal notes: {context.claim.notes}</Text>}</View>}
            <View style={styles.section}><Text style={styles.heading}>{professional ? "Property and event" : "Property and date"}</Text><Text>Property: {propertyLabel(report)}</Text><Text>Coordinates: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</Text><Text>Approximate date of loss: {format(report.date, "MMMM d, yyyy")} ({data.property.timeZone})</Text><Text>Event-day observation window: {readableEvidenceDate(data.eventDayWindow.start, data.property.timeZone)} to {readableEvidenceDate(data.eventDayWindow.end, data.property.timeZone)}</Text></View>
            <View style={styles.section}><Text style={styles.heading}>Evidence summary</Text><View style={styles.row}>{reportMetrics(data).map(([label, value, classification]) => <View key={label} style={styles.box}><Text style={styles.label}>{classification} · {label}</Text><Text style={styles.value}>{value}</Text></View>)}</View><Text style={styles.note}>{buildEvidenceSummary(data)}</Text></View>
            <View style={styles.section}><Text style={styles.heading}>Weather-event timeline</Text>{data.timeline.length ? data.timeline.slice(0, 14).map((entry) => <View key={entry.id} style={styles.timelineRow}><Text style={styles.timelineMeta}>{classificationLabels[entry.classification]} · {readableEvidenceDate(entry.timestamp, data.property.timeZone)} · {entry.source}{typeof entry.distanceMilesFromProperty === "number" ? ` · ${entry.distanceMilesFromProperty.toFixed(1)} miles` : ""}</Text><Text>{entry.title}</Text><Text style={styles.note}>{entry.explanation}</Text></View>) : <Text>No timeline records were returned by the searched sources.</Text>}</View>
            <Text style={styles.footer}>Observed values were measured at identified locations. Nearby reports occurred at reported locations, and warnings describe warned areas. These categories are not interchangeable.</Text>
        </Page>
        <Page size="LETTER" style={styles.page}>
            <Text style={styles.eyebrow}>CLAIMDEFENDER · DEMO SOURCE APPENDIX</Text><Text style={styles.title}>Sources, methodology, and limitations</Text><Text style={styles.sub}>{reportId(report, context)} · Retrieval {readableEvidenceDate(data.generatedAt, data.property.timeZone)}</Text>
            <View style={styles.section}><Text style={styles.heading}>Source retrieval status</Text>{data.sources.map((source) => <View key={source.id} style={styles.sourceRow}><Text style={styles.sourceName}>{source.provider}{"\n"}{source.dataset}</Text><Text style={styles.sourceStatus}>{sourceStatus(source.status)}{"\n"}{source.recordCount} record(s)</Text><Text style={styles.sourceCaveat}>{source.message ?? source.limitations[0]}{"\n"}Retrieved: {readableEvidenceDate(source.retrievedAt, data.property.timeZone)}</Text></View>)}</View>
            <View style={styles.section}><Text style={styles.heading}>Precipitation context</Text><Text>Station: {data.precipitation.stationName ?? "Not available"} ({data.precipitation.stationId ?? "no station ID"})</Text><Text>Event day: {formatMeasurement(data.precipitation.eventDayTotalInches, "in")}</Text><Text>Prior 24 / 72 hours: {formatMeasurement(data.precipitation.prior24HoursInches, "in")} / {formatMeasurement(data.precipitation.prior72HoursInches, "in")}</Text><Text>Prior seven days: {formatMeasurement(data.precipitation.priorSevenDaysInches, "in")}</Text></View>
            {data.dataQualityWarnings.length > 0 && <View style={styles.section}><Text style={styles.heading}>Data-quality notices</Text>{data.dataQualityWarnings.map((warning) => <Text key={warning} style={styles.note}>• {warning}</Text>)}</View>}
            <View style={styles.section}><Text style={styles.heading}>{professional ? "Package limitations" : "Report limitations"}</Text>{data.limitations.map((limitation) => <Text key={limitation} style={styles.note}>• {limitation}</Text>)}</View>
            <View style={styles.section}><Text style={styles.heading}>Imagery context</Text><Text>Before capture: {readableEvidenceDate(data.imagery.before?.capturedAt, data.property.timeZone)} · {data.imagery.before?.itemId ?? "No item"}</Text><Text>After capture: {readableEvidenceDate(data.imagery.after?.capturedAt, data.property.timeZone)} · {data.imagery.after?.itemId ?? "No item"}</Text><Text style={styles.note}>Available optical imagery is contextual. It cannot establish roof-level damage and is not analyzed in this report.</Text></View>
            <Text style={styles.footer}>{professional ? "Demo Evidence Package" : "Demo Property Evidence Report"} — not a certified weather record, inspection, engineering opinion, legal opinion, or insurance coverage decision.</Text>
        </Page>
    </Document>;
}

function ClassificationPill({ value }: { value: EvidenceClassification }) {
    return <span className="rounded-full border border-brand-gray bg-brand-offWhite px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-olive/65">{classificationLabels[value]}</span>;
}

export default function OfficialReport({ report, context = { audience: "homeowner" }, onStartNewSearch, onReportPreviewed }: { report: ReportDetails; context?: ReportContext; onStartNewSearch?: () => void; onReportPreviewed?: () => void }) {
    const [preparing, setPreparing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data } = report;
    const professional = context.audience === "professional";
    const contextRows = professionalContextRows(context);
    const previewTracked = useRef(false);

    useEffect(() => {
        if (previewTracked.current) return;
        previewTracked.current = true;
        onReportPreviewed?.();
        trackDemoEvent("report_preview_opened", { audience: context.audience });
    }, [context.audience, onReportPreviewed]);

    const download = async () => {
        setPreparing(true);
        setError(null);
        try {
            const blob = await pdf(<PdfDocument report={report} context={context} />).toBlob();
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${reportId(report, context)}-${professional ? "demo-evidence-package" : "demo-property-evidence-report"}.pdf`;
            anchor.click();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
            trackDemoEvent("demo_pdf_downloaded", { audience: context.audience });
        } catch {
            setError("Unable to generate the PDF. Please try again.");
        } finally {
            setPreparing(false);
        }
    };

    return <section className="mx-auto w-full max-w-5xl space-y-6 animate-in fade-in-0 slide-in-from-bottom-6 duration-500">
        <div className="rounded-3xl bg-brand-olive p-6 text-white shadow-xl sm:p-8"><div className="flex flex-col items-start justify-between gap-5 sm:flex-row"><div className="flex items-start gap-4">{professional && context.organization?.logoDataUrl && <img src={context.organization.logoDataUrl} alt={`${context.organization.name} logo`} className="h-12 w-20 rounded-lg bg-white object-contain p-1" />}<div><div className="mb-3 flex items-center gap-2 text-brand-lime"><FileCheck className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[.16em]">{professional ? "Demo Evidence Package" : "Demo Property Evidence Report"}</span></div><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{professional ? context.organization?.name ?? "Professional Evidence Package" : "Property Weather Evidence Report"}</h2><p className="mt-2 text-sm text-white/65">{reportId(report, context)} · Generated {readableEvidenceDate(data.generatedAt, data.property.timeZone)}</p></div></div><Button onClick={download} disabled={preparing} className="bg-brand-lime font-bold text-brand-olive hover:bg-brand-limeLight"><Download className="mr-2 h-4 w-4" />{preparing ? "Preparing PDF…" : "Download demo PDF"}</Button></div><div className="mt-6 flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-white/65"><ShieldCheck className="h-4 w-4 shrink-0 text-brand-lime" />This report preserves classifications and source limitations. It does not determine coverage, causation, physical damage, or claim outcome.</div></div>
        {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {professional && contextRows.length > 0 && <div className="rounded-2xl border border-brand-gray/60 bg-white p-5 sm:p-6"><h3 className="font-semibold text-brand-olive">Professional package context</h3><dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{contextRows.map(([label, value]) => <div key={label}><dt className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/45">{label}</dt><dd className="mt-1 text-sm text-brand-olive">{value}</dd></div>)}</dl>{context.claim?.notes && <div className="mt-4 border-t border-brand-gray pt-4"><p className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/45">Internal notes</p><p className="mt-1 text-sm leading-relaxed text-brand-olive/65">{context.claim.notes}</p></div>}</div>}
        <div className="grid gap-5 md:grid-cols-[1.35fr_.65fr]"><div className="rounded-2xl border border-brand-gray/60 bg-white p-5"><h3 className="font-semibold text-brand-olive">{professional ? "Property and event" : "Property and date"}</h3><p className="mt-3 flex items-start gap-2 text-sm text-brand-olive/70"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{propertyLabel(report)}</p><p className="mt-2 text-sm text-brand-olive/70">Approximate date: {format(report.date, "MMMM d, yyyy")} · {data.property.timeZone}</p><p className="mt-1 text-xs text-brand-olive/45">Coordinates: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</p></div><div className="rounded-2xl border border-brand-lime/40 bg-brand-lime/20 p-5 text-brand-olive"><div className="flex items-center gap-2"><Database className="h-4 w-4" /><p className="text-xs font-bold uppercase tracking-wider">Record inventory</p></div><p className="mt-3 text-sm font-semibold leading-relaxed">{data.records.localStormReports.length} local reports<br />{data.records.warnings.length} warnings<br />{data.records.stationObservations.length} station records<br />{data.timeline.length} timeline entries</p></div></div>
        <div className="rounded-2xl border border-brand-gray/60 bg-white p-5 sm:p-6"><h3 className="font-semibold text-brand-olive">Evidence summary</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{reportMetrics(data).map(([label, value, classification]) => <div key={label} className="rounded-xl border border-brand-gray/60 bg-brand-offWhite p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-brand-olive/45">{classification}</p><p className="mt-2 text-xs text-brand-olive/55">{label}</p><p className="mt-1 font-semibold text-brand-olive">{value}</p></div>)}</div><p className="mt-4 text-sm leading-relaxed text-brand-olive/70">{buildEvidenceSummary(data)}</p></div>
        <div className="rounded-2xl border border-brand-gray/60 bg-white p-5 sm:p-6"><h3 className="font-semibold text-brand-olive">Weather-event timeline</h3>{data.timeline.length ? <ol className="mt-4 border-l border-brand-gray pl-5">{data.timeline.map((entry) => <li key={entry.id} className="relative pb-5 last:pb-0"><span className="absolute -left-[24.5px] top-1.5 h-2 w-2 rounded-full bg-brand-olive ring-4 ring-white" /><div className="flex flex-wrap items-center gap-2"><ClassificationPill value={entry.classification} /><time className="text-[10px] text-brand-olive/45">{readableEvidenceDate(entry.timestamp, data.property.timeZone)}</time></div><p className="mt-2 text-sm font-semibold text-brand-olive">{entry.title}</p><p className="mt-1 text-xs leading-relaxed text-brand-olive/60">{entry.explanation}</p><p className="mt-1 text-[10px] text-brand-olive/40">{entry.source}{typeof entry.distanceMilesFromProperty === "number" ? ` · ${entry.distanceMilesFromProperty.toFixed(1)} miles from property` : ""}</p></li>)}</ol> : <p className="mt-4 text-sm text-brand-olive/55">No timeline records were returned.</p>}</div>
        {data.dataQualityWarnings.length > 0 && <div className="rounded-2xl border border-amber-700/20 bg-amber-50 p-5"><h3 className="flex items-center gap-2 font-semibold text-brand-olive"><AlertTriangle className="h-4 w-4 text-amber-800" />Data-quality notices</h3><ul className="mt-3 space-y-2 pl-5 text-xs leading-relaxed text-brand-olive/65">{data.dataQualityWarnings.map((warning) => <li className="list-disc" key={warning}>{warning}</li>)}</ul></div>}
        <div className="rounded-2xl border border-brand-gray/60 bg-white p-5 sm:p-6"><h3 className="font-semibold text-brand-olive">Source appendix</h3><div className="mt-4 divide-y divide-brand-gray/70 border-y border-brand-gray/70">{data.sources.map((source) => <div key={source.id} className="grid gap-1 py-4 text-sm sm:grid-cols-[1fr_.65fr_1.5fr] sm:gap-4"><div><p className="font-semibold text-brand-olive">{source.provider}</p><a href={source.sourceUrl} target="_blank" rel="noreferrer" className="text-[10px] text-brand-olive/45 underline">{source.dataset}</a></div><p className="text-xs text-brand-olive/65">{sourceStatus(source.status)} · {source.recordCount}<br />{readableEvidenceDate(source.retrievedAt, data.property.timeZone)}</p><p className="text-xs leading-relaxed text-brand-olive/50">{source.message ?? source.limitations[0]}</p></div>)}</div></div>
        <div className="rounded-2xl border border-brand-gray/60 bg-white p-5 sm:p-6"><h3 className="font-semibold text-brand-olive">Methodology and limitations</h3><ul className="mt-4 space-y-2 pl-5 text-xs leading-relaxed text-brand-olive/60">{data.limitations.map((limitation) => <li key={limitation} className="list-disc">{limitation}</li>)}</ul><p className="mt-4 border-t border-brand-gray pt-4 text-[11px] text-brand-olive/45">Provider retrieval times, record identifiers, distances, and classifications are retained in the downloaded package.</p></div>
        {onStartNewSearch && <Button onClick={onStartNewSearch} variant="outline" className="mx-auto flex border-brand-gray text-brand-olive"><RefreshCw className="mr-2 h-4 w-4" /> Start new search</Button>}
    </section>;
}
