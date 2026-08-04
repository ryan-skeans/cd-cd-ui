import Link from "next/link";
import {
    ArrowRight,
    Building2,
    CalendarDays,
    Check,
    Clock3,
    Database,
    FileCheck2,
    Home,
    MapPin,
    Radar,
    ShieldAlert,
    Wind,
} from "lucide-react";
import TrackedLink from "@/components/tracked-link";
import { SearchResponse } from "@/lib/types";

function eventTime(timestamp: string, timeZone: string) {
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone,
        timeZoneName: "short",
    }).format(new Date(timestamp));
}

const previewStyles = {
    warning: {
        icon: ShieldAlert,
        label: "Official warning",
        className: "bg-amber-50 text-amber-950 border-amber-900/15",
    },
    observed: {
        icon: Wind,
        label: "Measured nearby",
        className: "bg-emerald-50 text-emerald-950 border-emerald-900/15",
    },
    reported: {
        icon: Radar,
        label: "Reported nearby",
        className: "bg-sky-50 text-sky-950 border-sky-900/15",
    },
} as const;

function HeroEvidencePreview({ data }: { data: SearchResponse }) {
    return (
        <div className="relative mx-auto w-full max-w-[610px] lg:ml-auto">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-brand-lime/15 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-olive/15 bg-white shadow-[0_32px_90px_-42px_rgba(51,54,41,0.6)]">
                <div className="flex items-center justify-between gap-4 border-b border-brand-gray bg-brand-offWhite/85 px-4 py-3.5 sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-olive text-brand-lime">
                            <Clock3 className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-olive/75">Impact timeline</p>
                            <p className="mt-0.5 truncate text-sm font-semibold text-brand-olive">Property evidence preview</p>
                        </div>
                    </div>
                    <span className="shrink-0 rounded-full border border-brand-olive/10 bg-brand-lime/35 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.11em] text-brand-olive">Fictional sample</span>
                </div>

                <div className="px-4 py-4 sm:px-5 sm:py-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand-olive/75">Subject property</p>
                            <p className="mt-1 text-sm font-semibold text-brand-olive sm:text-base">1450 Sample Ridge Road</p>
                            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-brand-olive/75"><MapPin className="h-3 w-3" aria-hidden="true" /> Cedar Rapids, Iowa</p>
                        </div>
                        <p className="flex items-center gap-1.5 text-[11px] font-medium text-brand-olive/75"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> May 21, 2024</p>
                    </div>

                    <div className="relative mt-5 overflow-hidden rounded-2xl bg-brand-olive px-3 py-3 text-white max-[420px]:px-2 sm:px-4">
                        <div className="absolute bottom-0 left-[110px] top-0 w-px bg-white/10 max-[420px]:left-[22px] sm:left-[142px]" aria-hidden="true" />
                        <ol className="relative space-y-1">
                            {data.timeline.map((entry) => {
                                const style = previewStyles[entry.classification as keyof typeof previewStyles] ?? previewStyles.warning;
                                const Icon = style.icon;
                                return (
                                    <li key={entry.id} className="grid grid-cols-[76px_20px_minmax(0,1fr)] gap-x-2 rounded-xl px-1 py-2.5 max-[420px]:grid-cols-[20px_minmax(0,1fr)] sm:grid-cols-[100px_20px_minmax(0,1fr)] sm:gap-x-3">
                                        <time className="flex h-5 items-center justify-end whitespace-nowrap text-right text-[9px] font-semibold text-white/65 max-[420px]:col-span-2 max-[420px]:justify-start max-[420px]:pl-8 max-[420px]:text-left sm:text-[10px]">{eventTime(entry.timestamp, data.property.timeZone)}</time>
                                        <span className="relative z-10 grid h-5 w-5 place-items-center rounded-full border-2 border-brand-olive bg-brand-lime text-brand-olive max-[420px]:col-start-1 max-[420px]:row-start-2">
                                            <Icon className="h-2.5 w-2.5" aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0 max-[420px]:col-start-2 max-[420px]:row-start-2">
                                            <div className="flex h-5 items-center">
                                                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] ${style.className}`}>{style.label}</span>
                                            </div>
                                            <p className="mt-1.5 text-[11px] font-medium leading-snug text-white sm:text-xs">{entry.title}</p>
                                            <p className="mt-1 text-[9px] leading-relaxed text-white/60 sm:text-[10px]">{entry.source}{typeof entry.distanceMilesFromProperty === "number" ? ` · ${entry.distanceMilesFromProperty.toFixed(1)} mi from property` : ""}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <div className="rounded-xl border border-brand-gray bg-brand-offWhite/65 p-3">
                            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-brand-olive/75"><Wind className="h-3 w-3" aria-hidden="true" /> Station</p>
                            <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-brand-olive">51.8 <span className="text-[9px] font-medium tracking-normal text-brand-olive/75">mph</span></p>
                        </div>
                        <div className="rounded-xl border border-brand-gray bg-brand-offWhite/65 p-3">
                            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-brand-olive/75"><Radar className="h-3 w-3" aria-hidden="true" /> Hail report</p>
                            <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-brand-olive">1.25 <span className="text-[9px] font-medium tracking-normal text-brand-olive/75">in</span></p>
                        </div>
                        <div className="col-span-2 rounded-xl border border-brand-gray bg-brand-offWhite/65 p-3 sm:col-span-1">
                            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-brand-olive/75"><ShieldAlert className="h-3 w-3" aria-hidden="true" /> Warning</p>
                            <p className="mt-2 text-xs font-semibold text-brand-olive">Property inside archived polygon</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-brand-gray bg-brand-offWhite/70 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <p className="flex items-center gap-2 text-[10px] font-medium text-brand-olive/75"><Database className="h-3.5 w-3.5" aria-hidden="true" /> 3 timeline entries · 4 source collections</p>
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold text-brand-olive"><FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" /> Report preview ready</p>
                </div>
            </div>
        </div>
    );
}

export function HomepageHero({ data }: { data: SearchResponse }) {
    return (
        <>
            <section className="relative isolate overflow-hidden bg-brand-offWhite">
                <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_78%_12%,rgba(212,243,94,0.22),transparent_38%)]" aria-hidden="true" />
                <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-[9.5rem] lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-24 lg:pt-[10.5rem]">
                    <div>
                        <h1 className="max-w-[720px] text-balance text-[2.65rem] font-semibold leading-[1.02] tracking-[-0.055em] text-brand-olive sm:text-6xl lg:text-[4rem]">
                            Discover weather records for any property.
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-7 text-brand-olive/70 sm:text-lg sm:leading-8">
                            Search a property and approximate date. ClaimDefender organizes available station observations, nearby storm reports, warning context, precipitation, and source details into an impact timeline and report preview.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <TrackedLink event="homeowner_path_selected" href="/homeowners#investigation" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-olive px-6 text-sm font-bold text-white shadow-[0_12px_30px_-18px_rgba(51,54,41,.8)] transition-colors hover:bg-brand-oliveDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2">
                                Check a property <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                            </TrackedLink>
                            <TrackedLink event="professional_path_selected" href="/professionals" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-brand-olive/20 bg-white px-5 text-sm font-semibold text-brand-olive transition-colors hover:border-brand-olive/40 hover:bg-brand-offWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2">
                                <Building2 className="mr-2 h-4 w-4" aria-hidden="true" /> For professionals
                            </TrackedLink>
                        </div>
                        <p className="mt-5 text-sm text-brand-olive/70">
                            Prefer to inspect the output? <Link href="/sample-report" className="font-semibold text-brand-olive underline decoration-brand-olive/25 underline-offset-4 hover:decoration-brand-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2">View the sample report</Link>.
                        </p>
                        <p className="mt-5 flex max-w-2xl gap-2 text-xs leading-relaxed text-brand-olive/75">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            Records provide weather context; they do not verify property damage.
                        </p>
                    </div>
                    <HeroEvidencePreview data={data} />
                </div>
            </section>
            <section aria-labelledby="credibility-heading" className="border-y border-brand-gray bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <h2 id="credibility-heading" className="sr-only">What the ClaimDefender evidence preview preserves</h2>
                    <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-brand-gray">
                        {[
                            [Home, "Property context", "Selected location and approximate event date"],
                            [Wind, "Record classification", "Measured, reported, warning, and contextual stay distinct"],
                            [Clock3, "Impact chronology", "Time, source, and distance travel with each entry"],
                            [FileCheck2, "Inspectible output", "Timeline, source appendix, and stated limitations"],
                        ].map(([Icon, term, description], index) => {
                            const ItemIcon = Icon as typeof Home;
                            return (
                                <div key={String(term)} className={index ? "lg:px-7" : "lg:pr-7"}>
                                    <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-olive/70"><ItemIcon className="h-4 w-4" aria-hidden="true" /> {String(term)}</dt>
                                    <dd className="mt-2 text-sm leading-relaxed text-brand-olive/70">{String(description)}</dd>
                                </div>
                            );
                        })}
                    </dl>
                </div>
            </section>
        </>
    );
}
