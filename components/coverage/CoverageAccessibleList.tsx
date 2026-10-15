import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { COVERAGE_REGIONS, COVERAGE_CITIES } from "@/data/coverage";

export function CoverageAccessibleList() {
  return (
    <div className="mt-12 sm:mt-16 pt-10 border-t border-editorial-border/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-secondary-dark block mb-1">
            GEOGRAPHIC DIRECTORY & INTERNAL CORRIDORS
          </span>
          <h4 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-primary-dark">
            Complete Regional Coverage Matrix
          </h4>
        </div>
        <span className="text-xs font-mono text-secondary-dark/60">
          Rooted in Pune · Serving Maharashtra, Goa, Karnataka & Pan-India
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {COVERAGE_REGIONS.map((region) => {
          const regionCities = COVERAGE_CITIES.filter((c) => c.regionId === region.id);

          return (
            <div
              key={region.id}
              className="bg-white/80 p-5 rounded-2xl border border-editorial-border/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-mint">
                    {region.state}
                  </span>
                  <span className="text-[10px] font-mono text-secondary-dark/60 uppercase">
                    {region.operatingType.split(" ")[0]}
                  </span>
                </div>

                <h5 className="text-base font-bold uppercase tracking-tight text-primary-dark mb-1">
                  {region.name}
                </h5>

                <p className="text-xs text-secondary-dark leading-relaxed mb-4">
                  {region.tagline}
                </p>

                <div className="space-y-2 mb-4">
                  {regionCities.map((city) => (
                    <div key={city.id} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-primary-dark">
                        {city.displayName}
                      </span>
                      {city.locationUrl ? (
                        <Link
                          href={city.locationUrl}
                          className="font-mono text-[11px] text-secondary-dark hover:text-mint inline-flex items-center space-x-0.5 transition-colors"
                        >
                          <span>Explore</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="font-mono text-[10px] text-secondary-dark/50">
                          Corridor
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-editorial-border/50 flex flex-wrap gap-1">
                {region.keyIndustries.slice(0, 2).map((ind) => (
                  <span
                    key={ind}
                    className="text-[10px] font-mono text-secondary-dark/80 bg-canvas px-2 py-0.5 rounded"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
