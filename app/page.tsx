import { constructMetadata } from "@/lib/seo/metadata";
import { generateHomepageSchema } from "@/lib/seo/jsonld";
import { HOMEPAGE_FAQS } from "@/data/homepageFaqs";
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { SelectedWorkSection } from "@/components/sections/SelectedWorkSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { TrustSection } from "@/components/sections/TrustSection";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

export const metadata = constructMetadata({
  title: "Goldspade — Digital Studio & Web Development in Pune",
  exactTitle: true,
  description:
    "Goldspade is an engineering-led digital studio based in Pune. We build bespoke websites, custom web applications, product engineering, and modern brand experiences for ambitious founders.",
  canonicalUrl: "/",
});

export default function HomePage() {
  const pageSchema = generateHomepageSchema(HOMEPAGE_FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <HeroSection />
      <IntroSection />
      <SelectedWorkSection />
      <CapabilitiesSection />
      <ProcessSection />
      <PhilosophySection />
      <TrustSection />
      <CoverageSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
