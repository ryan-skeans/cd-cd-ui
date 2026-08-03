import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ClaimDefenderLogo } from "../src/components/brand/claim-defender-logo";
import { ClaimDefenderMark } from "../src/components/brand/claim-defender-mark";

const requiredAssets = [
    "public/brand/claim-defender-primary.svg",
    "public/brand/claim-defender-navigation.svg",
    "public/brand/claim-defender-mark.svg",
    "public/brand/claim-defender-compact.svg",
    "public/brand/claim-defender-compact-inverted.svg",
    "public/brand/claim-defender-app-icon.svg",
    "public/brand/favicon.svg",
    "public/brand/favicon-32.png",
    "public/brand/apple-touch-icon.png",
    "public/brand/claim-defender-app-icon-192.png",
    "public/brand/claim-defender-app-icon-512.png",
    "public/brand/claim-defender-social.png",
    "public/manifest.webmanifest",
] as const;

test("brand assets required by metadata and the responsive logo system exist", () => {
    for (const asset of requiredAssets) assert.equal(existsSync(asset), true, `${asset} should exist`);
});

test("source SVGs stay vector-only and avoid effects", () => {
    for (const asset of requiredAssets.filter((path) => path.endsWith(".svg"))) {
        const svg = readFileSync(asset, "utf8");
        assert.doesNotMatch(svg, /<(?:image|filter|linearGradient|radialGradient)\b/i, `${asset} should not embed raster artwork or SVG effects`);
        assert.doesNotMatch(svg, /data:image/i, `${asset} should not contain a raster data URI`);
    }
});

test("logo variants expose one accessible brand name and reserve the tagline for primary use", () => {
    const primary = renderToStaticMarkup(<ClaimDefenderLogo variant="primary" />);
    const navigation = renderToStaticMarkup(<ClaimDefenderLogo variant="navigation" />);
    const standalone = renderToStaticMarkup(<ClaimDefenderMark variant="compact" title="ClaimDefender property mark" />);

    assert.match(primary, /aria-label="ClaimDefender"/);
    assert.match(primary, /Weather evidence\. Clearly documented\./);
    assert.doesNotMatch(navigation, /Clearly documented/);
    assert.match(standalone, /aria-label="ClaimDefender property mark"/);
});
