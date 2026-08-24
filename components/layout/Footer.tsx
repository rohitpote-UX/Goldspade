"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [reducedMotion, setReducedMotion] = useState(false);

  const footerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    setCurrentYear(new Date().getFullYear());
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    if (mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      const footerEl = footerRef.current;
      const panelEl = panelRef.current;
      const contentEl = contentRef.current;
      const cardEl = cardRef.current;

      if (!footerEl || !panelEl) return;

      // Initial positions for sliding door entrance reveal
      gsap.set(panelEl, { yPercent: 35, opacity: 0.95 });
      if (contentEl) gsap.set(contentEl, { y: 25 });
      if (cardEl) gsap.set(cardEl, { y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerEl,
          start: "top 95%",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Panel rises smoothly like a large architectural sliding door
      tl.to(panelEl, {
        yPercent: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 1,
      });

      // Internal content subtly follows
      if (contentEl) {
        tl.to(
          contentEl,
          {
            y: 0,
            ease: "power2.out",
            duration: 0.85,
          },
          "<0.05"
        );
      }

      // Inquiry glass card settles with subtle depth
      if (cardEl) {
        tl.to(
          cardEl,
          {
            y: 0,
            ease: "power2.out",
            duration: 0.85,
          },
          "<0.1"
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-canvas pt-12 text-white overflow-hidden">
      {/* Curved Near-Black Panel Container (Sliding Door Panel) */}
      <div
        ref={panelRef}
        className="relative bg-[#050505] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] pt-20 pb-12 px-6 sm:px-12 md:px-16 lg:px-20 border-t border-white/10 shadow-2xl transition-shadow duration-500"
      >
        {/* Architectural Blueprint Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden rounded-t-[2.5rem] sm:rounded-t-[3.5rem]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="footer-architectural-grid"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-architectural-grid)" />

            {/* Mint Flowing Grid Lines (Organic Energy Paths) */}
            {!reducedMotion && (
              <>
                {/* Horizontal Path 1 */}
                <path
                  d="M 0 160 L 400 160 L 400 320 L 960 320"
                  fill="none"
                  stroke="#73F3C5"
                  strokeWidth="1.5"
                  strokeDasharray="120 480"
                  className="animate-[gridFlow1_12s_linear_infinite]"
                />
                {/* Vertical Path 2 */}
                <path
                  d="M 320 0 L 320 240 L 640 240 L 640 560"
                  fill="none"
                  stroke="#73F3C5"
                  strokeWidth="1.5"
                  strokeDasharray="100 500"
                  className="animate-[gridFlow2_16s_linear_infinite]"
                />
                {/* Diagonal Crossing Path 3 */}
                <path
                  d="M 800 80 L 800 400 L 1280 400"
                  fill="none"
                  stroke="#73F3C5"
                  strokeWidth="1.5"
                  strokeDasharray="140 460"
                  className="animate-[gridFlow3_14s_linear_infinite]"
                />
              </>
            )}
          </svg>
        </div>

        {/* Main Content Layout Container */}
        <div ref={contentRef} className="max-w-[1920px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-20 border-b border-white/10">
            {/* Column 1: Brand Signature & Contact */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-8">
              <div>
                <span className="font-mono text-xs text-mint uppercase tracking-widest block mb-4">
                  STUDIO SIGNATURE
                </span>
                <Link
                  href="/"
                  className="font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter uppercase text-white block mb-6 hover:opacity-90 transition-opacity"
                >
                  GOLDSPADE
                </Link>
                <p className="text-base sm:text-lg text-white/70 max-w-md leading-relaxed font-normal">
                  Forged for Founders. Strategy, design, and technology built for ambitious businesses.
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-mono block mb-2">
                  DIRECT CONTACT
                </span>
                <a
                  href="mailto:hello@goldspade.in"
                  className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-mint transition-colors duration-300 inline-block"
                >
                  HELLO@GOLDSPADE.IN
                </a>
              </div>
            </div>

            {/* Column 2 & 3: Navigation & Connect */}
            <div className="md:col-span-4 grid grid-cols-2 gap-8">
              {/* Navigation */}
              <div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-mono block mb-6">
                  NAVIGATION
                </span>
                <ul className="space-y-4 text-sm font-semibold">
                  {[
                    { label: "WORK", href: "/work" },
                    { label: "CAPABILITIES", href: "/capabilities" },
                    { label: "PHILOSOPHY", href: "/philosophy" },
                    { label: "ABOUT", href: "/about" },
                    { label: "JOURNAL", href: "/journal" },
                    { label: "CONTACT", href: "/contact" },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-white/80 hover:text-mint hover:translate-x-1.5 transition-all duration-300 inline-block"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect */}
              <div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-mono block mb-6">
                  CONNECT
                </span>
                <ul className="space-y-4 text-sm font-semibold">
                  {[
                    { label: "X / TWITTER", href: "https://twitter.com" },
                    { label: "LINKEDIN", href: "https://linkedin.com" },
                    { label: "GITHUB", href: "https://github.com" },
                  ].map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-mint hover:translate-x-1.5 transition-all duration-300 inline-block"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 4: Translucent Dark Glass Inquiry Card */}
            <div className="md:col-span-3">
              <div
                ref={cardRef}
                className="group relative flex flex-col justify-between bg-white/[0.04] backdrop-blur-md p-8 sm:p-9 rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-400 shadow-2xl h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-mint">
                      INQUIRIES
                    </span>
                    <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-3">
                    HAVE AN IDEA?
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-8">
                    Let&apos;s discuss how we can build your brand, product, or system.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center space-x-2 bg-mint text-primary-dark font-bold uppercase tracking-wider text-xs px-6 py-4 rounded-full hover:bg-[#5fe4b4] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md group-hover:shadow-mint/10"
                >
                  <span>START A PROJECT</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 font-mono">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <span className="text-white/30 font-bold">STUDIO / 001</span>
              <span>© {currentYear} GOLDSPADE STUDIO. ALL RIGHTS RESERVED.</span>
            </div>

            <div className="flex items-center space-x-6 font-bold">
              <Link href="/privacy" className="hover:text-white transition-colors">
                PRIVACY
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                TERMS
              </Link>
              <Link
                href="/admin"
                className="text-white/40 hover:text-mint transition-colors inline-flex items-center space-x-1"
                aria-label="Goldspade Internal Client Desk"
              >
                <span>CLIENT DESK</span>
                <span className="text-mint">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
