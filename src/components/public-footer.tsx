import Link from "next/link";
import { ClaimDefenderLogo } from "./brand/claim-defender-logo";

export default function PublicFooter() {
    return (
        <footer className="border-t border-brand-gray bg-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
                <div>
                    <Link href="/" aria-label="ClaimDefender home" className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2"><ClaimDefenderLogo variant="navigation" /></Link>
                    <p className="mt-4 max-w-2xl text-xs leading-6 text-brand-olive/75">ClaimDefender organizes available weather records and their source context. It does not determine insurance coverage, establish physical damage or causation, replace an inspection, or provide legal or engineering advice.</p>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-olive/70">Current experience is a fictional-data product demo</p>
                </div>
                <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-brand-olive/70 sm:grid-cols-3 md:grid-cols-2">
                    <Link className="flex min-h-10 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive" href="/#how-it-works">How it works</Link>
                    <Link className="flex min-h-10 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive" href="/homeowners">Homeowners</Link>
                    <Link className="flex min-h-10 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive" href="/professionals">Professionals</Link>
                    <Link className="flex min-h-10 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive" href="/#methodology">Methodology</Link>
                    <Link className="flex min-h-10 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive" href="/sample-report">Sample report</Link>
                </nav>
            </div>
        </footer>
    );
}
