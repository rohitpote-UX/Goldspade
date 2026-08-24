"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils/cn";

const PRINCIPLES = [
  {
    num: "01 / STRATEGY",
    label: "Commercial Clarity",
    cropStyle: "object-top scale-105",
  },
  {
    num: "02 / DESIGN",
    label: "Bespoke Aesthetics",
    cropStyle: "object-center scale-110",
  },
  {
    num: "03 / TECHNOLOGY",
    label: "Scalable Architecture",
    cropStyle: "object-bottom scale-105",
  },
  {
    num: "04 / CRAFT",
    label: "Uncompromising Precision",
    cropStyle: "object-center scale-100",
  },
];

export function IntroSection() {
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const sec = sectionRef.current;
      const left = leftColRef.current;
      const frame = imageFrameRef.current;

      if (!sec || !left || !frame) return;

      gsap.fromTo(
        left.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 82%",
          },
        }
      );

      gsap.fromTo(
        frame,
        { clipPath: "inset(100% 0 0 0)", y: 40, opacity: 0 },
        {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 82%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24; // Max 12px float
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 24;
    setMousePos({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      className="py-28 md:py-44 bg-canvas text-primary-dark border-t border-editorial-border px-6 sm:px-12 md:px-20 lg:px-24 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Eyebrow, Headline, Description */}
          <div ref={leftColRef} className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-6">
                01 — POSITIONING
              </span>

              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold uppercase tracking-tight text-primary-dark leading-[0.92] mb-8">
                WE DON&apos;T JUST <br />
                BUILD WEBSITES.
              </h2>

              <p className="text-xl sm:text-2xl md:text-3xl text-secondary-dark font-normal leading-relaxed mb-12 max-w-2xl">
                We build the digital foundations behind ambitious ideas. Positioning Goldspade at the intersection of strategic intelligence, bespoke craftsmanship, and rigorous engineering.
              </p>
            </div>

            {/* Four Strategic Principles with Pillar-to-Visual Hover Connection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-editorial-border">
              {PRINCIPLES.map((pillar, idx) => {
                const isActive = activePillar === idx;
                return (
                  <div
                    key={pillar.num}
                    onMouseEnter={() => setActivePillar(idx)}
                    onMouseLeave={() => setActivePillar(null)}
                    className={cn(
                      "cursor-pointer transition-all duration-300 group",
                      activePillar !== null && !isActive ? "opacity-40" : "opacity-100"
                    )}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full bg-mint transition-opacity duration-300",
                          isActive ? "opacity-100 scale-125" : "opacity-0"
                        )}
                      />
                      <span className="block text-xs font-mono uppercase text-secondary-dark font-semibold group-hover:text-primary-dark">
                        {pillar.num}
                      </span>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-primary-dark block group-hover:translate-x-1 transition-transform duration-300">
                      {pillar.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Hero Visual Artifact in Editorial Blueprint Frame */}
          <div className="lg:col-span-5">
            <div
              ref={imageFrameRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-editorial-border shadow-xl group cursor-pointer"
            >
              {/* Architectural Blueprint Grid Lines Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10 opacity-30 overflow-hidden">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern
                      id="intro-blueprint-grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="0.8"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#intro-blueprint-grid)" />
                </svg>
              </div>

              {/* Mint Technical Badge */}
              <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-editorial-border text-[10px] font-mono font-bold uppercase tracking-widest text-primary-dark flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                <span>FOUNDATION ARTIFACT / 001</span>
              </div>

              {/* Photorealistic Visual Artifact with Dynamic Crop Shift */}
              <div
                className="relative w-full h-full transition-transform duration-700 ease-out"
                style={{
                  transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
                }}
              >
                <Image
                  src="/media/pages/positioning/positioning-foundation-artifact.png"
                  alt="Goldspade Digital Foundation Artifact"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className={cn(
                    "object-cover filter contrast-105 transition-all duration-700 group-hover:scale-105",
                    activePillar !== null ? PRINCIPLES[activePillar].cropStyle : "object-center"
                  )}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
