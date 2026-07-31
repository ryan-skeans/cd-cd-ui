"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEvidenceSearch } from "@/hooks/use-evidence-search";
import LocationPicker from "@/components/location-picker";
import DatePicker from "@/components/date-picker";
import LoadingState from "@/components/loading-state";
import ResultsDashboard from "@/components/results-dashboard";
import DemoUnlockModal from "@/components/demo-unlock-modal";
import OfficialReport from "@/components/official-report";
import { ShieldCheck, MapPin, Calendar, ArrowRight, Database } from "lucide-react";

interface EvidenceInvestigationProps {
    onGetStartedRef?: (handler: () => void) => void;
}

function EvidenceInvestigationContent({ onGetStartedRef }: EvidenceInvestigationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const urlLat = searchParams.get("lat");
    const urlLng = searchParams.get("lng");
    const urlDate = searchParams.get("date");

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [latitude, setLatitude] = useState<number | null>(urlLat ? parseFloat(urlLat) : null);
    const [longitude, setLongitude] = useState<number | null>(urlLng ? parseFloat(urlLng) : null);
    const [date, setDate] = useState<Date | undefined>(urlDate ? new Date(urlDate) : undefined);
    const [address, setAddress] = useState<string | undefined>();
    const [unlockOpen, setUnlockOpen] = useState(false);

    const resultsRef = useRef<HTMLDivElement>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const locationCardRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const hasAutoRun = useRef(false);

    const handleGetStarted = useCallback(() => {
        setStep(1);
        locationCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 150);
    }, []);

    useEffect(() => {
        if (onGetStartedRef) {
            onGetStartedRef(handleGetStarted);
        }
    }, [onGetStartedRef, handleGetStarted]);

    const {
        mutate: runSearch,
        data: results,
        isPending: isLoading,
        isError,
        error,
        reset,
    } = useEvidenceSearch();

    useEffect(() => {
        if (urlLat && urlLng && urlDate) {
            // Debounce the auto-run slightly to avoid React StrictMode issues
            // where the component double-mounts and loses the mutation observer.
            const timeoutId = setTimeout(() => {
                if (!hasAutoRun.current) {
                    hasAutoRun.current = true;
                    runSearch({
                        latitude: parseFloat(urlLat),
                        longitude: parseFloat(urlLng),
                        estimatedDateOfDamage: new Date(urlDate).toISOString(),
                    }, {
                        onSuccess: () => {
                            setStep(2);
                            setTimeout(() => {
                                resultsRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                });
                            }, 200);
                        }
                    });
                }
            }, 100);

            return () => clearTimeout(timeoutId);
        } else {
            hasAutoRun.current = false;
        }
    }, [urlLat, urlLng, urlDate, runSearch]);



    const handleLocationChange = (lat: number, lng: number, displayAddress?: string) => {
        setLatitude(lat);
        setLongitude(lng);
        setAddress(displayAddress);
    };

    const handleSubmit = () => {
        if (latitude === null || longitude === null || !date) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("lat", latitude.toString());
        params.set("lng", longitude.toString());
        params.set("date", date.toISOString());
        router.push(`?${params.toString()}`, { scroll: false });

        reset(); // Clear previous results/errors
        hasAutoRun.current = true; // Prevent the useEffect from firing it again
        runSearch({
            latitude,
            longitude,
            estimatedDateOfDamage: date.toISOString(),
        }, {
            onSuccess: () => {
                setStep(2);
                setTimeout(() => {
                    resultsRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 200);
            }
        });
    };

    const isFormValid = latitude !== null && longitude !== null && date;
    const errorMessage =
        isError && error instanceof Error
            ? error.message
            : isError
                ? "An unexpected error occurred. Please try again."
                : null;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* ─── Map Interface / Step 1 ─── */}
            <div className={`w-full transition-all duration-500 ease-in-out ${step === 1 ? 'opacity-100 scale-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
                <div ref={locationCardRef} className="bg-white text-brand-olive rounded-3xl p-5 shadow-[0_20px_50px_-30px_rgba(51,54,41,0.35)] border border-brand-gray/70 sm:p-7 space-y-6 relative overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8">
                            <LoadingState />
                        </div>
                    )}

                    <div className="border-b border-brand-gray/70 pb-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-olive/50">New investigation</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-olive">Locate the weather evidence.</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-olive/60">Enter the property and the approximate date of loss. We&apos;ll prepare a source-labelled evidence preview using available weather records.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-brand-oliveDark font-semibold text-sm">
                            <MapPin className="w-4 h-4 text-brand-olive" /> Property location
                        </h3>
                        <div className="bg-zinc-50/50 rounded-xl overflow-hidden min-h-[300px] border border-brand-gray/40 relative">
                            <LocationPicker
                                latitude={latitude}
                                longitude={longitude}
                                onLocationChange={handleLocationChange}
                                searchInputRef={searchInputRef}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-brand-oliveDark font-semibold text-sm">
                            <Calendar className="w-4 h-4 text-brand-olive" /> Approximate date of loss
                        </h3>
                        <div className="bg-zinc-50/50 rounded-xl border border-brand-gray/40 p-1">
                            <DatePicker date={date} onDateChange={setDate} />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isLoading}
                        className="w-full h-14 bg-brand-olive hover:bg-brand-oliveDark text-white border-none text-base font-semibold transition-all rounded-xl mt-4 disabled:opacity-50"
                    >
                        Preview available evidence <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <p className="flex items-center justify-center gap-2 text-center text-xs text-brand-olive/50 tracking-wide mt-1">
                        <Database className="h-3.5 w-3.5" /> Demo only · No account, payment, or property data required.
                    </p>
                </div>
            </div>

            <div className={`mt-6 flex flex-wrap justify-center gap-3 transition-opacity duration-300 ${step === 1 ? 'opacity-100' : 'opacity-0 hidden'}`}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gray bg-white px-3 py-1.5 text-xs font-medium text-brand-olive/70"><ShieldCheck className="h-3.5 w-3.5" /> Weather archive records</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gray bg-white px-3 py-1.5 text-xs font-medium text-brand-olive/70"><ShieldCheck className="h-3.5 w-3.5" /> NWS alert context</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gray bg-white px-3 py-1.5 text-xs font-medium text-brand-olive/70"><ShieldCheck className="h-3.5 w-3.5" /> Historical imagery availability</span>
            </div>


            {/* ─── Results / Step 2 ─── */}
            <div
                ref={resultsRef}
                className={`w-full transition-all duration-500 ease-in-out ${step === 2 ? 'opacity-100 translate-y-0 mt-8' : 'opacity-0 h-0 hidden translate-y-12'}`}
            >
                {results && latitude !== null && longitude !== null && date && (
                    <ResultsDashboard
                        data={results}
                        latitude={latitude}
                        longitude={longitude}
                        date={date}
                        address={address}
                        onUnlock={() => setUnlockOpen(true)}
                    />
                )}

                <div className="mt-6 flex flex-col justify-between gap-4 bg-brand-olive p-6 rounded-2xl shadow-sm sm:flex-row sm:items-center">
                    <div>
                        <h3 className="text-lg font-bold text-white">Ready to assemble the evidence package?</h3>
                        <p className="text-sm text-white/65 mt-1">Open the report preview to review its contents and download the demo package.</p>
                    </div>
                    <Button
                        onClick={() => setUnlockOpen(true)}
                        className="bg-brand-lime text-brand-olive font-bold hover:bg-brand-limeLight px-6 h-11 rounded-xl text-sm"
                    >
                        Preview evidence package
                    </Button>
                </div>

                <div className="mt-4 text-center">
                    <Button variant="ghost" className="text-sm text-brand-olive/50" onClick={() => {
                        router.push("?", { scroll: false });
                        handleGetStarted();
                    }}>
                        Start New Search
                    </Button>
                </div>
            </div>


            {/* ─── Unlocked report / Step 3 ─── */}
            <div ref={reportRef} className={`w-full transition-all duration-500 ease-in-out ${step === 3 ? 'opacity-100 translate-y-0 mt-8' : 'opacity-0 h-0 hidden translate-y-12'}`}>
                {results && latitude !== null && longitude !== null && date && <OfficialReport report={{ data: results, latitude, longitude, date, address }} onStartNewSearch={() => { router.push("?", { scroll: false }); setUnlockOpen(false); setStep(1); handleGetStarted(); }} />}
            </div>
            <DemoUnlockModal open={unlockOpen} onOpenChange={setUnlockOpen} onUnlock={() => { setUnlockOpen(false); setStep(3); setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100); }} />
        </div>
    );
}

export default function EvidenceInvestigation({ onGetStartedRef }: EvidenceInvestigationProps) {
    return (
        <Suspense fallback={
            <div className="w-full flex items-center justify-center p-12">
                <LoadingState />
            </div>
        }>
            <EvidenceInvestigationContent onGetStartedRef={onGetStartedRef} />
        </Suspense>
    );
}
