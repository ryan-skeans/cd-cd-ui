import {
    ShieldCheck,
    CloudHail,
    Satellite,
    FileText,
    FileCheck,
    CheckCircle2,
    ArrowUpRight,
} from "lucide-react";

export default function MarketingSections() {
    const scrollToChecker = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-32">

            {/* ─── Metric Cards Section ─── */}
            <section className="text-center space-y-12">
                <div className="space-y-4">
                    <h2 className="text-3xl font-medium tracking-tight text-brand-olive text-balance">
                        Proven Results for Claim Appeals
                    </h2>
                    <p className="text-brand-olive/50 text-sm max-w-md mx-auto">
                        Leverage historical NOAA radar, severe weather telemetry, and high-res satellite imagery to challenge unfair insurance denials.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-brand-limeLight/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center aspect-square transition-transform hover:scale-105">
                        <span className="text-5xl font-light text-brand-olive mb-2">84%</span>
                        <span className="text-xs text-brand-olive/70 font-medium">Claim Reversal Rate</span>
                    </div>
                    <div className="bg-brand-limeLight/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center aspect-square transition-transform hover:scale-105">
                        <CloudHail className="w-10 h-10 text-brand-olive mb-3 opacity-60 stroke-[1.5]" />
                        <span className="text-xs text-brand-olive/70 font-medium tracking-tight">NOAA Weather Verification</span>
                    </div>
                    <div className="bg-brand-limeLight/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center aspect-square transition-transform hover:scale-105">
                        <div className="w-14 h-14 rounded-full border border-brand-olive/10 flex items-center justify-center mb-2">
                            <Satellite className="w-6 h-6 text-brand-olive/70" />
                        </div>
                        <span className="text-xs text-brand-olive/70 font-medium">Satellite Evidence</span>
                    </div>
                    <div className="bg-brand-limeLight/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center aspect-square transition-transform hover:scale-105">
                        <span className="text-5xl font-light text-brand-olive mb-2">3.2x</span>
                        <span className="text-xs text-brand-olive/70 font-medium">Faster Settlement Time</span>
                    </div>
                </div>
            </section>

            {/* ─── Evidence & Reliability Section ─── */}
            <section className="space-y-12">
                <h2 className="text-3xl font-medium tracking-tight text-center text-brand-olive">
                    Unassailable Claim Evidence
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Weather Telemetry Card */}
                    <div className="space-y-4">
                        <div className="bg-brand-gray/50 rounded-2xl aspect-[4/3] flex items-center justify-center relative overflow-hidden group p-6">
                            {/* Mockup Weather Telemetry Panel */}
                            <div className="w-full bg-brand-olive text-white rounded-xl shadow-2xl transition-transform group-hover:scale-[1.02] p-5 flex flex-col justify-between border border-white/10">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <CloudHail className="w-5 h-5 text-brand-lime" />
                                        <span className="text-xs font-semibold tracking-wider text-brand-lime uppercase">NOAA Storm Radar</span>
                                    </div>
                                    <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded-full font-mono">VERIFIED</span>
                                </div>

                                <div className="my-4 space-y-2">
                                    <div className="flex justify-between text-xs border-b border-white/10 pb-1.5">
                                        <span className="text-white/60">Peak Hail Diameter</span>
                                        <span className="font-semibold text-brand-lime font-mono">1.75 in (Golf Ball)</span>
                                    </div>
                                    <div className="flex justify-between text-xs border-b border-white/10 pb-1.5">
                                        <span className="text-white/60">Max Wind Speed</span>
                                        <span className="font-semibold text-white font-mono">68 mph Gusts</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/60">Severe Thunderstorm Alert</span>
                                        <span className="font-semibold text-emerald-400">Confirmed</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-white/50 pt-2 border-t border-white/10">
                                    <span>Doppler Radar Cell #4829</span>
                                    <span>Lat: 32.7767, Lng: -96.7970</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-brand-olive mb-1 tracking-wider uppercase">
                                Historical Weather & Radar Telemetry
                            </h3>
                            <p className="text-[11px] text-brand-olive/60 leading-relaxed">
                                Extract Doppler radar datasets and NOAA storm report logs at exact property coordinates to prove weather events occurred on the specified date of loss.
                            </p>
                        </div>
                    </div>

                    {/* Adjuster Report Card */}
                    <div className="space-y-4">
                        <div className="bg-brand-gray/50 rounded-2xl aspect-[4/3] flex items-center justify-center relative overflow-hidden p-6">
                            {/* Mockup Doc */}
                            <div className="bg-white text-brand-olive w-full h-full rounded-xl shadow-xl border border-black/5 p-5 flex flex-col justify-between relative">
                                <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-brand-olive/20" />
                                <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-brand-olive/20" />
                                <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-brand-olive/20" />
                                <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-brand-olive/20" />

                                <div className="flex items-center justify-between border-b border-brand-olive/10 pb-3">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-brand-olive" />
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-olive">Claim Defense Evidence</h4>
                                    </div>
                                    <span className="text-[10px] font-mono text-brand-olive/50">Doc #CD-2026-88A</span>
                                </div>

                                <div className="space-y-2 py-2 text-[10px] text-brand-olive/80 leading-relaxed">
                                    <p className="font-semibold text-brand-olive">Re: Weather Damage Verification & Claim Denial Appeal</p>
                                    <p className="text-brand-olive/60 line-clamp-3">
                                        &quot;NOAA Doppler radar and localized telemetry confirm severe hail and 68+ mph wind gusts at the insured property address on the reported date of loss, directly contradicting carrier denial claims...&quot;
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-brand-olive/10">
                                    <span className="text-[9px] text-brand-olive/50">Includes NOAA Charts & Satellite Imagery</span>
                                    <span className="text-[10px] font-bold text-brand-olive flex items-center gap-1">
                                        Ready to File <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-brand-olive mb-1 tracking-wider uppercase">
                                Adjuster-Ready Claim Packages
                            </h3>
                            <p className="text-[11px] text-brand-olive/60 leading-relaxed">
                                Generate pre-formatted defense letters backed by empirical atmospheric data to submit directly to your insurance carrier or public adjuster.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Large Feature Banner */}
                <div className="w-full bg-brand-olive text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-white/10 shadow-xl">
                    <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-lime/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 max-w-xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-lime text-xs font-medium">
                            <Satellite className="w-3.5 h-3.5" /> High-Resolution Earth Observation
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-medium tracking-tight">
                            Before & After Satellite Imagery Analysis
                        </h3>
                        <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                            Our automated imagery pipeline cross-references pre-storm and post-storm satellite captures to visually document structural changes, roof deterioration, and impact areas.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── Platform Capabilities ─── */}
            <section className="text-center space-y-12">
                <div className="space-y-4">
                    <h2 className="text-3xl font-medium tracking-tight text-brand-olive">
                        Everything You Need To Fight Back
                    </h2>
                    <p className="text-brand-olive/50 text-sm max-w-md mx-auto">
                        Purpose-built tools for policyholders, roofers, contractors, and public adjusters.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center gap-3">
                        <div className="bg-brand-olive rounded-xl w-full aspect-[4/3] flex justify-center items-center shadow-md hover:-translate-y-1 transition-transform">
                            <CloudHail className="w-8 h-8 text-brand-lime opacity-90 stroke-[1.5]" />
                        </div>
                        <span className="text-[10px] uppercase font-semibold text-brand-olive/80 tracking-wider">Hail & Wind Swaths</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="bg-brand-olive rounded-xl w-full aspect-[4/3] flex justify-center items-center shadow-md hover:-translate-y-1 transition-transform">
                            <Satellite className="w-8 h-8 text-brand-lime opacity-90 stroke-[1.5]" />
                        </div>
                        <span className="text-[10px] uppercase font-semibold text-brand-olive/80 tracking-wider">Satellite Evidence</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="bg-brand-olive rounded-xl w-full aspect-[4/3] flex justify-center items-center shadow-md hover:-translate-y-1 transition-transform">
                            <FileCheck className="w-8 h-8 text-brand-lime opacity-90 stroke-[1.5]" />
                        </div>
                        <span className="text-[10px] uppercase font-semibold text-brand-olive/80 tracking-wider">Denial Appeals</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="bg-brand-olive rounded-xl w-full aspect-[4/3] flex justify-center items-center shadow-md hover:-translate-y-1 transition-transform">
                            <ShieldCheck className="w-8 h-8 text-brand-lime opacity-90 stroke-[1.5]" />
                        </div>
                        <span className="text-[10px] uppercase font-semibold text-brand-olive/80 tracking-wider">Policy Defense</span>
                    </div>
                </div>
            </section>

            {/* ─── Bottom Banner CTA ─── */}
            <section className="relative overflow-hidden rounded-3xl bg-brand-olive text-white p-8 sm:p-12 md:p-16 flex flex-col justify-end min-h-[300px] border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-olive via-brand-olive/90 to-transparent z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(#a3e635_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

                <div className="relative z-20 max-w-md space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
                        Don&apos;t let insurance carriers unfairly deny your claim.
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70">
                        Run a free viability check with your property address and date of weather event.
                    </p>
                    <button
                        onClick={scrollToChecker}
                        className="bg-brand-lime text-brand-olive text-sm font-semibold px-6 py-3 rounded-xl hover:bg-white transition-all shadow-lg hover:shadow-brand-lime/20 inline-flex items-center gap-2"
                    >
                        Check Claim Viability <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </section>
        </div>
    );
}

