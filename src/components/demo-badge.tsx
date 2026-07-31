export function DemoBadge({ inverse = false }: { inverse?: boolean }) {
    return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] ${inverse ? "border-white/15 bg-white/10 text-brand-lime" : "border-brand-olive/15 bg-brand-lime/30 text-brand-olive"}`}>Demo</span>;
}

export function DemoDisclosure({ compact = false }: { compact?: boolean }) {
    return (
        <div className={`border border-amber-900/15 bg-amber-50 text-amber-950 ${compact ? "px-3 py-2 text-[11px]" : "rounded-2xl px-4 py-3 text-xs"}`} role="note">
            Demo mode. Workspace data is stored only in this browser. Do not enter sensitive personal, policy, or payment information.
        </div>
    );
}
