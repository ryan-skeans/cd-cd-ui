# ClaimDefender homepage reference audit

**Inspected:** August 3, 2026  
**Method:** Live pages were opened and rendered in Google Chrome through Playwright 1.62.1. Each page was inspected at 1440 × 900 and 390 × 844, scrolled to hydrate deferred content, captured as a full page, and reviewed for rendered navigation, headings, CTA placement, section order, product visuals, typography, responsive behavior, and credibility patterns. Vercel's scroll-pinned demonstrations were also captured at seven scroll stages per viewport because a static full-page image does not show every animated state.

The audit records what these sites rendered on the inspection date. It does not treat their claims, customer counts, logos, testimonials, or metrics as transferable proof for ClaimDefender.

## Artifact index

- Machine-readable rendered-page observations: [`reference-observations.json`](artifacts/homepage-reference-audit/2026-08-03/reference-observations.json)
- Vercel scroll-stage observations: [`vercel-scroll-stage-observations.json`](artifacts/homepage-reference-audit/2026-08-03/vercel-scroll-stage-observations.json)
- ClaimDefender baseline, desktop: [`claimdefender-local-before-desktop-full.png`](artifacts/homepage-reference-audit/2026-08-03/claimdefender-local-before-desktop-full.png)
- ClaimDefender baseline, mobile: [`claimdefender-local-before-mobile-full.png`](artifacts/homepage-reference-audit/2026-08-03/claimdefender-local-before-mobile-full.png)
- Deployed ClaimDefender, desktop: [`claimdefender-deployed-desktop-full.png`](artifacts/homepage-reference-audit/2026-08-03/claimdefender-deployed-desktop-full.png)
- Deployed ClaimDefender, mobile: [`claimdefender-deployed-mobile-full.png`](artifacts/homepage-reference-audit/2026-08-03/claimdefender-deployed-mobile-full.png)

## Linear

**Live page:** `https://linear.app/`  
**Screenshots:** [`desktop`](artifacts/homepage-reference-audit/2026-08-03/linear-desktop-full.png) · [`mobile`](artifacts/homepage-reference-audit/2026-08-03/linear-mobile-full.png)

### What is present

- **Hero structure:** A compact navigation precedes a left-aligned headline, a brief product statement, a small release link, and a large rendered Linear workspace. The interface—not decorative art—is the dominant hero asset.
- **CTA strategy:** The header carries Log in and Sign up. The hero itself stays product-led and low-pressure, while the closing section pairs Get started with Contact sales.
- **Product demonstration:** A high-fidelity workspace appears immediately, followed by large, focused interface demonstrations for intake, planning, agent work, code review, and progress monitoring. Each demonstration is paired with a short outcome statement and numbered product stage.
- **Section sequence:** Hero and product UI → customer-logo row → product thesis → three purpose principles → five alternating product demonstrations → changelog → two customer quotes → closing CTA → compact multi-column footer.
- **Credibility and social proof:** Recognizable customer logos appear directly after the hero. Customer quotes and a customer-count claim appear near the final decision point. Product craft and interface detail do much of the trust-building before those claims arrive.
- **Audience segmentation:** The story unifies product teams and software agents rather than branching into separate buyer journeys. The feature sequence progressively discloses the workflow.
- **Mobile behavior:** The header retains Log in, Sign up, and a menu control. The product view is reduced and cropped without replacing it with generic art. Principle cards and quotes use horizontal overflow; feature narratives become a single vertical sequence with generous pauses.

### Ideas worth applying to ClaimDefender

- Put a faithful impact-timeline interface in the hero and let it carry the claim.
- Use short numbered stages to connect search, analysis, and documentation.
- Alternate visually dense product proof with quiet explanatory sections.
- Keep motion subordinate to comprehension and preserve the same story when reduced motion is requested.

### Elements not to copy

- The black developer-tool aesthetic, AI-agent framing, tiny low-contrast copy, horizontal content clipping, or customer proof that ClaimDefender cannot substantiate.
- Linear's unusually low-pressure hero CTA pattern; ClaimDefender needs an explicit homeowner action because its task is less familiar.

