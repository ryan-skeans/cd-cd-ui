"use client";

import { ChevronDown, ChevronLeft, Download, FileCheck2, LockKeyhole, Settings2, X } from "lucide-react";
import { RefObject, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
    createRecommendedReportPdfConfiguration,
    getAvailableReportContent,
    getAvailableReportSections,
    getReportSectionSelection,
    ReportCustomizationInput,
    ReportPdfConfiguration,
    ReportSectionId,
    REPORT_SECTION_DEFINITIONS,
    REQUIRED_REPORT_CONTENT,
    setReportContent,
    setReportSectionContent,
} from "@/lib/report-sections";
import { cn } from "@/lib/utils";

type ReportPdfStep = "choose" | "customize";

interface ReportPdfDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGenerate: (configuration?: ReportPdfConfiguration) => void;
    onCustomizeOpened: () => void;
    onRecommendationsRestored: () => void;
    input: ReportCustomizationInput;
    preparing: boolean;
    error: string | null;
    returnFocusRef: RefObject<HTMLButtonElement>;
}

function initialExpandedSections() {
    return Object.fromEntries(
        REPORT_SECTION_DEFINITIONS.map((section) => [section.id, section.initiallyExpanded]),
    ) as Record<ReportSectionId, boolean>;
}

export default function ReportPdfDialog({
    open,
    onOpenChange,
    onGenerate,
    onCustomizeOpened,
    onRecommendationsRestored,
    input,
    preparing,
    error,
    returnFocusRef,
}: ReportPdfDialogProps) {
    const { data, eventType } = input;
    const [step, setStep] = useState<ReportPdfStep>("choose");
    const [configuration, setConfiguration] = useState(() => createRecommendedReportPdfConfiguration(input));
    const [requiredDetailsExpanded, setRequiredDetailsExpanded] = useState(false);
    const [expandedSections, setExpandedSections] = useState(initialExpandedSections);
    const availableSections = getAvailableReportSections(input);

    useEffect(() => {
        if (!open) return;
        setStep("choose");
        setConfiguration(createRecommendedReportPdfConfiguration({ data, eventType }));
        setRequiredDetailsExpanded(false);
        setExpandedSections(initialExpandedSections());
    }, [data, eventType, open]);

    const close = () => {
        if (!preparing) onOpenChange(false);
    };

    const showCustomization = () => {
        setStep("customize");
        onCustomizeOpened();
    };

    const restoreRecommended = () => {
        setConfiguration(createRecommendedReportPdfConfiguration(input));
        onRecommendationsRestored();
    };

    return <Dialog open={open} onOpenChange={(nextOpen) => {
        if (preparing && !nextOpen) return;
        onOpenChange(nextOpen);
    }}>
        <DialogContent
            aria-modal="true"
            className="flex max-h-[calc(100dvh-2rem)] max-w-2xl flex-col overflow-hidden p-0"
            onEscapeKeyDown={(event) => { if (preparing) event.preventDefault(); }}
            onPointerDownOutside={(event) => { if (preparing) event.preventDefault(); }}
            onCloseAutoFocus={(event) => {
                event.preventDefault();
                returnFocusRef.current?.focus();
            }}
        >
            <div className="flex items-start justify-between gap-4 border-b border-brand-gray px-5 py-5 sm:px-6">
                <div className="min-w-0">
                    {step === "customize" && <button type="button" onClick={() => setStep("choose")} disabled={preparing} className="mb-3 inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-brand-olive/55 hover:text-brand-olive disabled:opacity-50"><ChevronLeft className="h-4 w-4" />Back to PDF options</button>}
                    <DialogTitle className="text-xl font-bold text-brand-olive sm:text-2xl">{step === "choose" ? "Generate report PDF" : "Customize report"}</DialogTitle>
                    <DialogDescription className="mt-2 max-w-xl text-sm leading-relaxed text-brand-olive/60">
                        {step === "choose"
                            ? "Download the complete report now, or choose which report findings to include."
                            : "Choose the report findings relevant to this document. Required identity, source, and limitation details remain included."}
                    </DialogDescription>
                </div>
                <Button type="button" variant="ghost" size="icon" aria-label="Close PDF options" onClick={close} disabled={preparing} className="min-h-11 min-w-11 shrink-0"><X /></Button>
            </div>

            {step === "choose" ? <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                <div className="grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => onGenerate()} disabled={preparing} className="group min-h-40 rounded-2xl border-2 border-brand-olive bg-brand-olive p-5 text-left text-white transition-colors hover:bg-brand-olive/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-lime text-brand-olive"><FileCheck2 className="h-5 w-5" /></span>
                        <span className="mt-4 block font-semibold">{preparing ? "Generating complete report…" : "Generate complete report"}</span>
                        <span className="mt-2 block text-xs leading-relaxed text-white/65">Use the standard configuration and download every normally included report section.</span>
                    </button>
                    <button type="button" onClick={showCustomization} disabled={preparing} className="min-h-40 rounded-2xl border border-brand-gray bg-brand-offWhite p-5 text-left text-brand-olive transition-colors hover:border-brand-olive/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2 disabled:opacity-50">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-lime/30"><Settings2 className="h-5 w-5" /></span>
                        <span className="mt-4 block font-semibold">Customize report</span>
                        <span className="mt-2 block text-xs leading-relaxed text-brand-olive/55">Choose individual findings while keeping required context and source documentation.</span>
                    </button>
                </div>
                {error && <p role="alert" className="mt-4 rounded-xl border border-red-500/20 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
                <p aria-live="polite" className="sr-only">{preparing ? "Generating PDF" : error ?? ""}</p>
            </div> : <>
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                    <section aria-labelledby="required-report-content">
                        <Collapsible open={requiredDetailsExpanded} onOpenChange={setRequiredDetailsExpanded} className="overflow-hidden rounded-2xl border border-brand-gray bg-brand-offWhite/60">
                            <CollapsibleTrigger className="flex min-h-[4.5rem] w-full items-center gap-3 px-4 py-3 text-left text-brand-olive transition-colors hover:bg-brand-offWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-olive disabled:cursor-not-allowed disabled:opacity-60" disabled={preparing} aria-label={`${requiredDetailsExpanded ? "Collapse" : "Expand"} ${REQUIRED_REPORT_CONTENT.length} required report details`} aria-describedby="required-report-content-reason">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-olive text-white"><LockKeyhole className="h-4 w-4" aria-hidden="true" /></span>
                                <span className="min-w-0 flex-1">
                                    <span id="required-report-content" role="heading" aria-level={3} className="block text-sm font-semibold">Required report details</span>
                                    <span id="required-report-content-reason" className="mt-1 block text-xs leading-relaxed text-brand-olive/55">Included automatically to preserve identity, source traceability, and required limitations.</span>
                                </span>
                                <span className="hidden shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-olive/50 sm:inline">{REQUIRED_REPORT_CONTENT.length} required</span>
                                <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", requiredDetailsExpanded && "rotate-180")} aria-hidden="true" />
                            </CollapsibleTrigger>
                            <CollapsibleContent id="required-report-content-list" className="border-t border-brand-gray bg-white/70">
                                <div className="divide-y divide-brand-gray sm:ml-12">{REQUIRED_REPORT_CONTENT.map((content) => {
                                    const controlId = `required-report-content-${content.id}`;
                                    const descriptionId = `${controlId}-description`;
                                    return <div key={content.id} className="flex min-h-14 items-start gap-3 px-4 py-3">
                                        <Checkbox id={controlId} checked disabled aria-describedby={`${descriptionId} required-report-content-reason`} aria-label={`${content.label}, included and locked`} className="mt-0.5" />
                                        <div className="min-w-0 flex-1"><label htmlFor={controlId} className="text-sm font-semibold text-brand-olive">{content.label}</label><p id={descriptionId} className="mt-1 text-xs leading-relaxed text-brand-olive/55">{content.description}</p></div>
                                    </div>;
                                })}</div>
                            </CollapsibleContent>
                        </Collapsible>
                    </section>

                    <section aria-labelledby="customizable-report-content" className="mt-5">
                        <div className="flex items-end justify-between gap-3"><div><h3 id="customizable-report-content" className="text-sm font-semibold text-brand-olive">Customizable report content</h3><p className="mt-1 text-xs text-brand-olive/50">Recommendations reflect this report&apos;s evidence and event type.</p></div><button type="button" onClick={restoreRecommended} disabled={preparing} className="min-h-9 shrink-0 rounded-lg px-2 text-xs font-semibold text-brand-olive underline-offset-4 hover:underline disabled:opacity-50">Reset to recommended</button></div>
                        <div className="mt-3 space-y-3">{availableSections.map((section) => {
                            const sectionContent = getAvailableReportContent(input, section.id);
                            const selection = getReportSectionSelection(input, configuration, section.id);
                            const expanded = expandedSections[section.id];
                            const parentChecked = selection.state === "indeterminate" ? "indeterminate" : selection.state === "checked";
                            const parentId = `report-section-${section.id}`;
                            const contentId = `${parentId}-content`;
                            return <Collapsible key={section.id} open={expanded} onOpenChange={(nextOpen) => setExpandedSections((current) => ({ ...current, [section.id]: nextOpen }))} className="overflow-hidden rounded-2xl border border-brand-gray bg-white">
                                <div className="flex items-start gap-3 p-4">
                                    <Checkbox id={parentId} checked={parentChecked} disabled={preparing} aria-describedby={`${parentId}-description ${parentId}-count`} onCheckedChange={(checked) => setConfiguration((current) => setReportSectionContent(input, current, section.id, checked === true))} className="mt-0.5" />
                                    <div className="min-w-0 flex-1"><label htmlFor={parentId} className="text-sm font-semibold text-brand-olive">{section.label}</label><p id={`${parentId}-description`} className="mt-1 text-xs leading-relaxed text-brand-olive/55">{section.description}</p><p id={`${parentId}-count`} className="mt-1 text-[10px] font-bold uppercase tracking-wider text-brand-olive/45">{selection.selectedCount} of {selection.totalCount} included</p></div>
                                    <CollapsibleTrigger asChild><Button type="button" variant="ghost" size="icon" aria-label={`${expanded ? "Collapse" : "Expand"} ${section.label}`} className="min-h-11 min-w-11 shrink-0"><ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} /></Button></CollapsibleTrigger>
                                </div>
                                <CollapsibleContent id={contentId} className="border-t border-brand-gray bg-brand-offWhite/35">
                                    <div className="divide-y divide-brand-gray sm:ml-10">{sectionContent.map((content) => {
                                        const childId = `report-content-${content.id.replace(".", "-")}`;
                                        const descriptionId = `${childId}-description`;
                                        return <div key={content.id} className="flex min-h-16 items-start gap-3 px-4 py-3">
                                            <Checkbox id={childId} checked={configuration.includedContent.includes(content.id)} disabled={preparing} aria-describedby={descriptionId} onCheckedChange={(checked) => setConfiguration((current) => setReportContent(input, current, content.id, checked === true))} className="mt-0.5" />
                                            <div className="min-w-0"><label htmlFor={childId} className="text-sm font-semibold text-brand-olive">{content.label}</label><p id={descriptionId} className="mt-1 text-xs leading-relaxed text-brand-olive/55">{content.description}</p></div>
                                        </div>;
                                    })}</div>
                                </CollapsibleContent>
                            </Collapsible>;
                        })}</div>
                    </section>

                    {error && <p role="alert" className="mt-4 rounded-xl border border-red-500/20 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
                    <p aria-live="polite" className="sr-only">{preparing ? "Generating customized PDF" : error ?? ""}</p>
                </div>
                <div className="flex flex-col-reverse gap-2 border-t border-brand-gray bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <Button type="button" variant="outline" onClick={close} disabled={preparing} className="min-h-11">Cancel</Button>
                    <Button type="button" onClick={() => onGenerate(configuration)} disabled={preparing} className="min-h-11 bg-brand-lime font-bold text-brand-olive hover:bg-brand-limeLight"><Download className="h-4 w-4" />{preparing ? "Generating PDF…" : "Generate PDF"}</Button>
                </div>
            </>}
        </DialogContent>
    </Dialog>;
}
