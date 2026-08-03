import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function BrandMark({ inverse = false }: { inverse?: boolean }) {
    return (
        <Link href="/" className={`inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime ${inverse ? "text-white" : "text-brand-olive"}`}>
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${inverse ? "border border-white/15 bg-white/5" : "bg-brand-olive"}`}>
                <ShieldCheck className="h-5 w-5 text-brand-lime" aria-hidden="true" />
            </span>
            <span>
                <span className="block text-sm font-semibold tracking-tight">ClaimDefender</span>
                <span className={`block text-[9px] uppercase tracking-[0.16em] ${inverse ? "text-white/60" : "text-brand-olive/70"}`}>Weather evidence</span>
            </span>
        </Link>
    );
}
