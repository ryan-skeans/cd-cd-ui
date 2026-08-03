import PublicFooter from "@/components/public-footer";
import PublicHeader from "@/components/public-header";
import { HomepageHero } from "@/components/homepage/homepage-hero";
import {
    AudienceSection,
    FinalCtaSection,
    HowItWorksSection,
    MethodologySection,
    ProductDemoSection,
    UseCasesSection,
} from "@/components/homepage/homepage-sections";
import { createSampleEvidence } from "@/lib/sample-evidence";

export default function HomepageLanding() {
    // Reuse the report fixture so homepage product proof cannot drift from the implemented evidence contract.
    const sampleEvidence = createSampleEvidence();

    return (
        <div className="min-h-screen bg-brand-offWhite">
            <a href="#main-content" className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-lg bg-brand-olive px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand-lime focus:ring-offset-2">Skip to main content</a>
            <PublicHeader seamlessAtTop />
            <main id="main-content">
                <HomepageHero data={sampleEvidence} />
                <HowItWorksSection />
                <ProductDemoSection data={sampleEvidence} />
                <AudienceSection />
                <MethodologySection />
                <UseCasesSection />
                <FinalCtaSection />
            </main>
            <PublicFooter />
        </div>
    );
}
