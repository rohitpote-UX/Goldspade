import { constructMetadata } from "@/lib/seo/metadata";
import { generateWebPageSchema } from "@/lib/seo/jsonld";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { PROJECTS } from "@/data/projects";

export const metadata = constructMetadata({
  title: "Goldspade — Selected Work & Case Studies",
  exactTitle: true,
  description:
    "Explore selected digital products, web platforms, and brand systems engineered for ambitious founders by Goldspade.",
  canonicalUrl: "/work",
});

export default function WorkPage() {
  const pageSchema = generateWebPageSchema({
    title: "Goldspade — Selected Work & Case Studies",
    description:
      "Explore selected digital products, web platforms, and brand systems engineered for ambitious founders by Goldspade.",
    url: "/work",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Work", url: "/work" },
    ],
  });

  return (
    <div className="pt-28 sm:pt-36 pb-20 md:py-40 bg-canvas text-primary-dark min-h-screen px-5 sm:px-12 md:px-20 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16 md:mb-20">
          <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-3">
            PORTFOLIO
          </span>
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95]">
            SELECTED WORK
          </h1>
          <p className="mt-4 text-base sm:text-lg text-secondary-dark max-w-2xl font-normal leading-relaxed">
            A curated showcase of purpose-driven digital products, editorial platforms, and business systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 pt-6 sm:pt-8">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} aspectRatio="wide" />
          ))}
        </div>
      </div>
    </div>
  );
}
