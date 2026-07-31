"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DemoEvidencePackage, DemoOrganization, DemoWorkspace, removePackage, upsertPackage } from "@/lib/demo-workspace";
import { browserDemoWorkspaceRepository, DemoWorkspaceStorageError } from "@/lib/demo-workspace-repository";

interface DemoWorkspaceContextValue {
    workspace: DemoWorkspace | null;
    loading: boolean;
    storageError: string | null;
    savePackage(record: DemoEvidencePackage): boolean;
    deletePackage(id: string): boolean;
    saveOrganization(organization: DemoOrganization): boolean;
    resetWorkspace(): boolean;
}

const DemoWorkspaceContext = createContext<DemoWorkspaceContextValue | null>(null);

export function DemoWorkspaceProvider({ children }: { children: React.ReactNode }) {
    const [workspace, setWorkspace] = useState<DemoWorkspace | null>(null);
    const [loading, setLoading] = useState(true);
    const [storageError, setStorageError] = useState<string | null>(null);
    const repository = useMemo(() => browserDemoWorkspaceRepository(), []);

    useEffect(() => {
        try {
            if (!repository) throw new DemoWorkspaceStorageError();
            setWorkspace(repository.getWorkspace());
        } catch (error) {
            setStorageError(error instanceof Error ? error.message : "The demo workspace is unavailable.");
        } finally {
            setLoading(false);
        }
    }, [repository]);

    const persist = useCallback((next: DemoWorkspace) => {
        try {
            if (!repository) throw new DemoWorkspaceStorageError();
            repository.saveWorkspace(next);
            setWorkspace(next);
            setStorageError(null);
            return true;
        } catch (error) {
            setStorageError(error instanceof Error ? error.message : "The demo workspace could not be saved.");
            return false;
        }
    }, [repository]);

    const savePackage = useCallback((record: DemoEvidencePackage) => workspace ? persist(upsertPackage(workspace, record)) : false, [persist, workspace]);
    const deletePackage = useCallback((id: string) => workspace ? persist(removePackage(workspace, id)) : false, [persist, workspace]);
    const saveOrganization = useCallback((organization: DemoOrganization) => workspace ? persist({ ...workspace, organization }) : false, [persist, workspace]);
    const resetWorkspace = useCallback(() => {
        try {
            if (!repository) throw new DemoWorkspaceStorageError();
            const next = repository.resetWorkspace();
            setWorkspace(next);
            setStorageError(null);
            return true;
        } catch (error) {
            setStorageError(error instanceof Error ? error.message : "The demo workspace could not be reset.");
            return false;
        }
    }, [repository]);

    return <DemoWorkspaceContext.Provider value={{ workspace, loading, storageError, savePackage, deletePackage, saveOrganization, resetWorkspace }}>{children}</DemoWorkspaceContext.Provider>;
}

export function useDemoWorkspace() {
    const context = useContext(DemoWorkspaceContext);
    if (!context) throw new Error("useDemoWorkspace must be used within DemoWorkspaceProvider");
    return context;
}
