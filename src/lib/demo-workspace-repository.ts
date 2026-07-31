import {
    createSampleWorkspace,
    DEMO_WORKSPACE_STORAGE_KEY,
    DemoEvidencePackage,
    DemoWorkspace,
    isDemoWorkspace,
    removePackage,
    upgradeDemoWorkspace,
    upsertPackage,
} from "./demo-workspace";

export interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}

export interface DemoWorkspaceRepository {
    getWorkspace(): DemoWorkspace;
    saveWorkspace(workspace: DemoWorkspace): void;
    resetWorkspace(): DemoWorkspace;
    listPackages(): DemoEvidencePackage[];
    getPackage(id: string): DemoEvidencePackage | null;
    savePackage(record: DemoEvidencePackage): DemoWorkspace;
    deletePackage(id: string): DemoWorkspace;
}

export class DemoWorkspaceStorageError extends Error {
    constructor(message = "The demo workspace could not be saved in this browser.") {
        super(message);
        this.name = "DemoWorkspaceStorageError";
    }
}

export class LocalDemoWorkspaceRepository implements DemoWorkspaceRepository {
    constructor(private readonly storage: StorageLike) {}

    getWorkspace() {
        let raw: string | null;
        try {
            raw = this.storage.getItem(DEMO_WORKSPACE_STORAGE_KEY);
        } catch {
            throw new DemoWorkspaceStorageError("Browser storage is unavailable. The demo workspace cannot persist changes.");
        }
        if (raw === null) {
            const sample = createSampleWorkspace();
            this.saveWorkspace(sample);
            return sample;
        }
        try {
            const parsed: unknown = JSON.parse(raw);
            if (isDemoWorkspace(parsed)) {
                const upgraded = upgradeDemoWorkspace(parsed);
                if (upgraded !== parsed) {
                    try {
                        this.saveWorkspace(upgraded);
                    } catch (error) {
                        if (process.env.NODE_ENV === "development") console.warn("The upgraded demo workspace could not be persisted.", error);
                    }
                }
                return upgraded;
            }
        } catch (error) {
            if (process.env.NODE_ENV === "development") console.warn("Corrupt demo workspace value was replaced.", error);
        }
        const recovered = createSampleWorkspace();
        this.saveWorkspace(recovered);
        return recovered;
    }

    saveWorkspace(workspace: DemoWorkspace) {
        try {
            this.storage.setItem(DEMO_WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
        } catch {
            throw new DemoWorkspaceStorageError("The browser could not save this change. Storage may be unavailable or full.");
        }
    }

    resetWorkspace() {
        const workspace = createSampleWorkspace();
        this.saveWorkspace(workspace);
        return workspace;
    }

    listPackages() {
        return this.getWorkspace().packages;
    }

    getPackage(id: string) {
        return this.getWorkspace().packages.find((record) => record.id === id) ?? null;
    }

    savePackage(record: DemoEvidencePackage) {
        const workspace = upsertPackage(this.getWorkspace(), record);
        this.saveWorkspace(workspace);
        return workspace;
    }

    deletePackage(id: string) {
        const workspace = removePackage(this.getWorkspace(), id);
        this.saveWorkspace(workspace);
        return workspace;
    }
}

export function browserDemoWorkspaceRepository() {
    if (typeof window === "undefined") return null;
    return new LocalDemoWorkspaceRepository(window.localStorage);
}
