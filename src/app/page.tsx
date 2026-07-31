"use client";

import { useRef } from "react";
import Sidebar from "@/components/sidebar";
import EvidenceInvestigation from "@/components/evidence-investigation";
import MarketingSections from "@/components/marketing-sections";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  const getStartedHandlerRef = useRef<(() => void) | null>(null);

  return (
    <div className="min-h-screen bg-brand-offWhite font-sans flex flex-col lg:flex-row relative">
      {/* ─── Sticky Sidebar ─── */}
      <Sidebar onGetStarted={() => getStartedHandlerRef.current?.()} />

      {/* ─── Scrollable Main Content ─── */}
      <main className="flex-1 w-full lg:max-w-none px-4 py-9 sm:px-8 sm:py-12 lg:px-12 lg:py-16 space-y-20 overflow-x-hidden">

        {/* Map Interface and Timeline Steps */}
        <EvidenceInvestigation onGetStartedRef={(handler) => { getStartedHandlerRef.current = handler; }} />

        <MarketingSections />

        <footer className="mx-auto flex w-full max-w-4xl flex-col gap-3 border-t border-brand-gray/70 py-8 text-xs text-brand-olive/50 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-olive" /> ClaimDefender Evidence</span>
          <span>Demo environment · No data is retained</span>
        </footer>
      </main>
    </div>
  );
}
