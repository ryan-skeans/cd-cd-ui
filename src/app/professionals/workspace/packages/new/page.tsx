"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, ArrowRight, BriefcaseBusiness, FileText, MapPin, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/date-picker";
import LocationPicker from "@/components/location-picker";
import LoadingState from "@/components/loading-state";
import { useDemoWorkspace } from "@/components/demo-workspace-provider";
import { useEvidenceSearch } from "@/hooks/use-evidence-search";
import { createPackageId, DemoEvidencePackage } from "@/lib/demo-workspace";
import { trackDemoEvent } from "@/lib/demo-analytics";

function FieldLabel({ htmlFor, children, optional = false }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
    return <label htmlFor={htmlFor} className="text-xs font-semibold text-brand-olive">{children} <span className="font-normal text-brand-olive/40">{optional ? "Optional" : "Required for search"}</span></label>;
}

export default function NewProfessionalPackagePage() {
    const router = useRouter();
    const { savePackage, storageError } = useDemoWorkspace();
    const search = useEvidenceSearch();
    const [id] = useState(createPackageId);
    const [clientName, setClientName] = useState("");
    const [clientReference, setClientReference] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [date, setDate] = useState<Date | undefined>();
    const [propertyType, setPropertyType] = useState<"residential" | "commercial" | "other" | "">("");
    const [claimReference, setClaimReference] = useState("");
    const [carrier, setCarrier] = useState("");
    const [eventType, setEventType] = useState("");
    const [notes, setNotes] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const makeRecord = (status: DemoEvidencePackage["status"], evidence?: DemoEvidencePackage["evidence"]): DemoEvidencePackage => {
        const now = new Date().toISOString();
        return {
            id,
            isSample: false,
            status,
            client: { displayName: clientName.trim(), reference: clientReference.trim() || undefined },
            claim: { claimReference: claimReference.trim() || undefined, carrier: carrier.trim() || undefined, eventType: eventType.trim() || undefined, notes: notes.trim() || undefined },
            property: { address: address.trim() || undefined, latitude: latitude ?? undefined, longitude: longitude ?? undefined, propertyType: propertyType || undefined, estimatedDateOfDamage: date?.toISOString() },
            evidence,
            createdAt: now,
            updatedAt: now,
        };
    };

    const saveDraft = () => {
        if (!clientName.trim() && !address.trim() && latitude === null && !date) {
            setFormError("Add a client name or some property information before saving this draft.");
            return;
        }
        setFormError(null);
        if (savePackage(makeRecord("draft"))) {
            trackDemoEvent("professional_package_created", { action: "draft" });
            router.push(`/professionals/workspace/packages/${id}`);
        }
    };

    const runSearch = () => {
        if (!clientName.trim() || latitude === null || longitude === null || !date) {
            setFormError("Client name, a selected property location, and date of loss are required to run the evidence search.");
            return;
        }
        setFormError(null);
        const searching = makeRecord("searching");
        if (!savePackage(searching)) return;
        trackDemoEvent("professional_package_created", { action: "search" });
        search.mutate({ latitude, longitude, estimatedDateOfDamage: date.toISOString() }, {
            onSuccess: (evidence) => {
                savePackage({ ...searching, status: "evidence_ready", evidence, updatedAt: new Date().toISOString() });
                trackDemoEvent("professional_search_completed");
                router.push(`/professionals/workspace/packages/${id}`);
            },
            onError: () => {
                savePackage({ ...searching, status: "needs_refresh", updatedAt: new Date().toISOString() });
                setFormError("Weather records could not be retrieved. Your package details were preserved; try again when ready.");
            },
        });
    };

    return <div className="space-y-7"><header><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-olive/45">Demo Workspace · New Package</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Create a client evidence package</h1><p className="mt-2 max-w-3xl text-sm leading-relaxed text-brand-olive/55">Save a partial draft at any time, or select the required property details to run the shared weather-evidence search.</p></header>
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950"><strong>Demo privacy notice:</strong> Use fictional information only. Optional context is included only to demonstrate professional report formatting and remains in this browser.</div>
        {(formError || storageError || search.isError) && <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="h-5 w-5 shrink-0" /><p>{formError || storageError || (search.error instanceof Error ? search.error.message : "The evidence search failed.")}</p></div>}
        {search.isPending && <div className="rounded-2xl border border-brand-gray bg-white p-5"><LoadingState /></div>}
        <form onSubmit={(event) => event.preventDefault()} className="space-y-5" aria-busy={search.isPending}>
            <section className="rounded-2xl border border-brand-gray bg-white p-5 sm:p-7"><div className="flex items-center gap-3 border-b border-brand-gray pb-4"><BriefcaseBusiness className="h-5 w-5" /><div><h2 className="font-semibold">Client</h2><p className="text-xs text-brand-olive/45">Use a display name, not sensitive personal information.</p></div></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><div className="space-y-2"><FieldLabel htmlFor="client-name">Client or policyholder display name</FieldLabel><Input id="client-name" value={clientName} onChange={(event) => setClientName(event.target.value)} autoComplete="off" aria-describedby="client-name-help" /><p id="client-name-help" className="text-[11px] text-brand-olive/45">A client name alone is enough to save a draft.</p></div><div className="space-y-2"><FieldLabel htmlFor="client-reference" optional>Client reference</FieldLabel><Input id="client-reference" value={clientReference} onChange={(event) => setClientReference(event.target.value)} autoComplete="off" /></div></div></section>
            <section className="rounded-2xl border border-brand-gray bg-white p-5 sm:p-7"><div className="flex items-center gap-3 border-b border-brand-gray pb-4"><MapPin className="h-5 w-5" /><div><h2 className="font-semibold">Property and event</h2><p className="text-xs text-brand-olive/45">Location coordinates and a date are required only when running the search.</p></div></div><div className="mt-5 space-y-5"><div><span className="mb-2 block text-xs font-semibold">Property address <span className="font-normal text-brand-olive/40">Required for search</span></span><div className="min-h-[300px] overflow-hidden rounded-xl border border-brand-gray"><LocationPicker latitude={latitude} longitude={longitude} selectedAddress={address || undefined} onLocationChange={(lat, lng, displayAddress) => { setLatitude(lat); setLongitude(lng); setAddress(displayAddress ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`); }} /></div></div><div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><span className="block text-xs font-semibold">Approximate date of loss <span className="font-normal text-brand-olive/40">Required for search</span></span><DatePicker date={date} onDateChange={setDate} /></div><div className="space-y-2"><FieldLabel htmlFor="property-type" optional>Property type</FieldLabel><select id="property-type" value={propertyType} onChange={(event) => setPropertyType(event.target.value as typeof propertyType)} className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"><option value="">Select a type</option><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="other">Other</option></select></div></div></div></section>
            <section className="rounded-2xl border border-brand-gray bg-white p-5 sm:p-7"><div className="flex items-center gap-3 border-b border-brand-gray pb-4"><FileText className="h-5 w-5" /><div><h2 className="font-semibold">Claim context</h2><p className="text-xs text-brand-olive/45">All fields are optional and demonstrate professional report formatting only.</p></div></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><div className="space-y-2"><FieldLabel htmlFor="claim-reference" optional>Claim or internal reference</FieldLabel><Input id="claim-reference" value={claimReference} onChange={(event) => setClaimReference(event.target.value)} autoComplete="off" /></div><div className="space-y-2"><FieldLabel htmlFor="carrier" optional>Insurance carrier</FieldLabel><Input id="carrier" value={carrier} onChange={(event) => setCarrier(event.target.value)} autoComplete="off" /></div><div className="space-y-2"><FieldLabel htmlFor="event-type" optional>Event type</FieldLabel><Input id="event-type" value={eventType} onChange={(event) => setEventType(event.target.value)} placeholder="Wind, hail, precipitation…" /></div><div className="space-y-2 sm:col-span-2"><FieldLabel htmlFor="notes" optional>Internal notes</FieldLabel><textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm" /></div></div></section>
            <div className="flex flex-col-reverse gap-3 rounded-2xl border border-brand-gray bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><Link href="/professionals/workspace/packages" className="text-center text-sm text-brand-olive/55">Cancel</Link><div className="flex flex-col gap-3 sm:flex-row"><Button type="button" variant="outline" onClick={saveDraft} disabled={search.isPending}><Save className="mr-2 h-4 w-4" />Save Draft</Button><Button type="button" onClick={runSearch} disabled={search.isPending} className="bg-brand-lime font-bold text-brand-olive hover:bg-brand-limeLight">Run Evidence Search <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>
        </form>
    </div>;
}
