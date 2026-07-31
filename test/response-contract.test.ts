import test from "node:test";
import assert from "node:assert/strict";
import { parseEvidenceResponse } from "../src/lib/response-contract";

test("identifies the retired local Worker contract", () => {
    assert.throws(
        () => parseEvidenceResponse({ noaa: {}, satellite: {} }),
        /retired v1 response.*restart cd-cf-middleware/,
    );
});

test("identifies the stale pre-windowed normalized contract", () => {
    assert.throws(
        () => parseEvidenceResponse({ schemaVersion: "2.0" }),
        /schema 2\.0.*Restart cd-cf-middleware.*schema 2\.1/,
    );
});

test("retains the generic diagnostic for an unrelated malformed response", () => {
    assert.throws(
        () => parseEvidenceResponse({ schemaVersion: "2.1" }),
        /missing normalized evidence records/,
    );
});
