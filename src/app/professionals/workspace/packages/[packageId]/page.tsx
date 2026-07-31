"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CalendarDays, Edit3, FileText, MapPin, Plus, RefreshCw, Save, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/date-picker";
import LocationPicker from "@/components/location-picker";
import { useDemoWorkspace } from "@/components/demo-workspace-provider";
import PackageStatus from "@/components/package-status";
import OfficialReport from "@/components/official-report";
import { EvidenceStateNotice } from "@/components/evidence-state-notice";
import { EvidenceSummary, EvidenceTimeline, SourcesAndLimitations, SupportingEvidence } from "@/components/results-dashboard";
import LoadingState from "@/components/loading-state";
import { useEvidenceSearch } from "@/hooks/use-evidence-search";
import { DemoEvidencePackage } from "@/lib/demo-workspace";

type PackageTab = "summary" | "timeline" | "supporting" | "report";

function PackageEditor({ record, onSave, onCancel }: { record: DemoEvidencePackage; onSave: (record: DemoEvidencePackage) => void; onCancel: () => void }) {
    const [client, setClient] = useState(record.client.displayName);
    const [clientReference, setClientReference] = useState(record.client.reference ?? "");
    const [claimReference, setClaimReference] = useState(record.claim.claimReference ?? "");
    const [carrier, setCarrier] = useState(record.claim.carrier ?? "");
    const [eventType, setEventType] = useState(record.claim.eventType ?? "");
    const [notes, setNotes] = useState(record.claim.notes ?? "");
    const [address, setAddress] = useState(record.property.address ?? "");
    const [latitude, setLatitude] = useState<number | null>(record.property.latitude ?? null);
    const [longitude, setLongitude] = useState<number | null>(record.property.longitude ?? null);
    const [date, setDate] = useState<Date | undefined>(() => {
        if (!record.property.estimatedDateOfDamage) return undefined;
        const parsed = new Date(record.property.estimatedDateOfDamage);
        return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    });
    const save = () => onSave({ ...record, client: { displayName: client.trim(), reference: clientReference.trim() || undefined }, claim: { claimReference: claimReference.trim() || undefined, carrier: carrier.trim() || undefined, eventType: eventType.trim() || undefined, notes: notes.trim() || undefined }, property: { ...record.property, address: address.trim() || undefined, latitude: latitude ?? undefined, longitude: longitude ?? undefined, estimatedDateOfDamage: date?.toISOString() }, updatedAt: new Date().toISOString() });
    return <section className="rounded-2xl border border-brand-gray bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Edit package details</h2><p className="mt-1 text-xs text-brand-olive/50">Metadata changes do not rerun or alter stored weather evidence.</p></div><Button variant="ghost" onClick={onCancel}>Cancel</Button></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{[["Client display name", client, setClient], ["Client reference", clientReference, setClientReference], ["Claim / internal reference", claimReference, setClaimReference], ["Insurance carrier", carrier, setCarrier], ["Event type", eventType, setEventType]].map(([label, value, setter], index) => { const id = `edit-field-${index}`; return <div key={String(label)} className="space-y-2"><label htmlFor={id} className="text-xs font-semibold">{label as string}</label><Input id={id} value={value as string} onChange={(event) => (setter as (next: string) => void)(event.target.value)} /></div>; })}<div className="space-y-2"><span className="text-xs font-semibold">Approximate date of loss</span><DatePicker date={date} onDateChange={setDate} /></div><div className="space-y-2 sm:col-span-2"><span className="text-xs font-semibold">Property location</span><div className="min-h-[300px] overflow-hidden rounded-xl border border-brand-gray"><LocationPicker latitude={latitude} longitude={longitude} selectedAddress={address || undefined} onLocationChange={(lat, lng, displayAddress) => { setLatitude(lat); setLongitude(lng); setAddress(displayAddress ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`); }} /></div><p className="text-[11px] text-brand-olive/45">Selecting a search result or map point saves the coordinates required to run evidence.</p></div><div className="space-y-2 sm:col-span-2"><label htmlFor="edit-notes" className="text-xs font-semibold">Internal notes</label><textarea id="edit-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm" /></div></div><Button onClick={save} className="mt-5 bg-brand-lime font-bold text-brand-olive hover:bg-brand-limeLight"><Save className="mr-2 h-4 w-4" />Save Details</Button></section>;
}

