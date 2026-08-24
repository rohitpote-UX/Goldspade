import React from "react";
import Image from "next/image";

export function PhilosophySection() {
  return (
    <section className="py-16 sm:py-24 md:py-48 bg-canvas text-primary-dark border-t border-editorial-border relative overflow-hidden px-5 sm:px-12 md:px-20 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-5xl">
          <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-6 sm:mb-8">
            05 — PHILOSOPHY
          </span>

          <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight text-primary-dark leading-[0.9] mb-8 sm:mb-12">
            IDEAS ARE <br />
            EVERYWHERE. <br />
            <span className="text-mint">EXECUTION IS RARE.</span>
          </h2>

          {/* Cinematic Philosophy Image */}
          <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden border border-editorial-border my-12 shadow-sm">
            <Image
              src="/media/pages/philosophy/philosophy-founder-horizon.png"
              alt="Founder Ambition and Direction"
              fill
              className="object-cover filter contrast-105"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-editorial-border pt-12">
            <div className="md:col-span-6">
              <p className="text-xl sm:text-2xl text-primary-dark font-medium leading-relaxed">
                In a digital landscape filled with noise and superficial trends, Goldspade operates on restraint, clarity, and technical excellence.
              </p>
            </div>
            <div className="md:col-span-6">
              <p className="text-base sm:text-lg text-secondary-dark leading-relaxed font-normal">
                We believe that software should be robust, design should serve business objectives, and founders deserve partners who execute with absolute dedication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
