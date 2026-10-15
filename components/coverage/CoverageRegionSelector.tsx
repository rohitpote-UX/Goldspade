"use client";

import React from "react";
import { CoverageRegion, COVERAGE_REGIONS, CoverageCity } from "@/data/coverage";

interface CoverageRegionSelectorProps {
  regions: CoverageRegion[];
  cities: CoverageCity[];
  activeRegionId: string;
  activeCityId: string;
  onSelectRegion: (regionId: string) => void;
  onSelectCity: (cityId: string) => void;
  className?: string;
}

export function CoverageRegionSelector({
  regions = COVERAGE_REGIONS,
  cities,
  activeRegionId,
  activeCityId,
  onSelectRegion,
  onSelectCity,
  className = "",
}: CoverageRegionSelectorProps) {
  // Cities belonging to the currently selected region
  const regionCities = cities.filter((c) => c.regionId === activeRegionId);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary Region Tabs (Horizontal Scrollable on Mobile) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <span className="text-[10px] font-mono uppercase tracking-widest text-secondary-dark/60 font-bold whitespace-nowrap mr-2 hidden sm:inline-block">
          REGION:
        </span>
        {regions.map((region) => {
          const isActive = region.id === activeRegionId;
          const isPune = region.id === "pune";

          return (
            <button
              key={region.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onSelectRegion(region.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 border outline-none ${
                isActive
                  ? isPune
                    ? "bg-primary-dark text-mint border-primary-dark shadow-sm scale-105"
                    : "bg-primary-dark text-canvas border-primary-dark shadow-sm scale-105"
                  : "bg-white text-secondary-dark border-editorial-border hover:border-primary-dark/40 hover:text-primary-dark"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? (isPune ? "bg-mint" : "bg-mint") : "bg-editorial-border"
                }`}
              />
              <span>{region.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-city Selector (If region has multiple cities, e.g. Western Maharashtra or North Karnataka) */}
      {regionCities.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-editorial-border/60">
          <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-dark/60">
            Select City:
          </span>
          {regionCities.map((city) => {
            const isCityActive = city.id === activeCityId;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => onSelectCity(city.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 border ${
                  isCityActive
                    ? "bg-mint text-primary-dark border-mint font-bold shadow-sm"
                    : "bg-canvas/60 text-secondary-dark border-editorial-border hover:text-primary-dark hover:border-primary-dark/30"
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
