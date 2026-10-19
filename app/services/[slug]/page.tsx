import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { constructMetadata } from "@/lib/seo/metadata";
import { generateServiceDetailSchema } from "@/lib/seo/jsonld";
import { DEDICATED_SERVICES } from "@/data/services";
import { ALL_PROJECTS } from "@/data/projects";
import { Button } from "@/components/ui/Button";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DEDICATED_SERVICES.map((s) => ({
    slug: s.dedicatedSlug || s.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = DEDICATED_SERVICES.find(
    (s) => (s.dedicatedSlug || s.slug) === slug
  );

  if (!service) return {};

  return constructMetadata({
    title: `${service.title} — Goldspade Studio`,
    exactTitle: true,
    description: service.description,
    canonicalUrl: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = DEDICATED_SERVICES.find(
    (s) => (s.dedicatedSlug || s.slug) === slug
  );

  if (!service) {
    notFound();
  }

  const serviceSchema = generateServiceDetailSchema(service, `/services/${slug}`);
  const relatedProjects = (service.relatedProjects || [])
    .map((projSlug) => ALL_PROJECTS.find((p) => p.slug === projSlug))
    .filter(Boolean);

  const inquiryUrl = `/contact?service=${encodeURIComponent(service.slug)}`;

  return (
    <article className="pt-28 sm:pt-36 pb-20 md:py-40 bg-canvas min-h-screen text-primary-dark px-5 sm:px-12 md:px-20 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link
          href="/services"
          className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-secondary-dark hover:text-primary-dark transition-colors mb-6 group font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to All Services
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
              <Link href="/services" className="hover:text-primary-dark transition-colors">
                Services
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3 h-3 opacity-40" />
            </li>
            <li className="text-primary-dark font-bold truncate max-w-[200px] sm:max-w-none">
              {service.title}
            </li>
          </ol>
        </nav>

        {/* Header Block */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center space-x-3 mb-4">
            <span className="font-mono text-xs sm:text-sm font-bold text-secondary-dark/60 tracking-wider">
              CAPABILITY {service.id}
            </span>
            <span className="h-3 w-px bg-editorial-border" />
            <span className="text-xs font-mono uppercase tracking-widest text-secondary-dark">
              {service.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.98] mb-6">
            {service.title}
          </h1>

          <p className="text-lg sm:text-2xl text-secondary-dark font-normal leading-relaxed max-w-3xl">
            {service.tagline}
          </p>
        </div>

        {/* Overview & Strategic Philosophy */}
        {service.overview && (
          <div className="p-8 sm:p-12 rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-editorial-border mb-12 sm:mb-16 shadow-xs">
            <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-3">
              OVERVIEW & PHILOSOPHY
            </span>
            <p className="text-base sm:text-lg text-primary-dark/90 leading-relaxed font-normal">
              {service.overview}
            </p>
          </div>
        )}

        {/* Scope & Deliverables */}
        <div className="mb-14 sm:mb-20">
          <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-4">
            DETAILED SCOPE & DELIVERABLES
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {service.deliverables.map((item, index) => (
              <div
                key={index}
                className="p-5 sm:p-6 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-editorial-border flex items-start space-x-3"
              >
                <CheckCircle2 className="w-5 h-5 text-mint flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base font-medium text-primary-dark">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Project & Architectural Considerations */}
        {service.considerations && service.considerations.length > 0 && (
          <div className="mb-14 sm:mb-20">
            <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-4">
              TECHNICAL & ARCHITECTURAL CONSIDERATIONS
            </span>
            <div className="p-6 sm:p-8 rounded-3xl bg-white/40 dark:bg-white/[0.02] border border-editorial-border">
              <ul className="space-y-4">
                {service.considerations.map((consideration, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm sm:text-base text-secondary-dark">
                    <span className="font-mono text-xs text-secondary-dark/60 mt-1 font-bold">
                      {(idx + 1).toString().padStart(2, "0")}.
                    </span>
                    <span>{consideration}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Proven in Real Projects */}
        {relatedProjects.length > 0 && (
          <div className="mb-14 sm:mb-20">
            <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-4">
              PROVEN IN PRODUCTION PORTFOLIO
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((project) => {
                if (!project) return null;
                return (
                  <Link
                    key={project.slug}
                    href={`/work/${project.slug}`}
                    className="group block p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-editorial-border hover:border-mint transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono uppercase text-secondary-dark">
                        {project.category} · <time dateTime={project.year}>{project.year}</time>
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-secondary-dark group-hover:text-primary-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-primary-dark mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-secondary-dark line-clamp-2">
                      {project.positioning}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Frequently Asked Questions (FAQ) */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="mb-16 sm:mb-24">
            <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-4">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <div className="space-y-4">
              {service.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-6 sm:p-8 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-editorial-border"
                >
                  <h3 className="text-base sm:text-lg font-bold text-primary-dark mb-3 flex items-start space-x-2.5">
                    <HelpCircle className="w-5 h-5 text-mint flex-shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-sm sm:text-base text-secondary-dark leading-relaxed pl-7 font-normal">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contextual Inquiry CTA */}
        <div className="p-8 sm:p-12 md:p-16 rounded-3xl bg-primary-dark text-canvas border border-primary-dark text-center relative overflow-hidden">
          <span className="text-xs uppercase tracking-widest text-mint font-mono block mb-3">
            COMMISSION THIS CAPABILITY
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-canvas mb-4">
            LET’S BUILD YOUR {service.title}
          </h2>
          <p className="text-sm sm:text-base text-canvas/80 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            Collaborate directly with Goldspade’s senior engineers and designers to launch or scale your digital solution.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              href={inquiryUrl}
              variant="mint"
              size="lg"
              icon
            >
              START A PROJECT
            </Button>
            <Button
              href="/services"
              variant="outline"
              size="lg"
              className="border-canvas text-canvas hover:bg-canvas hover:text-primary-dark"
            >
              VIEW ALL 18 SERVICES
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
