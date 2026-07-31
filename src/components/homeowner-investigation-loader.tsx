"use client";

import dynamic from "next/dynamic";

const EvidenceInvestigation = dynamic(() => import("@/components/evidence-investigation"), {
    ssr: false,
    loading: () => <div role="status" className="mx-auto max-w-4xl rounded-3xl border border-brand-gray bg-white p-10 text-center text-sm text-brand-olive/55">Preparing the property evidence search…</div>,
});

export default function HomeownerInvestigationLoader() {
    return <EvidenceInvestigation />;
}
