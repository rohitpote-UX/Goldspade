import { constructMetadata } from "@/lib/seo/metadata";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";

export const metadata = constructMetadata({
  title: "Capabilities",
  description: "Brand strategy, digital product design, web engineering, business systems, and AI automation built for founders.",
});

export default function CapabilitiesPage() {
  return (
    <div className="pt-20 bg-canvas text-primary-dark min-h-screen">
      <CapabilitiesSection />
      <ProcessSection />
    </div>
  );
}
