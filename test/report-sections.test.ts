import test from "node:test";
import assert from "node:assert/strict";
import { buildEvidenceSummaryBlocks } from "../src/lib/evidence";
import { createSampleEvidence } from "../src/lib/sample-evidence";
import {
    createRecommendedReportPdfConfiguration,
    customizedReportDisclosure,
    getAvailableReportContent,
    getAvailableReportSections,
    getRecommendedReportContent,
    getReportSectionSelection,
    REPORT_CONTENT_DEFINITIONS,
    REQUIRED_REPORT_CONTENT,
    reportContentIdForTimelineEntry,
    resolveReportPdfConfiguration,
    setReportContent,
    setReportSectionContent,
} from "../src/lib/report-sections";

function reportInput(eventType?: string) {
    return { data: createSampleEvidence(), eventType };
}

function reportWithoutHail(eventType: string) {
    const input = reportInput(eventType);
    input.data.records.localStormReports = input.data.records.localStormReports.filter((record) => record.category !== "hail");
    input.data.timeline = input.data.timeline.filter((entry) => entry.recordId !== "sample-lsr-hail");
    input.data.summary.maximumReportedHailInches = undefined;
    input.data.summary.maximumReportedHailRecordId = undefined;
    input.data.summary.maximumRadarEstimatedHailInches = undefined;
    input.data.summary.maximumRadarEstimatedHailRecordId = undefined;
    input.data.summary.localStormReportCount = input.data.records.localStormReports.length;
    return input;
}

test("no PDF configuration preserves every complete-report renderer block", () => {
    const input = reportWithoutHail("Tornado");
    const resolved = resolveReportPdfConfiguration(input);

    assert.equal(resolved.isCustomized, false);
    assert.deepEqual(resolved.includedContent, REPORT_CONTENT_DEFINITIONS.map((content) => content.id));
    assert.equal(resolved.includedContent.includes("summary.hail"), true);
});

test("available customization content is derived from the current report", () => {
    const input = reportInput("Wind and hail");
    const available = getAvailableReportContent(input).map((content) => content.id);

    assert.deepEqual(available, [
        "summary.wind",
        "summary.hail",
        "summary.precipitation",
        "summary.warnings",
        "summary.stormReports",
        "timeline.observations",
        "timeline.hailReports",
        "timeline.warnings",
        "weather.precipitation",
    ]);
    assert.deepEqual(getAvailableReportSections(input).map((section) => section.id), ["evidenceSummary", "eventTimeline", "weatherContext"]);
});

test("irrelevant hail is unavailable and not recommended for a tornado report", () => {
    const input = reportWithoutHail("Tornado");

    assert.equal(getAvailableReportContent(input).some((content) => content.id === "summary.hail"), false);
    assert.equal(getRecommendedReportContent(input).includes("summary.hail"), false);
});

test("a negative hail finding remains available and recommended for a hail-related report", () => {
    const input = reportWithoutHail("Hail");

    assert.equal(getAvailableReportContent(input).some((content) => content.id === "summary.hail"), true);
    assert.equal(getRecommendedReportContent(input).includes("summary.hail"), true);
});

test("precipitation remains available but is not recommended for an unrelated professional event", () => {
    const input = reportInput("Wind");
    const available = getAvailableReportContent(input).map((content) => content.id);
    const recommended = getRecommendedReportContent(input);

    assert.equal(available.includes("summary.precipitation"), true);
    assert.equal(available.includes("weather.precipitation"), true);
    assert.equal(recommended.includes("summary.precipitation"), false);
    assert.equal(recommended.includes("weather.precipitation"), false);
});

test("available hail evidence stays optional when the selected event focus is unrelated", () => {
    const input = reportInput("Wind");
    const available = getAvailableReportContent(input).map((content) => content.id);
    const recommended = getRecommendedReportContent(input);

    assert.equal(available.includes("summary.hail"), true);
    assert.equal(available.includes("timeline.hailReports"), true);
    assert.equal(recommended.includes("summary.hail"), false);
    assert.equal(recommended.includes("timeline.hailReports"), false);
});

test("reports without an event type recommend available data rather than guessing relevance", () => {
    const input = reportInput();
    const recommended = getRecommendedReportContent(input);

    assert.equal(recommended.includes("summary.hail"), true);
    assert.equal(recommended.includes("summary.precipitation"), true);
    assert.equal(recommended.includes("weather.precipitation"), true);
});

test("parent selection derives checked, unchecked, and indeterminate states from children", () => {
    const input = reportInput("Wind and hail");
    const oneSelected = { includedContent: ["summary.wind" as const] };

    assert.deepEqual(getReportSectionSelection(input, oneSelected, "evidenceSummary"), {
        state: "indeterminate",
        selectedCount: 1,
        totalCount: 5,
    });

    const allSelected = setReportSectionContent(input, oneSelected, "evidenceSummary", true);
    assert.equal(getReportSectionSelection(input, allSelected, "evidenceSummary").state, "checked");

    const noneSelected = setReportSectionContent(input, allSelected, "evidenceSummary", false);
    assert.equal(getReportSectionSelection(input, noneSelected, "evidenceSummary").state, "unchecked");
});

