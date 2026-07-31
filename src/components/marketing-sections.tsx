import { FileCheck2, Radar, Satellite, Scale, ShieldCheck } from "lucide-react";

export default function MarketingSections() {
    const evidence = [
        { icon: Radar, title: "Weather records", detail: "Storm observations, wind, hail, precipitation, and alert context." },
        { icon: Satellite, title: "Imagery context", detail: "Available pre- and post-event imagery organised for review." },
        { icon: FileCheck2, title: "Report-ready file", detail: "A structured evidence package with property and date references." },
    ];

    return (
        <div className="mx-auto w-full max-w-4xl space-y-20">
            <section className="border-y border-brand-gray/80 py-9">
                <div className="grid gap-8 md:grid-cols-[1.1fr_2fr] md:items-center">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-olive/50">Built for the claim file</p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-brand-olive">Evidence that is easier to inspect and share.</h2>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-3">
                        {evidence.map(({ icon: Icon, title, detail }) => <div key={title}>
                            <Icon className="mb-3 h-5 w-5 text-brand-olive" />
                            <h3 className="text-sm font-semibold text-brand-olive">{title}</h3>
                            <p className="mt-1 text-xs leading-relaxed text-brand-olive/60">{detail}</p>
                        </div>)}
                    </div>
                </div>
            </section>

            <section className="grid gap-8 rounded-3xl border border-brand-gray/70 bg-white p-7 sm:p-10 md:grid-cols-[1fr_1.25fr]">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-brand-lime/35 px-3 py-1 text-[11px] font-semibold text-brand-olive"><ShieldCheck className="h-3.5 w-3.5" /> Source-forward methodology</div>
                    <h2 className="mt-5 text-3xl font-semibold tracking-tight text-brand-olive">Prepared for professional review.</h2>
                </div>
                <div className="space-y-5 text-sm leading-relaxed text-brand-olive/70">
                    <p>Designed for homeowners, roofing and restoration teams, public adjusters, and insurance counsel who need a clear starting point for a weather-related damage investigation.</p>
                    <p className="flex gap-3"><Scale className="mt-0.5 h-4 w-4 shrink-0 text-brand-olive" /> ClaimDefender documents available evidence. It does not make a coverage determination or replace an inspection, policy review, or professional advice.</p>
                </div>
            </section>
        </div>
    );
}
