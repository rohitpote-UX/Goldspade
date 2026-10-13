import Link from "next/link";
import { ArrowUpRight, Calendar, Clock, Sparkles } from "lucide-react";
import { constructMetadata } from "@/lib/seo/metadata";
import { generateWebPageSchema } from "@/lib/seo/jsonld";
import { JOURNAL_ARTICLES, EDITORIAL_PLAN_12 } from "@/data/journal";
import { Button } from "@/components/ui/Button";

export const metadata = constructMetadata({
  title: "Goldspade Journal — Engineering, Strategy & Founder Insights",
  exactTitle: true,
  description:
    "Original technical perspectives, product architecture guides, and candid web engineering analyses for ambitious founders by Goldspade Studio.",
  canonicalUrl: "/journal",
});

export default function JournalPage() {
  const pageSchema = generateWebPageSchema({
    title: "Goldspade Journal — Engineering, Strategy & Founder Insights",
    description:
      "Original technical perspectives, product architecture guides, and candid web engineering analyses for ambitious founders by Goldspade Studio.",
    url: "/journal",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Journal", url: "/journal" },
    ],
  });

  const plannedTopics = EDITORIAL_PLAN_12.filter((t) => t.status === "PLANNED");

  return (
    <div className="pt-28 sm:pt-36 pb-20 md:py-40 bg-canvas text-primary-dark min-h-screen px-5 sm:px-12 md:px-20 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block">
              04 — JOURNAL
            </span>
            <span className="h-2 w-px bg-editorial-border" />
            <span className="text-[11px] font-mono text-secondary-dark/70">
              FOUNDER INTELLIGENCE
            </span>
          </div>

          <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95] mb-4">
            PERSPECTIVES & INSIGHTS.
          </h1>
          <p className="mt-4 text-base sm:text-xl text-secondary-dark max-w-2xl font-normal leading-relaxed">
            Candid perspectives on web engineering, product architecture, technical SEO, and building scalable digital systems for modern ventures.
          </p>
        </div>

        {/* Featured / Published Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mb-20 sm:mb-28">
          {JOURNAL_ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="group flex flex-col justify-between p-7 sm:p-10 rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-editorial-border hover:border-mint transition-all duration-400 shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-secondary-dark mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-editorial-border bg-canvas text-primary-dark font-bold">
                    {article.category}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 opacity-60" />
                      {article.publishedAt}
                    </span>
                    <span>·</span>
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 opacity-60" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                <Link href={`/journal/${article.slug}`} className="block group/title">
                  <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark mb-3 group-hover/title:text-secondary-dark transition-colors leading-[1.1]">
                    {article.title}
                  </h2>
                </Link>

                <p className="text-sm sm:text-base text-secondary-dark leading-relaxed font-normal mb-6">
                  {article.description}
                </p>
              </div>

              <div className="pt-6 border-t border-editorial-border flex items-center justify-between">
                <span className="text-xs font-mono text-secondary-dark/80">
                  By {article.author.name}
                </span>

                <Link
                  href={`/journal/${article.slug}`}
                  className="inline-flex items-center text-xs font-mono font-bold uppercase tracking-wider text-primary-dark hover:text-secondary-dark transition-colors group/link"
                >
                  <span>Read Article</span>
                  <div className="w-7 h-7 rounded-full ml-2 flex items-center justify-center border border-editorial-border bg-white dark:bg-black group-hover/link:bg-mint transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 text-primary-dark" />
                  </div>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Editorial Roadmap: What We Are Investigating */}
        <div className="p-8 sm:p-12 md:p-14 rounded-3xl bg-white/40 dark:bg-white/[0.02] border border-editorial-border mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-mint bg-primary-dark px-3 py-1 rounded-full inline-block mb-3">
                EDITORIAL ROADMAP
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-primary-dark">
                UPCOMING RESEARCH & PERSPECTIVES
              </h2>
            </div>
            <Sparkles className="w-6 h-6 text-mint hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plannedTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-5 rounded-2xl bg-white/60 dark:bg-black/30 border border-editorial-border/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-secondary-dark/70 mb-2">
                    <span>TOPIC {topic.id}</span>
                    <span className="font-bold uppercase">{topic.searchIntent}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold uppercase tracking-tight text-primary-dark mb-2 leading-snug">
                    {topic.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-editorial-border/40 text-[11px] font-mono text-secondary-dark flex items-center justify-between">
                  <span>Target: {topic.relatedService}</span>
                  <span className="opacity-60">In Draft</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Callout */}
        <div className="p-8 sm:p-12 rounded-3xl bg-primary-dark text-canvas border border-primary-dark text-center">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-canvas mb-3">
            NEED A TECHNICAL PARTNER WHO THINKS LIKE A FOUNDER?
          </h2>
          <p className="text-sm sm:text-base text-canvas/80 max-w-xl mx-auto mb-6">
            We help ambitious ventures architect, design, and launch production-grade digital products.
          </p>
          <Button href="/contact" variant="mint" size="lg" icon>
            START A PROJECT
          </Button>
        </div>
      </div>
    </div>
  );
}
