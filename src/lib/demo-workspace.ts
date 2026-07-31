import { SearchResponse } from "./types";
import { createSampleEvidence, SAMPLE_PROPERTY } from "./sample-evidence";

export const DEMO_WORKSPACE_STORAGE_KEY = "claimdefender-demo-workspace:v1";
export const MAX_DEMO_PACKAGES = 25;

const SAMPLE_DRAFT_PROPERTY: DemoPropertyContext = {
    address: "44 Oak Avenue, Example, KS",
    latitude: 39.0473,
    longitude: -95.6752,
    propertyType: "residential",
    estimatedDateOfDamage: "2024-05-19T12:00:00.000Z",
};

export type DemoPackageStatus = "draft" | "searching" | "evidence_ready" | "report_previewed" | "needs_refresh";

export interface DemoOrganization {
    id: string;
    name: string;
    type: string;
    preparedBy?: string;
    email?: string;
    phone?: string;
    website?: string;
    logoDataUrl?: string;
}

export interface DemoClientContext {
    displayName: string;
    reference?: string;
}

export interface DemoClaimContext {
    claimReference?: string;
    carrier?: string;
    eventType?: string;
    notes?: string;
}

export interface DemoPropertyContext {
    address?: string;
    latitude?: number;
    longitude?: number;
    propertyType?: "residential" | "commercial" | "other";
    estimatedDateOfDamage?: string;
}

export interface DemoEvidencePackage {
    id: string;
    isSample: boolean;
    status: DemoPackageStatus;
    client: DemoClientContext;
    claim: DemoClaimContext;
    property: DemoPropertyContext;
    evidence?: SearchResponse;
    createdAt: string;
    updatedAt: string;
    reportPreviewedAt?: string;
}

export interface DemoWorkspace {
    version: 1;
    organization: DemoOrganization;
    packages: DemoEvidencePackage[];
}

export const packageStatusLabels: Record<DemoPackageStatus, string> = {
    draft: "Draft",
    searching: "Searching",
    evidence_ready: "Evidence Ready",
    report_previewed: "Report Previewed",
    needs_refresh: "Needs Refresh",
};

