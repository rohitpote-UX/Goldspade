import { constructMetadata } from "@/lib/seo/metadata";
import { generateWebPageSchema } from "@/lib/seo/jsonld";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { TrustSection } from "@/components/sections/TrustSection";

export const metadata = constructMetadata({
  title: "Goldspade Philosophy — Strategy, Design & Technology",
  exactTitle: true,
  description:
    "Ideas are everywhere. Execution is rare. Learn how Goldspade approaches brand strategy, digital product design, and software engineering.",
  canonicalUrl: "/philosophy",
});

export default function PhilosophyPage() {
  const pageSchema = generateWebPageSchema({
    title: "Goldspade Philosophy — Strategy, Design & Technology",
    description:
      "Ideas are everywhere. Execution is rare. Learn how Goldspade approaches brand strategy, digital product design, and software engineering.",
    url: "/philosophy",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Philosophy", url: "/philosophy" },
    ],
  });

  return (
    <div className="pt-20 bg-canvas text-primary-dark min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <PhilosophySection headingLevel="h1" />
      <TrustSection />
    </div>
  );
}
