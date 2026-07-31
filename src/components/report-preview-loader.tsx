"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type OfficialReportComponent from "@/components/official-report";

const OfficialReport = dynamic(() => import("@/components/official-report"), {
    ssr: false,
    loading: () => <div role="status" className="mx-auto max-w-5xl rounded-3xl border border-brand-gray bg-white p-10 text-center text-sm text-brand-olive/55">Preparing the demo report preview…</div>,
});

export default function ReportPreviewLoader(props: ComponentProps<typeof OfficialReportComponent>) {
    return <OfficialReport {...props} />;
}
