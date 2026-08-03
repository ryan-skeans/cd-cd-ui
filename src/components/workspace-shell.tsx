"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Files, LayoutDashboard, Menu, PlusCircle } from "lucide-react";
import { ClaimDefenderLogo } from "./brand/claim-defender-logo";
import { DemoBadge, DemoDisclosure } from "./demo-badge";
import {
    isWorkspaceLinkActive,
    WORKSPACE_NEW_PACKAGE_PATH,
    WORKSPACE_ORGANIZATION_PATH,
    WORKSPACE_OVERVIEW_PATH,
    WORKSPACE_PACKAGES_PATH,
} from "@/lib/workspace-navigation";

const links = [
    { href: WORKSPACE_OVERVIEW_PATH, label: "Overview", icon: LayoutDashboard },
    { href: WORKSPACE_PACKAGES_PATH, label: "Evidence Packages", icon: Files },
    { href: WORKSPACE_NEW_PACKAGE_PATH, label: "New Package", icon: PlusCircle },
    { href: WORKSPACE_ORGANIZATION_PATH, label: "Organization", icon: Building2 },
];

function WorkspaceNavigation({ mobile = false }: { mobile?: boolean }) {
    const pathname = usePathname();
    return <nav aria-label="Workspace navigation" className={mobile ? "space-y-1" : "mt-8 space-y-1"}>{links.map(({ href, label, icon: Icon }) => {
        const active = isWorkspaceLinkActive(pathname, href);
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-brand-lime text-brand-olive" : mobile ? "text-brand-olive hover:bg-brand-offWhite" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" aria-hidden="true" />{label}</Link>;
    })}</nav>;
}

export default function WorkspaceShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-brand-offWhite text-brand-olive lg:grid lg:grid-cols-[270px_minmax(0,1fr)]">
            <aside className="hidden min-h-screen bg-brand-olive p-6 text-white lg:block">
                <div className="sticky top-6"><div className="flex items-center justify-between gap-3"><Link href="/" aria-label="ClaimDefender home" className="min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime"><ClaimDefenderLogo variant="compact" showWordmark inverted /></Link><DemoBadge inverse /></div><p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-lime">Demo Workspace</p><WorkspaceNavigation /><p className="mt-10 border-t border-white/10 pt-5 text-[11px] leading-relaxed text-white/45">Browser-local product demonstration. Not a claim system of record.</p></div>
            </aside>
            <div className="min-w-0">
                <header className="border-b border-brand-gray bg-white px-4 py-3 lg:hidden"><div className="flex items-center justify-between"><Link href="/" aria-label="ClaimDefender home" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest"><ClaimDefenderLogo variant="navigation" /></Link><details className="group relative"><summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-xl border border-brand-gray [&::-webkit-details-marker]:hidden"><Menu className="h-5 w-5" /><span className="sr-only">Open workspace navigation</span></summary><div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-brand-gray bg-white p-3 shadow-xl"><div className="mb-2 flex items-center justify-between px-2"><span className="text-xs font-bold uppercase tracking-wider">Demo Workspace</span><DemoBadge /></div><WorkspaceNavigation mobile /></div></details></div></header>
                <div className="border-b border-amber-900/10"><DemoDisclosure compact /></div>
                <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
            </div>
        </div>
    );
}
