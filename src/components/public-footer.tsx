import Link from "next/link";
import BrandMark from "./brand-mark";

export default function PublicFooter() {
    return (
        <footer className="border-t border-brand-gray bg-white">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
                <div><BrandMark /><p className="mt-4 max-w-xl text-xs leading-relaxed text-brand-olive/55">ClaimDefender organizes publicly available evidence. It does not determine insurance coverage, establish physical damage, replace an inspection, or provide legal or engineering advice.</p></div>
                <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-brand-olive/65"><Link href="/homeowners">Homeowners</Link><Link href="/professionals">Professionals</Link><Link href="/#methodology">Methodology</Link><Link href="/sample-report">Sample report</Link></nav>
            </div>
        </footer>
    );
}
