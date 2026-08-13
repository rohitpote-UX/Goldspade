import React from "react";
import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  large?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  large = false,
}: SectionHeadingProps) {
  const alignment = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div className={cn("flex flex-col mb-12 md:mb-20", alignment[align], className)}>
      {eyebrow && (
        <span className="text-xs uppercase tracking-widest text-secondary-dark mb-3 font-mono">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-bold uppercase tracking-tight text-primary-dark leading-none",
          large
            ? "text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
            : "text-3xl sm:text-5xl md:text-6xl"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-secondary-dark max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
