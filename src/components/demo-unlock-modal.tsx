"use client";

import { CheckCircle2, FileCheck2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export default function DemoUnlockModal({ open, onOpenChange, onUnlock }: { open: boolean; onOpenChange: (open: boolean) => void; onUnlock: () => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <div className="flex items-start justify-between gap-4">
        <div><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-lime/25"><FileCheck2 className="h-5 w-5 text-brand-olive" /></div><DialogTitle className="text-xl font-bold text-brand-olive">Preview the property evidence report</DialogTitle><DialogDescription className="mt-2 text-sm text-brand-olive/65">This demo opens a sample report. No payment information is requested, collected, or processed.</DialogDescription></div>
        <DialogClose asChild><Button aria-label="Close demo unlock" variant="ghost" size="icon"><X /></Button></DialogClose>
      </div>
      <div className="mt-6 space-y-3 rounded-2xl border border-brand-gray/50 bg-brand-offWhite p-5 text-sm text-brand-olive/75">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-olive/50">Included in this preview</p>
        {["Property and approximate date", "Weather observations with source context", "Available imagery context", "Downloadable demo evidence report"].map(item => <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand-olive" />{item}</div>)}
      </div>
      <Button onClick={onUnlock} className="mt-6 h-12 w-full bg-brand-lime font-bold text-brand-olive hover:bg-brand-limeLight">Open demo report</Button>
    </DialogContent>
  </Dialog>;
}
