import { redirect } from "next/navigation";
import Link from "next/link";
import {
    ArrowRight,
    Building2,
    CalendarDays,
    Check,
    CloudRain,
    FileCheck2,
    Home,
    Image,
    MapPin,
    MapPinned,
    Radar,
    ShieldAlert,
    Wind,
} from "lucide-react";
import PublicHeader from "@/components/public-header";
import PublicFooter from "@/components/public-footer";
import TrackedLink from "@/components/tracked-link";
import { legacyHomeownerQuery, SearchParamValue } from "@/lib/routing";

const evidenceCategories = [
    [Wind, "Observed station conditions", "Measured wind and precipitation from nearby stations."],
    [Radar, "Local storm reports", "Observed measurements and reported events remain clearly classified."],
    [ShieldAlert, "Historical warning polygons", "Official warned areas are checked against the property point."],
    [CloudRain, "Precipitation context", "Event-day and antecedent totals provide surrounding context."],
    [Image, "Available imagery context", "Archive availability is documented with clear resolution limits."],
    [FileCheck2, "Sources and limitations", "Retrieval status and caveats stay attached to the evidence."],
] as const;

function EvidenceHeroPreview() {
    return (
        <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(212,243,94,0.16),transparent_65%)] blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-brand-offWhite text-brand-olive shadow-[0_32px_90px_-36px_rgba(0,0,0,0.75)]">
                <div className="flex items-center justify-between border-b border-brand-olive/10 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-olive text-brand-lime">
                            <FileCheck2 className="h-4 w-4" />
                        </span>
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-olive/45">Evidence package</p>
                            <p className="mt-0.5 text-sm font-semibold">Event overview</p>
                        </div>
                    </div>
                    <span className="rounded-full bg-brand-lime/45 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em]">Fictional demo</span>
                </div>

                <div className="px-5 pt-5 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-olive/40">Subject property</p>
                            <p className="mt-1 text-base font-semibold tracking-tight">1450 Sample Ridge Road</p>
                            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-brand-olive/50"><MapPin className="h-3 w-3" /> Cedar Rapids, Iowa</p>
                        </div>
                        <p className="flex items-center gap-1.5 text-[11px] font-medium text-brand-olive/55"><CalendarDays className="h-3.5 w-3.5" /> May 21, 2024</p>
                    </div>

                    <div className="relative mt-5 overflow-hidden rounded-2xl bg-brand-olive text-white">
                        <svg viewBox="0 0 520 205" className="h-[190px] w-full" aria-hidden="true">
                            <defs>
                                <pattern id="evidence-grid" width="42" height="42" patternUnits="userSpaceOnUse">
                                    <path d="M 42 0 L 0 0 0 42" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
                                </pattern>
                                <filter id="property-glow" x="-100%" y="-100%" width="300%" height="300%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                </filter>
                            </defs>
                            <rect width="520" height="205" fill="url(#evidence-grid)" />
                            <path d="M-15 154 C78 114 132 176 220 131 S384 66 545 91" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="14" />
                            <path d="M-15 154 C78 114 132 176 220 131 S384 66 545 91" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1.5" strokeDasharray="5 8" />
                            <path d="M-8 42 C82 61 126 13 218 32 S366 132 532 151" fill="none" stroke="rgba(255,255,255,.09)" strokeWidth="1" />
                            <polygon points="98,41 364,23 452,112 338,177 126,154 69,91" fill="rgba(212,243,94,.18)" stroke="#D4F35E" strokeWidth="1.5" strokeDasharray="6 5" />
                            <circle cx="284" cy="104" r="19" fill="rgba(212,243,94,.28)" filter="url(#property-glow)" />
                            <circle cx="284" cy="104" r="8" fill="#D4F35E" stroke="#333629" strokeWidth="4" />
                            <circle cx="176" cy="134" r="4" fill="white" opacity=".75" />
                            <path d="M176 134 L268 108" stroke="rgba(255,255,255,.35)" strokeWidth="1" strokeDasharray="3 5" />
                        </svg>

                        <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-brand-olive/85 px-3 py-2 backdrop-blur">
                            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-brand-lime">Archived NWS warning</p>
                            <p className="mt-1 text-[10px] text-white/60">Property point inside polygon</p>
                        </div>
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold text-brand-olive shadow-lg">
                            <span className="h-2 w-2 rounded-full bg-brand-lime ring-2 ring-brand-olive" /> Subject property
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-brand-olive/10 mx-5 mt-5 overflow-hidden rounded-xl border border-brand-olive/10 sm:mx-6">
                    <div className="bg-white p-4">
                        <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-brand-olive/40"><Wind className="h-3 w-3" /> Observed nearby</p>
                        <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">51.8 <span className="text-xs tracking-normal text-brand-olive/45">mph</span></p>
                        <p className="mt-1 text-[10px] text-brand-olive/45">KCID station · 7.2 mi S</p>
                    </div>
                    <div className="bg-white p-4">
                        <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-brand-olive/40"><CloudRain className="h-3 w-3" /> Reported nearby</p>
                        <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">1.25 <span className="text-xs tracking-normal text-brand-olive/45">in hail</span></p>
                        <p className="mt-1 text-[10px] text-brand-olive/45">Local storm report · 2.7 mi NE</p>
                    </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
                    <div className="flex items-center gap-2 text-[10px] text-brand-olive/50">
                        <span className="flex -space-x-1.5">
                            {["N", "I", "C"].map((source) => <span key={source} className="grid h-5 w-5 place-items-center rounded-full border-2 border-brand-offWhite bg-brand-olive text-[7px] font-bold text-white">{source}</span>)}
                        </span>
                        NWS, IEM, and Copernicus archives
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold">4 sources documented</span>
                </div>
            </div>
        </div>
    );
}

