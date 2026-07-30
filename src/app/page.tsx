"use client";

import { useRef } from "react";
import Sidebar from "@/components/sidebar";
import ViabilityChecker from "@/components/viability-checker";
import MarketingSections from "@/components/marketing-sections";
import { ArrowLeftRight } from "lucide-react";

export default function Home() {
  const getStartedHandlerRef = useRef<(() => void) | null>(null);

  return (
    <div className="min-h-screen bg-brand-offWhite font-sans flex flex-col lg:flex-row relative">
      {/* ─── Sticky Sidebar ─── */}
      <Sidebar onGetStarted={() => getStartedHandlerRef.current?.()} />

      {/* ─── Scrollable Main Content ─── */}
      <main className="flex-1 w-full lg:max-w-none px-4 sm:px-8 lg:px-12 py-12 lg:py-20 space-y-32 overflow-x-hidden">

        {/* Map Interface and Timeline Steps */}
        <ViabilityChecker onGetStartedRef={(handler) => { getStartedHandlerRef.current = handler; }} />

        {/* Placeholder Features Sections */}
        <MarketingSections />

        {/* ─── Large Footer Area ─── */}
        <footer className="w-full max-w-4xl mx-auto pt-16 border-t border-brand-gray/50 pb-8 flex flex-col gap-16">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
            <ArrowLeftRight className="w-10 h-10 text-brand-olive mix-blend-multiply" />
            <div className="text-xs text-brand-olive flex flex-col gap-1 font-medium">
              <span className="text-brand-olive/50 mb-1">Contact</span>
              <a href="#" className="hover:underline">hello@claimdefender.ai</a>
              <a href="#" className="hover:underline">Instagram</a>
              <a href="#" className="hover:underline">X</a>
              <a href="#" className="hover:underline">LinkedIn</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-brand-olive">
              ClaimDefender
            </h1>
            <div className="flex gap-4 text-[10px] text-brand-olive/50">
              <a href="#" className="hover:text-brand-olive transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-brand-olive transition-colors">Privacy</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
