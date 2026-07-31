import { DemoPackageStatus, packageStatusLabels } from "@/lib/demo-workspace";

const styles: Record<DemoPackageStatus, string> = {
    draft: "border-zinc-400/30 bg-zinc-100 text-zinc-700",
    searching: "border-sky-500/25 bg-sky-50 text-sky-800",
    evidence_ready: "border-emerald-500/25 bg-emerald-50 text-emerald-800",
    report_previewed: "border-violet-500/25 bg-violet-50 text-violet-800",
    needs_refresh: "border-amber-500/25 bg-amber-50 text-amber-900",
};

export default function PackageStatus({ status }: { status: DemoPackageStatus }) {
    return <span className={`inline-flex w-fit justify-self-start whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] ${styles[status]}`}>{packageStatusLabels[status]}</span>;
}
