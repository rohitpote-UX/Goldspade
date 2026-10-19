import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ChevronRight, HelpCircle, MapPin, Building2 } from "lucide-react";
import { constructMetadata } from "@/lib/seo/metadata";
import { generateLocationDetailSchema } from "@/lib/seo/jsonld";
import { LOCATIONS } from "@/data/locations";
import { ALL_PROJECTS } from "@/data/projects";
import { Button } from "@/components/ui/Button";

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return LOCATIONS.map((loc) => ({
    slug: loc.slug,
  }));
}

export async function generateMetadata({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = LOCATIONS.find((l) => l.slug === slug);

  if (!location) return {};

  return constructMetadata({
    title: location.seoTitle,
    exactTitle: true,
    description: location.metaDescription,
    canonicalUrl: `/locations/${slug}`,
  });
}

export default async function LocationDetailPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = LOCATIONS.find((l) => l.slug === slug);

  if (!location) {
    notFound();
  }

  const locationSchema = generateLocationDetailSchema(location, `/locations/${slug}`);
  const relatedProjects = location.relevantProjects
    .map((projSlug) => ALL_PROJECTS.find((p) => p.slug === projSlug))
    .filter((p): p is (typeof ALL_PROJECTS)[number] => Boolean(p));

  const inquiryUrl = `/contact?location=${encodeURIComponent(location.slug)}`;

  return (
    <article className="pt-28 sm:pt-36 pb-20 md:py-40 bg-canvas min-h-screen text-primary-dark px-5 sm:px-12 md:px-20 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link
          href="/locations"
          className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-secondary-dark hover:text-primary-dark transition-colors mb-6 group font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Regional Locations
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
              <Link href="/locations" className="hover:text-primary-dark transition-colors">
                Locations
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3 h-3 opacity-40" />
            </li>
            <li className="text-primary-dark font-bold truncate max-w-[200px] sm:max-w-none">
              {location.name}
            </li>
          </ol>
        </nav>

        {/* Header Block */}
        <header className="mb-14 sm:mb-20">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center space-x-1.5 font-mono text-xs font-bold text-secondary-dark tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-mint" />
              <span>{location.displayName}</span>
            </span>
            <span className="h-3 w-px bg-editorial-border" />
            <span className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-editorial-border bg-white dark:bg-white/5 text-primary-dark">
              {location.operatingModel.deliveryType}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95] mb-6">
            {location.h1}
          </h1>

          <p className="text-base sm:text-xl text-secondary-dark leading-relaxed font-normal max-w-3xl">
            {location.heroSummary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href={inquiryUrl} variant="primary" size="lg" icon>
              Start a Project in {location.name}
            </Button>
            <Button href="#projects" variant="secondary" size="lg">
              View Regional Proof ({relatedProjects.length})
            </Button>
          </div>
        </header>

        {/* Operating Model & Service Delivery Transparency */}
        <section className="mb-14 sm:mb-20 p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-editorial-border">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-secondary-dark mb-3">
            <Building2 className="w-4 h-4 text-mint" />
            <span>Delivery Model & Collaboration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark mb-3">
            How Goldspade Operates in {location.name}
          </h2>
          <p className="text-sm sm:text-base text-secondary-dark leading-relaxed">
            {location.operatingModel.description}
          </p>
        </section>

        {/* Regional Market Context */}
        <section className="mb-14 sm:mb-20 pt-10 border-t border-editorial-border">
          <span className="text-xs font-mono uppercase tracking-widest text-secondary-dark block mb-3 font-semibold">
            MARKET CONTEXT
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-primary-dark mb-6">
            The Digital Landscape in {location.name}
          </h2>
          <div className="space-y-4">
            {location.marketContext.map((paragraph, idx) => (
              <p key={idx} className="text-base sm:text-lg text-secondary-dark leading-relaxed font-normal">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Industry-Specific Needs & Solutions */}
        <section className="mb-14 sm:mb-20 pt-10 border-t border-editorial-border">
          <span className="text-xs font-mono uppercase tracking-widest text-secondary-dark block mb-3 font-semibold">
            TAILORED REGIONAL SOLUTIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-primary-dark mb-8">
            How We Solve Real Challenges in {location.name}
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {location.industryNeeds.map((need, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-editorial-border hover:border-primary-dark/30 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="font-mono text-xs font-bold text-mint uppercase tracking-wider">
                    SECTOR 0{idx + 1}
                  </span>
                  <span className="h-2 w-px bg-editorial-border" />
                  <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-primary-dark">
                    {need.industry}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-editorial-border/60">
                  <div>
                    <span className="text-xs font-mono uppercase text-secondary-dark font-semibold block mb-1">
                      The Operational Reality:
                    </span>
                    <p className="text-xs sm:text-sm text-secondary-dark leading-relaxed">
                      {need.challenge}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-primary-dark font-semibold block mb-1">
                      The Goldspade Engineering Solution:
                    </span>
                    <p className="text-xs sm:text-sm text-primary-dark font-medium leading-relaxed">
                      {need.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Concrete Deliverables */}
        <section className="mb-14 sm:mb-20 pt-10 border-t border-editorial-border">
          <span className="text-xs font-mono uppercase tracking-widest text-secondary-dark block mb-3 font-semibold">
            GENUINE CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-primary-dark mb-8">
            Concrete Systems We Engineer for {location.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {location.concreteDeliverables.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-editorial-border"
              >
                <CheckCircle2 className="w-5 h-5 text-mint flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-primary-dark leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Real Projects Demonstrated */}
        {relatedProjects.length > 0 && (
          <section id="projects" className="mb-14 sm:mb-20 pt-10 border-t border-editorial-border">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-secondary-dark block mb-2 font-semibold">
                  DEMONSTRATED WORK
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-primary-dark">
                  Relevant Portfolio Proof
                </h2>
              </div>
              <Link
                href="/work"
                className="text-xs font-mono font-bold uppercase tracking-wider text-primary-dark hover:text-secondary-dark transition-colors inline-flex items-center"
              >
                <span>View Full Studio Portfolio</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((project) => (
                <div
                  key={project.slug}
                  className="group rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-editorial-border overflow-hidden flex flex-col justify-between hover:border-primary-dark/40 transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5">
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border border-editorial-border">
                      {project.status === "LIVE" ? "LIVE RELEASE" : "DEVELOPMENT"}
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-dark block mb-1">
                      {project.category} · <time dateTime={project.year}>{project.year}</time>
                    </span>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-primary-dark mb-2">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary-dark line-clamp-2 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-editorial-border/60">
                      <Link
                        href={`/work/${project.slug}`}
                        className="text-xs font-mono font-bold uppercase tracking-wider text-primary-dark hover:text-mint transition-colors inline-flex items-center"
                      >
                        <span>Read Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Link>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-secondary-dark hover:text-primary-dark transition-colors"
                        >
                          Visit Live ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Localized FAQs */}
        {location.faqs && location.faqs.length > 0 && (
          <section className="mb-14 sm:mb-20 pt-10 border-t border-editorial-border">
            <span className="text-xs font-mono uppercase tracking-widest text-secondary-dark block mb-3 font-semibold">
              LOCAL QUESTIONS & ANSWERS
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-primary-dark mb-8">
              Frequently Asked Questions for {location.name}
            </h2>

            <div className="space-y-4">
              {location.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-editorial-border"
                >
                  <h3 className="text-base sm:text-lg font-bold text-primary-dark mb-3 flex items-start">
                    <HelpCircle className="w-4 h-4 text-mint mr-2.5 flex-shrink-0 mt-1" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-dark leading-relaxed pl-6.5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Core Services */}
        <section className="mb-14 sm:mb-20 pt-10 border-t border-editorial-border">
          <span className="text-xs font-mono uppercase tracking-widest text-secondary-dark block mb-3 font-semibold">
            RELATED CAPABILITIES
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark mb-6">
            Core Digital Services for {location.name} Businesses
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {location.serviceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-editorial-border hover:border-primary-dark transition-colors"
              >
                <span className="text-sm font-semibold text-primary-dark group-hover:text-primary-dark">
                  {link.label}
                </span>
                <ArrowUpRight className="w-4 h-4 text-secondary-dark group-hover:text-mint group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Contextual Inquiry CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-primary-dark text-canvas border border-primary-dark">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-mint block mb-3">
              START A CONVERSATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-pure-white mb-4">
              Have a Project in {location.name}?
            </h2>
            <p className="text-sm sm:text-base text-pure-white/80 leading-relaxed mb-8">
              Whether you need a bespoke digital flagship, custom operations software, or workflow automation, we are ready to discuss your business and engineering requirements.
            </p>
            <Button href={inquiryUrl} variant="primary" size="lg" icon>
              Inquire About {location.name} Project
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
