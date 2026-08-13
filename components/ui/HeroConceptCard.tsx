"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface HeroConceptCardProps {
  className?: string;
}

const FRAMES = [
  {
    id: "strategy",
    src: "/media/hero/hero-strategy.png",
    tagline: "01 · STRATEGY & FOUNDER VISION",
  },
  {
    id: "brand",
    src: "/media/hero/hero-brand.png",
    tagline: "02 · BRAND & DESIGN SYSTEM",
  },
  {
    id: "product",
    src: "/media/hero/hero-product.png",
    tagline: "03 · DIGITAL PRODUCT INTERFACE",
  },
  {
    id: "architecture",
    src: "/media/hero/hero-architecture.png",
    tagline: "04 · SYSTEM ARCHITECTURE & SCALE",
  },
];

export function HeroConceptCard({ className }: HeroConceptCardProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport IntersectionObserver to pause playback when out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Smooth 2.5-second frame montage loop
  useEffect(() => {
    if (!isVisible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % FRAMES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-44 sm:w-64 md:w-80 lg:w-96 aspect-[16/10] rounded-3xl overflow-hidden border border-editorial-border shadow-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group cursor-pointer select-none",
        isHovered ? "scale-[1.03] shadow-xl border-mint/40" : "scale-100",
        className
      )}
    >
      <Link href="/capabilities" className="block w-full h-full relative">
        {/* Cinematic Multi-Frame Visual Montage Engine */}
        <div className="absolute inset-0 overflow-hidden bg-black">
          {FRAMES.map((frame, index) => {
            const isActive = index === currentFrame;
            return (
              <div
                key={frame.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                )}
              >
                <Image
                  src={frame.src}
                  alt={frame.tagline}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 640px) 176px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                  className={cn(
                    "object-cover filter contrast-105 transition-transform duration-[3000ms] ease-out",
                    isActive && isVisible ? "scale-105" : "scale-100"
                  )}
                />
                {/* Subtle dark vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Editorial Progress Line at Top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/20 z-20 overflow-hidden">
          <div
            className="h-full bg-mint transition-all duration-500 ease-out"
            style={{ width: `${((currentFrame + 1) / FRAMES.length) * 100}%` }}
          />
        </div>

        {/* Status Pill Label (Bottom Left) */}
        <div
          className={cn(
            "absolute bottom-3 left-3 z-20 bg-white/95 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase text-primary-dark border border-editorial-border transition-all duration-300 flex items-center space-x-1.5 shadow-sm",
            isHovered ? "translate-x-1 -translate-y-0.5 border-mint/40" : "translate-x-0"
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
          <span>GOLDSPADE · FORGING SYSTEMS</span>
        </div>

        {/* Editorial Stage Tagline (Top Left) */}
        <div className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[9px] font-mono uppercase text-white/90 border border-white/10 tracking-widest pointer-events-none">
          {FRAMES[currentFrame]?.tagline}
        </div>
      </Link>
    </div>
  );
}
