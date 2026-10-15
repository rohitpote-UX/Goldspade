"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Compass, MapPin, Sparkles } from "lucide-react";
import { CoverageCity } from "@/data/coverage";

interface CoverageDetailsPanelProps {
  city: CoverageCity;
  className?: string;
}

export function CoverageDetailsPanel({
  city,
  className = "",
}: CoverageDetailsPanelProps) {
  const isPune = city.id === "pune";

  return (
    <div
      className={`bg-white rounded-3xl border border-editorial-border p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Top Background Gradient Glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 bg-mint/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-6">
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                isPune
                  ? "bg-primary-dark text-mint border-primary-dark shadow-sm"
                  : "bg-canvas text-primary-dark border-editorial-border"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isPune ? "bg-mint animate-pulse" : "bg-primary-dark"}`} />
              <span>{city.operatingModel.badge}</span>
            </span>

            <span className="text-xs font-mono text-secondary-dark/70 uppercase">
              {city.state}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-xs font-mono text-secondary-dark">
            <Compass className="w-3.5 h-3.5 text-mint" />
            <span>
              {city.coordinates.lat.toFixed(2)}°N, {city.coordinates.lng.toFixed(2)}°E
            </span>
          </div>
        </div>

        {/* City Title & Region */}
        <div className="mb-4">
          <span className="text-xs font-mono text-secondary-dark/70 uppercase tracking-widest block mb-1">
            {city.regionName}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark leading-tight flex items-center gap-2">
            <span>{city.displayName}</span>
            {isPune && (
              <span className="inline-block text-xs font-mono bg-mint/20 text-primary-dark border border-mint/40 px-2 py-0.5 rounded-md font-bold">
                CORE HUB
              </span>
            )}
          </h3>
          {city.alias && (
            <span className="text-xs font-mono text-secondary-dark block mt-0.5">
              Also known as: {city.alias}
            </span>
          )}
        </div>

        {/* Truthful Description */}
        <p className="text-sm sm:text-base text-secondary-dark leading-relaxed font-normal mb-6">
          {city.shortDescription}
        </p>

        {/* Operating Model Note */}
        <div className="bg-canvas/70 rounded-2xl p-4 border border-editorial-border/60 mb-6">
          <div className="flex items-center space-x-2 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-mint" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary-dark">
              HOW COLLABORATION HAPPENS
            </span>
          </div>
          <p className="text-xs text-secondary-dark leading-relaxed">
            {city.operatingModel.description}
          </p>
        </div>

        {/* Key Areas / Districts Covered */}
        <div className="mb-6">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary-dark/70 block mb-2">
            CORRIDOR HUBS & SERVICE REACH
          </span>
          <div className="flex flex-wrap gap-1.5">
            {city.keyDistrictsOrAreas.map((area) => (
              <span
                key={area}
                className="bg-canvas text-primary-dark border border-editorial-border/80 px-2.5 py-1 rounded-lg text-xs font-mono font-medium"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Concrete Deliverables */}
        <div className="mb-6">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary-dark/70 block mb-2">
            PRIMARY DELIVERABLES
          </span>
          <ul className="space-y-1.5">
            {city.deliverables.map((item) => (
              <li
                key={item}
                className="flex items-start space-x-2 text-xs text-secondary-dark font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-mint flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Case Study Callout (If Applicable) */}
        {city.caseStudy && (
          <div className="mb-6 pt-4 border-t border-editorial-border/60 flex items-center justify-between text-xs">
            <span className="font-mono text-secondary-dark/70 uppercase">
              Proven Local Work:
            </span>
            <Link
              href={city.caseStudy.href}
              className="font-mono font-bold text-primary-dark hover:text-mint inline-flex items-center space-x-1 group transition-colors"
            >
              <span>{city.caseStudy.title}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Conversion & Linking Section */}
      <div className="pt-6 border-t border-editorial-border/80">
        {/* Destination Page Link (If Dedicated Location Page Exists) */}
        {city.locationUrl && (
          <div className="mb-3">
            <Link
              href={city.locationUrl}
              className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-canvas border border-editorial-border hover:border-primary-dark/40 text-xs font-mono font-bold uppercase tracking-wider text-primary-dark transition-all duration-300 group"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-mint" />
                <span>Explore {city.name} Regional Page</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-secondary-dark group-hover:text-primary-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        )}

        {/* Primary Project Inquiry CTA */}
        <Link
          href={`/contact?location=${city.id}`}
          className="w-full group inline-flex items-center justify-center space-x-2 text-xs sm:text-sm font-bold uppercase tracking-widest bg-mint text-primary-dark px-6 py-4 rounded-full hover:bg-[#5fe4b4] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-sm text-center"
        >
          <span>START A PROJECT IN {city.name.toUpperCase()}</span>
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
        </Link>

        {/* Honest Reach Microcopy */}
        <span className="text-[10px] font-mono text-secondary-dark/60 mt-3 block text-center">
          Direct alignment with senior engineers · No bloated agency overhead
        </span>
      </div>
    </div>
  );
}
