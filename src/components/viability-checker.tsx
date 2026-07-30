"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFreeSearch } from "@/hooks/use-free-search";
import LocationPicker from "@/components/location-picker";
import DatePicker from "@/components/date-picker";
import LoadingState from "@/components/loading-state";
import ResultsDashboard from "@/components/results-dashboard";
import { Shield, MapPin, Calendar, ArrowRight, Lock } from "lucide-react";

interface ViabilityCheckerProps {
    onGetStartedRef?: (handler: () => void) => void;
}

function ViabilityCheckerContent({ onGetStartedRef }: ViabilityCheckerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const urlLat = searchParams.get("lat");
    const urlLng = searchParams.get("lng");
    const urlDate = searchParams.get("date");

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [latitude, setLatitude] = useState<number | null>(urlLat ? parseFloat(urlLat) : null);
    const [longitude, setLongitude] = useState<number | null>(urlLng ? parseFloat(urlLng) : null);
    const [date, setDate] = useState<Date | undefined>(urlDate ? new Date(urlDate) : undefined);

    const resultsRef = useRef<HTMLDivElement>(null);
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
    } = useFreeSearch();

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



    const handleLocationChange = (lat: number, lng: number) => {
        setLatitude(lat);
        setLongitude(lng);
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
                <div ref={locationCardRef} className="bg-white text-brand-olive rounded-3xl p-6 shadow-xl shadow-brand-olive/5 border border-brand-gray/30 space-y-6 relative overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8">
                            <LoadingState />
                        </div>
                    )}

                    <div className="space-y-3">
                        <h2 className="flex items-center gap-2 text-brand-oliveDark font-semibold text-sm">
                            <MapPin className="w-4 h-4 text-brand-olive" /> Property Location
                        </h2>
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
                        <h2 className="flex items-center gap-2 text-brand-oliveDark font-semibold text-sm">
                            <Calendar className="w-4 h-4 text-brand-olive" /> Estimated Date Of Damage
                        </h2>
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
                        Run Free Viability Check <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <p className="text-center text-xs text-brand-olive/50 tracking-wide mt-4">
                        Commonly requested for tornadoes, large hail, straight-line winds, and hurricanes.
                    </p>
                </div>
            </div>

            {/* ─── Timeline Info (Shown below Map visually aligning with Figma text) ─── */}
            <div className={`text-center space-y-2 mt-8 transition-opacity duration-300 ${step === 1 ? 'opacity-100' : 'opacity-0 hidden'}`}>
                <p className="text-[#3A412A] font-medium text-lg leading-snug">
                    Use transparency, official unbiased data, <br />
                    and AI powered insights to get the coverage you deserve.
                </p>
                <div className="flex justify-center items-center gap-6 mt-4 text-brand-olive text-sm font-semibold">
                    <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> NOAA</span>
                    <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> NWS Alerts</span>
                </div>
            </div>


            {/* ─── Results / Step 2 ─── */}
            <div
                ref={resultsRef}
                className={`w-full transition-all duration-500 ease-in-out ${step === 2 ? 'opacity-100 translate-y-0 mt-8' : 'opacity-0 h-0 hidden translate-y-12'}`}
            >
                {results && <ResultsDashboard data={results} />}

                <div className="mt-8 flex justify-between items-center bg-white border border-brand-gray p-6 rounded-2xl shadow-sm">
                    <div>
                        <h3 className="text-lg font-bold text-brand-olive">Unlock Full Report & Evidence</h3>
                        <p className="text-sm text-brand-olive/60 mt-1">Access non-obfuscated satellite imagery and official PDF documentation.</p>
                    </div>
                    <Button
                        onClick={() => setStep(3)}
                        className="bg-brand-lime text-brand-olive font-bold hover:bg-brand-limeLight px-8 h-12 rounded-xl text-base"
                    >
                        Initiate Payment
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


            {/* ─── Payment / Step 3 (TBD) ─── */}
            <div className={`w-full transition-all duration-500 ease-in-out ${step === 3 ? 'opacity-100 translate-y-0 mt-8' : 'opacity-0 h-0 hidden translate-y-12'}`}>
                <div className="bg-white border-2 border-brand-lime border-dashed rounded-3xl p-16 text-center space-y-6">
                    <div className="w-20 h-20 bg-brand-lime/20 rounded-full flex items-center justify-center mx-auto text-brand-olive">
                        <Lock className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-brand-olive mb-4">TBD - Payment Flow</h2>
                        <p className="text-lg text-brand-olive/70 max-w-lg mx-auto">
                            This is the placeholder for the Stripe/Checkout integration and full PDF report generation.
                        </p>
                    </div>
                    <Button onClick={() => setStep(2)} variant="outline" className="border-brand-gray text-brand-olive mt-8">
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function ViabilityChecker({ onGetStartedRef }: ViabilityCheckerProps) {
    return (
        <Suspense fallback={
            <div className="w-full flex items-center justify-center p-12">
                <LoadingState />
            </div>
        }>
            <ViabilityCheckerContent onGetStartedRef={onGetStartedRef} />
        </Suspense>
    );
}