export function createPackageId() {
    return `pkg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createSampleWorkspace(): DemoWorkspace {
    const evidence = createSampleEvidence();
    return {
        version: 1,
        organization: {
            id: "org-harbor-demo",
            name: "Harbor Property Claims",
            type: "Public adjuster",
            preparedBy: "Demo Evidence Team",
            website: "https://example.invalid",
        },
        packages: [
            {
                id: "sample-cedar-ridge",
                isSample: true,
                status: "evidence_ready",
                client: { displayName: "Sample Client A", reference: "CLIENT-A" },
                claim: { claimReference: "DEMO-2405", carrier: "Sample Mutual", eventType: "Wind and hail", notes: "Fictional context for demonstrating package organization." },
                property: { address: SAMPLE_PROPERTY.address, latitude: SAMPLE_PROPERTY.latitude, longitude: SAMPLE_PROPERTY.longitude, propertyType: "residential", estimatedDateOfDamage: SAMPLE_PROPERTY.date },
                evidence,
                createdAt: "2024-05-23T15:30:00.000Z",
                updatedAt: "2024-05-23T15:30:00.000Z",
            },
            {
                id: "sample-market-street",
                isSample: true,
                status: "report_previewed",
                client: { displayName: "Sample Client B" },
                claim: { claimReference: "DEMO-2311", eventType: "Wind" },
                property: { address: "820 Market Street, Sample City, MO", latitude: 38.627, longitude: -90.1994, propertyType: "commercial", estimatedDateOfDamage: "2024-05-21T12:00:00.000Z" },
                evidence,
                createdAt: "2024-05-24T15:30:00.000Z",
                updatedAt: "2024-05-25T15:30:00.000Z",
                reportPreviewedAt: "2024-05-25T15:30:00.000Z",
            },
            {
                id: "sample-oak-avenue",
                isSample: true,
                status: "draft",
                client: { displayName: "Sample Client C" },
                claim: {},
                property: SAMPLE_DRAFT_PROPERTY,
                createdAt: "2024-05-26T15:30:00.000Z",
                updatedAt: "2024-05-26T15:30:00.000Z",
            },
        ],
    };
}

export function isDemoWorkspace(value: unknown): value is DemoWorkspace {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Partial<DemoWorkspace>;
    return candidate.version === 1
        && Boolean(candidate.organization && typeof candidate.organization.name === "string")
        && Array.isArray(candidate.packages);
}

export function upgradeDemoWorkspace(workspace: DemoWorkspace): DemoWorkspace {
    let changed = false;
    const packages = workspace.packages.map((record) => {
        if (record.id !== "sample-oak-avenue" || !record.isSample) return record;
        const property = {
            ...record.property,
            address: record.property.address ?? SAMPLE_DRAFT_PROPERTY.address,
            latitude: record.property.latitude ?? SAMPLE_DRAFT_PROPERTY.latitude,
            longitude: record.property.longitude ?? SAMPLE_DRAFT_PROPERTY.longitude,
            propertyType: record.property.propertyType ?? SAMPLE_DRAFT_PROPERTY.propertyType,
            estimatedDateOfDamage: record.property.estimatedDateOfDamage ?? SAMPLE_DRAFT_PROPERTY.estimatedDateOfDamage,
        };
        if (
            typeof record.property.latitude === "number"
            && Number.isFinite(record.property.latitude)
            && typeof record.property.longitude === "number"
            && Number.isFinite(record.property.longitude)
            && typeof record.property.estimatedDateOfDamage === "string"
            && !Number.isNaN(new Date(record.property.estimatedDateOfDamage).getTime())
        ) return record;
        changed = true;
        return { ...record, property };
    });
    return changed ? { ...workspace, packages } : workspace;
}

export function upsertPackage(workspace: DemoWorkspace, record: DemoEvidencePackage): DemoWorkspace {
    const exists = workspace.packages.some((item) => item.id === record.id);
    const packages = exists
        ? workspace.packages.map((item) => item.id === record.id ? record : item)
        : [record, ...workspace.packages].slice(0, MAX_DEMO_PACKAGES);
    return { ...workspace, packages };
}

export function removePackage(workspace: DemoWorkspace, packageId: string): DemoWorkspace {
    return { ...workspace, packages: workspace.packages.filter((record) => record.id !== packageId) };
}

export function filterPackages(records: DemoEvidencePackage[], query: string, status: DemoPackageStatus | "all") {
    const normalizedQuery = query.trim().toLowerCase();
    return records.filter((record) => {
        const queryMatches = !normalizedQuery
            || record.client.displayName.toLowerCase().includes(normalizedQuery)
            || (record.property.address ?? "").toLowerCase().includes(normalizedQuery);
        return queryMatches && (status === "all" || record.status === status);
    });
}

export function workspaceMetrics(workspace: DemoWorkspace, now = new Date()) {
    return {
        drafts: workspace.packages.filter((record) => record.status === "draft").length,
        evidenceReady: workspace.packages.filter((record) => record.status === "evidence_ready").length,
        reportsPreviewed: workspace.packages.filter((record) => Boolean(record.reportPreviewedAt)).length,
        createdThisMonth: workspace.packages.filter((record) => {
            const date = new Date(record.createdAt);
            return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
        }).length,
    };
}

export function packageEvidenceSummary(record: DemoEvidencePackage) {
    if (!record.evidence) return record.status === "needs_refresh" ? "Evidence refresh required" : "Not searched";
    const { summary } = record.evidence;
    const total = summary.localStormReportCount + summary.warningCount + summary.officialEventCount;
    return `${total} sourced event record${total === 1 ? "" : "s"} · ${record.evidence.timeline.length} timeline entr${record.evidence.timeline.length === 1 ? "y" : "ies"}`;
}