export default function HomePage({ searchParams = {} }: { searchParams?: Record<string, SearchParamValue> }) {
    const legacyDestination = legacyHomeownerQuery(searchParams);
    if (legacyDestination) redirect(legacyDestination);

    return (
        <div className="min-h-screen bg-brand-offWhite">
            <PublicHeader />
            <main>
                <section className="overflow-hidden bg-brand-olive text-white">
                    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:py-28">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-lime">Property weather evidence</p>
                            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-medium leading-[1.04] tracking-[-0.04em] sm:text-6xl">Weather evidence for property damage claims</h1>
                            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg">Review official observations, nearby storm reports, warnings, precipitation, and available imagery for your property—or organize the same evidence for a client file.</p>
                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/48">ClaimDefender organizes evidence. It does not determine damage, causation, insurance coverage, or claim outcome.</p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <TrackedLink event="homeowner_path_selected" href="/homeowners#investigation" className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-lime px-6 text-sm font-bold text-brand-olive hover:bg-brand-limeLight">Check My Property <ArrowRight className="ml-2 h-4 w-4" /></TrackedLink>
                                <TrackedLink event="professional_path_selected" href="/professionals" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white hover:bg-white/10">Explore Professional Tools</TrackedLink>
                            </div>
                            <Link href="/sample-report" className="mt-5 inline-block text-sm text-brand-lime underline-offset-4 hover:underline">View a Sample Evidence Package</Link>
                        </div>
                        <EvidenceHeroPreview />
                    </div>
                </section>

                <section id="product" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-olive/50">One evidence platform, two experiences</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-olive sm:text-4xl">Choose the journey built for your work.</h2></div>
                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        <article className="rounded-3xl border border-brand-gray bg-white p-7 shadow-[0_18px_50px_-40px_rgba(51,54,41,.45)] sm:p-9"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-lime/35"><Home className="h-5 w-5" /></span><p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-brand-olive/45">For property owners</p><h3 className="mt-2 text-2xl font-semibold tracking-tight">Understand what weather records show around your property.</h3><ul className="mt-6 space-y-3 text-sm text-brand-olive/65">{["Search by property and approximate date", "Review nearby observations and storm reports", "Preview a sourced property evidence report", "No account required in the demo"].map((point) => <li key={point} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0" />{point}</li>)}</ul><TrackedLink event="homeowner_path_selected" href="/homeowners" className="mt-8 inline-flex items-center text-sm font-bold text-brand-olive">Check My Property <ArrowRight className="ml-2 h-4 w-4" /></TrackedLink></article>
                        <article className="rounded-3xl bg-brand-olive p-7 text-white shadow-[0_22px_55px_-35px_rgba(51,54,41,.7)] sm:p-9"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-lime text-brand-olive"><Building2 className="h-5 w-5" /></span><p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-brand-lime">For claim professionals</p><h3 className="mt-2 text-2xl font-semibold tracking-tight">Create client-ready weather evidence packages.</h3><ul className="mt-6 space-y-3 text-sm text-white/65">{["Organize evidence for multiple client properties", "Preserve client and claim context", "Maintain a searchable package history", "Preview organization-branded reports"].map((point) => <li key={point} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime" />{point}</li>)}</ul><TrackedLink event="professional_path_selected" href="/professionals/workspace" className="mt-8 inline-flex items-center text-sm font-bold text-brand-lime">Open Professional Demo <ArrowRight className="ml-2 h-4 w-4" /></TrackedLink></article>
                    </div>
                </section>

                <section className="border-y border-brand-gray bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><div className="text-center"><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-olive/45">Shared workflow</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">From property to organized evidence.</h2></div><ol className="mt-12 grid gap-5 md:grid-cols-3">{[["01", "Select a property and loss date", "Use the same guided location and date tools in either journey."], ["02", "Review sourced weather evidence", "Keep observations, reports, warnings, and context distinct."], ["03", "Prepare an evidence package", "Homeowners get a guided report; professionals add client and organization context."]].map(([number, title, copy]) => <li key={number} className="rounded-2xl border border-brand-gray bg-brand-offWhite p-6"><span className="text-xs font-bold text-brand-olive/35">{number}</span><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-brand-olive/55">{copy}</p></li>)}</ol></div>
                </section>

                <section id="methodology" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-olive/45">Evidence credibility</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Facts keep their source and classification.</h2><p className="mt-4 text-sm leading-relaxed text-brand-olive/60">The methodology separates measurements, nearby reports, warned areas, and contextual records because they answer different questions.</p></div><div className="grid gap-3 sm:grid-cols-2">{evidenceCategories.map(([Icon, title, copy]) => <article key={title} className="rounded-2xl border border-brand-gray bg-white p-5"><Icon className="h-5 w-5" /><h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="mt-2 text-xs leading-relaxed text-brand-olive/55">{copy}</p></article>)}</div></div>
                </section>

                <section className="bg-brand-lime/20"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-olive/45">Proof of output</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">See the report before running a search.</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-olive/60">Open a fictional package showing the evidence timeline, source appendix, methodology, and limitations.</p></div><Link href="/sample-report" className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-olive px-5 text-sm font-bold text-white">View Sample Report <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>

                <section className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6"><MapPinned className="mx-auto h-6 w-6 text-brand-olive/40" /><p className="mt-4 text-sm leading-relaxed text-brand-olive/55">ClaimDefender organizes publicly available evidence. It does not determine insurance coverage, establish physical damage, replace an inspection, or provide legal or engineering advice.</p></section>
            </main>
            <PublicFooter />
        </div>
    );
}
