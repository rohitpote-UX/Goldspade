import { constructMetadata } from "@/lib/seo/metadata";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { PROJECTS } from "@/data/projects";

export const metadata = constructMetadata({
  title: "Selected Work",
  description: "Browse selected digital products, brand identities, and real estate experiences forged by Goldspade.",
});

export default function WorkPage() {
  return (
    <div className="pt-36 pb-28 md:py-40 bg-canvas text-primary-dark min-h-screen px-6 sm:px-12 md:px-20 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-20">
          <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-3">
            PORTFOLIO
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95]">
            SELECTED WORK
          </h1>
          <p className="mt-4 text-lg text-secondary-dark max-w-2xl font-normal leading-relaxed">
            A curated showcase of purpose-driven digital products, editorial platforms, and business systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pt-8">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} aspectRatio="wide" />
          ))}
        </div>
      </div>
    </div>
  );
}
