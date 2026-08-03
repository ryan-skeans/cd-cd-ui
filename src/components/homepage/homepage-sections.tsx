import Link from "next/link";
import {
    ArrowRight,
    Building2,
    CalendarDays,
    Check,
    Database,
    FileText,
    FolderClock,
    Home,
    MapPin,
    Radar,
    Satellite,
    ShieldCheck,
    Wind,
    X,
} from "lucide-react";
import TrackedLink from "@/components/tracked-link";
import WeatherTimelineDemo from "@/components/homepage/weather-timeline-demo";
import { SearchResponse } from "@/lib/types";

const methodologyRows = [
    {
        label: "Measured",
        meaning: "A value observed at a named station or instrument location.",
        context: "Station, timestamp, distance, dataset",
    },
    {
        label: "Reported",
        meaning: "A nearby event report at its reported location.",
        context: "Report type, location, distance, archive",
    },
    {
        label: "Warning",
        meaning: "An archived warned area that included the property point.",
        context: "Issuing office, valid period, polygon status",
    },
    {
        label: "Contextual",
        meaning: "Supporting material that is not a property-level measurement.",
        context: "Capture or model details, quality limits",
    },
] as const;

const useCases = [
    {
        number: "01",
        title: "Review a reported weather date",
        copy: "Bring nearby measurements, reports, warning context, and precipitation into one chronological view around the selected date.",
    },
    {
        number: "02",
        title: "Prepare for a property conversation",
        copy: "Use a source-labeled timeline as additional context when speaking with an adjuster, inspector, roofer, attorney, or other property professional.",
    },
    {
        number: "03",
        title: "Document what the records do—and do not—show",
        copy: "Keep proximity and evidence type visible so a nearby report is not mistaken for a measurement at the structure.",
    },
    {
        number: "04",
        title: "Repeat a consistent professional workflow",
        copy: "Organize client, property, date, timeline, and report context in the browser-local professional demo.",
    },
] as const;

function PropertyStepVisual() {
    return (
        <div aria-hidden="true" className="h-full rounded-2xl border border-brand-gray bg-white p-4 shadow-[0_18px_40px_-34px_rgba(51,54,41,.45)]">
            <div className="flex items-center gap-2 border-b border-brand-gray pb-3 text-[9px] font-bold uppercase tracking-[0.13em] text-brand-olive/75"><MapPin className="h-3.5 w-3.5" /> Search details</div>
            <div className="mt-3 space-y-2">
                <div className="rounded-xl bg-brand-offWhite px-3 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-brand-olive/75">Property</p>
                    <p className="mt-1 text-xs font-semibold text-brand-olive">1450 Sample Ridge Road</p>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                    <div className="rounded-xl bg-brand-offWhite px-3 py-3">
                        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-brand-olive/75">Approximate date</p>
                        <p className="mt-1 text-xs font-semibold text-brand-olive">May 21, 2024</p>
                    </div>
                    <span className="grid w-11 place-items-center rounded-xl bg-brand-lime text-brand-olive"><CalendarDays className="h-4 w-4" /></span>
                </div>
            </div>
        </div>
    );
}