test("parent changes update only their available children", () => {
    const input = reportInput("Wind and hail");
    const configuration = { includedContent: ["weather.precipitation" as const] };
    const selected = setReportSectionContent(input, configuration, "evidenceSummary", true);
    const deselected = setReportSectionContent(input, selected, "evidenceSummary", false);

    assert.equal(selected.includedContent.includes("summary.wind"), true);
    assert.equal(selected.includedContent.includes("weather.precipitation"), true);
    assert.deepEqual(deselected.includedContent, ["weather.precipitation"]);
});

test("unavailable content cannot be injected into a customized configuration", () => {
    const input = reportWithoutHail("Tornado");
    const configuration = { includedContent: ["summary.wind" as const, "summary.hail" as const] };
    const resolved = resolveReportPdfConfiguration(input, configuration);

    assert.deepEqual(resolved.includedContent, ["summary.wind"]);
    assert.equal(setReportContent(input, { includedContent: [] }, "summary.hail", true).includedContent.length, 0);
});

test("reset restores the report-specific recommendation", () => {
    const input = reportInput("Wind");
    const changed = setReportContent(input, createRecommendedReportPdfConfiguration(input), "summary.precipitation", true);
    const reset = createRecommendedReportPdfConfiguration(input);

    assert.equal(changed.includedContent.includes("summary.precipitation"), true);
    assert.deepEqual(reset.includedContent, getRecommendedReportContent(input));
    assert.equal(reset.includedContent.includes("summary.precipitation"), false);
});

test("evidence summary sentences are independent content blocks", () => {
    const blocks = buildEvidenceSummaryBlocks(createSampleEvidence());
    const withoutHail = blocks.filter((block) => block.id !== "hail");

    assert.equal(blocks.some((block) => block.id === "hail" && block.text.includes("1.25 in")), true);
    assert.equal(withoutHail.some((block) => block.text.includes("hail up to")), false);
    assert.equal(withoutHail.some((block) => block.id === "wind" && block.text.includes("54.0 mph")), true);
    assert.equal(withoutHail.some((block) => block.id === "warnings"), true);
});

test("hail can be excluded across compound PDF content without removing other findings", () => {
    const input = reportInput("Wind and hail");
    const configuration = {
        includedContent: getAvailableReportContent(input)
            .map((content) => content.id)
            .filter((id) => id !== "summary.hail" && id !== "timeline.hailReports"),
    };
    const resolved = resolveReportPdfConfiguration(input, configuration);
    const includedSummaryBlocks = buildEvidenceSummaryBlocks(input.data).filter((block) => {
        const contentId = `summary.${block.id}`;
        return resolved.includedContent.includes(contentId as typeof resolved.includedContent[number]);
    });
    const includedTimeline = input.data.timeline.filter((entry) => resolved.includedContent.includes(reportContentIdForTimelineEntry(input.data, entry)));

    assert.equal(includedSummaryBlocks.some((block) => block.id === "hail"), false);
    assert.equal(includedSummaryBlocks.some((block) => block.id === "wind"), true);
    assert.equal(includedSummaryBlocks.some((block) => block.id === "warnings"), true);
    assert.equal(includedTimeline.some((entry) => entry.recordId === "sample-lsr-hail"), false);
    assert.equal(includedTimeline.some((entry) => entry.classification === "observed"), true);
    assert.equal(includedTimeline.some((entry) => entry.classification === "warning"), true);
});

test("required context is centralized, locked, and independent of optional selections", () => {
    const input = reportInput("Wind");
    const resolved = resolveReportPdfConfiguration(input, { includedContent: [] });

    assert.equal(REQUIRED_REPORT_CONTENT.length, 4);
    assert.equal(REQUIRED_REPORT_CONTENT.every((content) => content.label && content.description), true);
    assert.deepEqual(resolved.includedContent, []);
    assert.equal(resolved.isCustomized, true);
});

test("customization produces a restrained report-specific disclosure", () => {
    assert.equal(
        customizedReportDisclosure("SAMPLE-PACKAGE-001"),
        "Customized report containing selected sections from ClaimDefender report SAMPLE-PACKAGE-001.",
    );
});

test("changing PDF presentation configuration does not mutate source report data", () => {
    const input = reportInput("Wind");
    const before = JSON.stringify(input.data);
    const configuration = setReportSectionContent(input, createRecommendedReportPdfConfiguration(input), "eventTimeline", false);

    resolveReportPdfConfiguration(input, configuration);

    assert.equal(JSON.stringify(input.data), before);
});
