import { constructMetadata } from "@/lib/seo/metadata";
import { generateWebPageSchema } from "@/lib/seo/jsonld";

export const metadata = constructMetadata({
  title: "Privacy Policy",
  description: "Privacy policy and data protection standards for Goldspade studio.",
  canonicalUrl: "/privacy",
});

export default function PrivacyPage() {
  const pageSchema = generateWebPageSchema({
    title: "Privacy Policy — Goldspade",
    description: "Privacy policy and data protection standards for Goldspade studio.",
    url: "/privacy",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Privacy Policy", url: "/privacy" },
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
            LEGAL &bull; TRUST SIGNALS
          </span>
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95] mb-4">
            PRIVACY POLICY
          </h1>
          <p className="text-sm sm:text-base font-mono text-secondary-dark uppercase tracking-wider">
            LAST UPDATED: JANUARY 2026
          </p>
        </div>

        <div className="space-y-10 text-secondary-dark leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark">
              1. Overview &amp; Commitment
            </h2>
            <p className="text-base font-normal">
              Goldspade (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;studio&rdquo;) respects your privacy and is committed to protecting the confidential information and personal data you share with us through our website (https://www.goldspade.in) and client engagement channels.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark">
              2. Information We Collect
            </h2>
            <p className="text-base font-normal">
              When you submit a project inquiry or communicate with our studio, we collect information you intentionally provide, including your name, email address, company name, estimated budget, and project overview. We do not sell, rent, or monetize your inquiry data to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark">
              3. Purpose of Processing
            </h2>
            <p className="text-base font-normal">
              We process your data strictly to evaluate project scope, formulate technical proposals, communicate timelines, and deliver digital studio services. Internal client data is protected behind authenticated access controls.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark">
              4. Data Security &amp; Confidentiality
            </h2>
            <p className="text-base font-normal">
              We employ strict technical and organizational safeguards including encrypted transport (HTTPS/TLS), secure credential storage, and HttpOnly session cookies for private administrative areas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark">
              5. Direct Inquiries &amp; Rights
            </h2>
            <p className="text-base font-normal">
              You may request access to, modification of, or permanent deletion of your project records at any time by emailing us directly at{" "}
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
