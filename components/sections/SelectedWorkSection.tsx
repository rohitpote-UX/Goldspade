"use client";

import React, { useRef, useEffect } from "react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/Button";
import { PROJECTS } from "@/data/projects";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SelectedWorkSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const featuredProjects = PROJECTS.slice(0, 4);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row) => {
        if (!row) return;

        gsap.fromTo(
          row,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-28 md:py-40 bg-canvas text-primary-dark border-t border-editorial-border px-6 sm:px-12 md:px-20 lg:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24">
          <div>
            <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-3">
              02 — PORTFOLIO
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95]">
              SELECTED WORK
            </h2>
          </div>
          <Button href="/work" variant="secondary" size="md" icon className="mt-6 md:mt-0">
            View All Work ({PROJECTS.length})
          </Button>
        </div>

        {/* Alternating Editorial Portfolio Showcase */}
        <div className="space-y-28 md:space-y-40">
          {featuredProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={project.slug}
                ref={(el) => {
                  rowsRef.current[index] = el;
                }}
                className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center ${
                  isEven ? "" : "md:flex-row-reverse"
                }`}
              >
                <div className={isEven ? "md:col-span-7" : "md:col-span-7 md:order-2"}>
                  <ProjectCard
                    project={project}
                    aspectRatio={isEven ? "wide" : "video"}
                  />
                </div>
                <div
                  className={`flex flex-col justify-center ${
                    isEven ? "md:col-span-5" : "md:col-span-5 md:order-1"
                  }`}
                >
                  <div className="flex items-center space-x-2.5 mb-2">
                    <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block">
                      PROJECT 0{index + 1} — {project.category}
                    </span>
                    <span className="text-xs font-mono text-secondary-dark">•</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-editorial-border bg-white text-primary-dark inline-flex items-center shadow-xs">
                      {project.status === "LIVE" ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse mr-1.5" />
                          <span>LIVE</span>
                        </>
                      ) : (
                        <span>COMING SOON</span>
                      )}
                    </span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-primary-dark mb-4">
                    {project.title}
                  </h3>
                  <p className="text-base sm:text-lg text-secondary-dark mb-8 leading-relaxed font-normal">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.services.map((service) => (
                      <span
                        key={service}
                        className="text-xs font-mono font-bold uppercase tracking-wider bg-white px-3.5 py-1.5 rounded-full border border-editorial-border text-primary-dark"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                  <div>
                    <Button href={`/work/${project.slug}`} variant="primary" size="md" icon>
                      VIEW CASE STUDY
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
