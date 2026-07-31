import { Button } from "@/components/ui/button";
import { FileSearch, MapPin, Radar, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
    onGetStarted?: () => void;
}

const workflow = [
    { icon: MapPin, label: "Set property & loss date" },
    { icon: Radar, label: "Review weather evidence" },
    { icon: FileSearch, label: "Prepare evidence package" },
];

export default function Sidebar({ onGetStarted }: SidebarProps) {
    return (
        <aside className="w-full shrink-0 border-b border-white/10 bg-brand-olive text-white lg:sticky lg:top-0 lg:h-screen lg:w-[420px] lg:border-b-0 xl:w-[470px]">
            <div className="flex h-full flex-col px-4 py-4 sm:px-8 lg:px-10 lg:py-10">
                <header className="flex items-center justify-between">
                    <Link
                        href="/"
                        onClick={(event) => {
                            if (onGetStarted) {
                                event.preventDefault();
                                onGetStarted();
                            }
                        }}
                        className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2 focus-visible:ring-offset-brand-olive"
                    >
                        <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5">
                            <ShieldCheck className="h-5 w-5 text-brand-lime" />
                        </div>
                        <div>
                            <span className="block text-base font-semibold tracking-tight">ClaimDefender</span>
                            <span className="block text-[10px] uppercase tracking-[0.16em] text-white/50">Weather evidence</span>
                        </div>
                    </Link>
                    <Button onClick={onGetStarted} className="h-9 rounded-lg bg-brand-lime px-4 text-xs font-semibold text-brand-olive hover:bg-brand-limeLight">
                        Start investigation
                    </Button>
                </header>

                <div className="my-auto hidden max-w-sm pb-8 lg:block">
                    <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-lime">Property damage evidence</p>
                    <h1 className="text-4xl font-medium leading-[1.06] tracking-[-0.035em] sm:text-5xl">
                        Build the weather record behind the claim.
                    </h1>
                    <p className="mt-6 max-w-[360px] text-[15px] leading-relaxed text-white/70">
                        Property-specific weather and NWS records, historical context, and report-ready documentation for damage investigations.
                    </p>

                    <div className="mt-10 border-t border-white/10 pt-6">
                        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Investigation workflow</p>
                        <ol className="space-y-4">
                            {workflow.map(({ icon: Icon, label }, index) => (
                                <li key={label} className="flex items-center gap-3 text-sm text-white/80">
                                    <span className="grid h-7 w-7 place-items-center rounded-full border border-white/15 text-[11px] font-semibold text-brand-lime">{index + 1}</span>
                                    <Icon className="h-4 w-4 text-brand-lime/80" />
                                    {label}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <p className="mt-auto hidden max-w-sm border-t border-white/10 pt-5 text-xs leading-relaxed text-white/45 lg:block">
                    Evidence supports investigation and documentation. It does not determine coverage, cause of loss, or claim outcome.
                </p>
            </div>
        </aside>
    );
}
