import test from "node:test";
import assert from "node:assert/strict";
import {
    isWorkspaceLinkActive,
    WORKSPACE_NEW_PACKAGE_PATH,
    WORKSPACE_OVERVIEW_PATH,
    WORKSPACE_PACKAGES_PATH,
} from "../src/lib/workspace-navigation";

test("new-package navigation highlights only New Package", () => {
    assert.equal(isWorkspaceLinkActive(WORKSPACE_NEW_PACKAGE_PATH, WORKSPACE_NEW_PACKAGE_PATH), true);
    assert.equal(isWorkspaceLinkActive(WORKSPACE_NEW_PACKAGE_PATH, WORKSPACE_PACKAGES_PATH), false);
    assert.equal(isWorkspaceLinkActive(WORKSPACE_NEW_PACKAGE_PATH, WORKSPACE_OVERVIEW_PATH), false);
});

test("package history and package detail highlight Evidence Packages", () => {
    assert.equal(isWorkspaceLinkActive(WORKSPACE_PACKAGES_PATH, WORKSPACE_PACKAGES_PATH), true);
    assert.equal(isWorkspaceLinkActive(`${WORKSPACE_PACKAGES_PATH}/sample-cedar-ridge`, WORKSPACE_PACKAGES_PATH), true);
    assert.equal(isWorkspaceLinkActive(`${WORKSPACE_PACKAGES_PATH}/sample-cedar-ridge`, WORKSPACE_NEW_PACKAGE_PATH), false);
});
