import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, Check, CheckCircle2, CloudRain, FileCheck2, Files, FileText, MapPin, Repeat2, ShieldAlert, Users, Wind } from "lucide-react";
import PublicHeader from "@/components/public-header";
import PublicFooter from "@/components/public-footer";

const pillars = [
    [Repeat2, "Repeatable investigation", "Start with a client, property, and date of loss."],
    [Files, "Organized evidence", "Preserve the source-backed timeline and supporting records in one package."],
    [FileText, "Client-ready output", "Preview a structured report with organization and claim context."],
    [Users, "Package history", "Return to drafts and completed demo investigations from one workspace."],
] as const;

function ProfessionalHeroPreview() {
    return <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(212,243,94,0.15),transparent_64%)] blur-2xl" />
        <div className="relative overflow-hidden rounded-[1.55rem] bg-brand-offWhite text-brand-olive shadow-[0_34px_90px_-38px_rgba(0,0,0,0.8)]">
                <div className="flex items-center justify-between gap-4 border-b border-brand-olive/10 bg-white px-5 py-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-olive text-brand-lime"><Building2 className="h-4 w-4" /></span>
                        <div className="min-w-0"><p className="truncate text-sm font-semibold">Harbor Property Claims</p><p className="mt-0.5 text-[10px] text-brand-olive/45">Professional evidence workspace</p></div>
                    </div>
                    <span className="shrink-0 rounded-full bg-brand-lime/45 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em]">Fictional demo</span>
                </div>

                <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-brand-olive/40">Active client package</p><h2 className="mt-1.5 text-lg font-semibold tracking-tight">Sample Client A</h2><p className="mt-1 text-[10px] text-brand-olive/45">Claim ref. DEMO-2405 · Wind and hail</p></div>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-700/15 bg-emerald-50 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-emerald-800"><CheckCircle2 className="h-3 w-3" />Evidence ready</span>
                    </div>

                    <div className="mt-5 rounded-2xl border border-brand-olive/10 bg-white p-4 shadow-[0_14px_35px_-30px_rgba(51,54,41,0.7)]">
                        <div className="flex items-start gap-3"><span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-lime/35"><MapPin className="h-3.5 w-3.5" /></span><div><p className="text-xs font-semibold">1450 Sample Ridge Road</p><p className="mt-1 text-[10px] text-brand-olive/45">Cedar Rapids, Iowa</p></div></div>
                        <div className="mt-4 flex items-center gap-2 border-t border-brand-olive/8 pt-3 text-[10px] text-brand-olive/50"><CalendarDays className="h-3.5 w-3.5" />Requested loss date · May 21, 2024</div>
                    </div>

                    <div className="mt-5 flex items-center justify-between"><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-brand-olive/40">Evidence snapshot</p><p className="text-[10px] font-medium text-brand-olive/45">4 source collections</p></div>
                    <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
                        <div className="rounded-xl border border-brand-olive/10 bg-white p-3"><Wind className="h-3.5 w-3.5 text-brand-olive/50" /><p className="mt-3 text-lg font-semibold tracking-[-0.04em]">51.8 <span className="text-[9px] tracking-normal text-brand-olive/45">mph</span></p><p className="mt-1 text-[9px] leading-snug text-brand-olive/45">KCID observation<br />7.2 mi south</p></div>
                        <div className="rounded-xl border border-brand-olive/10 bg-white p-3"><CloudRain className="h-3.5 w-3.5 text-brand-olive/50" /><p className="mt-3 text-lg font-semibold tracking-[-0.04em]">1.25 <span className="text-[9px] tracking-normal text-brand-olive/45">in hail</span></p><p className="mt-1 text-[9px] leading-snug text-brand-olive/45">Local storm report<br />2.7 mi northeast</p></div>
                        <div className="rounded-xl border border-brand-olive/10 bg-white p-3"><ShieldAlert className="h-3.5 w-3.5 text-brand-olive/50" /><p className="mt-3 text-sm font-semibold leading-tight tracking-tight">Inside polygon</p><p className="mt-2 text-[9px] leading-snug text-brand-olive/45">Archived NWS<br />warning record</p></div>
                    </div>

                    <Link href="/sample-report?audience=professional" aria-label="View the fictional sample professional evidence report" className="mt-5 block rounded-2xl bg-brand-olive px-4 py-3.5 text-white transition-colors hover:bg-brand-oliveDark">
                        <div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-lime text-brand-olive"><FileCheck2 className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-[9px] font-bold uppercase tracking-[0.15em] text-brand-lime">Client-ready deliverable</p><p className="mt-1 truncate text-xs font-semibold">Professional evidence report</p></div><ArrowRight className="h-4 w-4 shrink-0 text-brand-lime" /></div>
                    </Link>
                </div>

                <div className="flex flex-col gap-2 border-t border-brand-olive/10 bg-white px-5 py-3.5 text-[9px] text-brand-olive/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <span className="flex items-center gap-1.5"><Check className="h-3 w-3" />Sources and limitations stay attached</span>
                    <span>NWS · IEM · Copernicus</span>
                </div>
        </div>
    </div>;
}

export default function ProfessionalsPage() {
    return <div className="min-h-screen bg-brand-offWhite"><PublicHeader /><main>
        <section className="overflow-hidden bg-brand-olive text-white"><div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:py-28"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-brand-lime">For property-claim professionals · Demo</p><h1 className="mt-5 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-6xl">Create client-ready weather evidence packages.</h1><p className="mt-6 max-w-2xl text-base leading-relaxed text-white/68">Organize observations, storm reports, warnings, precipitation, and source documentation for multiple client properties from one repeatable workspace.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/professionals/workspace" className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-lime px-6 text-sm font-bold text-brand-olive">Open Demo Workspace <ArrowRight className="ml-2 h-4 w-4" /></Link><Link href="/sample-report?audience=professional" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 text-sm font-semibold text-white">View Professional Report</Link></div><p className="mt-4 text-xs text-white/45">No account required. Demo records are stored only in this browser.</p></div><ProfessionalHeroPreview /></div></section>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-olive/45">Built for repeated evidence preparation</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">One focused workflow around the shared evidence engine.</h2><p className="mt-4 text-sm leading-relaxed text-brand-olive/60">For public adjusters, roofing companies, restoration contractors, and insurance attorneys—without pretending to replace the claim-management tools they already use.</p></div><div className="mt-10 grid gap-4 md:grid-cols-2">{pillars.map(([Icon, title, copy]) => <article key={title} className="rounded-2xl border border-brand-gray bg-white p-6"><Icon className="h-5 w-5" /><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-brand-olive/55">{copy}</p></article>)}</div></section>
        <section className="border-y border-brand-gray bg-white"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8"><div><h2 className="text-2xl font-semibold tracking-tight">A weather-evidence workspace, not a claims CRM.</h2><p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-olive/60">ClaimDefender complements existing workflows. It does not demonstrate carrier communications, tasks, settlement management, commissions, team accounts, or full document management.</p><p className="mt-4 flex gap-2 text-xs text-brand-olive/55"><CheckCircle2 className="h-4 w-4" />Browser-local sample organization and fictional packages are ready on entry.</p></div><Link href="/professionals/workspace" className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-olive px-5 text-sm font-bold text-white">Open Demo Workspace</Link></div></section>
    </main><PublicFooter /></div>;
}
