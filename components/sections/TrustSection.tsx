"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, Code2, Cpu, Layers, Sparkles, Zap } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SYSTEM_NODES = [
  { label: "IDEA", icon: Sparkles },
  { label: "STRATEGY", icon: Layers },
  { label: "DESIGN", icon: Cpu },
  { label: "BUILD", icon: Code2 },
  { label: "OPTIMIZE", icon: Zap },
  { label: "GROW", icon: ArrowRight },
];

export function TrustSection() {
  const [activeNodeIndex, setActiveNodeIndex] = useState(3); // Default "BUILD"
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const sec = sectionRef.current;
      if (!sec) return;

      cardsRef.current.forEach((card, idx) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: idx * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 md:py-40 bg-canvas text-primary-dark border-t border-editorial-border px-6 sm:px-12 md:px-20 lg:px-24 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-3">
              06 — CREDIBILITY
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95]">
              BUILT ON <span className="text-mint">TRUST.</span>
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-secondary-dark max-w-2xl font-normal leading-relaxed">
              Your business deserves more than a polished interface. It deserves clarity, technical discipline, and people who take ownership.
            </p>
          </div>

          <div className="hidden lg:block text-right">
            <span className="font-mono text-xs uppercase tracking-widest text-secondary-dark/60 font-bold block mb-1">
              TRUST ARCHITECTURE
            </span>
            <span className="font-mono text-xs text-primary-dark font-bold tracking-wider">
              STRATEGY / DESIGN / ENGINEERING / PERFORMANCE
            </span>
          </div>
        </div>

        {/* Asymmetric Trust Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Card 01: Featured Technical Discipline (lg:col-span-7) */}
          <div
            ref={(el) => {
              cardsRef.current[0] = el;
            }}
            className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-editorial-border shadow-sm flex flex-col justify-between group hover:border-primary-dark/40 hover:-translate-y-1.5 transition-all duration-400 relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-mint uppercase tracking-widest font-bold">
                  01 — TECHNICAL FOUNDATION
                </span>
                <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark mb-4">
                TECHNICAL DISCIPLINE
              </h3>
              <p className="text-base text-secondary-dark leading-relaxed font-normal mb-8 max-w-xl">
                Modern technology without unnecessary complexity. Performance, accessibility, SEO, and maintainability are considered from the first line of code.
              </p>
            </div>

            {/* Abstract System Architecture Diagram */}
            <div className="bg-canvas/60 p-6 rounded-2xl border border-editorial-border/60 mt-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary-dark/60 block mb-4">
                SYSTEM ARCHITECTURE FLOW
              </span>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {SYSTEM_NODES.map((node, index) => {
                  const NodeIcon = node.icon;
                  const isActive = activeNodeIndex === index;
                  return (
                    <button
                      key={node.label}
                      onClick={() => setActiveNodeIndex(index)}
                      type="button"
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${
                        isActive
                          ? "bg-primary-dark text-canvas border-primary-dark shadow-sm scale-105"
                          : "bg-white text-primary-dark border-editorial-border hover:border-mint hover:bg-canvas"
                      }`}
                    >
                      <NodeIcon className={`w-4 h-4 ${isActive ? "text-mint" : "text-secondary-dark"}`} />
                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase">
                        {node.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 02: Direct Founder Alignment (lg:col-span-5) */}
          <div
            ref={(el) => {
              cardsRef.current[1] = el;
            }}
            className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl border border-editorial-border shadow-sm flex flex-col justify-between group hover:border-primary-dark/40 hover:-translate-y-1.5 transition-all duration-400"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-secondary-dark/60 uppercase tracking-widest font-bold">
                  02 — COLLABORATION
                </span>
                <span className="font-mono text-xl text-mint font-bold">↔</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark mb-4">
                DIRECT FOUNDER ALIGNMENT
              </h3>
              <p className="text-base text-secondary-dark leading-relaxed font-normal">
                You work directly with the people responsible for the thinking, design, and build — not layers of unnecessary account management.
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-editorial-border/60 flex items-center space-x-2 text-xs font-mono text-secondary-dark">
              <span className="w-1.5 h-1.5 rounded-full bg-mint" />
              <span>Direct access to leads</span>
            </div>
          </div>

          {/* Card 03: Honest Execution (lg:col-span-5) */}
          <div
            ref={(el) => {
              cardsRef.current[2] = el;
            }}
            className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl border border-editorial-border shadow-sm flex flex-col justify-between group hover:border-primary-dark/40 hover:-translate-y-1.5 transition-all duration-400"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-secondary-dark/60 uppercase tracking-widest font-bold">
                  03 — TRANSPARENCY
                </span>
                <div className="w-7 h-7 rounded-full bg-mint/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-dark" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark mb-4">
                HONEST EXECUTION
              </h3>
              <p className="text-base text-secondary-dark leading-relaxed font-normal">
                No inflated numbers. No fabricated case studies. No promises designed to close a deal. Just clear thinking, honest communication, and real work.
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-editorial-border/60 flex items-center space-x-2 text-xs font-mono text-secondary-dark">
              <span className="w-1.5 h-1.5 rounded-full bg-mint" />
              <span>Zero bloated agency promises</span>
            </div>
          </div>

          {/* Card 04: Built For What Comes Next (lg:col-span-7) */}
          <div
            ref={(el) => {
              cardsRef.current[3] = el;
            }}
            className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-editorial-border shadow-sm flex flex-col justify-between group hover:border-primary-dark/40 hover:-translate-y-1.5 transition-all duration-400"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-mint uppercase tracking-widest font-bold">
                  04 — LONGEVITY
                </span>
                <span className="font-mono text-xl text-mint font-bold">↗</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark mb-4">
                BUILT FOR WHAT COMES NEXT
              </h3>
              <p className="text-base text-secondary-dark leading-relaxed font-normal mb-8 max-w-xl">
                We don&apos;t design only for launch day. We build digital foundations that can evolve as your business grows.
              </p>
            </div>

            <div className="bg-canvas/60 p-4 rounded-2xl border border-editorial-border/60 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-mono font-bold uppercase text-secondary-dark">
                EVOLUTION PATHWAY
              </span>

              <div className="flex items-center space-x-2 font-mono text-xs font-bold uppercase tracking-wider text-primary-dark">
                <span className="bg-white px-3 py-1.5 rounded-full border border-editorial-border">TODAY</span>
                <span className="text-mint font-bold">→</span>
                <span className="bg-white px-3 py-1.5 rounded-full border border-editorial-border">NEXT</span>
                <span className="text-mint font-bold">→</span>
                <span className="bg-primary-dark text-white px-3 py-1.5 rounded-full">SCALE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
