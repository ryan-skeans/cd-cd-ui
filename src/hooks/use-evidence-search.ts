import { useMutation } from "@tanstack/react-query";
import { SearchPayload, SearchResponse } from "@/lib/types";
import { parseEvidenceResponse } from "@/lib/response-contract";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

async function retrieveEvidence(
    payload: SearchPayload
): Promise<SearchResponse> {
    const response = await fetch(`${API_URL}/initiateFreeSearch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
            `Server responded with ${response.status}: ${response.statusText}${errorBody ? ` — ${errorBody}` : ""
            }`
        );
    }

    return parseEvidenceResponse(await response.json());
}

export function useEvidenceSearch() {
    return useMutation({
        mutationFn: retrieveEvidence,
        // TanStack will auto-retry once on failure (from provider defaults)
    });
}
