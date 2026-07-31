import test from "node:test";
import assert from "node:assert/strict";
import { legacyHomeownerQuery } from "../src/lib/routing";

test("valid legacy root investigation links migrate to the homeowner route", () => {
    assert.equal(
        legacyHomeownerQuery({ lat: "41.976339", lng: "-91.673068", date: "2020-08-10T07:00:00.000Z" }),
        "/homeowners?lat=41.976339&lng=-91.673068&date=2020-08-10T07%3A00%3A00.000Z",
    );
});

test("incomplete or invalid root query parameters do not redirect", () => {
    assert.equal(legacyHomeownerQuery({ lat: "41", lng: "-91" }), null);
    assert.equal(legacyHomeownerQuery({ lat: "100", lng: "-91", date: "2024-05-21" }), null);
    assert.equal(legacyHomeownerQuery({ lat: "41", lng: "-191", date: "2024-05-21" }), null);
    assert.equal(legacyHomeownerQuery({ lat: "41", lng: "-91", date: "not-a-date" }), null);
});