## Ramp

**Live page:** `https://ramp.com/`  
**Screenshots:** [`desktop`](artifacts/homepage-reference-audit/2026-08-03/ramp-desktop-full.png) · [`mobile`](artifacts/homepage-reference-audit/2026-08-03/ramp-mobile-full.png)

### What is present

- **Hero structure:** An announcement bar and full navigation lead to the direct headline “Time is money. Save both.” A short outcome statement, an email capture, a primary Get started for free action, and a layered product composition sit above the fold.
- **CTA strategy:** See a demo remains in the header; Get started for free is the hero conversion. View Demo and product-specific actions recur after major explanation blocks, and the closing section repeats the core headline and conversion paths.
- **Product demonstration:** Layered UI panels establish product tangibility in the hero. A five-part product grid ties each finance workflow to its own interface. Later sections use large integration and automation demonstrations plus customer workflow stories.
- **Section sequence:** Outcome hero → quantified customer-growth statement and logo proof → all-in-one platform grid → connected-systems demonstration → intelligence-platform thesis → customer workflow stories → enterprise/global outcomes → testimonial grid → closing CTA → dense dark footer.
- **Credibility and social proof:** Ramp places its own customer count, growth claim, customer logos, named stories, and testimonials close to product claims. The proof is frequent and highly commercial.
- **Audience segmentation:** The primary story is a shared finance platform. Segmentation appears later through accounting-firm, enterprise, and global-spend use cases.
- **Mobile behavior:** The navigation collapses to a menu and the main CTA becomes full width. Product tiles stack one by one, preserving screenshots and CTA hierarchy. The footer converts large desktop link groups into compact mobile disclosure rows.

### Ideas worth applying to ClaimDefender

- Lead with the immediate outcome: a clearer, sourced record of weather around a property and date.
- Put interface proof beside important claims, then repeat the homeowner CTA after the visitor understands the deliverable.
- Organize sections around user questions—what happened, what records support it, and what can be shared—rather than around a generic feature inventory.

### Elements not to copy

- Aggressive performance claims, promotional incentives, oversized social-proof programs, sales pressure, or implied outcomes without ClaimDefender evidence.
- The long, dense sequence of commercial stories and scroll-driven whitespace.

## Stripe

**Live page:** `https://stripe.com/`  
**Screenshots:** [`desktop`](artifacts/homepage-reference-audit/2026-08-03/stripe-desktop-full.png) · [`mobile`](artifacts/homepage-reference-audit/2026-08-03/stripe-mobile-full.png)

### What is present

- **Hero structure:** A broad umbrella value proposition explains several jobs under one platform. A registration form and Google sign-up action provide the primary conversion path; layered product UI and gradient fields make the platform tangible.
- **CTA strategy:** Get started/Start now is paired with Contact sales. Guide me offers a task-based navigation path. Product-specific links recur throughout, followed by a final block that separates starting, pricing, and sales questions.
- **Product demonstration:** Modular tiles show payments, billing, agentic commerce, issuing, money movement, and embedded payments using interface fragments rather than generic illustrations. Later sections use customer product views and integration diagrams.
- **Section sequence:** Umbrella hero → modular business-model solutions → recommendation prompt → event/video feature → scale and reliability proof → enterprise, startup, and platform stories → infrastructure/integration proof → news and resources → three-path final CTA → extensive footer.
- **Credibility and social proof:** Stripe combines operating statistics, customer stories, product screenshots, uptime/infrastructure claims, ecosystem diagrams, and current editorial content. Proof changes form as the story moves from buyers to builders.
- **Audience segmentation:** Enterprise, startups, and software platforms receive distinct modules under one coherent infrastructure proposition. Navigation also supports task-based self-selection.
- **Mobile behavior:** Navigation collapses to a single control. Hero actions span the viewport, solution modules become a long vertical sequence, and complex interface demonstrations are recomposed rather than simply scaled down. The mobile page is substantially longer than desktop.

