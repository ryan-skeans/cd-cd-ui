import { ArrowDown, CheckCircle2, Home } from "lucide-react";
import PublicHeader from "@/components/public-header";
import PublicFooter from "@/components/public-footer";
import HomeownerInvestigationLoader from "@/components/homeowner-investigation-loader";

export default function HomeownersPage() {
    return (
        <div className="min-h-screen bg-brand-offWhite">
            <PublicHeader homeowner />
            <main>
                <section className="border-b border-brand-gray bg-white">
                    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_.8fr] lg:items-center lg:px-8">
                        <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-olive/45"><Home className="h-4 w-4" /> For homeowners · Demo</p><h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-[-0.035em] text-brand-olive sm:text-5xl">See what weather records show around your property.</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-olive/60">Enter your property and approximate date of damage to review available weather observations, reports, warnings, and precipitation records.</p><a href="/homeowners?reset=1#investigation" className="mt-7 inline-flex h-11 items-center rounded-xl bg-brand-lime px-5 text-sm font-bold text-brand-olive">Check Available Evidence <ArrowDown className="ml-2 h-4 w-4" /></a></div>
                        <div className="rounded-3xl border border-brand-gray bg-brand-offWhite p-6"><p className="text-xs font-bold uppercase tracking-wider text-brand-olive/45">What you can review</p><ul className="mt-5 space-y-4 text-sm text-brand-olive/70">{["Measured conditions from nearby stations", "Nearby storm reports and warned areas", "A chronological, source-labeled event view", "A clearly labeled downloadable demo report"].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand-olive" />{item}</li>)}</ul></div>
                    </div>
                </section>
                <section id="investigation" className="scroll-mt-6 px-4 py-12 sm:px-6 lg:px-8"><HomeownerInvestigationLoader /></section>
            </main>
            <PublicFooter />
        </div>
    );
}
