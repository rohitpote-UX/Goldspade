import { constructMetadata } from "@/lib/seo/metadata";
import { generateWebPageSchema } from "@/lib/seo/jsonld";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";

export const metadata = constructMetadata({
  title: "Digital Strategy, Design & Development — Goldspade",
  exactTitle: true,
  description:
    "Goldspade is a premium digital studio providing brand strategy, digital product UI/UX design, full-stack web engineering, and technical SEO architecture.",
  canonicalUrl: "/capabilities",
});

export default function CapabilitiesPage() {
  const pageSchema = generateWebPageSchema({
    title: "Digital Strategy, Design & Development — Goldspade",
    description:
      "Goldspade is a premium digital studio providing brand strategy, digital product UI/UX design, full-stack web engineering, and technical SEO architecture.",
    url: "/capabilities",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Capabilities", url: "/capabilities" },
    ],
  });

  return (
    <div className="pt-20 bg-canvas text-primary-dark min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <CapabilitiesSection headingLevel="h1" />
      <ProcessSection />
    </div>
  );
}
