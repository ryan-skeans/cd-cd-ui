import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import PublicHeader from "@/components/public-header";
import PublicFooter from "@/components/public-footer";
import ReportPreviewLoader from "@/components/report-preview-loader";
import { createSampleEvidence, SAMPLE_PROPERTY } from "@/lib/sample-evidence";
import { createSampleWorkspace } from "@/lib/demo-workspace";

export default function SampleReportPage({ searchParams }: { searchParams?: { audience?: string } }) {
    const professional = searchParams?.audience === "professional";
    const evidence = createSampleEvidence();
    const workspace = createSampleWorkspace();
    const samplePackage = workspace.packages[0];
    return <div className="min-h-screen bg-brand-offWhite"><PublicHeader /><main><section className="border-b border-brand-gray bg-white"><div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-olive/45"><FileText className="h-4 w-4" />Shared sample report · Demo</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{professional ? "Professional evidence package preview" : "Property evidence report preview"}</h1><p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-olive/55">This search-free preview uses clearly marked fictional records to demonstrate report structure, classifications, source context, methodology, and limitations.</p><div className="mt-5 flex flex-wrap gap-3"><Link href={professional ? "/sample-report" : "/sample-report?audience=professional"} className="inline-flex h-10 items-center rounded-xl border border-brand-gray bg-white px-4 text-sm font-semibold">View {professional ? "homeowner" : "professional"} format</Link><Link href={professional ? "/professionals" : "/homeowners"} className="inline-flex h-10 items-center text-sm font-semibold text-brand-olive/60"><ArrowLeft className="mr-2 h-4 w-4" />Back to {professional ? "professionals" : "homeowners"}</Link></div></div></section><section className="px-4 py-12 sm:px-6 lg:px-8"><ReportPreviewLoader report={{ data: evidence, latitude: SAMPLE_PROPERTY.latitude, longitude: SAMPLE_PROPERTY.longitude, date: new Date(SAMPLE_PROPERTY.date), address: SAMPLE_PROPERTY.address }} context={professional ? { audience: "professional", organization: workspace.organization, client: samplePackage.client, claim: samplePackage.claim, packageId: "SAMPLE-PACKAGE-001" } : { audience: "homeowner" }} /></section></main><PublicFooter /></div>;
}
