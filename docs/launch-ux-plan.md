# ClaimDefender launch UX and product plan

## Product diagnosis

ClaimDefender has a credible premise: turning difficult-to-collect weather records into a usable property-damage evidence package. The current experience, however, frames the product as an AI claim-fighting tool. That introduces avoidable skepticism for investors, carriers, and professional users who need traceable, neutral documentation.

### Highest-impact opportunities

1. **Remove the claim score.** A proprietary viability score looks subjective, creates potential legal/compliance questions, and can tell a prospect not to buy. Replace it with a neutral evidence inventory and explicit source labels.
2. **Make the paid outcome concrete.** “Upgrade to Pro” and “Initiate Payment” do not communicate what is delivered. The product should sell a professional Evidence Package: source records, event timeline, imagery comparison, and a downloadable report.
3. **Lead with investigation, not confrontation.** “Fight back” and unsupported outcomes such as claim reversal rate reduce credibility. Position the service as independent, property-specific evidence preparation; do not suggest an outcome or legal conclusion.
4. **Show provenance.** NOAA, NWS, radar, and imagery need visible source/coverage labels and caveats. Data should read as an evidence trail, not a black-box verdict.
5. **Remove demo payment theater.** A skeleton payment form is visually indistinguishable from an unfinished checkout. In demo mode, use an explicit report-preview unlock with a clear “no payment required” explanation.
6. **Reduce the marketing-page density.** The current page repeats capabilities and adds generic feature cards after the task flow. Use a short methodology strip and professional-use cases that reinforce the investigation workflow.

## Prioritized implementation plan

### P0 — Demo-day trust and conversion

- Replace the “AI” product framing and adversarial headline with objective-evidence positioning.
- Rebuild results as an **Evidence snapshot**: property/date context, evidence availability, sourced weather observations, and an evidence-package preview. Do not calculate or display a claim score.
- Rename all purchase CTAs to **Preview evidence package** / **Unlock demo evidence package** and state exactly what becomes available.
- Replace faux payment fields with a clearly labelled demo unlock dialog; retain the mock-only behavior.
- Remove unsupported efficacy metrics and definitive claims from marketing copy.

### P1 — Professional usability and visual cohesion

- Establish one professional card language: restrained borders, compact metadata, source pills, a consistent olive/lime hierarchy, and calmer interaction states.
- Improve responsive hierarchy: compact mobile header, primary investigation surface first, and no visual dependence on hover.
- Rework the report to be an evidence package with source methodology, property context, weather observations, and transparent demo disclosures.

### P2 — Next validation before production

- Validate terminology and evidence requirements with one public adjuster, one roofing/restoration operator, and one property-claims attorney.
- Confirm licensing/attribution and retrieval-time rules for every NOAA/NWS/radar/imagery source.
- Test the first-run flow with homeowners and professional users; measure completion of the evidence preview and report download, not score engagement.

## Product decisions applied in this implementation

- **Evidence, not prediction:** observations are separated from conclusions so ClaimDefender is credible across stakeholder types.
- **A package, not a subscription abstraction:** the offer is a specific, inspectable deliverable.
- **Transparent demo:** the unlock remains mocked and is clearly called out as such; no payment, authentication, or persistence is introduced.
- **No legal or coverage promises:** the UI describes what was observed and what is included, while reserving outcome interpretation for the user and their professional advisers.
