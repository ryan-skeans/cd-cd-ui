import test from "node:test";
import assert from "node:assert/strict";
import {
    createSampleWorkspace,
    DEMO_WORKSPACE_STORAGE_KEY,
    filterPackages,
    packageEvidenceSummary,
    removePackage,
    upsertPackage,
    upgradeDemoWorkspace,
    workspaceMetrics,
} from "../src/lib/demo-workspace";
import { DemoWorkspaceStorageError, LocalDemoWorkspaceRepository, StorageLike } from "../src/lib/demo-workspace-repository";

class MemoryStorage implements StorageLike {
    values = new Map<string, string>();
    getItem(key: string) { return this.values.get(key) ?? null; }
    setItem(key: string, value: string) { this.values.set(key, value); }
    removeItem(key: string) { this.values.delete(key); }
}

test("workspace seeds only when the storage key does not exist", () => {
    const storage = new MemoryStorage();
    const repository = new LocalDemoWorkspaceRepository(storage);
    const seeded = repository.getWorkspace();
    assert.equal(seeded.organization.name, "Harbor Property Claims");
    assert.equal(seeded.packages.length, 3);
    repository.saveWorkspace(removePackage(removePackage(removePackage(seeded, seeded.packages[0].id), seeded.packages[1].id), seeded.packages[2].id));
    assert.equal(repository.getWorkspace().packages.length, 0);
    assert.ok(storage.getItem(DEMO_WORKSPACE_STORAGE_KEY));
});

test("corrupt workspace JSON recovers to the fictional sample workspace", () => {
    const storage = new MemoryStorage();
    storage.setItem(DEMO_WORKSPACE_STORAGE_KEY, "{not valid json");
    const recovered = new LocalDemoWorkspaceRepository(storage).getWorkspace();
    assert.equal(recovered.version, 1);
    assert.equal(recovered.packages.every((record) => record.isSample), true);
});

test("existing sample drafts gain runnable search coordinates without restoring deleted samples", () => {
    const workspace = createSampleWorkspace();
    const draft = workspace.packages.find((record) => record.id === "sample-oak-avenue");
    assert.ok(draft);
    const legacy = {
        ...workspace,
        packages: workspace.packages.map((record) => record.id === draft.id
            ? { ...record, property: { address: record.property.address, propertyType: record.property.propertyType } }
            : record),
    };
    const upgraded = upgradeDemoWorkspace(legacy);
    const upgradedDraft = upgraded.packages.find((record) => record.id === draft.id);
    assert.equal(typeof upgradedDraft?.property.latitude, "number");
    assert.equal(typeof upgradedDraft?.property.longitude, "number");
    assert.ok(upgradedDraft?.property.estimatedDateOfDamage);
    const storage = new MemoryStorage();
    storage.setItem(DEMO_WORKSPACE_STORAGE_KEY, JSON.stringify(legacy));
    const persistedUpgrade = new LocalDemoWorkspaceRepository(storage).getWorkspace();
    assert.equal(typeof persistedUpgrade.packages.find((record) => record.id === draft.id)?.property.latitude, "number");
    assert.equal(
        typeof JSON.parse(storage.getItem(DEMO_WORKSPACE_STORAGE_KEY) as string).packages
            .find((record: { id: string }) => record.id === draft.id).property.latitude,
        "number",
    );
    assert.equal(upgradeDemoWorkspace({ ...workspace, packages: [] }).packages.length, 0);
});

test("storage failures become a friendly domain error", () => {
    const failing: StorageLike = { getItem: () => null, setItem: () => { throw new Error("quota"); }, removeItem: () => undefined };
    assert.throws(() => new LocalDemoWorkspaceRepository(failing).getWorkspace(), DemoWorkspaceStorageError);
});

test("draft upsert, delete, filtering, and metrics are derived from records", () => {
    const workspace = createSampleWorkspace();
    const original = workspace.packages[0];
    const draft = { ...original, id: "test-draft", isSample: false, status: "draft" as const, client: { displayName: "Test Client" }, evidence: undefined, createdAt: "2024-05-30T12:00:00.000Z", updatedAt: "2024-05-30T12:00:00.000Z" };
    const withDraft = upsertPackage(workspace, draft);
    assert.equal(withDraft.packages.length, 4);
    assert.equal(filterPackages(withDraft.packages, "cedar rapids", "all").length, 2);
    assert.equal(filterPackages(withDraft.packages, "test client", "draft").length, 1);
    assert.match(packageEvidenceSummary(original), /sourced event records/);
    const metrics = workspaceMetrics(withDraft, new Date("2024-05-31T12:00:00.000Z"));
    assert.equal(metrics.drafts, 2);
    assert.equal(metrics.evidenceReady, 1);
    assert.equal(metrics.reportsPreviewed, 1);
    assert.equal(metrics.createdThisMonth, 4);
    assert.equal(removePackage(withDraft, draft.id).packages.length, 3);
});

test("reset explicitly restores the original sample workspace", () => {
    const storage = new MemoryStorage();
    const repository = new LocalDemoWorkspaceRepository(storage);
    const first = repository.getWorkspace();
    repository.saveWorkspace({ ...first, packages: [] });
    assert.equal(repository.getWorkspace().packages.length, 0);
    assert.equal(repository.resetWorkspace().packages.length, 3);
});
