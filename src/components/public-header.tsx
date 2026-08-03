"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { ClaimDefenderLogo } from "./brand/claim-defender-logo";

const navigation = [
    ["How it works", "/#how-it-works"],
    ["Homeowners", "/homeowners"],
    ["Professionals", "/professionals"],
    ["Methodology", "/#methodology"],
] as const;

export default function PublicHeader({
    homeowner = false,
    seamlessAtTop = false,
}: {
    homeowner?: boolean;
    seamlessAtTop?: boolean;
}) {
    const investigationHref = homeowner
        ? "#investigation"
        : "/homeowners#investigation";
    const topSentinelRef = useRef<HTMLSpanElement>(null);
    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        if (!seamlessAtTop || !topSentinelRef.current) return;

        // Observe document position instead of relying on scroll events. The first
        // observation also corrects the header after browser scroll restoration.
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsAtTop(entry.intersectionRatio === 1);
            },
            { threshold: 1 }
        );

        observer.observe(topSentinelRef.current);
        return () => observer.disconnect();
    }, [seamlessAtTop]);

    const headerClassName = seamlessAtTop
        ? `fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-200 ${
              isAtTop
                  ? "border-b border-transparent bg-transparent"
                  : "border-b border-brand-gray/80 bg-white"
          }`
        : "sticky top-0 z-50 border-b border-brand-gray/80 bg-white";

    return (
        <>
            {seamlessAtTop && (
                <span
                    ref={topSentinelRef}
                    className="pointer-events-none absolute left-0 top-0 h-px w-px"
                    aria-hidden="true"
                />
            )}
            <header className={headerClassName}>
                <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            aria-label="ClaimDefender home"
                            className="inline-flex h-11 items-center rounded-lg leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2"
                        >
                            <ClaimDefenderLogo variant="navigation" />
                        </Link>
                    </div>
                    <nav
                        aria-label="Primary navigation"
                        className="hidden items-center gap-1 lg:flex"
                    >
                        {navigation.map(([label, href]) => (
                            <Link
                                key={href}
                                href={href}
                                className="inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium text-brand-olive/70 transition-colors hover:bg-brand-offWhite hover:text-brand-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                    <div className="hidden lg:block">
                        <Link
                            href={investigationHref}
                            className="inline-flex h-11 items-center rounded-xl bg-brand-olive px-4 text-sm font-bold text-white transition-colors hover:bg-brand-oliveDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2"
                        >
                            Check a property{" "}
                            <ArrowRight
                                className="ml-2 h-4 w-4"
                                aria-hidden="true"
                            />
                        </Link>
                    </div>
                    <details className="group relative lg:hidden">
                        <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-xl border border-brand-gray bg-white text-brand-olive transition-colors hover:bg-brand-offWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                            <Menu className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">Open navigation</span>
                        </summary>
                        <nav
                            aria-label="Mobile navigation"
                            className="absolute right-0 top-14 z-50 w-[min(19rem,calc(100vw-2rem))] rounded-2xl border border-brand-gray bg-white p-3 shadow-[0_24px_70px_-30px_rgba(51,54,41,.55)]"
                        >
                            {navigation.map(([label, href]) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-brand-olive transition-colors hover:bg-brand-offWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive"
                                >
                                    {label}
                                </Link>
                            ))}
                            <Link
                                href="/sample-report"
                                className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-brand-olive transition-colors hover:bg-brand-offWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive"
                            >
                                Sample report
                            </Link>
                            <Link
                                href={investigationHref}
                                className="mt-2 flex min-h-11 items-center justify-center rounded-xl bg-brand-olive px-3 text-center text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2"
                            >
                                Check a property{" "}
                                <ArrowRight
                                    className="ml-2 h-4 w-4"
                                    aria-hidden="true"
                                />
                            </Link>
                        </nav>
                    </details>
                </div>
            </header>
        </>
    );
}
