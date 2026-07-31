"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import BrandMark from "./brand-mark";
import { DemoBadge } from "./demo-badge";

const navigation = [
    ["For Homeowners", "/homeowners"],
    ["For Professionals", "/professionals"],
    ["Sample Report", "/sample-report"],
] as const;

export default function PublicHeader({ homeowner = false }: { homeowner?: boolean }) {
    return (
        <header className="border-b border-brand-gray/80 bg-white/95 backdrop-blur">
            <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3"><BrandMark /><DemoBadge /></div>
                <nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex">
                    {navigation.map(([label, href]) => <Link key={href} href={href} className="text-sm text-brand-olive/65 transition-colors hover:text-brand-olive">{label}</Link>)}
                </nav>
                <div className="hidden lg:block">
                    <Link href={homeowner ? "#investigation" : "/homeowners#investigation"} className="inline-flex h-10 items-center rounded-xl bg-brand-lime px-4 text-sm font-semibold text-brand-olive transition-colors hover:bg-brand-limeLight">Investigate a Property</Link>
                </div>
                <details className="group relative lg:hidden">
                    <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-xl border border-brand-gray text-brand-olive [&::-webkit-details-marker]:hidden"><Menu className="h-5 w-5" /><span className="sr-only">Open navigation</span></summary>
                    <nav aria-label="Mobile navigation" className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-brand-gray bg-white p-3 shadow-xl">
                        {navigation.map(([label, href]) => <Link key={href} href={href} className="block rounded-xl px-3 py-2.5 text-sm text-brand-olive hover:bg-brand-offWhite">{label}</Link>)}
                        <Link href={homeowner ? "#investigation" : "/homeowners#investigation"} className="mt-2 block rounded-xl bg-brand-lime px-3 py-2.5 text-center text-sm font-semibold text-brand-olive">Investigate a Property</Link>
                    </nav>
                </details>
            </div>
        </header>
    );
}
