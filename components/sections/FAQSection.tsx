"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import {
  HOMEPAGE_FAQS,
  STUDIO_COMPARISON_MATRIX,
  TECHNICAL_DEFINITIONS,
} from "@/data/homepageFaqs";
import { cn } from "@/lib/utils/cn";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative py-24 sm:py-32 bg-canvas text-primary-dark border-t border-editorial-border px-5 sm:px-12 md:px-20 lg:px-24"
      aria-labelledby="faq-section-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-white/[0.04] border border-editorial-border px-3.5 py-1.5 rounded-full mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary-dark">
              ANSWER-FIRST INTEL · AEO & CITABILITY
            </span>
          </div>

          <h2
            id="faq-section-heading"
            className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95] mb-6"
          >
            CLEAR ANSWERS FOR <br className="hidden sm:inline" />
            FOUNDERS & SEARCH ENGINES.
          </h2>

          <p className="text-base sm:text-xl text-secondary-dark leading-relaxed font-normal">
            Direct, factual answers regarding our engineering practices, sprint delivery models, commercial investment tiers, and regional collaboration across Pune, Maharashtra, and India.
          </p>
        </div>

        {/* 8 Core Commercial FAQs Accordion */}
        <div className="mb-24 sm:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <div className="sticky top-28 p-7 rounded-3xl bg-white/70 dark:bg-white/[0.03] border border-editorial-border">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-mint bg-primary-dark px-2.5 py-1 rounded-full inline-block mb-4">
                  INDEXED FAQ MATRIX
                </span>
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary-dark mb-3">
                  Direct Facts, Zero Ambiguity
                </h3>
                <p className="text-xs sm:text-sm text-secondary-dark leading-relaxed mb-6">
                  Every answer is structured for instant human comprehension and generative citation across Google, Perplexity, and voice assistants.
                </p>
                <div className="space-y-2.5 pt-4 border-t border-editorial-border text-xs font-mono text-secondary-dark">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-mint" />
                    <span>Schema.org FAQPage Validated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-mint" />
                    <span>SpeakableSpecification Integrated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-mint" />
                    <span>Verified Fixed Milestone Pricing</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {HOMEPAGE_FAQS.map((faq, index) => {
                const isOpen = openIndex === index;
                const headingId = `faq-${faq.id}`;
                const answerId = `faq-${faq.id}-answer`;

                return (
                  <div
                    key={faq.id}
                    className={cn(
                      "rounded-2xl border transition-all duration-300",
                      isOpen
                        ? "bg-white/90 dark:bg-white/[0.05] border-primary-dark/30 dark:border-white/20 shadow-sm"
                        : "bg-white/40 dark:bg-white/[0.02] border-editorial-border hover:border-primary-dark/20"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(index)}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      id={headingId}
                      className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-mint rounded-2xl"
                    >
                      <span className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-tight text-primary-dark leading-snug">
                        {faq.question}
                      </span>
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border border-editorial-border shrink-0 transition-transform duration-300",
                          isOpen
                            ? "bg-primary-dark text-canvas rotate-180"
                            : "bg-white dark:bg-black text-primary-dark"
                        )}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div
                        id={answerId}
                        role="region"
                        aria-labelledby={headingId}
                        className="px-6 pb-6 sm:px-7 sm:pb-7 pt-1 text-secondary-dark"
                      >
                        <p className="text-sm sm:text-base leading-relaxed font-normal mb-4">
                          {faq.fullAnswer}
                        </p>
                        {faq.serviceHref && faq.serviceLabel && (
                          <Link
                            href={faq.serviceHref}
                            className="inline-flex items-center text-xs font-mono font-bold uppercase tracking-wider text-primary-dark hover:text-secondary-dark transition-colors group"
                          >
                            <span>{faq.serviceLabel}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Balanced Comparison Matrix */}
        <div className="mb-24 sm:mb-32">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-mint bg-primary-dark px-3 py-1 rounded-full inline-block mb-3">
              ENGAGEMENT MATRIX
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-primary-dark mb-4">
              CHOOSING THE RIGHT TECHNICAL PARTNER
            </h3>
            <p className="text-sm sm:text-base text-secondary-dark leading-relaxed">
              Every delivery model has valid tradeoffs. We encourage founders to evaluate partners based on project scope, communication bandwidth, and long-term codebase ownership.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-editorial-border bg-white/70 dark:bg-white/[0.02] shadow-xs">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <caption className="sr-only">
                Comparison of Independent Freelancers, Goldspade Digital Studio, and Large Traditional Agencies
              </caption>
              <thead>
                <tr className="border-b border-editorial-border bg-black/[0.02] dark:bg-white/[0.02]">
                  <th scope="col" className="p-5 sm:p-6 text-xs font-mono uppercase tracking-widest text-secondary-dark font-bold">
                    Evaluation Vector
                  </th>
                  <th scope="col" className="p-5 sm:p-6 text-xs font-mono uppercase tracking-widest text-secondary-dark font-bold">
                    Independent Freelancer
                  </th>
                  <th scope="col" className="p-5 sm:p-6 text-xs font-mono uppercase tracking-widest text-primary-dark font-bold bg-mint/15 dark:bg-mint/10">
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-mint fill-mint" />
                      <span>Goldspade Studio</span>
                    </span>
                  </th>
                  <th scope="col" className="p-5 sm:p-6 text-xs font-mono uppercase tracking-widest text-secondary-dark font-bold">
                    Traditional Agency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-border text-xs sm:text-sm">
                {STUDIO_COMPARISON_MATRIX.map((row) => (
                  <tr key={row.dimension} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                    <th scope="row" className="p-5 sm:p-6 font-bold uppercase tracking-tight text-primary-dark font-mono text-xs">
                      {row.dimension}
                    </th>
                    <td className="p-5 sm:p-6 text-secondary-dark leading-relaxed">
                      {row.freelancer}
                    </td>
                    <td className="p-5 sm:p-6 font-medium text-primary-dark bg-mint/10 dark:bg-mint/5 leading-relaxed">
                      {row.goldspade}
                    </td>
                    <td className="p-5 sm:p-6 text-secondary-dark leading-relaxed">
                      {row.agency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Definition List (<dl>) for Citability & AEO */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white/40 dark:bg-white/[0.02] border border-editorial-border">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-secondary-dark block mb-2">
              CANONICAL TECHNICAL GLOSSARY
            </span>
            <h3 className="text-xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark">
              CORE ARCHITECTURAL CONCEPTS
            </h3>
          </div>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {TECHNICAL_DEFINITIONS.map((def) => (
              <div
                key={def.term}
                className="p-6 rounded-2xl bg-white/80 dark:bg-black/30 border border-editorial-border/80 flex flex-col justify-between"
              >
                <dt className="text-base sm:text-lg font-bold uppercase tracking-tight text-primary-dark mb-2 font-mono">
                  {def.term}
                </dt>
                <dd className="text-xs sm:text-sm text-secondary-dark leading-relaxed font-normal">
                  {def.definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
