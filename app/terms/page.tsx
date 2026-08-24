import { constructMetadata } from "@/lib/seo/metadata";
import { generateWebPageSchema } from "@/lib/seo/jsonld";

export const metadata = constructMetadata({
  title: "Terms of Service",
  description: "Terms of service and engagement standards for Goldspade studio.",
  canonicalUrl: "/terms",
});

export default function TermsPage() {
  const pageSchema = generateWebPageSchema({
    title: "Terms of Service — Goldspade",
    description: "Terms of service and engagement standards for Goldspade studio.",
    url: "/terms",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Terms of Service", url: "/terms" },
    ],
  });

  return (
    <div className="pt-28 sm:pt-36 pb-20 md:py-40 bg-canvas text-primary-dark min-h-screen px-5 sm:px-12 md:px-20 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 sm:mb-16 border-b border-editorial-border pb-8">
          <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-3">
            LEGAL &bull; ENGAGEMENT TERMS
          </span>
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95] mb-4">
            TERMS OF SERVICE
          </h1>
          <p className="text-sm sm:text-base font-mono text-secondary-dark uppercase tracking-wider">
            LAST UPDATED: JANUARY 2026
          </p>
        </div>

        <div className="space-y-10 text-secondary-dark leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark">
              1. Engagement Principles
            </h2>
            <p className="text-base font-normal">
              By accessing the website (https://www.goldspade.in) or initiating a project inquiry with Goldspade, you agree to these Terms of Service. Goldspade provides bespoke brand strategy, digital product design, web engineering, and software solutions for founders and enterprises.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark">
              2. Intellectual Property
            </h2>
            <p className="text-base font-normal">
              All visual artifacts, custom code, case study editorial materials, and design systems displayed on this website are the intellectual property of Goldspade or their respective referenced clients. Client project deliverables and IP rights are transferred according to individual bilateral master services agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark">
              3. Service Inquiries &amp; Estimates
            </h2>
            <p className="text-base font-normal">
              Project scope estimates, milestones, and deliverables shared during initial discovery or via our inquiry forms represent preliminary evaluations. Formal engagements are executed via mutually signed statements of work.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark">
              4. Contact &amp; Governance
            </h2>
            <p className="text-base font-normal">
              For any questions regarding commercial agreements, partnerships, or terms, contact us at{" "}
              <a href="mailto:hello@goldspade.in" className="text-primary-dark font-bold underline hover:text-mint">
                hello@goldspade.in
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
