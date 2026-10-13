"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, ExternalLink } from "lucide-react";
import { SERVICES, SERVICE_CATEGORIES } from "@/data/services";
import { ServiceCategorySlug, ServiceItem } from "@/types/service";
import { ALL_PROJECTS } from "@/data/projects";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";

interface ServicesCatalogProps {
  initialCategory?: ServiceCategorySlug | "all";
}

export function ServicesCatalog({ initialCategory = "all" }: ServicesCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategorySlug | "all">(initialCategory);

  const filteredServices = useMemo(() => {
    if (activeCategory === "all") return SERVICES;
    return SERVICES.filter((s) => s.categorySlug === activeCategory);
  }, [activeCategory]);

  // Project map for quick lookup
  const projectMap = useMemo(() => {
    const map = new Map<string, string>();
    ALL_PROJECTS.forEach((p) => map.set(p.slug, p.title));
    return map;
  }, []);

  return (
    <div className="w-full">
      {/* Category Navigation Bar */}
      <div className="mb-10 sm:mb-14 overflow-x-auto pb-4 scrollbar-none">
        <nav
          aria-label="Service Categories"
          className="flex items-center gap-2 sm:gap-3 min-w-max"
        >
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint border",
              activeCategory === "all"
                ? "bg-primary-dark text-canvas border-primary-dark shadow-sm"
                : "bg-white/70 dark:bg-white/5 text-secondary-dark border-editorial-border hover:border-primary-dark hover:text-primary-dark"
            )}
          >
            All Services <span className="opacity-60 ml-1.5">({SERVICES.length})</span>
          </button>

          {SERVICE_CATEGORIES.map((cat) => {
            const count = SERVICES.filter((s) => s.categorySlug === cat.slug).length;
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint border",
                  isActive
                    ? "bg-primary-dark text-canvas border-primary-dark shadow-sm"
                    : "bg-white/70 dark:bg-white/5 text-secondary-dark border-editorial-border hover:border-primary-dark hover:text-primary-dark"
                )}
              >
                {cat.name} <span className="opacity-60 ml-1.5">({count})</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Services Grid (Editorial 2-Column Responsive Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {filteredServices.map((service: ServiceItem) => {
          const inquiryUrl = `/contact?service=${encodeURIComponent(service.slug)}`;
          const detailUrl = service.hasDedicatedPage && service.dedicatedSlug
            ? `/services/${service.dedicatedSlug}`
            : null;

          return (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between p-6 sm:p-8 md:p-10 rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-editorial-border hover:border-primary-dark/40 dark:hover:border-white/20 transition-all duration-500 shadow-xs hover:shadow-md"
            >
              {/* Card Top: Identifier + Category Tag */}
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs sm:text-sm font-bold text-secondary-dark/60 tracking-wider">
                      {service.id}
                    </span>
                    <span className="h-3 w-px bg-editorial-border" />
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-secondary-dark">
                      {service.category}
                    </span>
                  </div>

                  {service.hasDedicatedPage && (
                    <span className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-mint/60 bg-mint/15 text-primary-dark">
                      <Sparkles className="w-2.5 h-2.5 mr-1 text-primary-dark" />
                      Detailed Guide
                    </span>
                  )}
                </div>

                {/* Service Title */}
                <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark leading-[1.1] mb-2 group-hover:text-primary-dark transition-colors">
                  {service.title}
                </h3>

                {/* Tagline */}
                <span className="text-xs font-mono text-secondary-dark/80 block mb-4">
                  {service.tagline}
                </span>

                {/* Description */}
                <p className="text-sm sm:text-base text-secondary-dark font-normal leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Deliverables Pills */}
                <div className="mb-6">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-secondary-dark/70 block mb-2.5">
                    Scope & Deliverables
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {service.deliverables.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] sm:text-xs font-mono px-3 py-1 rounded-full border border-editorial-border bg-canvas text-secondary-dark/90"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related Real Portfolio Projects if Available */}
                {service.relatedProjects && service.relatedProjects.length > 0 && (
                  <div className="mb-6 pt-4 border-t border-editorial-border/60">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-secondary-dark/70 block mb-2">
                      Proven in Real Work:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {service.relatedProjects.map((projSlug) => {
                        const projTitle = projectMap.get(projSlug) || projSlug;
                        return (
                          <Link
                            key={projSlug}
                            href={`/work/${projSlug}`}
                            className="inline-flex items-center text-[11px] sm:text-xs font-mono px-3 py-1 rounded-full border border-mint/40 bg-white dark:bg-black/40 text-primary-dark hover:border-mint hover:bg-mint/10 transition-colors"
                          >
                            <span>{projTitle}</span>
                            <ArrowUpRight className="w-3 h-3 ml-1 text-secondary-dark group-hover:text-primary-dark" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-6 border-t border-editorial-border flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={inquiryUrl}
                  className="inline-flex items-center text-xs sm:text-sm font-mono uppercase tracking-wider font-bold text-primary-dark hover:text-secondary-dark transition-colors group/link"
                >
                  <span>Start a Project</span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ml-2 flex items-center justify-center border border-editorial-border bg-white dark:bg-black group-hover/link:bg-mint transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 text-primary-dark" />
                  </div>
                </Link>

                {detailUrl && (
                  <Link
                    href={detailUrl}
                    className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-secondary-dark hover:text-primary-dark transition-colors"
                  >
                    <span>Read Deep Dive</span>
                    <ExternalLink className="w-3 h-3 ml-1.5 opacity-60" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion Banner: WHAT ARE YOU BUILDING? */}
      <div className="mt-16 sm:mt-24 p-8 sm:p-12 md:p-16 rounded-3xl bg-primary-dark text-canvas border border-primary-dark relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <span className="text-xs uppercase tracking-widest text-mint font-mono block mb-3">
            NEXT STEPS
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-canvas leading-[0.98] mb-4">
            WHAT ARE YOU BUILDING?
          </h2>
          <p className="text-base sm:text-lg text-canvas/80 font-normal leading-relaxed mb-8 max-w-2xl">
            Tell us what you want to launch, improve, or automate. From initial scope formulation to full-stack execution, we’ll help define the right next step for your venture.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              href="/contact"
              variant="mint"
              size="lg"
              icon
            >
              START A PROJECT
            </Button>
            <Button
              href="/work"
              variant="outline"
              size="lg"
              className="border-canvas text-canvas hover:bg-canvas hover:text-primary-dark"
            >
              EXPLORE CASE STUDIES
            </Button>
          </div>
        </div>

        {/* Subtle decorative watermark */}
        <div className="absolute right-4 -bottom-10 pointer-events-none select-none opacity-5 text-[140px] sm:text-[220px] font-bold tracking-tighter leading-none text-canvas font-mono">
          GS
        </div>
      </div>
    </div>
  );
}
