import { SearchResponse } from "../lib/types";

export function EvidenceStateNotice({ data }: { data: SearchResponse }) {
    const degradedSources = data.sources.filter(
        (source) => source.status === "failed" || source.status === "partial",
    );
    if (degradedSources.length > 0) {
        return (
            <div className="rounded-2xl border border-amber-700/20 bg-amber-50 p-4 text-brand-olive" role="status">
                <p className="text-sm font-semibold">Partial evidence package</p>
                <ul className="mt-2 space-y-1 pl-6 text-xs leading-relaxed text-brand-olive/70">
                    {degradedSources.map((source) => (
                        <li key={source.id} className="list-disc">
                            {source.message ?? `${source.dataset} was partially unavailable.`}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    const substantiveCount = data.summary.localStormReportCount
        + data.summary.warningCount
        + data.summary.officialEventCount
        + (data.summary.maximumObservedWindGustMph === undefined ? 0 : 1);
    if (substantiveCount === 0) {
        return (
            <div className="rounded-2xl border border-brand-gray/70 bg-white p-4 text-sm text-brand-olive/65" role="status">
                No substantive weather records were returned by the searched sources and analysis window. This does not mean no weather occurred.
            </div>
        );
    }

    return null;
}
