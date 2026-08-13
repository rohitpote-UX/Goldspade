import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils/cn";

interface ProjectCardProps {
  project: Project;
  aspectRatio?: "square" | "video" | "wide" | "tall";
  className?: string;
}

export function ProjectCard({
  project,
  aspectRatio = "wide",
  className,
}: ProjectCardProps) {
  const aspectRatios = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/10]",
    tall: "aspect-[4/5]",
  };

  const isLive = project.status === "LIVE";

  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn("group block w-full text-primary-dark cursor-pointer", className)}
    >
      {/* Rounded Image Container (24px - rounded-3xl) */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-3xl bg-white border border-editorial-border mb-6 shadow-sm",
          aspectRatios[aspectRatio]
        )}
      >
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-105"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-editorial-border text-[11px] font-mono font-bold uppercase tracking-widest text-primary-dark flex items-center space-x-1.5 shadow-xs">
          {isLive ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
              <span>{project.year} · LIVE</span>
            </>
          ) : (
            <span>{project.year} · COMING SOON</span>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-1">
          {project.category}
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark group-hover:text-secondary-dark transition-colors duration-300 flex items-center justify-between">
          <span>{project.title}</span>
          <ArrowUpRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 text-primary-dark" />
        </h3>
        <p className="text-base text-secondary-dark mt-2 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>
    </Link>
  );
}
