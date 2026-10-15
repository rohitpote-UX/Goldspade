import { constructMetadata } from "@/lib/seo/metadata";
import { generateWebPageSchema } from "@/lib/seo/jsonld";
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { SelectedWorkSection } from "@/components/sections/SelectedWorkSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { TrustSection } from "@/components/sections/TrustSection";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

export const metadata = constructMetadata({
  title: "Goldspade — Premium Digital Studio for Ambitious Founders",
  exactTitle: true,
  description:
    "Goldspade is a premium digital studio building brands, digital products, websites and digital experiences for ambitious founders and businesses.",
  canonicalUrl: "/",
});

export default function HomePage() {
  const pageSchema = generateWebPageSchema({
    title: "Goldspade — Premium Digital Studio for Ambitious Founders",
    description:
      "Goldspade is a premium digital studio building brands, digital products, websites and digital experiences for ambitious founders and businesses.",
    url: "/",
  });

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
      <FinalCTASection />
    </>
  );
}
