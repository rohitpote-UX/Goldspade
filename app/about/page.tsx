import Image from "next/image";
import { constructMetadata } from "@/lib/seo/metadata";
import { TrustSection } from "@/components/sections/TrustSection";

export const metadata = constructMetadata({
  title: "About Goldspade",
  description: "Goldspade is a premium digital studio that helps ambitious businesses build brands, digital products, websites, and business systems.",
});

export default function AboutPage() {
  return (
    <div className="pt-36 pb-20 bg-canvas text-primary-dark min-h-screen px-6 sm:px-12 md:px-20 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-20">
          <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-3">
            ABOUT US
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95]">
            FORGED FOR <span className="text-mint">FOUNDERS.</span>
          </h1>
          <p className="mt-4 text-lg text-secondary-dark max-w-2xl font-normal leading-relaxed">
            Goldspade is a premium digital studio built for businesses that demand strategy, design, and technical craftsmanship.
          </p>
        </div>

        {/* Studio Atmospheric Image */}
        <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden border border-editorial-border mb-16 shadow-sm">
          <Image
            src="/media/pages/about/about-studio-collaborative.png"
            alt="Goldspade Studio Environment"
            fill
            priority
            className="object-cover filter contrast-105"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-12 border-t border-b border-editorial-border text-primary-dark">
          <div className="md:col-span-6 space-y-4">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-primary-dark">Our Mission</h3>
            <p className="text-base text-secondary-dark leading-relaxed font-normal">
              We eliminate the friction between ambition and digital execution. Most founders struggle with fragmented agencies, superficial visual work, or unscalable code. We bridge strategy, aesthetics, and engineering into one unified digital studio.
            </p>
          </div>

          <div className="md:col-span-6 space-y-4">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-primary-dark">Core Competencies</h3>
            <p className="text-base text-secondary-dark leading-relaxed font-normal">
              Whether launching a new enterprise brand, building complex billing software, developing biometric verification systems, or crafting high-converting web experiences, we deliver with speed and discipline.
            </p>
          </div>
        </div>
      </div>
      <TrustSection />
    </div>
  );
}
