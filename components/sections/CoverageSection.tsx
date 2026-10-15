"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COVERAGE_CITIES, COVERAGE_REGIONS } from "@/data/coverage";
import { CoverageMap } from "@/components/coverage/CoverageMap";
import { CoverageDetailsPanel } from "@/components/coverage/CoverageDetailsPanel";
import { CoverageRegionSelector } from "@/components/coverage/CoverageRegionSelector";
import { CoverageAccessibleList } from "@/components/coverage/CoverageAccessibleList";

export function CoverageSection() {
  const [activeRegionId, setActiveRegionId] = useState<string>("pune");
  const [activeCityId, setActiveCityId] = useState<string>("pune");

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const sec = sectionRef.current;
      const head = headerRef.current;
      const map = mapRef.current;
      const panel = panelRef.current;

      if (!sec || !head || !map || !panel) return;

      gsap.fromTo(
        head.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        map,
        { opacity: 0, scale: 0.98, y: 25 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: map,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        panel,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handlers for synchronized state
  const handleSelectCity = (cityId: string) => {
    setActiveCityId(cityId);
    const city = COVERAGE_CITIES.find((c) => c.id === cityId);
    if (city) {
      setActiveRegionId(city.regionId);
    }
  };

  const handleSelectRegion = (regionId: string) => {
    setActiveRegionId(regionId);
    const region = COVERAGE_REGIONS.find((r) => r.id === regionId);
    if (region) {
      setActiveCityId(region.primaryCityId);
    }
  };

  const currentCity =
    COVERAGE_CITIES.find((c) => c.id === activeCityId) || COVERAGE_CITIES[0];

  return (
    <section
      id="our-reach"
      ref={sectionRef}
      className="py-16 sm:py-24 md:py-36 bg-canvas text-primary-dark border-t border-editorial-border px-5 sm:px-12 md:px-20 lg:px-24 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div
          ref={headerRef}
          className="mb-10 sm:mb-14 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8"
        >
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block">
                OUR REACH / 01
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-mint" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-secondary-dark/70">
                PUNE · MAHARASHTRA · GOA · NORTH KARNATAKA · INDIA
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95] max-w-4xl">
              BUILT IN PUNE. <br />
              CONNECTED TO YOUR <span className="text-mint">NEXT BIG IDEA.</span>
            </h2>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-secondary-dark max-w-3xl font-normal leading-relaxed">
              From Pune to businesses across Maharashtra, Goa and North Karnataka, Goldspade helps ambitious teams turn business challenges into thoughtful digital solutions. Wherever you&apos;re building, let&apos;s explore what technology can do for you.
            </p>
          </div>

          <div className="hidden lg:block text-right flex-shrink-0">
            <span className="font-mono text-xs uppercase tracking-widest text-secondary-dark/60 font-bold block mb-1">
              OPERATING ETHOS
            </span>
            <span className="font-mono text-xs text-primary-dark font-bold tracking-wider block">
              REGIONAL UNDERSTANDING.
            </span>
            <span className="font-mono text-xs text-mint font-bold tracking-wider">
              DIGITAL-FIRST COLLABORATION.
            </span>
          </div>
        </div>

        {/* Regional Selector Pills */}
        <CoverageRegionSelector
          regions={COVERAGE_REGIONS}
          cities={COVERAGE_CITIES}
          activeRegionId={activeRegionId}
          activeCityId={activeCityId}
          onSelectRegion={handleSelectRegion}
          onSelectCity={handleSelectCity}
          className="mb-8"
        />

        {/* Interactive Experience Grid (Map Stage + Details Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Interactive Map (lg:col-span-7) */}
          <div ref={mapRef} className="lg:col-span-7">
            <CoverageMap
              cities={COVERAGE_CITIES}
              activeCityId={activeCityId}
              onSelectCity={handleSelectCity}
            />
          </div>

          {/* Details Inspection Panel (lg:col-span-5) */}
          <div ref={panelRef} className="lg:col-span-5 h-full">
            <CoverageDetailsPanel city={currentCity} />
          </div>
        </div>

        {/* Closing Editorial Banner & Direct Project CTA */}
        <div className="mt-12 sm:mt-16 bg-white p-6 sm:p-10 rounded-3xl border border-editorial-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-mint font-bold block mb-1">
              NEXT STEPS
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-primary-dark">
              Your city. Your challenge. Let&apos;s build the right solution.
            </h3>
            <p className="text-xs sm:text-sm text-secondary-dark mt-2 font-normal">
              Whether you are in Pune, along the NH48 industrial corridor, on the coast, or collaborating remotely, our engineers are ready to build.
            </p>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto">
            <Link
              href="/contact?intent=reach"
              className="w-full md:w-auto group inline-flex items-center justify-center space-x-2 text-xs sm:text-sm font-bold uppercase tracking-widest bg-primary-dark text-canvas px-8 py-4 sm:py-5 rounded-full hover:bg-mint hover:text-primary-dark transition-all duration-300 shadow-sm"
            >
              <span>START A PROJECT</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Accessible Semantic HTML Geographic Directory */}
        <CoverageAccessibleList />
      </div>
    </section>
  );
}