function TimelineStepVisual() {
    return (
        <div aria-hidden="true" className="h-full rounded-2xl border border-brand-gray bg-brand-olive p-4 text-white shadow-[0_18px_40px_-34px_rgba(51,54,41,.65)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/60">Impact chronology</p>
                <span className="rounded-full bg-brand-lime/20 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-brand-lime">3 records</span>
            </div>
            <div className="mt-3 space-y-3">
                {[
                    ["4:42 PM", ShieldCheck, "Warning included property"],
                    ["5:05 PM", Wind, "51.8 mph at KCID"],
                    ["5:14 PM", Radar, "1.25 in hail reported nearby"],
                ].map(([time, Icon, label]) => {
                    const ItemIcon = Icon as typeof Wind;
                    return (
                        <div key={String(time)} className="grid grid-cols-[48px_24px_1fr] items-center gap-2 text-[10px]">
                            <span className="text-white/60">{String(time)}</span>
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-brand-lime"><ItemIcon className="h-3 w-3" /></span>
                            <span className="font-medium text-white/85">{String(label)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ReportStepVisual() {
    return (
        <div aria-hidden="true" className="h-full rounded-2xl border border-brand-gray bg-white p-4 shadow-[0_18px_40px_-34px_rgba(51,54,41,.45)]">
            <div className="flex items-center justify-between border-b border-brand-gray pb-3">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.13em] text-brand-olive/75"><FileText className="h-3.5 w-3.5" /> Evidence report</div>
                <span className="rounded-full bg-brand-lime/35 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-brand-olive">Demo</span>
            </div>
            <div className="mt-3 grid grid-cols-[1fr_80px] gap-3">
                <div>
                    <div className="h-2 w-24 rounded-full bg-brand-olive/80" />
                    <div className="mt-2 h-1.5 w-full rounded-full bg-brand-olive/10" />
                    <div className="mt-1.5 h-1.5 w-4/5 rounded-full bg-brand-olive/10" />
                    <div className="mt-4 space-y-1.5">
                        <div className="h-5 rounded-md bg-brand-offWhite" />
                        <div className="h-5 rounded-md bg-brand-offWhite" />
                        <div className="h-5 rounded-md bg-brand-offWhite" />
                    </div>
                </div>
                <div className="rounded-xl bg-brand-lime/25 p-2 text-center">
                    <Database className="mx-auto h-4 w-4 text-brand-olive" />
                    <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.08em] text-brand-olive/75">Source appendix</p>
                    <p className="mt-1 text-xs font-semibold text-brand-olive">4 collections</p>
                </div>
            </div>
        </div>
    );
}

export function HowItWorksSection() {
    const steps = [
        {
            title: "Choose a property and approximate date",
            copy: "Use the guided address and date tools to define the property and weather window you want to review.",
            visual: <PropertyStepVisual />,
        },
        {
            title: "Review returned records in context",
            copy: "ClaimDefender classifies available observations, reports, warnings, and precipitation, then places the records in time order.",
            visual: <TimelineStepVisual />,
        },
        {
            title: "Inspect the report and source trail",
            copy: "Preview a structured demo report with property context, findings, chronology, source status, methodology, and limitations.",
            visual: <ReportStepVisual />,
        },
    ];

    return (
        <section id="how-it-works" className="scroll-mt-24 bg-brand-offWhite py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-olive/75">How it works</p>
                        <h2 className="mt-3 max-w-xl text-balance text-3xl font-semibold tracking-[-0.04em] text-brand-olive sm:text-5xl">From a property question to an inspectible source trail.</h2>
                    </div>
                    <p className="max-w-2xl text-sm leading-7 text-brand-olive/70 lg:justify-self-end lg:text-base">The workflow is intentionally narrow: define the place and time, review what available records say, and keep the source context attached to the output.</p>
                </div>

                <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
                    {steps.map((step, index) => (
                        <li key={step.title} className="relative grid grid-rows-[auto_auto_1fr_auto] border-t border-brand-olive/20 pt-5">
                            <span className="text-xs font-bold tabular-nums text-brand-olive/70">0{index + 1}</span>
                            <h3 className="mt-5 max-w-xs text-xl font-semibold leading-tight tracking-[-0.025em] text-brand-olive md:min-h-[3.125rem]">{step.title}</h3>
                            <p className="mt-3 min-h-[72px] text-sm leading-6 text-brand-olive/70">{step.copy}</p>
                            <div className="mt-6 md:h-48">{step.visual}</div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

export function ProductDemoSection({ data }: { data: SearchResponse }) {
    return (
        <section id="product" className="scroll-mt-20 overflow-hidden bg-brand-olive py-20 text-white sm:py-24">
            <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[.7fr_1.3fr] lg:items-start lg:gap-16 lg:px-8">
                <div className="lg:sticky lg:top-28">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-lime">Product proof</p>
                    <h2 className="mt-4 max-w-xl text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">A timeline that keeps measured, reported, and warned events distinct.</h2>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">Weather records answer different questions. ClaimDefender keeps their classification, timestamp, source, and proximity visible so the sequence is useful without overstating what happened at a structure.</p>
                    <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
                        {[
                            [Wind, "Measured", "Observed at the named station or instrument location"],
                            [Radar, "Reported", "Recorded at the location supplied by the report"],
                            [ShieldCheck, "Warning", "Property point inside an archived warned area"],
                        ].map(([Icon, label, copy]) => {
                            const ItemIcon = Icon as typeof Wind;
                            return (
                                <div key={String(label)} className="grid grid-cols-[32px_88px_1fr] gap-2 py-4 text-xs leading-relaxed">
                                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-brand-lime"><ItemIcon className="h-3.5 w-3.5" aria-hidden="true" /></span>
                                    <span className="font-semibold text-white">{String(label)}</span>
                                    <span className="text-white/60">{String(copy)}</span>
                                </div>
                            );
                        })}
                    </div>
                    <Link href="#methodology" className="mt-7 inline-flex min-h-11 items-center text-sm font-semibold text-brand-lime underline decoration-brand-lime/30 underline-offset-4 hover:decoration-brand-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2 focus-visible:ring-offset-brand-olive">Read the evidence method <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                </div>
                <WeatherTimelineDemo data={data} />
            </div>
        </section>
    );
}

export function AudienceSection() {
    return (
        <section aria-labelledby="audience-heading" className="bg-white py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-olive/75">Choose your path</p>
                    <h2 id="audience-heading" className="mt-3 text-balance text-3xl font-semibold tracking-[-0.04em] text-brand-olive sm:text-5xl">One evidence model. Two ways into the work.</h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-olive/70 sm:text-base">Homeowners get a guided investigation. Professionals get a repeatable, browser-local demo workspace around the same source-labeled evidence.</p>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
                    <article id="homeowners" className="scroll-mt-24 overflow-hidden rounded-[2rem] border border-brand-gray bg-brand-offWhite p-6 sm:p-8 lg:p-10">
                        <div className="flex items-center justify-between gap-4">
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-olive shadow-sm"><Home className="h-5 w-5" aria-hidden="true" /></span>
                            <span className="rounded-full border border-brand-olive/15 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-olive/75">Guided homeowner demo</span>
                        </div>
                        <p className="mt-8 text-xs font-bold uppercase tracking-[0.14em] text-brand-olive/75">For homeowners</p>
                        <h3 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.035em] text-brand-olive">Understand what available weather records show around your property.</h3>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-brand-olive/70">Start with one property and date, review the evidence in plain language, then inspect a clearly labeled demo report.</p>
                        <ul className="mt-7 grid gap-3 text-sm text-brand-olive/75 sm:grid-cols-2">
                            {["Guided property and date search", "Plain-language evidence snapshot", "Timeline with source and distance", "No account or payment in the demo"].map((point) => <li key={point} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{point}</li>)}
                        </ul>
                        <TrackedLink event="homeowner_path_selected" href="/homeowners#investigation" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-olive px-5 text-sm font-bold text-white transition-colors hover:bg-brand-oliveDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2">Check a property <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></TrackedLink>
                    </article>

                    <article id="professionals" className="scroll-mt-24 overflow-hidden rounded-[2rem] bg-brand-olive p-6 text-white shadow-[0_30px_65px_-50px_rgba(51,54,41,.75)] sm:p-8 lg:p-10">
                        <div className="flex items-center justify-between gap-4">
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-lime text-brand-olive"><Building2 className="h-5 w-5" aria-hidden="true" /></span>
                            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white/65">Browser-local workspace</span>
                        </div>
                        <p className="mt-8 text-xs font-bold uppercase tracking-[0.14em] text-brand-lime">For professionals</p>
                        <h3 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.035em]">Prepare consistent evidence packages around client properties.</h3>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">Add client and reference context, organize fictional draft packages, and preview the professional report format without implying a full claims CRM.</p>
                        <ul className="mt-7 grid gap-3 text-sm text-white/75 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            {["Client, property, and date context", "Browser-local draft and package history", "Organization-aware report preview", "No account or cloud persistence in the demo"].map((point) => <li key={point} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime" aria-hidden="true" />{point}</li>)}
                        </ul>
                        <TrackedLink event="professional_path_selected" href="/professionals" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-lime px-5 text-sm font-bold text-brand-olive transition-colors hover:bg-brand-limeLight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2 focus-visible:ring-offset-brand-olive">Explore professional tools <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></TrackedLink>
                    </article>
                </div>
            </div>
        </section>
    );
}

export function MethodologySection() {
    // Imagery stays roadmap-only here until retrieval, comparison, and report behavior are supported end to end.
    return (
        <section id="methodology" className="scroll-mt-20 border-y border-brand-gray bg-brand-offWhite py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-olive/75">Methodology and scope</p>
                        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.04em] text-brand-olive sm:text-5xl">A source label is part of the evidence.</h2>
                    </div>
                    <p className="max-w-2xl text-sm leading-7 text-brand-olive/70 lg:justify-self-end sm:text-base">When a record is returned, ClaimDefender keeps the provider, dataset, classification, time, proximity, retrieval status, and limitations close to the value it supports.</p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
                    <div className="rounded-[1.75rem] bg-brand-olive p-6 text-white sm:p-8">
                        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-lime text-brand-olive"><ShieldCheck className="h-4 w-4" aria-hidden="true" /></span><h3 className="text-xl font-semibold">Useful context, bounded conclusions</h3></div>
                        <div className="mt-7">
                            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-brand-lime">The package can help</p>
                            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                                {["Organize returned weather records around a property and date", "Show when and where a nearby measurement or report occurred", "Preserve the source trail for a report or conversation"].map((point) => <li key={point} className="flex gap-2.5"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-lime" aria-hidden="true" />{point}</li>)}
                            </ul>
                        </div>
                        <div className="mt-7 border-t border-white/10 pt-7">
                            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-white/65">The package cannot establish</p>
                            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/65">
                                {["Physical damage at the structure", "The cause of a property condition", "Insurance coverage, legal admissibility, or claim outcome"].map((point) => <li key={point} className="flex gap-2.5"><X className="mt-1 h-3.5 w-3.5 shrink-0 text-white/60" aria-hidden="true" />{point}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[1.75rem] border border-brand-gray bg-white">
                        <div className="grid grid-cols-[96px_1fr] gap-4 border-b border-brand-gray bg-brand-offWhite/75 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-olive/75 sm:grid-cols-[120px_1fr_1fr] sm:px-6">
                            <span>Classification</span><span>What it means</span><span className="hidden sm:block">Context retained</span>
                        </div>
                        <div className="divide-y divide-brand-gray">
                            {methodologyRows.map((row) => (
                                <div key={row.label} className="grid grid-cols-[96px_1fr] gap-4 px-4 py-5 text-sm sm:grid-cols-[120px_1fr_1fr] sm:px-6">
                                    <p className="font-semibold text-brand-olive">{row.label}</p>
                                    <p className="leading-6 text-brand-olive/70">{row.meaning}</p>
                                    <p className="col-start-2 text-xs leading-5 text-brand-olive/75 sm:col-auto sm:text-sm sm:leading-6">{row.context}</p>
                                </div>
                            ))}
                        </div>
                        <p className="border-t border-brand-gray bg-brand-offWhite/55 px-4 py-4 text-xs leading-6 text-brand-olive/75 sm:px-6">The fictional sample demonstrates records modeled on the IEM-hosted ASOS and NWS Local Storm Reports archives, plus archived NWS warning polygons. Actual source availability varies by property, date, and provider response.</p>
                    </div>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    <article className="rounded-2xl border border-brand-gray bg-white p-6">
                        <div className="flex items-center gap-3"><Database className="h-5 w-5 text-brand-olive" aria-hidden="true" /><h3 className="font-semibold text-brand-olive">Demo and data handling</h3></div>
                        <p className="mt-3 text-sm leading-7 text-brand-olive/70">The homeowner search sends the selected coordinates and date to the evidence API; address lookup uses the configured Mapbox integration. No account or checkout is required. The professional demo stores its sample workspace in this browser. A production privacy and retention commitment is not published in this repository and still requires founder review.</p>
                    </article>
                    <article className="rounded-2xl border border-brand-gray bg-white p-6">
                        <div className="flex flex-wrap items-center gap-3"><Satellite className="h-5 w-5 text-brand-olive" aria-hidden="true" /><h3 className="font-semibold text-brand-olive">Expanded satellite comparison</h3><span className="rounded-full bg-brand-lime/40 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-brand-olive">Planned</span></div>
                        <p className="mt-3 text-sm leading-7 text-brand-olive/70">The current package can retain imagery archive capture metadata when available. Richer before-and-after satellite comparison is planned; it is not presented as a current property-damage analysis capability.</p>
                    </article>
                </div>
            </div>
        </section>
    );
}

export function UseCasesSection() {
    return (
        <section className="bg-white py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-olive/75">Practical uses</p>
                        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.04em] text-brand-olive sm:text-5xl">Useful when the question begins with “what do the records show?”</h2>
                    </div>
                    <p className="max-w-2xl text-sm leading-7 text-brand-olive/70 lg:justify-self-end sm:text-base">ClaimDefender adds context to property research. It does not replace inspection, engineering, legal judgment, or claims evaluation.</p>
                </div>
                <div className="mt-12 grid border-y border-brand-gray md:grid-cols-2">
                    {useCases.map((useCase, index) => (
                        <article key={useCase.number} className={`grid grid-cols-[42px_1fr] gap-4 py-7 md:p-8 ${index % 2 === 0 ? "md:border-r md:border-brand-gray" : ""} ${index < 2 ? "border-b border-brand-gray" : ""}`}>
                            <span className="text-xs font-bold tabular-nums text-brand-olive/70">{useCase.number}</span>
                            <div><h3 className="text-lg font-semibold tracking-[-0.02em] text-brand-olive">{useCase.title}</h3><p className="mt-2 text-sm leading-7 text-brand-olive/70">{useCase.copy}</p></div>
                        </article>
                    ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-2 text-sm text-brand-olive/70"><FolderClock className="h-4 w-4" aria-hidden="true" /> See how these records are organized in the deliverable.</p>
                    <Link href="/sample-report" className="inline-flex min-h-11 items-center font-semibold text-brand-olive underline decoration-brand-olive/25 underline-offset-4 hover:decoration-brand-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2">View the fictional sample report <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                </div>
            </div>
        </section>
    );
}

export function FinalCtaSection() {
    return (
        <section className="bg-brand-lime/20 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-brand-olive px-6 py-10 text-white shadow-[0_30px_70px_-50px_rgba(51,54,41,.8)] sm:px-10 sm:py-12 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:px-14">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-lime">Start with a place and time</p>
                    <h2 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Review the weather record around the property date you want to understand.</h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">Use the guided homeowner flow, or explore how the same evidence is organized for repeated professional work.</p>
                </div>
                <div className="mt-8 flex flex-col gap-3 lg:mt-0 lg:min-w-[250px]">
                    <TrackedLink event="homeowner_path_selected" href="/homeowners#investigation" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-lime px-5 text-sm font-bold text-brand-olive transition-colors hover:bg-brand-limeLight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2 focus-visible:ring-offset-brand-olive">Check a property <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></TrackedLink>
                    <TrackedLink event="professional_path_selected" href="/professionals" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-olive">Explore professional demo</TrackedLink>
                    <p className="text-center text-[10px] leading-relaxed text-white/60">Demo only · no account or payment</p>
                </div>
            </div>
        </section>
    );
}
