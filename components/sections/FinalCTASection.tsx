"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface IntentOption {
  id: string;
  label: string;
  insight: string;
}

const INTENT_OPTIONS: IntentOption[] = [
  {
    id: "idea",
    label: "I HAVE AN IDEA",
    insight: "Good ideas become stronger when strategy enters the room.",
  },
  {
    id: "business",
    label: "I'M BUILDING A BUSINESS",
    insight: "Let's identify what's holding the next stage of growth back.",
  },
  {
    id: "website",
    label: "I NEED A BETTER WEBSITE",
    insight: "A website should communicate authority and drive commercial value.",
  },
  {
    id: "product",
    label: "I'M LAUNCHING A PRODUCT",
    insight: "Let's ensure your product earns attention and momentum before launch.",
  },
  {
    id: "scale",
    label: "I WANT TO SCALE",
    insight: "Let's optimize your digital architecture before you scale.",
  },
];

export function FinalCTASection() {
  const [selectedIntent, setSelectedIntent] = useState<IntentOption>(INTENT_OPTIONS[0]);
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const sec = sectionRef.current;
      const left = leftColRef.current;
      const right = rightCardRef.current;

      if (!sec || !left || !right) return;

      gsap.fromTo(
        left.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        right,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="start-a-conversation"
      ref={sectionRef}
      className="py-16 sm:py-24 md:py-44 bg-canvas text-primary-dark border-t border-editorial-border relative overflow-hidden px-5 sm:px-12 md:px-20 lg:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          {/* Left Column: Asymmetric Editorial Question & Brand Purpose */}
          <div ref={leftColRef} className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-6 sm:mb-8">
                07 — START A CONVERSATION
              </span>

              <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-bold uppercase tracking-tight text-primary-dark leading-[0.9] mb-6 sm:mb-8">
                WHAT <br />
                ARE YOU <br />
                <span className="group relative inline-block text-mint cursor-pointer">
                  BUILDING?
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-mint/70 overflow-visible pointer-events-none transition-transform duration-500 group-hover:scale-x-105 origin-left"
                    viewBox="0 0 100 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 7C28 2 72 11 98 5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>

              <p className="text-base sm:text-xl md:text-2xl text-secondary-dark max-w-xl font-normal leading-relaxed mb-6 sm:mb-8">
                Tell us what you&apos;re building, where you&apos;re stuck, or where you want to go. We&apos;ll help you find the clearest path forward.
              </p>
            </div>

            <div className="pt-6 sm:pt-8 border-t border-editorial-border/60">
              <span className="font-mono text-xs uppercase tracking-widest text-secondary-dark/60 font-bold block mb-3">
                IDEA → STRATEGY → BUILD → GROW
              </span>
              <p className="text-xs text-secondary-dark max-w-md font-normal leading-relaxed">
                Goldspade partners with founders and executive leaders to engineer software, digital platforms, and market-defining brands.
              </p>
            </div>
          </div>

          {/* Right Column: Conversational Intent Interface Card */}
          <div className="lg:col-span-5">
            <div
              ref={rightCardRef}
              className="bg-white p-6 sm:p-10 rounded-3xl border border-editorial-border shadow-sm flex flex-col justify-between h-full relative overflow-hidden"
            >
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-secondary-dark block mb-4 sm:mb-6">
                  WHERE ARE YOU NOW?
                </span>

                {/* Intent Selectable Options */}
                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {INTENT_OPTIONS.map((option) => {
                    const isSelected = selectedIntent.id === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedIntent(option)}
                        type="button"
                        className={`w-full text-left px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-between group ${
                          isSelected
                            ? "bg-primary-dark text-canvas border-primary-dark shadow-sm translate-x-1"
                            : "bg-canvas/50 border border-editorial-border/60 text-primary-dark hover:border-primary-dark/30 hover:bg-canvas hover:translate-x-1"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              isSelected ? "bg-mint scale-125" : "bg-editorial-border group-hover:bg-primary-dark/40"
                            }`}
                          />
                          <span>{option.label}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Strategic Insight Banner */}
                <div className="bg-canvas/60 p-4 rounded-2xl border border-editorial-border/60 mb-6 sm:mb-8 transition-all duration-300">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-mint block mb-1">
                    STRATEGIC INSIGHT
                  </span>
                  <p className="text-xs sm:text-sm text-primary-dark font-medium leading-relaxed italic">
                    &ldquo;{selectedIntent.insight}&rdquo;
                  </p>
                </div>
              </div>

              {/* Conversion Action CTA & Microcopy */}
              <div>
                <Link
                  href={`/contact?intent=${selectedIntent.id}`}
                  className="w-full group inline-flex items-center justify-center space-x-2 text-xs sm:text-sm font-bold uppercase tracking-widest bg-mint text-primary-dark px-6 sm:px-8 py-4 sm:py-5 min-h-[48px] rounded-full hover:bg-[#5fe4b4] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-sm text-center"
                >
                  <span>START A PROJECT</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </Link>

                <span className="text-[11px] font-mono text-secondary-dark/60 mt-3 block text-center">
                  No obligation. Just a conversation.
                </span>

                <div className="mt-6 pt-6 border-t border-editorial-border/60 flex items-center justify-between text-xs font-mono text-secondary-dark">
                  <span>Prefer direct email?</span>
                  <a
                    href="mailto:hello@goldspade.in"
                    className="text-xs uppercase tracking-widest text-primary-dark font-bold font-mono hover:text-secondary-dark transition-colors inline-flex items-center"
                  >
                    hello@goldspade.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
