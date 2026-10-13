import { constructMetadata } from "@/lib/seo/metadata";
import { generateServicesCatalogSchema } from "@/lib/seo/jsonld";
import { ServicesCatalog } from "@/components/sections/ServicesCatalog";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { SERVICES } from "@/data/services";

export const metadata = constructMetadata({
  title: "Capabilities & Services — Goldspade",
  exactTitle: true,
  description:
    "Goldspade is a premium digital studio providing brand strategy, digital product UI/UX design, full-stack web engineering, and technical SEO architecture.",
  canonicalUrl: "/services",
});

export default function CapabilitiesPage() {
  const catalogSchema = generateServicesCatalogSchema(SERVICES);

  return (
    <div className="pt-28 sm:pt-36 pb-20 md:py-40 bg-canvas text-primary-dark min-h-screen px-5 sm:px-12 md:px-20 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Editorial Page Header */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block">
              CAPABILITIES & SERVICES
            </span>
            <span className="h-2 w-px bg-editorial-border" />
            <span className="text-[11px] font-mono text-secondary-dark/70">
              CORE COMPETENCIES
            </span>
          </div>

          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95] mb-6">
            WHAT WE BUILD.
          </h1>

          <p className="text-base sm:text-xl text-secondary-dark max-w-3xl font-normal leading-relaxed">
            From defining your position to engineering the systems behind your business, Goldspade brings strategy, design, and technology together to turn ambitious ideas into considered digital products.
          </p>
        </div>

        {/* Comprehensive Service Matrix */}
        <ServicesCatalog />
      </div>

      <div className="max-w-7xl mx-auto mt-24 sm:mt-32 pt-16 border-t border-editorial-border">
        <ProcessSection />
      </div>
    </div>
  );
}