export default function ProfessionalPackagePage({ params }: { params: { packageId: string } }) {
    const { workspace, loading, storageError, savePackage } = useDemoWorkspace();
    const search = useEvidenceSearch();
    const [tab, setTab] = useState<PackageTab>("summary");
    const [editing, setEditing] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const record = workspace?.packages.find((item) => item.id === params.packageId);

    useEffect(() => {
        if (record?.status === "searching" && !search.isPending) setActionError("This browser session did not finish the previous search. Refresh evidence to try again.");
    }, [record?.status, search.isPending]);

    const refreshEvidence = () => {
        if (!record) return;
        const { latitude, longitude, estimatedDateOfDamage } = record.property;
        if (typeof latitude !== "number" || typeof longitude !== "number" || !estimatedDateOfDamage) {
            setActionError("Select valid property coordinates and a date in Edit Details before running evidence.");
            return;
        }
        setActionError(null);
        const searching = { ...record, status: "searching" as const, updatedAt: new Date().toISOString() };
        savePackage(searching);
        search.mutate({ latitude, longitude, estimatedDateOfDamage }, {
            onSuccess: (evidence) => savePackage({ ...searching, status: "evidence_ready", evidence, updatedAt: new Date().toISOString() }),
            onError: () => {
                savePackage({ ...record, status: "needs_refresh", updatedAt: new Date().toISOString() });
                setActionError("Weather retrieval failed. Package details and the previous evidence response, if any, were preserved.");
            },
        });
    };

    const markReportPreviewed = useCallback(() => {
        if (!record || record.status === "report_previewed") return;
        savePackage({ ...record, status: "report_previewed", reportPreviewedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }, [record, savePackage]);

    if (loading) return <p role="status">Loading browser-local package…</p>;
    if (!workspace || !record) return <div className="rounded-2xl border border-brand-gray bg-white p-8 text-center"><AlertCircle className="mx-auto h-7 w-7 text-brand-olive/45" /><h1 className="mt-4 text-xl font-semibold">Evidence package not found</h1><p className="mt-2 text-sm text-brand-olive/55">It may have been deleted, the browser-local workspace may have been reset, or the link may be invalid.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/professionals/workspace/packages" className="inline-flex h-10 items-center justify-center rounded-xl border border-brand-gray px-4 text-sm font-semibold">Return to packages</Link><Link href="/professionals/workspace/packages/new" className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-lime px-4 text-sm font-bold">Start new package</Link></div></div>;

    const { evidence } = record;
    const reportReady = evidence && typeof record.property.latitude === "number" && typeof record.property.longitude === "number" && record.property.estimatedDateOfDamage;
    return <div className="space-y-7"><header className="rounded-2xl border border-brand-gray bg-white p-5 sm:p-7"><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-brand-lime/30 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider">Demo</span>{record.isSample && <span className="rounded-full bg-brand-offWhite px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-brand-olive/50">Fictional sample data</span>}<PackageStatus status={record.status} /></div><h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{record.client.displayName || "Untitled client package"}</h1><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-brand-olive/55"><span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{record.property.address || "Property not selected"}</span><span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{record.property.estimatedDateOfDamage ? new Date(record.property.estimatedDateOfDamage).toLocaleDateString() : "Date not selected"}</span></div><p className="mt-2 text-xs text-brand-olive/40">Package {record.id} · Updated {new Date(record.updatedAt).toLocaleString()}</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setEditing((value) => !value)}><Edit3 className="mr-2 h-4 w-4" />Edit Details</Button><Button onClick={() => { setTab("report"); }} disabled={!reportReady} className="bg-brand-lime font-bold text-brand-olive hover:bg-brand-limeLight"><FileText className="mr-2 h-4 w-4" />Preview Report</Button><Link href="/professionals/workspace/packages/new" className="inline-flex h-10 items-center rounded-md border border-brand-gray px-4 text-sm font-medium"><Plus className="mr-2 h-4 w-4" />Start New Package</Link></div></div></header>
        {(storageError || actionError) && <p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">{storageError || actionError}</p>}
        {editing && <PackageEditor record={record} onCancel={() => setEditing(false)} onSave={(updated) => { if (savePackage(updated)) setEditing(false); }} />}
        <section className="grid gap-3 rounded-2xl border border-brand-gray bg-white p-5 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40">Organization</p><p className="mt-1 text-sm font-semibold">{workspace.organization.name}</p></div>{[["Prepared by", workspace.organization.preparedBy], ["Carrier", record.claim.carrier], ["Reference", record.claim.claimReference ?? record.client.reference], ["Property type", record.property.propertyType], ["Event type", record.claim.eventType]].filter(([, value]) => Boolean(value)).map(([label, value]) => <div key={label}><p className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40">{label}</p><p className="mt-1 text-sm">{value}</p></div>)}</section>
        {search.isPending && <div className="rounded-2xl border border-brand-gray bg-white p-5"><LoadingState /></div>}
        {!search.isPending && <><nav aria-label="Package evidence sections" className="flex gap-1 overflow-x-auto rounded-xl border border-brand-gray bg-white p-1">{[["summary", "Summary"], ["timeline", "Timeline"], ["supporting", "Supporting Records"], ["report", "Report Preview"]].map(([value, label]) => <button key={value} type="button" onClick={() => setTab(value as PackageTab)} disabled={value !== "summary" && !evidence} aria-current={tab === value ? "page" : undefined} className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold ${tab === value ? "bg-brand-olive text-white" : "text-brand-olive/55 hover:bg-brand-offWhite disabled:opacity-35"}`}>{label}</button>)}</nav>
            {!evidence ? <div className="rounded-2xl border border-brand-gray bg-white p-8 text-center"><UserRound className="mx-auto h-7 w-7 text-brand-olive/40" /><h2 className="mt-4 font-semibold">{record.status === "needs_refresh" ? "Evidence needs to be refreshed" : "This package is still a draft"}</h2><p className="mt-2 text-sm text-brand-olive/55">Package metadata is saved. A complete property location and date are required before weather records can be retrieved.</p><Button onClick={refreshEvidence} className="mt-5 bg-brand-lime font-bold text-brand-olive hover:bg-brand-limeLight"><RefreshCw className="mr-2 h-4 w-4" />Run Evidence Search</Button></div> : <div className="space-y-5">{tab === "summary" && <><EvidenceStateNotice data={evidence} /><EvidenceSummary data={evidence} audience="professional" /><div className="flex justify-end"><Button variant="outline" onClick={refreshEvidence}><RefreshCw className="mr-2 h-4 w-4" />Refresh Evidence</Button></div></>}{tab === "timeline" && <EvidenceTimeline data={evidence} audience="professional" initiallyExpanded />}{tab === "supporting" && <><SupportingEvidence data={evidence} audience="professional" /><SourcesAndLimitations data={evidence} expanded /></>}{tab === "report" && reportReady && <OfficialReport report={{ data: evidence, latitude: record.property.latitude as number, longitude: record.property.longitude as number, date: new Date(record.property.estimatedDateOfDamage as string), address: record.property.address }} context={{ audience: "professional", organization: workspace.organization, client: record.client, claim: record.claim, packageId: record.id }} onReportPreviewed={markReportPreviewed} />}</div>}</>}
    </div>;
}
