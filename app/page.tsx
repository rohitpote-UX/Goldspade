import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { SelectedWorkSection } from "@/components/sections/SelectedWorkSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { TrustSection } from "@/components/sections/TrustSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <SelectedWorkSection />
      <CapabilitiesSection />
      <ProcessSection />
      <PhilosophySection />
      <TrustSection />
      <FinalCTASection />
    </>
  );
}
