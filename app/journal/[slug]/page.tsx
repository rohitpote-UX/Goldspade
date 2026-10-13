import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, ChevronRight, Clock } from "lucide-react";
import { constructMetadata } from "@/lib/seo/metadata";
import { generateArticleSchema } from "@/lib/seo/jsonld";
import { JOURNAL_ARTICLES } from "@/data/journal";
import { ALL_PROJECTS } from "@/data/projects";
import { Button } from "@/components/ui/Button";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return JOURNAL_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) return {};

  return constructMetadata({
    title: article.seoTitle || `${article.title} — Goldspade Journal`,
    exactTitle: true,
    description: article.description,
    canonicalUrl: `/journal/${slug}`,
    type: "article",
  });
}

export default async function JournalArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const articleSchema = generateArticleSchema(article, `/journal/${slug}`);
  const relatedProjects = (article.relatedProjects || [])
    .map((projSlug) => ALL_PROJECTS.find((p) => p.slug === projSlug))
    .filter(Boolean);

  return (
    <article className="pt-28 sm:pt-36 pb-20 md:py-40 bg-canvas min-h-screen text-primary-dark px-5 sm:px-12 md:px-20 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/journal"
          className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-secondary-dark hover:text-primary-dark transition-colors mb-6 group font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Journal
        </Link>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 sm:mb-12">
          <ol className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-secondary-dark">
            <li>
              <Link href="/" className="hover:text-primary-dark transition-colors">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3 h-3 opacity-40" />
            </li>
            <li>
              <Link href="/journal" className="hover:text-primary-dark transition-colors">
                Journal
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3 h-3 opacity-40" />
            </li>
            <li className="text-primary-dark font-bold truncate max-w-[200px] sm:max-w-none">
              {article.category}
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12 sm:mb-16">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-secondary-dark mb-4">
            <span className="px-3 py-1 rounded-full border border-editorial-border bg-white dark:bg-white/5 font-bold uppercase text-primary-dark">
              {article.category}
            </span>
            <span>·</span>
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

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-primary-dark leading-[1.05] mb-6">
            {article.title}
          </h1>

          <div className="flex items-center space-x-3 pt-6 border-t border-editorial-border">
            <div className="w-10 h-10 rounded-full bg-primary-dark text-canvas flex items-center justify-center font-mono text-xs font-bold">
              RP
            </div>
            <div>
              <span className="text-sm font-bold text-primary-dark block">
                {article.author.name}
              </span>
              <span className="text-xs font-mono text-secondary-dark block">
                {article.author.role}
              </span>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-primary-dark">
          {/* Introduction */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/60 dark:bg-white/[0.02] border border-editorial-border mb-10 text-base sm:text-lg text-secondary-dark font-normal leading-relaxed">
            {article.content.introduction}
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {article.content.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark pt-4">
                  {section.heading}
                </h2>

                {section.paragraphs.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-base sm:text-lg text-secondary-dark leading-relaxed font-normal"
                  >
                    {para}
                  </p>
                ))}

                {section.callout && (
                  <blockquote className="my-6 p-6 rounded-2xl border-l-4 border-mint bg-mint/10 text-primary-dark font-medium italic text-base sm:text-lg">
                    “{section.callout}”
                  </blockquote>
                )}
              </section>
            ))}
          </div>

          {/* Conclusion */}
          <div className="mt-12 pt-8 border-t border-editorial-border space-y-4">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-primary-dark">
              Strategic Takeaway
            </h2>
            <p className="text-base sm:text-lg text-secondary-dark leading-relaxed font-normal">
              {article.content.conclusion}
            </p>
          </div>
        </div>

        {/* Contextual Service Connection Card */}
        <div className="mt-14 p-7 sm:p-9 rounded-3xl bg-white dark:bg-white/[0.03] border border-editorial-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-secondary-dark block mb-1">
              RELATED STUDIO CAPABILITY
            </span>
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark">
              {article.relatedService.title}
            </h3>
            <p className="text-sm text-secondary-dark mt-1">
              Explore how Goldspade architects and delivers this capability for founders.
            </p>
          </div>

          <Link
            href={article.relatedService.href}
            className="inline-flex items-center text-xs font-mono font-bold uppercase tracking-wider bg-primary-dark text-canvas px-6 py-3.5 rounded-full hover:opacity-90 transition-all flex-shrink-0"
          >
            <span>Explore Service</span>
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {/* Related Case Studies */}
        {relatedProjects.length > 0 && (
          <div className="mt-12">
            <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-4">
              PROVEN IN GOLDSPADE PORTFOLIO
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedProjects.map((project) => {
                if (!project) return null;
                return (
                  <Link
                    key={project.slug}
                    href={`/work/${project.slug}`}
                    className="group block p-5 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-editorial-border hover:border-mint transition-all"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-secondary-dark mb-1">
                      <span>{project.category}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <h4 className="text-lg font-bold uppercase text-primary-dark">
                      {project.title}
                    </h4>
                    <p className="text-xs text-secondary-dark line-clamp-1 mt-1">
                      {project.positioning}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Closing Conversion Block */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-primary-dark text-canvas border border-primary-dark text-center">
          <span className="text-xs uppercase tracking-widest text-mint font-mono block mb-2">
            COMMISSION YOUR PROJECT
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-canvas mb-3">
            HAVE AN IDEA OR SYSTEM TO BUILD?
          </h2>
          <p className="text-sm sm:text-base text-canvas/80 max-w-lg mx-auto mb-6">
            Partner directly with Goldspade’s senior engineers to build, launch, or automate your venture.
          </p>
          <Button href="/contact" variant="mint" size="lg" icon>
            START A PROJECT
          </Button>
        </div>
      </div>
    </article>
  );
}