### Ideas worth applying to ClaimDefender

- Keep one umbrella proposition—source-labeled property weather evidence—then give homeowners and professionals clearly distinct modules.
- Let visitors explore by audience and by task: How it works, Homeowners, Professionals, Methodology, and Sample report.
- Use modular product evidence to explain observations, reports, warnings, timelines, and output without implying they are the same evidence type.

### Elements not to copy

- The vivid gradient system, extreme page length, platform-scale taxonomy, account-creation form, or unsupported reliability and volume claims.

## Vercel

**Live page:** `https://vercel.com/`  
**Screenshots:** [`desktop full page`](artifacts/homepage-reference-audit/2026-08-03/vercel-desktop-full.png) · [`mobile full page`](artifacts/homepage-reference-audit/2026-08-03/vercel-mobile-full.png)  
**Scroll-stage examples:** [`desktop stage 5`](artifacts/homepage-reference-audit/2026-08-03/vercel-desktop-scroll-stage-5.png) · [`desktop stage 6`](artifacts/homepage-reference-audit/2026-08-03/vercel-desktop-scroll-stage-6.png) · [`desktop stage 7`](artifacts/homepage-reference-audit/2026-08-03/vercel-desktop-scroll-stage-7.png) · [`mobile stage 5`](artifacts/homepage-reference-audit/2026-08-03/vercel-mobile-scroll-stage-5.png) · [`mobile stage 7`](artifacts/homepage-reference-audit/2026-08-03/vercel-mobile-scroll-stage-7.png)

### What is present

- **Hero structure:** A highly disciplined three-part composition pairs the “Agentic Infrastructure” headline, a central Vercel mark, and three short audience/job statements. Deploy now and Talk to sales sit together beneath the headline.
- **CTA strategy:** Product-led Deploy now and sales-led Talk to sales are repeated in the closing “Built by you, or your agents” section. Get a Demo, Log In, and Sign Up remain available in the header.
- **Product demonstration:** Three large, scroll-pinned case studies pair a customer-specific outcome, a short capability list, and an authentic-looking product or customer interface. A later “Recently shipped” grid uses working UI/code motifs.
- **Section sequence:** Sparse hero → customer-logo line → three pinned customer/product demonstrations → recently shipped grid → compact closing CTA → very dense product footer.
- **Credibility and social proof:** A customer-logo row and named customer workloads anchor each product demonstration. The interface composition itself supplies technical credibility.
- **Audience segmentation:** The hero separates coding agents, app/agent deployment, and automated operations in three terse statements. Later content is segmented by workload rather than by organization size.
- **Mobile behavior:** Only the brand and menu remain in the header. The central mark moves above the headline, both CTAs become full width, and customer interfaces are simplified into a single-column sequence.
- **Capture note:** The full-page screenshots contain large blank regions because key scenes are sticky and react to scroll position. The supplemental stage captures show the later rendered states that are not composited into a static full-page capture.

### Ideas worth applying to ClaimDefender

- Explain an abstract data workflow with concrete interface states: property selected, records classified, timeline assembled, report ready.
- Use a rigorous grid and product views that remain legible at mobile sizes.
- Keep interface labels and source status visible so the visual functions as proof, not decoration.

### Elements not to copy

- Monochrome infrastructure styling, the triangular brand motif, developer language, oversized scroll-pinned whitespace, or interactions that hide important content in a static/reduced-motion state.

## Vanta

**Live page:** `https://www.vanta.com/`  
**Screenshots:** [`desktop`](artifacts/homepage-reference-audit/2026-08-03/vanta-desktop-full.png) · [`mobile`](artifacts/homepage-reference-audit/2026-08-03/vanta-mobile-full.png)

### What is present

