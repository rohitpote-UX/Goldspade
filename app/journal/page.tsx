import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Journal & Insights",
  description: "Perspectives on strategy, design, engineering, and digital business systems by Goldspade.",
});

export default function JournalPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-20 md:py-40 bg-canvas text-primary-dark min-h-screen px-5 sm:px-12 md:px-20 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16 md:mb-20">
          <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-3">
            JOURNAL
          </span>
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95]">
            PERSPECTIVES & INSIGHTS
          </h1>
          <p className="mt-4 text-base sm:text-lg text-secondary-dark max-w-2xl font-normal leading-relaxed">
            Thoughts on digital strategy, software architecture, brand positioning, and modern execution.
          </p>
        </div>

        <div className="py-14 sm:py-20 px-4 border-t border-b border-editorial-border text-center font-mono text-secondary-dark text-xs font-bold uppercase tracking-widest bg-white rounded-3xl border shadow-sm">
          [ JOURNAL ARTICLES & FOUNDER INSIGHTS — PUBLISHING SOON ]
        </div>
      </div>
    </div>
  );
}
