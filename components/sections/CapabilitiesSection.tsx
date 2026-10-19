"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CAPABILITIES = [
  {
    num: "01",
    title: "BRAND",
    tagline: "Positioning & Visual Identity",
    description:
      "We forge distinctive brand identities, design systems, and positioning strategies that establish immediate authority and long-term enterprise value.",
    deliverables: ["Brand Identity", "Visual Strategy", "Design Systems", "Tone of Voice"],
    image: "/media/projects/gitapath/gitapath-hero-river.png",
    href: "/services#strategy-brand",
  },
  {
    num: "02",
    title: "PRODUCT",
    tagline: "UI/UX & Digital Platforms",
    description:
      "End-to-end digital product design for web applications and mobile ecosystems engineered around intuitive user interaction and scalability.",
    deliverables: ["UI/UX Architecture", "SaaS Platforms", "Mobile Applications", "Prototyping"],
    image: "/media/projects/brandbattle/brandbattle-hero-workspace.png",
    href: "/services/product-engineering",
  },
  {
    num: "03",
    title: "EXPERIENCE",
    tagline: "Editorial & Web Design",
    description:
      "Immersive web experiences designed with typography, composition, and restrained motion that elevate brand perception.",
    deliverables: ["Editorial Websites", "Marketing Sites", "Interactive Design", "Motion Design"],
    image: "/media/pages/about/about-studio-collaborative.png",
    href: "/services/website-design-development",
  },
  {
    num: "04",
    title: "TECHNOLOGY",
    tagline: "Full-Stack Engineering & AI",
    description:
      "Clean, modern frontend and backend architectures utilizing Next.js, React, TypeScript, and AI integrations for performance.",
    deliverables: ["Next.js App Router", "Full-Stack Web", "API Architecture", "AI Automation"],
    image: "/media/projects/ezdukkan/ezdukkan-hero-retail.png",
    href: "/services/ai-integration-automation",
  },
  {
    num: "05",
    title: "GROWTH",
    tagline: "System Performance & SEO",
    description:
      "Technical SEO foundations, conversion architecture, and performance optimization ensuring maximum visibility and organic conversion.",
    deliverables: ["Technical SEO", "Conversion Rate Optimization", "Performance Audit", "Core Web Vitals"],
    image: "/media/pages/philosophy/philosophy-founder-horizon.png",
    href: "/services/technical-seo-performance",
  },
];

interface CapabilitiesSectionProps {
  headingLevel?: "h1" | "h2";
}

export function CapabilitiesSection({ headingLevel = "h2" }: CapabilitiesSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const sec = sectionRef.current;
      if (!sec) return;

      rowsRef.current.forEach((row) => {
        if (!row) return;

        gsap.fromTo(
          row,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const HeadingTag = headingLevel;

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-16 sm:py-24 md:py-40 bg-canvas text-primary-dark border-t border-editorial-border px-5 sm:px-12 md:px-20 lg:px-24 relative overflow-hidden"
    >
      {/* Backward-compatible anchor target for legacy #capabilities links */}
      <span id="capabilities" className="absolute -top-24 pointer-events-none opacity-0" aria-hidden="true" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 md:mb-24 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-3">
              03 — SERVICES & CAPABILITIES
            </span>
            <HeadingTag className="text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95]">
              WHAT WE BUILD
            </HeadingTag>
            <p className="mt-4 text-base sm:text-lg text-secondary-dark max-w-2xl font-normal leading-relaxed">
              Integrated services structured to take ambitious founders from initial concept to market leadership.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center text-xs sm:text-sm font-mono uppercase tracking-wider font-bold text-primary-dark hover:text-secondary-dark transition-colors border-b border-primary-dark pb-1 w-fit group"
          >
            <span>Explore Full Catalogue (18 Services)</span>
            <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Marino-Style Editorial Capability Catalogue */}
        <div className="border-t border-editorial-border relative">
          {CAPABILITIES.map((cap, index) => {
            return (
              <Link
                key={cap.num}
                href={cap.href || "/services"}
                ref={(el) => {
                  rowsRef.current[index] = el;
                }}
                className="group relative block border-b border-editorial-border py-6 sm:py-8 md:py-14 transition-all duration-500 hover:bg-white/40 dark:hover:bg-white/5 px-2 md:px-4 cursor-pointer"
              >
                {/* Horizontal Editorial Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10">
                  {/* Left: Number + Sliding Image Container (Enters from Left X: -110% -> 0% on Hover Only) */}
                  <div className="flex items-center space-x-4 sm:space-x-8 md:space-x-10">
                    <span className="text-xs sm:text-sm font-mono text-secondary-dark/60 font-semibold tracking-wider w-6 sm:w-8 flex-shrink-0">
                      {cap.num}
                    </span>

                    {/* Marino Sliding Image Slot (Left Entrance & Exit on Hover Only) */}
                    <div className="hidden lg:block overflow-hidden w-0 group-hover:w-60 md:group-hover:w-72 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-2xl relative flex-shrink-0 h-28 md:h-32 mr-0 group-hover:mr-4 shadow-lg border border-editorial-border/60">
                      <div className="w-60 md:w-72 h-full relative transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-full group-hover:translate-x-0">
                        <Image
                          src={cap.image}
                          alt={cap.title}
                          fill
                          sizes="288px"
                          className="object-cover rounded-2xl filter contrast-105"
                        />
                        <div className="absolute inset-0 bg-black/10 pointer-events-none rounded-2xl" />
                      </div>
                    </div>

                    {/* Main Service Title */}
                    <h3 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-primary-dark transition-transform duration-500 group-hover:translate-x-2">
                      {cap.title}
                    </h3>
                  </div>

                  {/* Right: Secondary Descriptor & Directional Mint Arrow */}
                  <div className="flex items-center justify-between md:justify-end space-x-6 sm:space-x-8 mt-4 sm:mt-6 md:mt-0">
                    <span className="text-xs sm:text-sm text-secondary-dark/80 font-mono uppercase tracking-wider md:inline group-hover:text-primary-dark group-hover:translate-x-1.5 transition-all duration-500">
                      {cap.tagline}
                    </span>

                    {/* Directional Mint Arrow Button */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border border-editorial-border bg-white text-primary-dark transition-all duration-500 group-hover:bg-mint group-hover:border-editorial-border group-hover:rotate-45 group-hover:scale-105 shadow-xs">
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
