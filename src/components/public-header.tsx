"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import BrandMark from "./brand-mark";
import { DemoBadge } from "./demo-badge";

const navigation = [
    ["How it works", "/#how-it-works"],
    ["Homeowners", "/homeowners"],
    ["Professionals", "/professionals"],
    ["Methodology", "/#methodology"],
] as const;

export default function PublicHeader({ homeowner = false, seamlessAtTop = false }: { homeowner?: boolean; seamlessAtTop?: boolean }) {
    const investigationHref = homeowner ? "#investigation" : "/homeowners#investigation";
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        if (!seamlessAtTop) return;

        const updateHeaderState = () => setHasScrolled(window.scrollY > 0);
        updateHeaderState();
        window.addEventListener("scroll", updateHeaderState, { passive: true });
        return () => window.removeEventListener("scroll", updateHeaderState);
    }, [seamlessAtTop]);

    const headerClassName = seamlessAtTop
        ? `fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200 ${hasScrolled ? "border-b border-brand-gray/80 bg-white/90 shadow-[0_10px_30px_-24px_rgba(51,54,41,.65)] backdrop-blur-xl" : "border-b border-transparent bg-transparent"}`
        : "sticky top-0 z-50 border-b border-brand-gray/80 bg-white/90 backdrop-blur-xl";

    return (
        <header className={headerClassName}>
            <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3"><BrandMark /><DemoBadge /></div>
                <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
                    {navigation.map(([label, href]) => <Link key={href} href={href} className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium text-brand-olive/70 transition-colors hover:bg-brand-offWhite hover:text-brand-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2">{label}</Link>)}
                </nav>
                <div className="hidden lg:block">
                    <Link href={investigationHref} className="inline-flex min-h-11 items-center rounded-xl bg-brand-olive px-4 text-sm font-bold text-white transition-colors hover:bg-brand-oliveDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2">Check a property <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                </div>
                <details className="group relative lg:hidden">
                    <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-xl border border-brand-gray bg-white text-brand-olive transition-colors hover:bg-brand-offWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"><Menu className="h-5 w-5" aria-hidden="true" /><span className="sr-only">Open navigation</span></summary>
                    <nav aria-label="Mobile navigation" className="absolute right-0 top-14 z-50 w-[min(19rem,calc(100vw-2rem))] rounded-2xl border border-brand-gray bg-white p-3 shadow-[0_24px_70px_-30px_rgba(51,54,41,.55)]">
                        {navigation.map(([label, href]) => <Link key={href} href={href} className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-brand-olive transition-colors hover:bg-brand-offWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive">{label}</Link>)}
                        <Link href="/sample-report" className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-brand-olive transition-colors hover:bg-brand-offWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive">Sample report</Link>
                        <Link href={investigationHref} className="mt-2 flex min-h-11 items-center justify-center rounded-xl bg-brand-olive px-3 text-center text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2">Check a property <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                    </nav>
                </details>
            </div>
        </header>
    );
}
