"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
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
    // Primary navigation should take visitors to the homeowner page normally.
    // `reset=1` deliberately scrolls/focuses the search form, which is reserved
    // for explicit "Check a property" calls to action.
    const homeownerHref = "/homeowners";
    const investigationHref = homeowner
        ? "#investigation"
        : "/homeowners#investigation";
    const topSentinelRef = useRef<HTMLSpanElement>(null);
    const [isAtTop, setIsAtTop] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                <div className="mx-auto flex min-h-[64px] max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
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
                                href={label === "Homeowners" ? homeownerHref : href}
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
                    <DialogPrimitive.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <DialogPrimitive.Trigger asChild>
                            <button
                                type="button"
                                aria-label="Open navigation"
                                className="grid h-11 w-11 place-items-center rounded-xl border border-brand-gray bg-white text-brand-olive transition-colors hover:bg-brand-offWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2 lg:hidden"
                            >
                                <Menu className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </DialogPrimitive.Trigger>
                        <DialogPrimitive.Portal>
                            <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-white lg:hidden" />
                            <DialogPrimitive.Content className="fixed inset-0 z-[101] flex h-dvh flex-col overflow-hidden bg-white text-brand-olive outline-none lg:hidden">
                                <DialogPrimitive.Title className="sr-only">ClaimDefender navigation</DialogPrimitive.Title>
                                <DialogPrimitive.Description className="sr-only">Choose a destination or close the menu to return to the current page.</DialogPrimitive.Description>

                                <div className="flex min-h-[72px] shrink-0 items-center justify-between border-b border-brand-gray/80 px-4 sm:px-6">
                                    <DialogPrimitive.Close asChild>
                                        <Link
                                            href="/"
                                            aria-label="ClaimDefender home"
                                            className="inline-flex h-11 items-center rounded-lg leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2"
                                        >
                                            <ClaimDefenderLogo variant="navigation" />
                                        </Link>
                                    </DialogPrimitive.Close>
                                    <DialogPrimitive.Close asChild>
                                        <button
                                            type="button"
                                            aria-label="Close navigation"
                                            className="grid h-12 w-12 place-items-center rounded-xl bg-brand-offWhite text-brand-olive transition-colors hover:bg-brand-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2"
                                        >
                                            <X className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </DialogPrimitive.Close>
                                </div>

                                <nav aria-label="Mobile navigation" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6">
                                    {[...navigation, ["Sample report", "/sample-report"] as const].map(([label, href]) => (
                                        <DialogPrimitive.Close asChild key={href}>
                                            <Link
                                                href={label === "Homeowners" ? homeownerHref : href}
                                                className="flex min-h-[76px] items-center justify-between border-b border-brand-gray/80 text-xl font-medium tracking-tight transition-colors hover:text-brand-olive/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-olive"
                                            >
                                                {label}
                                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                            </Link>
                                        </DialogPrimitive.Close>
                                    ))}
                                </nav>

                                <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-brand-gray/80 bg-white p-4 sm:p-6">
                                    <DialogPrimitive.Close asChild>
                                        <Link
                                            href="/professionals"
                                            className="inline-flex min-h-14 items-center justify-center rounded-xl bg-brand-charcoal px-5 text-center text-sm font-bold text-white transition-colors hover:bg-brand-oliveDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2"
                                        >
                                            For professionals
                                        </Link>
                                    </DialogPrimitive.Close>
                                    <DialogPrimitive.Close asChild>
                                        <Link
                                            href={investigationHref}
                                            className="inline-flex min-h-14 items-center justify-center rounded-xl bg-brand-lime px-5 text-center text-sm font-bold text-brand-olive transition-colors hover:bg-brand-limeLight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2"
                                        >
                                            Check a property
                                            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                                        </Link>
                                    </DialogPrimitive.Close>
                                </div>
                            </DialogPrimitive.Content>
                        </DialogPrimitive.Portal>
                    </DialogPrimitive.Root>
                </div>
            </header>
        </>
    );
}
