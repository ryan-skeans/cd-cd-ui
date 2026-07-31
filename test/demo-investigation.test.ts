import test from "node:test";
import assert from "node:assert/strict";
import {
    FEATURED_DEMO_INVESTIGATION,
    featuredDemoDisplayDate,
} from "../src/lib/demo-investigation";

test("featured demo uses the known Cedar Rapids investigation", () => {
    assert.equal(
        FEATURED_DEMO_INVESTIGATION.address,
        "101 1st Street Southwest, Cedar Rapids, Iowa 52405, United States",
    );
    assert.equal(FEATURED_DEMO_INVESTIGATION.latitude, 41.976339);
    assert.equal(FEATURED_DEMO_INVESTIGATION.longitude, -91.673068);
    assert.equal(FEATURED_DEMO_INVESTIGATION.estimatedDateOfDamage, "2020-08-10T07:00:00.000Z");

    const displayDate = featuredDemoDisplayDate();
    assert.equal(displayDate.getFullYear(), 2020);
    assert.equal(displayDate.getMonth(), 7);
    assert.equal(displayDate.getDate(), 10);
});