- **Hero structure:** An announcement bar and product navigation lead to a centered trust proposition, one dominant Get a demo action, a mascot, and a large product workspace showing a compliance workflow.
- **CTA strategy:** Get a demo is persistent in the navigation, appears in the hero, and returns in the final campaign panel. Framework, resource, and product links provide secondary exploration between those asks.
- **Product demonstration:** The hero workspace communicates what monitoring and progress look like. A six-part capability grid, an AI-agent panel, framework cards, and resource previews extend that proof.
- **Section sequence:** Trust hero and product UI → customer-logo row → six-capability product grid → agent feature → testimonial → framework carousel → startup/mid-market/enterprise cards → testimonial portraits → analyst report → resources → campaign-style final CTA → extensive footer.
- **Credibility and social proof:** Credibility is sequenced aggressively: logos, specific workflow UI, a testimonial, framework breadth, audience reassurance, more testimonials, third-party analyst recognition, then resources. Proof is placed close to each claim rather than isolated in one logo strip.
- **Audience segmentation:** Startup, mid-market, and enterprise users receive distinct reassurance cards after the common product and methodology story.
- **Mobile behavior:** Navigation is reduced, the product workspace is stacked beneath the hero, capability and audience cards become a single column, and framework content uses a horizontal carousel. The long footer remains dense.

### Ideas worth applying to ClaimDefender

- Establish trust through process transparency: source, distance, record type, retrieval status, and limitation beside each observation.
- Address the homeowner's uncertainty and the professional's repeatability needs separately after explaining the shared evidence method.
- Put the sample output and scope limitations near conversion points, not only in fine print.

### Elements not to copy

- The mascot, purple campaign styling, chunky uniform card wall, extreme page density, compliance-framework framing, analyst awards, certifications, customer logos, or testimonials.

## ClaimDefender baseline

**Local page:** `http://127.0.0.1:3000/`  
**Deployed page:** `https://cd-cd-ui.vercel.app/`

The local and deployed pages returned the same visible homepage structure and copy during the audit. Both use a compact white header, a dark split hero with a fictional event-overview interface, two audience cards, a three-step workflow, a six-card methodology grid, a sample-report CTA, an explicit scope limitation, and a minimal footer. The local baseline produced no console errors in either audited viewport.

### What is already working

- The page uses restrained, factual language and visibly labels the product state as a demo.
- Homeowner and professional routes are real and distinct.
- The hero shows source classification, property/date context, and a concrete report-like output.
- Limitations are explicit and unsupported testimonials, logos, outcomes, and metrics are absent.

### Highest-value changes

- Make the current core product clearer: fact-based weather analysis and a property-specific weather impact timeline, not image comparison.
- Bring a faithful timeline and evidence-classification demonstration closer to the first claim.
- Replace the repeated card-stack rhythm with alternating product views, quieter explanation, and one compact methodology ledger.
- Add an immediate credibility layer that says what is included, how nearby records are labeled, and what the output cannot establish.
- Repeat homeowner and professional actions only at meaningful decision points, including a contextual final CTA.
- Keep imagery as supporting archive context. Expanded satellite comparison should be labeled as planned functionality until the retrieval, licensing, comparison controls, and report contract exist.

## Principles adopted for the refactor

1. **Product proof first:** Show an impact timeline with property/date context, record classifications, distances, and source status in the hero.
2. **Outcome-oriented but restrained:** Promise an organized, source-labeled weather record—not a claim outcome, causal conclusion, or legal proof.
3. **One product, two paths:** Explain the shared evidence method once, then separate homeowner guidance from professional repeat workflows.
4. **Proof beside claims:** Attach source type and limitation to observations; attach a sample report to deliverable claims; attach demo labels to fictional values.
5. **Progressive disclosure:** Move from the answer, to the three-step workflow, to the timeline demonstration, to audience paths, methodology, use cases, and final action.
6. **Responsive by composition:** Recompose timelines and controls for touch rather than merely shrinking the desktop preview.
7. **No borrowed proof:** Do not reproduce reference-site logos, testimonials, statistics, certifications, awards, visual assets, or proprietary page compositions.
