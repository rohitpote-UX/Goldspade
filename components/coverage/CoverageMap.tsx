"use client";

import React, { useState } from "react";
import { CoverageCity } from "@/data/coverage";

interface CoverageMapProps {
  cities: CoverageCity[];
  activeCityId: string;
  onSelectCity: (cityId: string) => void;
  className?: string;
}

export function CoverageMap({
  cities,
  activeCityId,
  onSelectCity,
  className = "",
}: CoverageMapProps) {
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);

  // Coastline path (Thane/Mumbai down to Karwar)
  const coastlinePath =
    "M 175 40 " +
    "C 178 70, 182 100, 185 140 " + // Raigad / Alibag
    "C 188 180, 186 220, 190 270 " + // Chiplun / Dabhol
    "C 193 310, 194 340, 195 360 " + // Ratnagiri
    "C 198 390, 215 425, 225 450 " + // Vijaydurg / Devgad
    "C 235 470, 248 495, 260 520 " + // Malvan / Sindhudurg
    "C 272 535, 285 545, 292 565 " + // Goa coast (Panaji to Margao)
    "C 300 590, 312 620, 325 660"; // Karwar / South border

  // Secondary ocean depth contours
  const oceanContour1 =
    "M 140 40 " +
    "C 145 100, 150 180, 155 270 " +
    "C 160 350, 175 430, 205 500 " +
    "C 230 550, 255 600, 275 660";

  const oceanContour2 =
    "M 100 40 " +
    "C 105 120, 115 220, 120 320 " +
    "C 128 410, 150 510, 185 590 " +
    "C 200 625, 220 645, 235 660";

  // Western Ghats ridge line (Sahyadri corridor)
  const ghatsRidge =
    "M 255 50 " +
    "Q 265 140, 275 220 " +
    "Q 285 300, 310 380 " +
    "Q 330 460, 350 540 " +
    "Q 360 600, 375 660";

  // NH48 Spine: Pune -> Satara -> Karad -> Kolhapur -> Belagavi -> Hubballi
  const nh48Corridor = "M 297 169 L 323 274 L 359 323 L 370 395 L 418 502 L 537 562";

  // Branch lines:
  // Kolhapur -> Sangli
  const sangliBranch = "M 370 395 L 434 377";
  // Pune -> Konkan
  const konkanBranch = "M 297 169 Q 235 250, 195 360";
  // Belagavi -> Goa
  const goaBranch = "M 418 502 L 292 546";
  // Pune -> Pan-India
  const panIndiaBranch = "M 297 169 Q 470 120, 640 190";

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl border border-editorial-border bg-canvas/90 p-3 sm:p-6 shadow-sm select-none ${className}`}>
      {/* Top Telemetry Header Bar */}
      <div className="flex items-center justify-between border-b border-editorial-border/60 pb-3 mb-2 font-mono text-[10px] sm:text-xs text-secondary-dark uppercase tracking-wider">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-mint animate-pulse" />
          <span className="font-bold text-primary-dark">REGIONAL TELEMETRY</span>
          <span className="hidden sm:inline text-secondary-dark/60">· WESTERN CORRIDOR & BEYOND</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="hidden md:inline text-secondary-dark/60">GRID: 15.0°N–19.5°N · 72.6°E–76.2°E</span>
          <span className="bg-canvas border border-editorial-border px-2 py-0.5 rounded text-primary-dark font-bold">
            SCALE 1:1
          </span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative aspect-[4/3.4] sm:aspect-[4/3.3] w-full max-w-full">
        <svg
          viewBox="0 0 800 680"
          className="w-full h-full text-primary-dark"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Interactive Goldspade Service Reach Map covering Pune, Western Maharashtra, Goa, Konkan, and North Karnataka"
        >
          <defs>
            {/* Subtle Grid Pattern */}
            <pattern id="coordGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.04"
                strokeWidth="1"
              />
            </pattern>

            {/* Mint Gradient Glow */}
            <radialGradient id="mintGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#73F3C5" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#73F3C5" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#73F3C5" stopOpacity="0" />
            </radialGradient>

            {/* Land Mass Fill Gradient */}
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.015" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.035" />
            </linearGradient>
          </defs>

          {/* Coordinate Grid Background */}
          <rect width="800" height="680" fill="url(#coordGrid)" />

          {/* Land Mass Silhouette Behind Coastline */}
          <path
            d={`M 175 40 L 790 40 L 790 660 L 325 660 ${coastlinePath.replace("M 175 40", "")} Z`}
            fill="url(#landGradient)"
          />

          {/* Arabian Sea Area & Depth Contours */}
          <g className="text-secondary-dark/30 pointer-events-none">
            <path
              d={oceanContour2}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 5"
              strokeOpacity="0.12"
            />
            <path
              d={oceanContour1}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 6"
              strokeOpacity="0.18"
            />
            {/* Coastline */}
            <path
              d={coastlinePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeOpacity="0.4"
              strokeLinecap="round"
            />

            {/* Ocean Watermark Label */}
            <text
              x="90"
              y="380"
              fill="currentColor"
              className="font-mono text-[10px] tracking-[0.3em] font-medium"
              transform="rotate(-85 90 380)"
              opacity="0.35"
            >
              ARABIAN SEA · WESTERN SEABOARD
            </text>
          </g>

          {/* Western Ghats / Sahyadri Topographic Line */}
          <path
            d={ghatsRidge}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 6"
            strokeOpacity="0.15"
          />
          <text
            x="270"
            y="290"
            fill="currentColor"
            className="font-mono text-[8px] tracking-[0.25em]"
            transform="rotate(65 270 290)"
            opacity="0.25"
          >
            SAHYADRI RIDGE
          </text>

          {/* Geographic Coordinates Markers (Border Ticks) */}
          <g className="font-mono text-[8px] fill-secondary-dark/50 select-none">
            <text x="25" y="70">19°00&apos;N</text>
            <text x="25" y="195">18°00&apos;N</text>
            <text x="25" y="325">17°00&apos;N</text>
            <text x="25" y="470">16°00&apos;N</text>
            <text x="25" y="605">15°00&apos;N</text>

            <text x="180" y="665">73°00&apos;E</text>
            <text x="350" y="665">74°00&apos;E</text>
            <text x="520" y="665">75°00&apos;E</text>
            <text x="690" y="665">76°00&apos;E</text>
          </g>

          {/* Regional Territory Boundary Indicators (Subtle dotted state & regional dividers) */}
          <g className="stroke-editorial-border/60 stroke-[1] stroke-dasharray-4 fill-none pointer-events-none">
            {/* Maharashtra - Karnataka border hint */}
            <path d="M 235 480 Q 320 485, 410 470 Q 500 460, 600 470" strokeDasharray="3 4" strokeOpacity="0.2" />
            <text x="460" y="465" className="font-mono text-[8px] tracking-wider fill-secondary-dark/30">
              MH / KA BORDER
            </text>
          </g>

          {/* Highway & Network Telemetry Lines */}
          <g className="pointer-events-none">
            {/* NH48 Main Spine */}
            <path
              d={nh48Corridor}
              fill="none"
              stroke="#73F3C5"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.45"
            />
            {/* Branch to Sangli */}
            <path
              d={sangliBranch}
              fill="none"
              stroke="#73F3C5"
              strokeWidth="1"
              strokeDasharray="3 3"
              strokeOpacity="0.35"
            />
            {/* Branch to Konkan */}
            <path
              d={konkanBranch}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 4"
              strokeOpacity="0.2"
            />
            {/* Branch to Goa */}
            <path
              d={goaBranch}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 4"
              strokeOpacity="0.25"
            />
            {/* Branch to Pan-India */}
            <path
              d={panIndiaBranch}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 6"
              strokeOpacity="0.2"
            />

            {/* NH48 Tag */}
            <text
              x="335"
              y="300"
              className="font-mono text-[7px] tracking-wider fill-mint/70 font-bold"
              transform="rotate(62 335 300)"
            >
              NH48 INDUSTRIAL CORRIDOR
            </text>
          </g>

          {/* Interactive City Nodes & Markers */}
          {cities.map((city) => {
            const isActive = activeCityId === city.id;
            const isHovered = hoveredCityId === city.id;
            const isPune = city.id === "pune";
            const isRemote = city.id === "pan-india";

            return (
              <g
                key={city.id}
                role="button"
                tabIndex={0}
                aria-label={`${city.displayName} - ${city.operatingModel.badge}`}
                aria-pressed={isActive}
                onClick={() => onSelectCity(city.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectCity(city.id);
                  }
                }}
                onMouseEnter={() => setHoveredCityId(city.id)}
                onMouseLeave={() => setHoveredCityId(null)}
                className="cursor-pointer group outline-none"
              >
                {/* Hit target area (large touch friendly circle) */}
                <circle
                  cx={city.coordinates.x}
                  cy={city.coordinates.y}
                  r={isPune ? 36 : 24}
                  fill="transparent"
                  className="outline-none"
                />

                {/* Radar Ripple & Pulse for Pune (Primary Hub) */}
                {isPune && (
                  <g className="pointer-events-none">
                    <circle
                      cx={city.coordinates.x}
                      cy={city.coordinates.y}
                      r="30"
                      fill="url(#mintGlow)"
                      className="animate-pulse"
                    />
                    <circle
                      cx={city.coordinates.x}
                      cy={city.coordinates.y}
                      r="22"
                      fill="none"
                      stroke="#73F3C5"
                      strokeWidth="1"
                      strokeOpacity="0.4"
                    />
                    <circle
                      cx={city.coordinates.x}
                      cy={city.coordinates.y}
                      r="14"
                      fill="none"
                      stroke="#73F3C5"
                      strokeWidth="1.2"
                      strokeDasharray="2 3"
                    />
                  </g>
                )}

                {/* Active City Glow Ring */}
                {isActive && !isPune && (
                  <circle
                    cx={city.coordinates.x}
                    cy={city.coordinates.y}
                    r="18"
                    fill="url(#mintGlow)"
                    className="animate-pulse"
                  />
                )}

                {/* Outer Focus / Selection Indicator */}
                <circle
                  cx={city.coordinates.x}
                  cy={city.coordinates.y}
                  r={isPune ? 10 : isActive || isHovered ? 9 : 6}
                  fill="var(--color-canvas)"
                  stroke={isPune || isActive || isHovered ? "#73F3C5" : "currentColor"}
                  strokeWidth={isPune ? 2.5 : isActive || isHovered ? 2 : 1}
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* Inner Core Dot */}
                <circle
                  cx={city.coordinates.x}
                  cy={city.coordinates.y}
                  r={isPune ? 5 : isActive ? 4 : 2.5}
                  fill={isPune || isActive ? "#73F3C5" : "currentColor"}
                  className="transition-all duration-300"
                />

                {/* Remote Hub Beacon Ring */}
                {isRemote && (
                  <circle
                    cx={city.coordinates.x}
                    cy={city.coordinates.y}
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    strokeOpacity="0.3"
                  />
                )}

                {/* Permanent Text Label */}
                <g
                  transform={`translate(${
                    isPune
                      ? city.coordinates.x + 14
                      : isRemote
                      ? city.coordinates.x - 12
                      : city.coordinates.x + 12
                  }, ${city.coordinates.y + 4})`}
                  className="pointer-events-none select-none transition-transform duration-300 group-hover:translate-x-1"
                >
                  {/* Subtle Background Backdrop for maximum legibility */}
                  <rect
                    x={isRemote ? -130 : -4}
                    y="-13"
                    width={isPune ? 120 : isRemote ? 134 : 95}
                    height="20"
                    rx="4"
                    fill="var(--color-canvas)"
                    fillOpacity="0.82"
                    stroke="var(--color-editorial-border)"
                    strokeWidth="0.5"
                    className="backdrop-blur-sm"
                  />

                  {/* Primary City Name */}
                  <text
                    x={isRemote ? -122 : 0}
                    y="0"
                    className={`font-mono font-bold tracking-tight uppercase ${
                      isPune
                        ? "text-[11px] fill-primary-dark"
                        : isActive
                        ? "text-[10px] fill-mint font-bold"
                        : "text-[9px] fill-primary-dark/90"
                    }`}
                  >
                    {city.name}
                    {isPune && " ★"}
                  </text>

                  {/* Microcopy Subtitle */}
                  <text
                    x={isRemote ? -122 : 0}
                    y="5"
                    className={`font-mono text-[7px] tracking-wider uppercase ${
                      isPune ? "fill-mint font-bold" : "fill-secondary-dark/70"
                    }`}
                  >
                    {isPune
                      ? "STUDIO BASE"
                      : isRemote
                      ? "REMOTE COLLAB"
                      : city.state === "Karnataka"
                      ? "NORTH KA"
                      : city.regionId === "goa"
                      ? "GOA"
                      : "MAHARASHTRA"}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Legend in bottom corner */}
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-canvas/95 backdrop-blur-md border border-editorial-border/80 rounded-xl p-2.5 sm:p-3 shadow-sm font-mono text-[9px] sm:text-[10px] space-y-1.5 pointer-events-none">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-mint border border-primary-dark shadow-sm" />
            <span className="font-bold text-primary-dark">PUNE: STUDIO BASE</span>
          </div>
          <div className="flex items-center space-x-2 text-secondary-dark">
            <span className="w-2 h-2 rounded-full bg-primary-dark border border-mint" />
            <span>REGIONAL CORRIDOR HUB</span>
          </div>
          <div className="flex items-center space-x-2 text-secondary-dark/70">
            <span className="w-4 h-0.5 border-t border-dashed border-mint" />
            <span>NH48 TRANSIT / DELIVERY SPINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
