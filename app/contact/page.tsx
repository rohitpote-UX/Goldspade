"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, Check, ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const BUDGET_OPTIONS = [
  "< ₹10k",
  "₹10k - ₹25k",
  "₹25k - ₹50k",
  "₹50k - ₹1L",
  "₹1L - ₹2.5L",
  "₹2.5L+",
];

const PROMPT_CHIPS = [
  "A new brand?",
  "A digital product?",
  "A web platform?",
  "Something difficult to explain?",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "₹10k - ₹25k",
    message: "",
    _hp: "", // Honeypot field
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    company: false,
    message: false,
  });

  const [focused, setFocused] = useState({
    name: false,
    email: false,
    company: false,
    message: false,
    budget: false,
  });

  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<{
    submitting: boolean;
    submitted: boolean;
    error?: string;
  }>({
    submitting: false,
    submitted: false,
  });

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Close budget dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBudgetOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Email helper validation
  const isValidEmailFormat = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPartialEmail = (email: string) => {
    return email.includes("@") && !isValidEmailFormat(email);
  };

  // Field status messaging
  const getNameFeedback = () => {
    if (!formData.name) return "";
    if (formData.name.trim().length === 1) {
      return "We promise we won't call you 'A'. What's your full name?";
    }
    return "";
  };

  const getEmailFeedback = () => {
    if (!formData.email) return "";
    if (isValidEmailFormat(formData.email)) {
      return "Valid email format";
    }
    if (isPartialEmail(formData.email)) {
      return "Almost there — your email needs a domain.";
    }
    return "";
  };

  const getCompanyFeedback = () => {
    const generic = ["website", "project", "app", "company"];
    if (generic.includes(formData.company.trim().toLowerCase())) {
      return "Give it a name we'll remember.";
    }
    return "";
  };

  // Calculate Progressive Confidence
  const getRequiredCompletedCount = () => {
    let count = 0;
    if (formData.name.trim().length >= 2) count++;
    if (isValidEmailFormat(formData.email)) count++;
    if (formData.message.trim().length >= 10) count++;
    return count;
  };

  const getProgressMessage = () => {
    const count = getRequiredCompletedCount();
    if (count === 1) return "Getting started...";
    if (count === 2) return "You're giving us a good picture.";
    if (count === 3) return "That's enough for us to get started.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.submitting) return; // Prevent duplicate submissions

    // Reset validation errors
    const errors = { name: "", email: "", message: "" };
    let hasError = false;

    if (!formData.name.trim()) {
      errors.name = "Please let us know who we're speaking with.";
      hasError = true;
    }

    if (!formData.email.trim() || !isValidEmailFormat(formData.email)) {
      errors.email = "We need a real email so we know where to reach you.";
      hasError = true;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = "Give us a little more context (minimum 10 characters).";
      hasError = true;
    }

    setValidationErrors(errors);

    if (hasError) return;

    // Honeypot Protection: Silently accept automated submissions without sending
    if (formData._hp && formData._hp.trim().length > 0) {
      setStatus({ submitting: false, submitted: true });
      return;
    }

    setStatus({ submitting: true, submitted: false, error: undefined });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          budget: formData.budget,
          message: formData.message.trim(),
          _hp: formData._hp,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ submitting: false, submitted: true });
      } else {
        setStatus({
          submitting: false,
          submitted: false,
          error:
            data.error || "Something went wrong while sending your inquiry. Please try again.",
        });
      }
    } catch {
      setStatus({
        submitting: false,
        submitted: false,
        error:
          "Something went wrong while sending your inquiry. Your message wasn't sent. Please try again.",
      });
    }
  };

  const handleChipClick = (chip: string) => {
    const prefix = `We are looking to build ${chip.toLowerCase().replace("?", "")}: `;
    if (!formData.message.includes(prefix)) {
      setFormData((prev) => ({
        ...prev,
        message: prev.message ? `${prev.message}\n${prefix}` : prefix,
      }));
    }
  };

  return (
    <div
      suppressHydrationWarning
      className="pt-28 sm:pt-36 md:py-40 bg-canvas text-primary-dark min-h-screen px-5 sm:px-12 md:px-20 lg:px-24 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto" suppressHydrationWarning>
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 md:mb-20 max-w-3xl" suppressHydrationWarning>
          <span className="text-xs uppercase tracking-widest text-secondary-dark font-mono block mb-3 font-bold">
            INQUIRIES · START A CONVERSATION
          </span>
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95] mb-4">
            START A PROJECT
          </h1>
          <p className="text-base sm:text-xl text-secondary-dark font-normal leading-relaxed">
            Tell us about your company, what you are building, or where you need technical and design clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 pt-6 sm:pt-8 border-t border-editorial-border" suppressHydrationWarning>
          {/* Left Column: Direct Studio Information */}
          <div className="md:col-span-5 space-y-6 sm:space-y-8" suppressHydrationWarning>
            {/* Direct Email with Awwwards-style Brush Interaction */}
            <div className="group relative" suppressHydrationWarning>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase text-secondary-dark tracking-wider">
                  Direct Email
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
              </div>

              {/* Brushed Clickable Anchor */}
              <a
                href="mailto:hello@goldspade.in"
                aria-label="Directly email Goldspade studio at hello@goldspade.in"
                className="relative inline-flex items-center py-2 px-1 text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint rounded-lg group"
              >
                {/* Organic Awwwards Paint Brush Stroke Effect */}
                <div
                  className="absolute inset-x-0 bottom-1.5 h-3 sm:h-3.5 -z-10 pointer-events-none overflow-visible opacity-90 transition-all duration-500 ease-out origin-left group-hover:scale-y-125"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 340 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-mint drop-shadow-[0_2px_8px_rgba(115,243,197,0.4)] transition-all duration-500 ease-out"
                    preserveAspectRatio="none"
                  >
                    {/* Background Soft Texture Path */}
                    <path
                      d="M2 11.5C38 6.5 110 4 175 8.5C240 13 298 9.5 338 12C341 12.2 336 16.5 315 16C265 15 190 17 110 15C50 13.5 12 16.5 3 14C1 13.5 1 12 2 11.5Z"
                      fill="currentColor"
                      className="opacity-0 group-hover:opacity-40 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                    />
                    {/* Primary Dynamic Drawn Brush Stroke */}
                    <path
                      d="M3 10C45 4.5 125 5 180 8C235 11 295 7.5 337 11"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="[stroke-dasharray:360] [stroke-dashoffset:360] group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0] transition-all duration-500 ease-out"
                    />
                    {/* Second subtle fine-line bristle stroke for handmade depth */}
                    <path
                      d="M15 14C70 12 160 14 240 12.5C285 11.5 315 14 330 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="[stroke-dasharray:340] [stroke-dashoffset:340] group-hover:[stroke-dashoffset:0] transition-all duration-700 ease-out delay-75 opacity-70"
                    />
                  </svg>
                </div>

                {/* Email text with micro-translation */}
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  hello@goldspade.in
                </span>

                {/* Arrow with kinetic hover translation */}
                <ArrowUpRight className="relative z-10 w-6 h-6 ml-2 text-primary-dark/70 group-hover:text-primary-dark group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300" />
              </a>

              {/* Sub-label explaining direct mail action */}
              <div className="flex items-center space-x-1.5 mt-1 text-[11px] font-mono text-secondary-dark">
                <Mail className="w-3.5 h-3.5 opacity-60" />
                <span className="tracking-wide">Opens your default email client</span>
              </div>
            </div>

            {/* Studio Location */}
            <div suppressHydrationWarning>
              <span className="text-xs font-mono font-bold uppercase text-secondary-dark block mb-2 tracking-wider">
                Studio Location
              </span>
              <p className="text-sm sm:text-base text-secondary-dark font-normal leading-relaxed">
                Global Digital Studio. Operating across timezones for ambitious founders worldwide.
              </p>
            </div>

            {/* Response SLA Card (Interactive) */}
            <div className="p-5 sm:p-6 bg-white dark:bg-black/60 rounded-3xl border border-editorial-border shadow-xs hover:border-mint/50 hover:shadow-md transition-all duration-300 group relative overflow-hidden" suppressHydrationWarning>
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-mint opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-xs font-mono font-bold uppercase text-secondary-dark block mb-2 tracking-wider flex items-center justify-between">
                <span>Response SLA</span>
                <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
              </span>
              <p className="text-sm sm:text-base text-primary-dark font-semibold leading-relaxed">
                We review every project inquiry within 24 hours.
              </p>
            </div>

            {/* Quiet Workspace Media Asset */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-editorial-border shadow-xs group cursor-pointer" suppressHydrationWarning>
              <Image
                src="/media/pages/contact/contact-desk-morning.png"
                alt="Goldspade Morning Workspace"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover filter contrast-105 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-primary-dark border border-editorial-border">
                GOLDSPADE STUDIO
              </div>
            </div>
          </div>

          {/* Right Column: Contact / Inquiry Form */}
          <div className="md:col-span-7" suppressHydrationWarning>
            {status.submitted ? (
              /* Success State */
              <div className="p-8 sm:p-14 bg-white dark:bg-black/60 rounded-3xl border border-editorial-border text-center space-y-6 shadow-sm animate-in fade-in duration-500" suppressHydrationWarning>
                <div className="w-12 h-12 rounded-full bg-mint/20 border border-mint text-primary-dark flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 text-primary-dark" />
                </div>
                <div className="space-y-2" suppressHydrationWarning>
                  <h3 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-primary-dark">
                    INQUIRY RECEIVED.
                  </h3>
                  <p className="text-secondary-dark text-sm sm:text-lg max-w-md mx-auto leading-relaxed">
                    Thank you. We&apos;ve received your inquiry and will get back to you within 24 hours.
                  </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4" suppressHydrationWarning>
                  <Button
                    onClick={() => {
                      setStatus({ submitting: false, submitted: false });
                      setFormData({
                        name: "",
                        email: "",
                        company: "",
                        budget: "₹10k - ₹25k",
                        message: "",
                        _hp: "",
                      });
                    }}
                    variant="secondary"
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    Send Another Message
                  </Button>
                  <Button href="/" variant="primary" size="md" icon className="w-full sm:w-auto">
                    BACK TO THE SITE
                  </Button>
                </div>
              </div>
            ) : (
              /* Form Component */
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7 p-6 sm:p-8 md:p-10 bg-white dark:bg-black/40 rounded-3xl border border-editorial-border shadow-xs" suppressHydrationWarning>
                {/* Honeypot field (hidden from human users) */}
                <input
                  type="text"
                  name="_hp"
                  value={formData._hp}
                  onChange={(e) => setFormData({ ...formData, _hp: e.target.value })}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    zIndex: -1,
                    width: 0,
                    height: 0,
                    pointerEvents: "none",
                  }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  suppressHydrationWarning
                />

                {status.error && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 text-xs font-mono rounded-2xl" suppressHydrationWarning>
                    <p className="font-bold mb-1">Something went wrong.</p>
                    <p>{status.error}</p>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" suppressHydrationWarning>
                  {/* Your Name */}
                  <div className="relative" suppressHydrationWarning>
                    <label
                      htmlFor="name"
                      className={cn(
                        "block text-xs font-mono font-bold uppercase text-secondary-dark mb-2 transition-all duration-200",
                        focused.name || formData.name ? "text-primary-dark" : ""
                      )}
                    >
                      Your Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onFocus={() => setFocused((p) => ({ ...p, name: true }))}
                      onBlur={() => {
                        setFocused((p) => ({ ...p, name: false }));
                        setTouched((p) => ({ ...p, name: true }));
                      }}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Mercer"
                      className={cn(
                        "w-full bg-white dark:bg-black/60 border border-editorial-border rounded-2xl px-4 py-3.5 text-primary-dark text-sm placeholder:text-secondary-dark/50 focus:outline-none transition-all duration-200 shadow-xs",
                        focused.name ? "border-mint ring-1 ring-mint/30" : "",
                        validationErrors.name && touched.name ? "border-red-400" : ""
                      )}
                      suppressHydrationWarning
                    />
                    {getNameFeedback() && (
                      <p className="mt-1.5 text-[11px] font-mono text-secondary-dark">
                        {getNameFeedback()}
                      </p>
                    )}
                    {validationErrors.name && !getNameFeedback() && (
                      <p className="mt-1.5 text-[11px] font-mono text-red-600 dark:text-red-400">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="relative" suppressHydrationWarning>
                    <label
                      htmlFor="email"
                      className={cn(
                        "block text-xs font-mono font-bold uppercase text-secondary-dark mb-2 transition-all duration-200",
                        focused.email || formData.email ? "text-primary-dark" : ""
                      )}
                    >
                      Email Address *
                    </label>
                    <div className="relative" suppressHydrationWarning>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onFocus={() => setFocused((p) => ({ ...p, email: true }))}
                        onBlur={() => {
                          setFocused((p) => ({ ...p, email: false }));
                          setTouched((p) => ({ ...p, email: true }));
                        }}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@founder.com"
                        className={cn(
                          "w-full bg-white dark:bg-black/60 border border-editorial-border rounded-2xl px-4 py-3.5 text-primary-dark text-sm placeholder:text-secondary-dark/50 focus:outline-none transition-all duration-200 shadow-xs pr-10",
                          focused.email ? "border-mint ring-1 ring-mint/30" : "",
                          validationErrors.email && touched.email ? "border-red-400" : ""
                        )}
                        suppressHydrationWarning
                      />
                      {isValidEmailFormat(formData.email) && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-mint/20 border border-mint text-primary-dark flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-dark" />
                        </div>
                      )}
                    </div>
                    {getEmailFeedback() && (
                      <p className="mt-1.5 text-[11px] font-mono text-secondary-dark flex items-center space-x-1">
                        <span>{getEmailFeedback()}</span>
                      </p>
                    )}
                    {validationErrors.email && !getEmailFeedback() && (
                      <p className="mt-1.5 text-[11px] font-mono text-red-600 dark:text-red-400">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company & Budget Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" suppressHydrationWarning>
                  {/* Company / Project Name */}
                  <div className="relative" suppressHydrationWarning>
                    <label
                      htmlFor="company"
                      className="block text-xs font-mono font-bold uppercase text-secondary-dark mb-2"
                    >
                      Company / Project Name
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onFocus={() => setFocused((p) => ({ ...p, company: true }))}
                      onBlur={() => setFocused((p) => ({ ...p, company: false }))}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Venture Ltd."
                      className={cn(
                        "w-full bg-white dark:bg-black/60 border border-editorial-border rounded-2xl px-4 py-3.5 text-primary-dark text-sm placeholder:text-secondary-dark/50 focus:outline-none transition-all duration-200 shadow-xs",
                        focused.company ? "border-mint ring-1 ring-mint/30" : ""
                      )}
                      suppressHydrationWarning
                    />
                    {getCompanyFeedback() && (
                      <p className="mt-1.5 text-[11px] font-mono text-secondary-dark">
                        {getCompanyFeedback()}
                      </p>
                    )}
                  </div>

                  {/* Custom Budget Dropdown */}
                  <div className="relative" ref={dropdownRef} suppressHydrationWarning>
                    <label
                      htmlFor="budget"
                      className="block text-xs font-mono font-bold uppercase text-secondary-dark mb-2"
                    >
                      Estimated Budget
                    </label>
                    <button
                      type="button"
                      id="budget"
                      onClick={() => setIsBudgetOpen((prev) => !prev)}
                      className={cn(
                        "w-full bg-white dark:bg-black/60 border border-editorial-border rounded-2xl px-4 py-3.5 text-primary-dark text-sm text-left flex items-center justify-between transition-all duration-200 shadow-xs",
                        isBudgetOpen ? "border-mint ring-1 ring-mint/30" : ""
                      )}
                      suppressHydrationWarning
                    >
                      <span className="font-semibold">{formData.budget}</span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-secondary-dark transition-transform duration-200",
                          isBudgetOpen ? "rotate-180 text-primary-dark" : ""
                        )}
                      />
                    </button>

                    {/* Custom Dropdown Popup Menu */}
                    {isBudgetOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black border border-editorial-border rounded-2xl shadow-lg z-30 py-2 overflow-hidden animate-in fade-in duration-200" suppressHydrationWarning>
                        {BUDGET_OPTIONS.map((opt) => {
                          const isSelected = formData.budget === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, budget: opt });
                                setIsBudgetOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors",
                                isSelected
                                  ? "bg-mint/15 text-primary-dark border-l-2 border-mint"
                                  : "text-secondary-dark hover:text-primary-dark hover:bg-black/5 dark:hover:bg-white/5"
                              )}
                              suppressHydrationWarning
                            >
                              <span>{opt}</span>
                              {isSelected && <Check className="w-4 h-4 text-primary-dark" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Overview & Objectives Textarea */}
                <div className="relative" suppressHydrationWarning>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="message"
                      className="block text-xs font-mono font-bold uppercase text-secondary-dark"
                    >
                      Project Overview & Objectives *
                    </label>
                    {formData.message.length > 0 && (
                      <span className="text-[10px] font-mono text-secondary-dark">
                        {formData.message.length} characters
                      </span>
                    )}
                  </div>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onFocus={() => setFocused((p) => ({ ...p, message: true }))}
                    onBlur={() => {
                      setFocused((p) => ({ ...p, message: false }));
                      setTouched((p) => ({ ...p, message: true }));
                    }}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you're building, what isn't working, and where you want to take it."
                    className={cn(
                      "w-full bg-white dark:bg-black/60 border border-editorial-border rounded-2xl p-4 text-primary-dark text-sm placeholder:text-secondary-dark/50 focus:outline-none transition-all duration-200 shadow-xs leading-relaxed",
                      focused.message ? "border-mint ring-1 ring-mint/30" : "",
                      validationErrors.message && touched.message ? "border-red-400" : ""
                    )}
                    suppressHydrationWarning
                  />

                  {/* Contextual Conversational Chips */}
                  <div className="mt-3 flex flex-wrap gap-2 items-center" suppressHydrationWarning>
                    <span className="text-[10px] font-mono uppercase text-secondary-dark tracking-wider mr-1">
                      PROMPTS:
                    </span>
                    {PROMPT_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleChipClick(chip)}
                        className="text-[11px] font-mono font-medium text-secondary-dark hover:text-primary-dark bg-white dark:bg-black/40 hover:bg-mint/10 border border-editorial-border hover:border-mint/40 px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer shadow-2xs"
                        suppressHydrationWarning
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {validationErrors.message && (
                    <p className="mt-1.5 text-[11px] font-mono text-red-600 dark:text-red-400">
                      {validationErrors.message}
                    </p>
                  )}
                </div>

                {/* Progressive Confidence Line & Submit Button */}
                <div className="pt-4 space-y-4" suppressHydrationWarning>
                  {/* Progressive Confidence Indicator */}
                  {getProgressMessage() && (
                    <div className="flex items-center space-x-2 text-xs font-mono text-secondary-dark animate-in fade-in duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                      <span>{getProgressMessage()}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4" suppressHydrationWarning>
                    <Button
                      type="submit"
                      disabled={status.submitting}
                      variant="mint"
                      size="lg"
                      icon={!status.submitting}
                      className="w-full sm:w-auto"
                      suppressHydrationWarning
                    >
                      {status.submitting ? "SENDING INQUIRY..." : "SUBMIT INQUIRY"}
                    </Button>
                    <span className="text-[11px] font-mono text-secondary-dark text-center sm:text-right">
                      Strict SLA: Response within 24 hours.
                    </span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
