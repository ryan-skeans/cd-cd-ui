"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Radar, Database, Cloud, Shield } from "lucide-react";

export default function LoadingState() {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500" role="status" aria-live="polite">
            {/* Radar Animation */}
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
                <div className="relative">
                    {/* Outer pulse rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border border-brand-olive/20 animate-pulse-ring" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-24 h-24 rounded-full border border-brand-olive/15 animate-pulse-ring"
                            style={{ animationDelay: "0.5s" }}
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-24 h-24 rounded-full border border-brand-olive/10 animate-pulse-ring"
                            style={{ animationDelay: "1s" }}
                        />
                    </div>

                    {/* Center radar icon */}
                    <div className="relative z-10 w-16 h-16 bg-brand-olive/5 rounded-full flex items-center justify-center border border-brand-olive/20">
                        <Radar className="w-8 h-8 text-brand-olive animate-radar-sweep" />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-brand-olive">
                        Retrieving weather evidence
                    </h3>
                    <p className="text-sm text-brand-olive/60 max-w-md">
                        Reviewing available records for the selected property and date.
                    </p>
                </div>

                {/* Progress Indicators */}
                <div className="w-full max-w-sm space-y-3">
                    <div className="flex items-center gap-3">
                        <Cloud className="w-4 h-4 text-brand-olive animate-pulse" />
                        <div className="flex-1">
                            <div className="text-xs text-brand-olive/60 mb-1">
                                Locating nearby weather stations…
                            </div>
                            <Skeleton className="h-2 w-full bg-brand-gray/50" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Database className="w-4 h-4 text-brand-olive/60 animate-pulse" style={{ animationDelay: "0.7s" }} />
                        <div className="flex-1">
                            <div className="text-xs text-brand-olive/60 mb-1">
                                Reviewing local storm reports…
                            </div>
                            <Skeleton className="h-2 w-3/4 bg-brand-gray/50" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-brand-olive/30 animate-pulse" style={{ animationDelay: "1.4s" }} />
                        <div className="flex-1">
                            <div className="text-xs text-brand-olive/60 mb-1">
                                Checking historical warnings…
                            </div>
                            <Skeleton className="h-2 w-1/2 bg-brand-gray/50" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Cloud className="h-4 w-4 animate-pulse text-brand-olive/40" />
                        <div className="flex-1"><div className="mb-1 text-xs text-brand-olive/60">Calculating precipitation context…</div><Skeleton className="h-2 w-2/3 bg-brand-gray/50" /></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Database className="h-4 w-4 animate-pulse text-brand-olive/30" />
                        <div className="flex-1"><div className="mb-1 text-xs text-brand-olive/60">Building the event timeline…</div><Skeleton className="h-2 w-1/2 bg-brand-gray/50" /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
