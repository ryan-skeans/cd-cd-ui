"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Wind,
    CloudHail,
    Droplets,
    AlertTriangle,
    ShieldCheck,
    ShieldX,
    Copy,
    Check,
    Satellite,
    Lock,
    ArrowRight,
    Sparkles,
    FileText,
    Eye,
} from "lucide-react";
import { SearchResponse } from "@/lib/types";

interface ResultsDashboardProps {
    data: SearchResponse;
}

function getScoreColor(score: number): string {
    if (score >= 70) return "text-emerald-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
}

function getScoreLabel(score: number): string {
    if (score >= 70) return "High Viability";
    if (score >= 40) return "Moderate Viability";
    return "Low Viability";
}

function getScoreIcon(score: number) {
    if (score >= 70) return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
    if (score >= 40)
        return <AlertTriangle className="w-6 h-6 text-amber-400" />;
    return <ShieldX className="w-6 h-6 text-red-400" />;
}

function getProgressColor(score: number): string {
    if (score >= 70)
        return "[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400";
    if (score >= 40)
        return "[&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-amber-400";
    return "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-400";
}

function getScoreBg(score: number): string {
    if (score >= 70) return "from-emerald-500/10 to-emerald-500/5";
    if (score >= 40) return "from-amber-500/10 to-amber-500/5";
    return "from-red-500/10 to-red-500/5";
}

