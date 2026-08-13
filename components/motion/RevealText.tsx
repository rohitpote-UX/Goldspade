"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down";
}

export function RevealText({
  children,
  className,
  delay = 0,
  direction = "up",
}: RevealTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const element = textRef.current;
    if (!element) return;

    gsap.fromTo(
      element,
      {
        y: direction === "up" ? 40 : -40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay,
        ease: "power3.out",
      }
    );
  }, [delay, direction]);

  return (
    <div ref={textRef} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
