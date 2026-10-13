import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ALL_PROJECTS } from "@/data/projects";
import { constructMetadata } from "@/lib/seo/metadata";
import { generateCaseStudySchema } from "@/lib/seo/jsonld";
import { ArrowLeft } from "lucide-react";

interface CaseStudyProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyProps) {
  const { slug } = await params;
  const project = ALL_PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};

  return constructMetadata({
    title: `Goldspade × ${project.title} — ${project.category} Case Study`,
    exactTitle: true,
    description: project.description,
    canonicalUrl: `/work/${project.slug}`,
    image: project.heroImage,
    type: "article",
  });
}

export default async function CaseStudyPage({ params }: CaseStudyProps) {
  const { slug } = await params;
  const project = ALL_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const isLive = project.status === "LIVE";
  const caseStudySchema = generateCaseStudySchema(project, `/work/${project.slug}`);

  return (
    <article className="pt-28 sm:pt-36 pb-20 md:py-40 bg-canvas min-h-screen text-primary-dark px-5 sm:px-12 md:px-20 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/work"
          className="inline-flex items-center text-xs uppercase tracking-widest text-secondary-dark hover:text-primary-dark font-mono mb-6 sm:mb-8 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Work
        </Link>

        {/* Case Study Header */}
        <div className="max-w-4xl mb-10 sm:mb-12">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block">
              {project.category} — {project.year}
            </span>
            <span className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-editorial-border bg-white text-primary-dark">
              {isLive ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse mr-1.5" />
                  <span>LIVE</span>
                </>
              ) : (
                <span>COMING SOON</span>
              )}
            </span>
          </div>
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark mb-4 sm:mb-6">
            {project.title}
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-secondary-dark leading-relaxed font-normal">
            {project.positioning}
          </p>
        </div>

        {/* Featured Image Container */}
        <div className="relative w-full aspect-[16/9] bg-white border border-editorial-border rounded-3xl overflow-hidden mb-16 shadow-sm">
          <Image
            src={project.heroImage}
            alt={`${project.title} — ${project.category} case study visual interface by Goldspade`}
            fill
            priority
            sizes="100vw"
            className="object-cover filter contrast-105 hover:scale-105 transition-all duration-700"
          />
        </div>

        {/* Case Study Grid Information */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-8 border-t border-editorial-border">
          <div className="md:col-span-4 space-y-8">
            <div>
              <span className="text-xs font-mono uppercase text-secondary-dark font-bold block mb-2">
                Project Status
              </span>
              <span className="inline-flex items-center text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-editorial-border bg-white text-primary-dark">
                {isLive ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse mr-1.5" />
                    <span>LIVE RELEASE</span>
                  </>
                ) : (
                  <span>COMING SOON</span>
                )}
              </span>
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-secondary-dark font-bold block mb-2">
                Services Rendered
              </span>
              <ul className="space-y-1 text-sm font-semibold">
                {project.services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-secondary-dark font-bold block mb-2">
                Technology Stack
              </span>
              <ul className="space-y-1 text-sm font-semibold">
                {project.technologies.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            {project.liveUrl && (
              <div>
                <span className="text-xs font-mono uppercase text-secondary-dark font-bold block mb-2">
                  Live Platform
                </span>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-mono font-bold uppercase tracking-wider text-primary-dark hover:text-secondary-dark transition-colors underline underline-offset-4"
                >
                  VISIT LIVE SITE ↗
                </a>
              </div>
            )}
          </div>

          <div className="md:col-span-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 text-primary-dark">
                Overview & Challenge
              </h2>
              <p className="text-base sm:text-lg text-secondary-dark leading-relaxed font-normal">
                {project.description}
              </p>
            </div>

            <div className="pt-8 border-t border-editorial-border">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-4 text-primary-dark">
                Strategic Approach
              </h3>
              <p className="text-base text-secondary-dark leading-relaxed font-normal">
                Goldspade designed and engineered this digital experience focusing on clarity, minimal friction, visual impact, and strict technical performance standards.
              </p>
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-4">
              {project.liveUrl && (
                <Button
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="md"
                  icon
                >
                  VISIT LIVE SITE
                </Button>
              )}
              <Button
                href="/contact"
                variant={project.liveUrl ? "secondary" : "primary"}
                size="md"
                icon
              >
                Discuss Similar Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
