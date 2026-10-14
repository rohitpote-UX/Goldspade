import Link from "next/link";
import { ArrowUpRight, MapPin, ChevronRight, ShieldCheck, Zap, Compass } from "lucide-react";
import { constructMetadata } from "@/lib/seo/metadata";
import { generateLocationsHubSchema } from "@/lib/seo/jsonld";
import { LOCATIONS } from "@/data/locations";

export const metadata = constructMetadata({
  title: "Regional Locations & Service Coverage — Goldspade Digital Studio",
  exactTitle: true,
  description:
    "Goldspade is a premium digital studio based in Pune, engineering high-speed websites, custom business software, and AI automation across Maharashtra, Goa, and North Karnataka.",
  canonicalUrl: "/locations",
});

export default function LocationsHubPage() {
  const hubSchema = generateLocationsHubSchema(LOCATIONS);

  return (
    <div className="pt-28 sm:pt-36 pb-20 md:py-40 bg-canvas text-primary-dark min-h-screen px-5 sm:px-12 md:px-20 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema) }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-secondary-dark">
            <li>
              <Link href="/" className="hover:text-primary-dark transition-colors">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3 h-3 opacity-40" />
            </li>
            <li className="text-primary-dark font-bold">Locations</li>
          </ol>
        </nav>

        {/* Editorial Page Header */}
        <div className="mb-14 sm:mb-20">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block">
              REGIONAL SERVICE COVERAGE
            </span>
            <span className="h-2 w-px bg-editorial-border" />
            <span className="text-[11px] font-mono text-secondary-dark/70">
              MAHARASHTRA · GOA · NORTH KARNATAKA
            </span>
          </div>

          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95] mb-6">
            ENGINEERED FOR <br className="hidden sm:inline" />
            <span className="text-mint">WESTERN INDIA.</span>
          </h1>

          <p className="text-base sm:text-xl text-secondary-dark max-w-3xl font-normal leading-relaxed">
            Headquartered in Pune with verified project delivery across Karad, Satara, and Sangli, Goldspade builds bespoke digital flagships, custom business software, and workflow automation for ambitious founders across Maharashtra, Goa, and North Karnataka.
          </p>
        </div>

        {/* Studio Operating Model Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 sm:mb-24 pt-8 border-t border-editorial-border">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-editorial-border">
            <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center text-primary-dark mb-4">
              <Compass className="w-5 h-5 text-primary-dark" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-primary-dark mb-2">
              Pune Studio Base
            </h3>
            <p className="text-xs sm:text-sm text-secondary-dark leading-relaxed">
              Our central engineering and design base. Available for in-person architectural strategy and founder discovery workshops.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-editorial-border">
            <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center text-primary-dark mb-4">
              <ShieldCheck className="w-5 h-5 text-primary-dark" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-primary-dark mb-2">
              Verified Regional Proof
            </h3>
            <p className="text-xs sm:text-sm text-secondary-dark leading-relaxed">
              Real running applications: Hotel Atithi Karad, Mamacha Mala in Khodshi, Saanjgarva in Western Maharashtra, and Jar in Satara.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-editorial-border">
            <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center text-primary-dark mb-4">
              <Zap className="w-5 h-5 text-primary-dark" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-primary-dark mb-2">
              Direct Founder Alignment
            </h3>
            <p className="text-xs sm:text-sm text-secondary-dark leading-relaxed">
              You collaborate directly with principal architects and designers. No account managers, no outsourced junior handoffs.
            </p>
          </div>
        </div>

        {/* Location Grid Header */}
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-secondary-dark block mb-2">
            REGIONAL HUBS & CORRIDORS
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-primary-dark">
            Explore Dedicated Location Centers
          </h2>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {LOCATIONS.map((loc) => {
            const projectCount = loc.relevantProjects.length;

            return (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-editorial-border hover:border-primary-dark/40 dark:hover:border-white/20 transition-all duration-500 shadow-xs hover:shadow-md hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-mint" />
                      <span className="text-[11px] font-mono uppercase tracking-wider text-secondary-dark">
                        {loc.region}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-editorial-border bg-white text-primary-dark">
                      {loc.operatingModel.deliveryType.includes("Headquarters")
                        ? "STUDIO BASE"
                        : "REGIONAL CORRIDOR"}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark mb-2 group-hover:text-primary-dark transition-colors flex items-center justify-between">
                    <span>{loc.name}</span>
                    <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-all text-mint" />
                  </h3>

                  <p className="text-xs sm:text-sm text-secondary-dark leading-relaxed line-clamp-3 mb-6">
                    {loc.heroSummary}
                  </p>

                  {/* Top Industry Focus Chips */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-dark/60 block">
                      Key Sectors Served:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {loc.industryNeeds.slice(0, 2).map((ind) => (
                        <span
                          key={ind.industry}
                          className="text-[10px] font-mono bg-canvas border border-editorial-border px-2.5 py-1 rounded-full text-primary-dark"
                        >
                          {ind.industry}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-4 border-t border-editorial-border/60 flex items-center justify-between text-xs font-mono">
                  {projectCount > 0 ? (
                    <span className="text-secondary-dark inline-flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse mr-1.5" />
                      {projectCount} Demonstrated {projectCount === 1 ? "Project" : "Projects"}
                    </span>
                  ) : (
                    <span className="text-secondary-dark/60">Active Regional Coverage</span>
                  )}

                  <span className="font-bold uppercase tracking-wider text-primary-dark group-hover:text-mint transition-colors">
                    View Center →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Contextual Bottom Callout */}
        <div className="mt-20 sm:mt-28 p-8 sm:p-12 rounded-3xl bg-primary-dark text-canvas border border-primary-dark">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-mint block mb-3">
              EXPANDING DIGITAL HORIZONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-pure-white mb-4">
              Building Outside These Exact Locations?
            </h2>
            <p className="text-sm sm:text-base text-pure-white/80 leading-relaxed mb-8">
              We partner with ambitious founders across Maharashtra, Karnataka, Goa, and all of India. Our engineering sprints, transparent Git repositories, and daily asynchronous communication keep projects moving with zero geographic friction.
            </p>
            <Link
              href="/contact?location=general"
              className="inline-flex items-center space-x-2 bg-mint text-[#171515] font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-full hover:bg-[#5fe4b4] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
            >
              <span>DISCUSS YOUR REGIONAL PROJECT</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
