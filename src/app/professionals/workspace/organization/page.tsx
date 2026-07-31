"use client";
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useState } from "react";
import { Building2, ImagePlus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDemoWorkspace } from "@/components/demo-workspace-provider";
import { createSampleWorkspace, DemoOrganization } from "@/lib/demo-workspace";

const MAX_LOGO_BYTES = 400 * 1024;
const SUPPORTED_LOGO_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

function OrganizationForm({ initial }: { initial: DemoOrganization }) {
    const { saveOrganization, resetWorkspace, storageError } = useDemoWorkspace();
    const [organization, setOrganization] = useState(initial);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const update = (field: keyof DemoOrganization, value: string | undefined) => setOrganization((current) => ({ ...current, [field]: value }));
    const uploadLogo = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setMessage(null);
        if (!SUPPORTED_LOGO_TYPES.has(file.type)) { setError("Use a PNG, JPEG, WebP, GIF, or SVG logo file."); event.target.value = ""; return; }
        if (file.size > MAX_LOGO_BYTES) { setError("The logo must be smaller than 400 KB so it can remain safely in browser storage."); event.target.value = ""; return; }
        const reader = new FileReader();
        reader.onerror = () => setError("The logo could not be read. Try another file.");
        reader.onload = () => { if (typeof reader.result === "string") { update("logoDataUrl", reader.result); setError(null); setMessage("Logo is ready to save locally."); } };
        reader.readAsDataURL(file);
    };
    const save = () => {
        if (!organization.name.trim()) { setError("Organization name is required."); return; }
        if (saveOrganization({ ...organization, name: organization.name.trim() })) { setError(null); setMessage("Organization settings were saved in this browser."); }
    };
    const restoreOrganization = () => { const sample = createSampleWorkspace().organization; setOrganization(sample); if (saveOrganization(sample)) { setError(null); setMessage("The fictional sample organization was restored. Packages were not changed."); } };
    const resetAll = () => { if (window.confirm("Reset the entire demo workspace? All browser-local organization changes and packages will be removed and the original fictional samples restored.")) { if (resetWorkspace()) { setOrganization(createSampleWorkspace().organization); setMessage("The original fictional demo workspace was restored."); setError(null); } } };
    return <div className="space-y-7"><header><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-olive/45">Demo Workspace · Organization</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Organization settings</h1><p className="mt-2 max-w-3xl text-sm leading-relaxed text-brand-olive/55">Customize how professional demo reports are framed. These values and any logo stay in this browser.</p></header>
        {(error || storageError) && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error || storageError}</p>}{message && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{message}</p>}
        <section className="rounded-2xl border border-brand-gray bg-white p-5 sm:p-7"><div className="flex items-center gap-3 border-b border-brand-gray pb-5"><Building2 className="h-5 w-5" /><div><h2 className="font-semibold">Report identity</h2><p className="text-xs text-brand-olive/45">Optional contact fields are shown only when supplied.</p></div></div><div className="mt-6 grid gap-5 sm:grid-cols-2">{[["Organization name", "name", false], ["Prepared-by name", "preparedBy", true], ["Email", "email", true], ["Phone", "phone", true], ["Website", "website", true]].map(([label, field, optional]) => <div key={String(field)} className="space-y-2"><label htmlFor={`organization-${field}`} className="text-xs font-semibold">{label as string} {optional && <span className="font-normal text-brand-olive/40">Optional</span>}</label><Input id={`organization-${field}`} type={field === "email" ? "email" : field === "website" ? "url" : "text"} value={(organization[field as keyof DemoOrganization] as string | undefined) ?? ""} onChange={(event) => update(field as keyof DemoOrganization, event.target.value || undefined)} /></div>)}<div className="space-y-2"><label htmlFor="organization-type" className="text-xs font-semibold">Organization type</label><select id="organization-type" value={organization.type} onChange={(event) => update("type", event.target.value)} className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm">{["Public adjuster", "Roofing contractor", "Restoration contractor", "Attorney or law firm", "Other property professional"].map((type) => <option key={type}>{type}</option>)}</select></div></div></section>
        <section className="rounded-2xl border border-brand-gray bg-white p-5 sm:p-7"><div className="flex items-center gap-3"><ImagePlus className="h-5 w-5" /><div><h2 className="font-semibold">Organization logo</h2><p className="text-xs text-brand-olive/45">PNG, JPEG, WebP, GIF, or SVG up to 400 KB. The file is never uploaded.</p></div></div><div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">{organization.logoDataUrl ? <div className="flex h-24 w-44 items-center justify-center rounded-xl border border-brand-gray bg-brand-offWhite p-3"><img src={organization.logoDataUrl} alt="Organization logo preview" className="max-h-full max-w-full object-contain" /></div> : <div className="grid h-24 w-44 place-items-center rounded-xl border border-dashed border-brand-gray bg-brand-offWhite text-xs text-brand-olive/40">No logo selected</div>}<div className="flex flex-wrap gap-2"><label className="inline-flex h-10 cursor-pointer items-center rounded-md border border-brand-gray bg-white px-4 text-sm font-medium"><ImagePlus className="mr-2 h-4 w-4" />Choose local logo<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={uploadLogo} className="sr-only" /></label>{organization.logoDataUrl && <Button variant="outline" onClick={() => { update("logoDataUrl", undefined); setMessage("Logo removed from this draft. Save changes to persist removal."); }}><Trash2 className="mr-2 h-4 w-4" />Remove</Button>}</div></div></section>
        <div className="flex flex-col gap-3 rounded-2xl border border-brand-gray bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-col gap-2 sm:flex-row"><Button variant="outline" onClick={restoreOrganization}><RotateCcw className="mr-2 h-4 w-4" />Restore Sample Organization</Button><Button variant="outline" onClick={resetAll} className="border-red-200 text-red-800 hover:bg-red-50"><Trash2 className="mr-2 h-4 w-4" />Reset Entire Demo Workspace</Button></div><Button onClick={save} className="bg-brand-lime font-bold text-brand-olive hover:bg-brand-limeLight"><Save className="mr-2 h-4 w-4" />Save Changes</Button></div>
    </div>;
}

export default function OrganizationSettingsPage() {
    const { workspace, loading, storageError } = useDemoWorkspace();
    if (loading) return <p role="status">Loading organization settings…</p>;
    if (!workspace) return <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{storageError ?? "Organization settings are unavailable."}</p>;
    return <OrganizationForm key={`${workspace.organization.id}-${workspace.organization.name}`} initial={workspace.organization} />;
}