export default function ResultsDashboard({ data }: ResultsDashboardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(data.evidenceTemplate);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback
            const textarea = document.createElement("textarea");
            textarea.value = data.evidenceTemplate;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const safeFormatDate = (dateStr: string | undefined | null): string => {
        if (!dateStr) return "N/A";
        // Gracefully handle explanatory backend messages
        if (dateStr.includes("Not available") || dateStr === "Unknown") {
            return dateStr;
        }
        try {
            const parsed = new Date(dateStr);
            if (isNaN(parsed.getTime())) return "N/A";
            return format(parsed, "MMM d, yyyy 'at' h:mm a");
        } catch {
            return "N/A";
        }
    };

    const beforeDate = safeFormatDate(data.satellite?.beforeDate);
    const afterDate = safeFormatDate(data.satellite?.afterDate);

    // Prepend the API base URL for image proxy paths
    const imageBase =
        typeof window !== "undefined" && window.location.hostname === "localhost"
            ? "http://localhost:8787"
            : "";

    const getImageUrl = (url?: string) => {
        if (!url) return "";

        // On localhost, strip Cloudflare image resizing prefix since CF isn't deployed locally
        if (typeof window !== "undefined" && window.location.hostname === "localhost") {
            if (url.startsWith("/cdn-cgi/image/")) {
                const httpIdx = url.indexOf("http");
                if (httpIdx !== -1) {
                    return url.substring(httpIdx);
                }
            }
        }

        if (url.startsWith("http")) return url;
        return `${imageBase}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
            {/* ─── Truth Score ─── */}
            <Card className="bg-white border-brand-gray/30 text-brand-olive shadow-sm overflow-hidden">
                <div className={`bg-gradient-to-br ${getScoreBg(data.viabilityScore)} p-1`}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {getScoreIcon(data.viabilityScore)}
                                <div>
                                    <CardTitle className="text-xl font-bold">
                                        Claim Viability Score
                                    </CardTitle>
                                    <CardDescription className="text-brand-olive/60">
                                        AI-generated confidence in the legitimacy of this claim
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="text-right">
                                <div
                                    className={`text-5xl font-black tracking-tight ${getScoreColor(
                                        data.viabilityScore
                                    )}`}
                                >
                                    {data.viabilityScore}
                                </div>
                                <div
                                    className={`text-sm font-medium ${getScoreColor(
                                        data.viabilityScore
                                    )}`}
                                >
                                    {getScoreLabel(data.viabilityScore)}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Progress
                            value={data.viabilityScore}
                            className={`h-3 bg-secondary/50 rounded-full ${getProgressColor(
                                data.viabilityScore
                            )}`}
                        />
                        <div className="flex justify-between mt-2 text-xs text-brand-olive/60">
                            <span>0 — Not Viable</span>
                            <span>50 — Uncertain</span>
                            <span>100 — Highly Viable</span>
                        </div>
                    </CardContent>
                </div>
            </Card>

            {/* ─── NOAA + Satellite side-by-side ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Meteorological Data Card */}
                <Card className="bg-white border-brand-gray/30 text-brand-olive shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Wind className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                                <CardTitle className="text-base text-brand-olive">
                                    Meteorological Data
                                </CardTitle>
                                <CardDescription className="text-brand-olive/60">NOAA Storm Records</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Wind */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-brand-gray/30">
                            <div className="flex items-center gap-3">
                                <Wind className="w-5 h-5 text-sky-400" />
                                <div>
                                    <div className="text-sm font-medium">Max Wind Gust</div>
                                    <div className="text-xs text-brand-olive/60">
                                        Peak recorded wind speed
                                    </div>
                                </div>
                            </div>
                            <div className="text-lg font-bold font-mono text-brand-olive">
                                {data.noaa.obfuscatedWind}
                            </div>
                        </div>

                        {/* Hail */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-brand-gray/30">
                            <div className="flex items-center gap-3">
                                <CloudHail className="w-5 h-5 text-indigo-500" />
                                <div>
                                    <div className="text-sm font-medium">Max Hail Size</div>
                                    <div className="text-xs text-brand-olive/60">
                                        Largest confirmed hailstone
                                    </div>
                                </div>
                            </div>
                            <div className="text-lg font-bold font-mono text-brand-olive">
                                {data.noaa.obfuscatedHail}
                            </div>
                        </div>

                        {/* Precipitation */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-brand-gray/30">
                            <div className="flex items-center gap-3">
                                <Droplets className="w-5 h-5 text-cyan-500" />
                                <div>
                                    <div className="text-sm font-medium">Total Precipitation</div>
                                    <div className="text-xs text-brand-olive/60">
                                        Rainfall ±1 week of damage date
                                    </div>
                                </div>
                            </div>
                            <div className="text-lg font-bold font-mono text-brand-olive">
                                {data.noaa.totalPrecipitationInches != null
                                    ? `${data.noaa.totalPrecipitationInches.toFixed(2)} in`
                                    : "N/A"}
                            </div>
                        </div>

                        {/* Severe Alerts */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-brand-gray/30">
                            <div className="flex items-center gap-3">
                                <AlertTriangle
                                    className={`w-5 h-5 ${data.noaa.hasSevereAlerts
                                        ? "text-amber-500"
                                        : "text-brand-gray"
                                        }`}
                                />
                                <div>
                                    <div className="text-sm font-medium">Severe Alerts</div>
                                    <div className="text-xs text-brand-olive/60">
                                        NWS severe weather alerts
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`text-sm font-semibold px-3 py-1 rounded-full ${data.noaa.hasSevereAlerts
                                    ? "bg-amber-500/10 text-amber-400"
                                    : "bg-zinc-500/10 text-muted-foreground"
                                    }`}
                            >
                                {data.noaa.hasSevereAlerts ? "Yes" : "None Found"}
                            </div>
                        </div>

                        {/* Tornado Reported Badge */}
                        {data.noaa.tornadoReported && (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                                    <div>
                                        <div className="text-sm font-medium text-red-500">Tornado</div>
                                        <div className="text-xs text-red-500/80">
                                            Proximity vortex reported
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white uppercase tracking-wider">
                                    Reported
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Satellite Evidence Card */}
                <Card className="bg-white border-brand-gray/30 text-brand-olive shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <Satellite className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                                <CardTitle className="text-base text-brand-olive">
                                    Satellite Evidence
                                </CardTitle>
                                <CardDescription className="text-brand-olive/60">
                                    Before & After Comparison
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Before */}
                            <div className="space-y-2">
                                <div className="text-xs font-medium text-brand-olive/60 uppercase tracking-wider">
                                    Before
                                </div>
                                <div className="relative aspect-square rounded-lg overflow-hidden border border-brand-gray/30 bg-zinc-50">
                                    {data.satellite?.beforeThumbnailUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={getImageUrl(data.satellite.beforeThumbnailUrl)}
                                            alt="Satellite view before damage"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                            <Eye className="w-8 h-8 text-brand-olive/20 mb-2" />
                                            {data.satellite?.beforeDate?.includes("Not available") && (
                                                <span className="text-[10px] text-brand-olive/50 leading-tight">
                                                    {data.satellite.beforeDate}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-brand-olive/60 mt-2 line-clamp-2">
                                    {data.satellite?.beforeDate?.includes("Not available") ? "No Imagery" : beforeDate}
                                </div>
                            </div>

                            {/* After */}
                            <div className="space-y-2">
                                <div className="text-xs font-medium text-brand-olive/60 uppercase tracking-wider">
                                    After
                                </div>
                                <div className="relative aspect-square rounded-lg overflow-hidden border border-brand-gray/30 bg-zinc-50">
                                    {data.satellite?.afterThumbnailUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={getImageUrl(data.satellite.afterThumbnailUrl)}
                                            alt="Satellite view after damage"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                            <Eye className="w-8 h-8 text-brand-olive/20 mb-2" />
                                            {data.satellite?.afterDate?.includes("Not available") && (
                                                <span className="text-[10px] text-brand-olive/50 leading-tight">
                                                    {data.satellite.afterDate}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-brand-olive/60 mt-2 line-clamp-2">
                                    {data.satellite?.afterDate?.includes("Not available") ? "No Imagery" : afterDate}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ─── Factual Rebuttal Card ─── */}
            <Card className="bg-white border-brand-gray/30 text-brand-olive shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <CardTitle className="text-base text-brand-olive">
                                    Evidence Documentation
                                </CardTitle>
                                <CardDescription className="text-brand-olive/60">
                                    Formal investigative summary for claim records
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className="gap-2 border-brand-gray/30 hover:bg-zinc-50 bg-white text-brand-olive transition-all"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative p-5 rounded-lg bg-zinc-50 border border-brand-gray/30 font-mono text-sm leading-relaxed text-brand-olive/80">
                        {/* Decorative "document" lines */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/30 rounded-l-lg" />
                        <p className="pl-4">{data.evidenceTemplate}</p>
                    </div>
                </CardContent>
            </Card>

            {/* ─── Upgrade CTA ─── */}
            <Card className="bg-white border-brand-gray/30 text-brand-olive shadow-sm relative overflow-hidden">
                {/* Blurred premium content preview */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-10" />
                <CardContent className="p-6">
                    <div className="relative">
                        {/* Simulated locked content */}
                        <div className="space-y-3 blur-[6px] select-none pointer-events-none opacity-40">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 bg-brand-olive/20 rounded" />
                                <div className="h-3 w-48 bg-brand-olive/10 rounded" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="h-32 bg-brand-olive/5 rounded-lg border border-brand-gray/20" />
                                <div className="h-32 bg-brand-olive/5 rounded-lg border border-brand-gray/20" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 w-full bg-brand-olive/10 rounded" />
                                <div className="h-3 w-3/4 bg-brand-olive/10 rounded" />
                                <div className="h-3 w-5/6 bg-brand-olive/10 rounded" />
                            </div>
                        </div>

                        {/* Overlay CTA */}
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="text-center space-y-4 p-6">
                                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                    <Lock className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-brand-olive">
                                        Unlock Full Intelligence Report
                                    </h3>
                                    <p className="text-sm text-brand-olive/70 mt-1 max-w-sm">
                                        Upgrade to <span className="text-brand-lime font-bold">Pro</span> to access
                                        unblurred satellite imagery, raw NOAA data, detailed change
                                        detection analysis, and downloadable PDF reports.
                                    </p>
                                </div>
                                <Button className="gap-2 bg-brand-lime text-brand-olive hover:bg-brand-limeLight font-bold">
                                    <Sparkles className="w-4 h-4" />
                                    Upgrade to Pro
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
