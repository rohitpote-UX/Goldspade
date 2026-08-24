"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


const PROCESS_STEPS = [
  {
    step: "01",
    title: "DISCOVER",
    description: "Deep dive into your business model, competitive landscape, target audience, and primary objectives.",
    image: "/media/pages/methodology/methodology-discover.png",
    alt: "Goldspade discovery process research workspace",
    aspectRatio: "aspect-[16/10]",
    yOffset: 40,
  },
  {
    step: "02",
    title: "DEFINE",
    description: "Establish clear technical scope, strategic positioning, user flows, and project milestone criteria.",
    image: "/media/pages/methodology/methodology-define.png",
    alt: "Goldspade definition strategy wireframe workspace",
    aspectRatio: "aspect-[4/3]",
    yOffset: 55,
  },
  {
    step: "03",
    title: "DESIGN",
    description: "Craft minimal visual systems, typography hierarchy, high-fidelity UI wireframes, and motion concepts.",
    image: "/media/pages/methodology/methodology-design.png",
    alt: "Goldspade design craft typography workspace",
    aspectRatio: "aspect-[16/11]",
    yOffset: 35,
  },
  {
    step: "04",
    title: "BUILD",
    description: "Transform approved strategy and design into scalable, production-ready digital experiences.",
    image: "/media/pages/methodology/methodology-build.png",
    alt: "Goldspade engineering product development workstation",
    aspectRatio: "aspect-[16/10]",
    yOffset: 50,
  },
  {
    step: "05",
    title: "LAUNCH",
    description: "Validate, refine, optimize and deploy the final experience with performance and reliability in mind.",
    image: "/media/pages/methodology/methodology-launch.png",
    alt: "Goldspade product deployment launch momentum environment",
    aspectRatio: "aspect-[4/3]",
    yOffset: 40,
  },
  {
    step: "06",
    title: "GROW",
    description: "Measure, learn and continuously improve the product as the business evolves.",
    image: "/media/pages/methodology/methodology-grow.png",
    alt: "Goldspade long-term product expansion city horizon",
    aspectRatio: "aspect-[16/9]",
    yOffset: 55,
  },
];

export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const arrowsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        ".methodology-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );

      // Connecting Timeline Progress Bar Animation
      if (progressLineRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power2.out",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
            },
          }
        );
      }

      // Staggered Card Reveals with Masked Image Inset
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        const stepObj = PROCESS_STEPS[idx];
        const imgContainer = imageContainersRef.current[idx];
        const img = imagesRef.current[idx];

        // Card Y entrance
        gsap.fromTo(
          card,
          { opacity: 0, y: stepObj.yOffset, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: idx * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
            },
          }
        );

        // Image Mask Reveal
        if (imgContainer && img) {
          gsap.fromTo(
            imgContainer,
            { clipPath: "inset(8% 8% 8% 8%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              ease: "power3.out",
              delay: idx * 0.08 + 0.1,
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
              },
            }
          );

          gsap.fromTo(
            img,
            { scale: 1.08 },
            {
              scale: 1,
              duration: 1.1,
              ease: "power3.out",
              delay: idx * 0.08 + 0.1,
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (idx: number) => {
    setHoveredIndex(idx);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const img = imagesRef.current[idx];
    const card = cardsRef.current[idx];
    const arrow = arrowsRef.current[idx];

    if (card) {
      gsap.to(card, { y: -6, duration: 0.4, ease: "power2.out" });
    }
    if (img) {
      gsap.to(img, { scale: 1.05, x: 4, y: -3, duration: 0.8, ease: "power2.out" });
    }
    if (arrow) {
      gsap.to(arrow, { x: 8, duration: 0.3, ease: "power2.out" });
    }
  };

  const handleMouseLeave = (idx: number) => {
    setHoveredIndex(null);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const img = imagesRef.current[idx];
    const card = cardsRef.current[idx];
    const arrow = arrowsRef.current[idx];

    if (card) {
      gsap.to(card, { y: 0, duration: 0.4, ease: "power2.out" });
    }
    if (img) {
      gsap.to(img, { scale: 1, x: 0, y: 0, duration: 0.8, ease: "power2.out" });
    }
    if (arrow) {
      gsap.to(arrow, { x: 0, duration: 0.3, ease: "power2.out" });
    }
  };

  return (
    <section
      id="our-process"
      ref={containerRef}
      className="py-16 sm:py-24 md:py-40 bg-canvas text-primary-dark border-t border-editorial-border px-5 sm:px-12 md:px-20 lg:px-24 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="methodology-header mb-12 sm:mb-16 md:mb-20">
          <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-3">
            04 — METHODOLOGY
          </span>
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95]">
            FROM IDEA TO <span className="text-mint">IMPACT.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-secondary-dark max-w-2xl font-normal leading-relaxed">
            A systematic strategy ensuring every decision builds commercial value and enterprise credibility.
          </p>
        </div>

        {/* Connecting Progress Bar */}
        <div className="relative mb-12 hidden lg:block">
          <div className="flex justify-between text-[11px] font-mono font-bold uppercase tracking-widest text-secondary-dark/60 mb-3">
            {PROCESS_STEPS.map((item) => (
              <span key={item.step}>
                {item.step} {item.title}
              </span>
            ))}
          </div>
          <div className="w-full h-[1px] bg-editorial-border relative overflow-hidden">
            <div
              ref={progressLineRef}
              className="absolute inset-0 bg-primary-dark"
            />
          </div>
        </div>

        {/* Editorial Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROCESS_STEPS.map((item, idx) => {
            const isDimmed = hoveredIndex !== null && hoveredIndex !== idx;

            return (
              <div
                key={item.step}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                className={`group flex flex-col justify-between p-6 sm:p-7 bg-white rounded-3xl border border-editorial-border hover:border-primary-dark transition-all duration-400 shadow-sm cursor-pointer min-h-[480px] md:min-h-[520px] ${
                  isDimmed ? "lg:opacity-85" : "opacity-100"
                }`}
              >
                <div>
                  {/* Top Stage Header */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold text-secondary-dark uppercase tracking-widest">
                      STAGE {item.step}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-secondary-dark/50 uppercase tracking-widest">
                      PHASE {item.step}/06
                    </span>
                  </div>

                  {/* Cinematic Image Container */}
                  <div
                    ref={(el) => {
                      imageContainersRef.current[idx] = el;
                    }}
                    className={`relative w-full ${item.aspectRatio} rounded-2xl overflow-hidden mb-6 border border-editorial-border bg-canvas`}
                  >
                    <div
                      ref={(el) => {
                        imagesRef.current[idx] = el;
                      }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                        className="object-cover filter contrast-105"
                      />
                      {/* Subtle Dark Overlay */}
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-500" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-primary-dark mb-2.5 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-secondary-dark leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Process Indicator */}
                <div className="pt-6 mt-6 border-t border-editorial-border flex items-center justify-between font-mono text-xs font-bold text-primary-dark">
                  <span>{item.step} / 06</span>
                  <span
                    ref={(el) => {
                      arrowsRef.current[idx] = el;
                    }}
                    className="inline-block transition-transform text-base"
                  >
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
