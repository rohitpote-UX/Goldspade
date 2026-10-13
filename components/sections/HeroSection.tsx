"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";
import { HeroConceptCard } from "@/components/ui/HeroConceptCard";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Headline lines reveal using clip container translation
      const lines = headlineRef.current?.querySelectorAll(".clip-text");
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.0,
            stagger: 0.1,
            ease: "power4.out",
          }
        );
      }

      // Floating project images staggered scale and fade entry
      const validImages = imagesRef.current.filter(Boolean);
      if (validImages.length > 0) {
        gsap.fromTo(
          validImages,
          { scale: 1.08, opacity: 0, y: 30 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.15,
            delay: 0.2,
            ease: "power3.out",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] pt-28 sm:pt-36 md:pt-40 pb-14 sm:pb-20 flex flex-col justify-between bg-canvas text-primary-dark overflow-hidden px-5 sm:px-12 md:px-20 lg:px-24"
    >
      <div className="max-w-7xl mx-auto w-full my-auto">
        {/* Compact Eyebrow Pill */}
        <div className="inline-flex items-center space-x-2 bg-white border border-editorial-border px-4 py-2 rounded-full mb-6 sm:mb-8 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary-dark">
            BRAND · PRODUCT · EXPERIENCE
          </span>
        </div>

        {/* Editorial Typography + Interacting Floating Images Canvas */}
        <div ref={headlineRef} className="relative z-10 font-bold uppercase tracking-tighter leading-[0.85] text-primary-dark">
          {/* Accessible Semantic H1 for Search Engines and Screen Readers */}
          <h1 className="sr-only">Goldspade — Premium Digital Studio Forged for Founders</h1>

          {/* Line 1: FORGED + Floating Hero Concept Showcase */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-8 mb-2">
            <div className="clip-text-container">
              <span aria-hidden="true" className="clip-text block text-[clamp(44px,13vw,180px)] font-bold tracking-tighter">
                FORGED
              </span>
            </div>

            {/* Floating Hero Concept Showcase */}
            <div ref={(el) => { imagesRef.current[0] = el; }}>
              <HeroConceptCard />
            </div>
          </div>

          {/* Line 2: FOR + Floating Image 2 + Floating Image 3 */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-8 mb-2">
            {/* Floating Image 2 (Brand Identity & Craft) */}
            <div
              ref={(el) => { imagesRef.current[1] = el; }}
              className="relative w-36 sm:w-52 md:w-64 aspect-[4/3] rounded-3xl overflow-hidden border border-editorial-border shadow-md transition-transform duration-700 hover:scale-105 group cursor-pointer hidden sm:block"
            >
              <Link href="/services" className="relative block w-full h-full" aria-label="Explore Brand & Visual Identity Systems">
                <Image
                  src="/media/hero/hero-brand.png"
                  alt="Brand and visual identity system engineered by Goldspade"
                  fill
                  sizes="(max-width: 768px) 208px, 256px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase text-primary-dark border border-editorial-border">
                  BRAND & VISUAL SYSTEM
                </div>
              </Link>
            </div>

            <div className="clip-text-container">
              <span aria-hidden="true" className="clip-text block text-[clamp(44px,13vw,180px)] font-bold tracking-tighter text-primary-dark">
                FOR
              </span>
            </div>

            {/* Floating Image 3 (Product Interface & System UX) */}
            <div
              ref={(el) => { imagesRef.current[2] = el; }}
              className="relative w-40 sm:w-56 md:w-72 aspect-[16/9] rounded-3xl overflow-hidden border border-editorial-border shadow-md transition-transform duration-700 hover:scale-105 group cursor-pointer"
            >
              <Link href="/services" className="relative block w-full h-full" aria-label="Explore Digital Product Interface & UX">
                <Image
                  src="/media/hero/hero-product.png"
                  alt="Digital product interface and user experience design by Goldspade"
                  fill
                  sizes="(max-width: 768px) 224px, 288px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase text-primary-dark border border-editorial-border">
                  PRODUCT & DIGITAL INTERFACE
                </div>
              </Link>
            </div>
          </div>

          {/* Line 3: FOUNDERS. + Floating Image 4 + Floating Proof Pill */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-8">
            <div className="clip-text-container">
              <span aria-hidden="true" className="clip-text block text-[clamp(44px,13vw,180px)] font-bold tracking-tighter text-mint">
                FOUNDERS.
              </span>
            </div>

            {/* Floating Image 4 (Scale & Architectural Foundation) */}
            <div
              ref={(el) => { imagesRef.current[3] = el; }}
              className="relative w-36 sm:w-48 aspect-square rounded-3xl overflow-hidden border border-editorial-border shadow-md transition-transform duration-700 hover:scale-105 group cursor-pointer hidden lg:block"
            >
              <Link href="/philosophy" className="relative block w-full h-full" aria-label="Read Goldspade philosophy on scale and foundations">
                <Image
                  src="/media/hero/hero-growth.png"
                  alt="Scale and architectural foundation engineered for founders"
                  fill
                  sizes="192px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase text-primary-dark border border-editorial-border">
                  SCALE & FOUNDATION
                </div>
              </Link>
            </div>

            {/* Floating Factual Proof Pill */}
            <div
              ref={(el) => { imagesRef.current[4] = el; }}
              className="inline-flex items-center space-x-2 bg-mint text-[#171515] px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-black/10 shadow-xs"
            >
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                IDEA TO SCALABLE SYSTEM
              </span>
            </div>
          </div>
        </div>

        {/* Supporting Copy & Dual Rounded CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-end pt-10 sm:pt-12 md:pt-16">
          <div className="md:col-span-6">
            <p className="text-base sm:text-xl md:text-2xl text-secondary-dark leading-relaxed font-normal max-w-lg">
              Goldspade is a premium digital studio engineering bespoke websites, web applications, and AI integrations for ambitious founders.
            </p>
          </div>

          <div className="md:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-start md:justify-end gap-3 sm:gap-4">
            <Button href="/work" variant="primary" size="lg" icon className="w-full sm:w-auto">
              VIEW OUR WORK
            </Button>
            <Button href="/contact" variant="secondary" size="lg" icon className="w-full sm:w-auto">
              START A PROJECT
            </Button>
          </div>
        </div>
      </div>

      {/* Editorial Bottom Architectural Divider */}
      <div className="max-w-7xl mx-auto w-full pt-12">
        <div className="flex items-center justify-between text-xs font-mono text-secondary-dark uppercase tracking-widest pt-6 border-t border-editorial-border">
          <span>GOLDSPADE DIGITAL STUDIO</span>
          <span className="hidden sm:inline">EDITORIAL & COMMERCIAL DIGITAL EXECUTION</span>
        </div>
      </div>
    </section>
  );
}
