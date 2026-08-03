"use client";

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEvidenceSearch } from "@/hooks/use-evidence-search";
import LocationPicker from "@/components/location-picker";
import DatePicker from "@/components/date-picker";
import LoadingState from "@/components/loading-state";
import ResultsDashboard from "@/components/results-dashboard";
import DemoUnlockModal from "@/components/demo-unlock-modal";
import OfficialReport from "@/components/official-report";
import { FEATURED_DEMO_INVESTIGATION, featuredDemoDisplayDate } from "@/lib/demo-investigation";
import { trackDemoEvent } from "@/lib/demo-analytics";
import { MapPin, Calendar, ArrowRight, Database, MapPinned, Gauge, RadioTower, FileCheck2 } from "lucide-react";

function EvidenceInvestigationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const urlLat = searchParams.get("lat");
    const urlLng = searchParams.get("lng");
    const urlDate = searchParams.get("date");
    const resetRequested = searchParams.get("reset") === "1";
    const parsedUrlLat = urlLat === null ? null : Number(urlLat);
    const parsedUrlLng = urlLng === null ? null : Number(urlLng);
    const parsedUrlDate = useMemo(() => urlDate === null ? null : new Date(urlDate), [urlDate]);
    const urlSearchReady = parsedUrlLat !== null
        && Number.isFinite(parsedUrlLat)
        && parsedUrlLat >= -90
        && parsedUrlLat <= 90
        && parsedUrlLng !== null
        && Number.isFinite(parsedUrlLng)
        && parsedUrlLng >= -180
        && parsedUrlLng <= 180
        && parsedUrlDate !== null
        && !Number.isNaN(parsedUrlDate.getTime());
    const invalidSharedLink = Boolean(urlLat || urlLng || urlDate) && !urlSearchReady;

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [latitude, setLatitude] = useState<number | null>(urlSearchReady ? parsedUrlLat : null);
    const [longitude, setLongitude] = useState<number | null>(urlSearchReady ? parsedUrlLng : null);
    const [date, setDate] = useState<Date | undefined>(urlSearchReady && parsedUrlDate ? parsedUrlDate : undefined);
    const [address, setAddress] = useState<string | undefined>();
    const [unlockOpen, setUnlockOpen] = useState(false);

    const resultsRef = useRef<HTMLDivElement>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const locationCardRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const hasAutoRun = useRef(false);
    const previousUrlSearchReady = useRef(urlSearchReady);

    const {
        mutate: runSearch,
        data: results,
        isPending: isLoading,
        isError,
        error,
        reset,
    } = useEvidenceSearch();

    const clearInvestigationState = useCallback(() => {
        reset();
        setStep(1);
        setLatitude(null);
        setLongitude(null);
        setDate(undefined);
        setAddress(undefined);
        setUnlockOpen(false);
        hasAutoRun.current = false;
        setTimeout(() => {
            locationCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 150);
    }, [reset]);

    const resetInvestigation = useCallback(() => {
        router.replace("/homeowners", { scroll: false });
        clearInvestigationState();
    }, [clearInvestigationState, router]);

    useEffect(() => {
        const returnedToInputs = previousUrlSearchReady.current
            && !urlSearchReady
            && urlLat === null
            && urlLng === null
            && urlDate === null
            && !resetRequested;

        previousUrlSearchReady.current = urlSearchReady;

        if (returnedToInputs) {
            clearInvestigationState();
        }
    }, [clearInvestigationState, resetRequested, urlDate, urlLat, urlLng, urlSearchReady]);

    // Navigation entry points use this one-time marker so returning to the
    // homeowner journey never leaves a prior investigation on screen.
    useEffect(() => {
        if (resetRequested) {
            resetInvestigation();
        }
    }, [resetInvestigation, resetRequested]);

    useEffect(() => {
        if (urlSearchReady && parsedUrlLat !== null && parsedUrlLng !== null && parsedUrlDate) {
            // Debounce the auto-run slightly to avoid React StrictMode issues
            // where the component double-mounts and loses the mutation observer.
            const timeoutId = setTimeout(() => {
                if (!hasAutoRun.current) {
                    hasAutoRun.current = true;
                    runSearch({
                        latitude: parsedUrlLat,
                        longitude: parsedUrlLng,
                        estimatedDateOfDamage: parsedUrlDate.toISOString(),
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
    }, [parsedUrlDate, parsedUrlLat, parsedUrlLng, runSearch, urlSearchReady]);



    const handleLocationChange = (lat: number, lng: number, displayAddress?: string) => {
        setLatitude(lat);
        setLongitude(lng);
        setAddress(displayAddress);
    };

    const startInvestigation = ({
        searchLatitude,
        searchLongitude,
        searchDate,
        displayAddress,
        estimatedDateOfDamage = searchDate.toISOString(),
    }: {
        searchLatitude: number;
        searchLongitude: number;
        searchDate: Date;
        displayAddress?: string;
        estimatedDateOfDamage?: string;
    }) => {
        setLatitude(searchLatitude);
        setLongitude(searchLongitude);
        setDate(searchDate);
        setAddress(displayAddress);
        const params = new URLSearchParams(searchParams.toString());
        params.set("lat", searchLatitude.toString());
        params.set("lng", searchLongitude.toString());
        params.set("date", estimatedDateOfDamage);
        router.push(`/homeowners?${params.toString()}`, { scroll: false });

        reset(); // Clear previous results/errors
        hasAutoRun.current = true; // Prevent the useEffect from firing it again
        trackDemoEvent("homeowner_search_started");
        runSearch({
            latitude: searchLatitude,
            longitude: searchLongitude,
            estimatedDateOfDamage,
        }, {
            onSuccess: () => {
                trackDemoEvent("homeowner_search_completed");
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

    const handleSubmit = () => {
        if (latitude === null || longitude === null || !date) return;
        startInvestigation({
            searchLatitude: latitude,
            searchLongitude: longitude,
            searchDate: date,
            displayAddress: address,
        });
    };

    const handleDemoInvestigation = () => {
        startInvestigation({
            searchLatitude: FEATURED_DEMO_INVESTIGATION.latitude,
            searchLongitude: FEATURED_DEMO_INVESTIGATION.longitude,
            searchDate: featuredDemoDisplayDate(),
            displayAddress: FEATURED_DEMO_INVESTIGATION.address,
            estimatedDateOfDamage: FEATURED_DEMO_INVESTIGATION.estimatedDateOfDamage,
        });
    };

    const isFormValid = latitude !== null && longitude !== null && date;
    const errorMessage =
        isError && error instanceof Error
            ? error.message
            : isError
                ? "An unexpected error occurred. Please try again."
                : invalidSharedLink
                    ? "This shared investigation link is incomplete or invalid. Select a property and date to start a new search."
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
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-olive/50">Property evidence search</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-olive">Check available weather records.</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-olive/60">Enter the property and approximate date of damage. We&apos;ll organize nearby observations, reports, warning areas, precipitation, and available imagery into a sourced timeline.</p>
                    </div>

                    <div className="flex flex-col gap-4 rounded-2xl border border-brand-lime/60 bg-brand-lime/15 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-lime/50 text-brand-olive">
                                <MapPinned className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-brand-olive/50">Not sure what to search?</p>
                                <h3 className="mt-1 text-sm font-semibold text-brand-olive">Explore a sample weather event</h3>
                                <p className="mt-1 text-xs leading-relaxed text-brand-olive/60">{FEATURED_DEMO_INVESTIGATION.shortLocation} · {FEATURED_DEMO_INVESTIGATION.dateLabel}</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDemoInvestigation}
                            disabled={isLoading}
                            className="shrink-0 border-brand-olive/20 bg-white text-brand-olive hover:bg-brand-offWhite"
                        >
                            Explore sample event <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-brand-oliveDark font-semibold text-sm">
                            <MapPin className="w-4 h-4 text-brand-olive" /> Property location
                        </h3>
                        <div className="bg-zinc-50/50 rounded-xl overflow-hidden min-h-[300px] border border-brand-gray/40 relative">
                            <LocationPicker
                                latitude={latitude}
                                longitude={longitude}
                                selectedAddress={address}
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
                        Check Available Evidence <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <p className="flex items-center justify-center gap-2 text-center text-xs text-brand-olive/50 tracking-wide mt-1">
                        <Database className="h-3.5 w-3.5" /> Demo only. No account or payment information is required.
                    </p>
                </div>
            </div>

            <div className={`mt-6 flex flex-wrap justify-center gap-3 transition-opacity duration-300 ${step === 1 ? 'opacity-100' : 'opacity-0 hidden'}`}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gray bg-white px-3 py-1.5 text-xs font-medium text-brand-olive/70"><Gauge className="h-3.5 w-3.5" /> Observed station records</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gray bg-white px-3 py-1.5 text-xs font-medium text-brand-olive/70"><RadioTower className="h-3.5 w-3.5" /> Reports and warning polygons</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gray bg-white px-3 py-1.5 text-xs font-medium text-brand-olive/70"><FileCheck2 className="h-3.5 w-3.5" /> Source-level limitations</span>
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
                    />
                )}

                <div className="mt-6 flex flex-col justify-between gap-4 bg-brand-olive p-6 rounded-2xl shadow-sm sm:flex-row sm:items-center">
                    <div>
                        <h3 className="text-lg font-bold text-white">Review the complete property evidence report</h3>
                        <p className="text-sm text-white/65 mt-1">See the organized timeline, detailed records, source appendix, methodology, and available imagery context.</p>
                    </div>
                    <Button
                        onClick={() => setUnlockOpen(true)}
                        className="bg-brand-lime text-brand-olive font-bold hover:bg-brand-limeLight px-6 h-11 rounded-xl text-sm"
                    >
                        Preview Full Report
                    </Button>
                </div>

                <div className="mt-4 text-center">
                    <Button variant="ghost" className="text-sm text-brand-olive/50" onClick={() => {
                        resetInvestigation();
                    }}>
                        Start New Search
                    </Button>
                </div>
            </div>


            {/* ─── Unlocked report / Step 3 ─── */}
            <div ref={reportRef} className={`w-full transition-all duration-500 ease-in-out ${step === 3 ? 'opacity-100 translate-y-0 mt-8' : 'opacity-0 h-0 hidden translate-y-12'}`}>
                {results && latitude !== null && longitude !== null && date && <OfficialReport report={{ data: results, latitude, longitude, date, address }} onStartNewSearch={resetInvestigation} />}
            </div>
            <DemoUnlockModal open={unlockOpen} onOpenChange={setUnlockOpen} onUnlock={() => { setUnlockOpen(false); setStep(3); setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100); }} />
        </div>
    );
}

export default function EvidenceInvestigation() {
    return (
        <Suspense fallback={
            <div className="w-full flex items-center justify-center p-12">
                <LoadingState />
            </div>
        }>
            <EvidenceInvestigationContent />
        </Suspense>
    );
}
