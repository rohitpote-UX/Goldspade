"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { label: "WORK", href: "/work" },
  { label: "CAPABILITIES", href: "/capabilities" },
  { label: "PHILOSOPHY", href: "/philosophy" },
  { label: "ABOUT", href: "/about" },
  { label: "JOURNAL", href: "/journal" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-6 sm:pt-8 md:pt-10 px-6 sm:px-12 md:px-16 lg:px-20 pointer-events-none">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between pointer-events-auto relative">
        {/* Independent Left Logo with Animated Mint Curved Line */}
        <Link
          href="/"
          aria-label="Goldspade Homepage"
          className="group relative inline-block font-bold text-xl sm:text-2xl tracking-tighter uppercase text-primary-dark focus:outline-none flex-shrink-0 py-1"
        >
          <span className="relative z-10">GOLDSPADE</span>
          <svg
            className="absolute -bottom-1 left-0 w-full h-2.5 text-mint overflow-visible pointer-events-none"
            viewBox="0 0 100 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 7C28 2 72 11 98 5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="[stroke-dasharray:100] [stroke-dashoffset:0] transition-all duration-700 ease-out group-hover:scale-x-105 group-hover:translate-y-[1px] origin-left"
            />
          </svg>
        </Link>

        {/* Independent Floating Navigation Pill on Right */}
        <div
          className={cn(
            "hidden md:flex items-center justify-between bg-white border border-editorial-border rounded-full px-6 py-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition-all duration-500 max-w-[1020px] w-full ml-12 lg:ml-20",
            scrolled ? "shadow-md border-editorial-border" : "shadow-[0_4px_14px_rgba(0,0,0,0.04)]"
          )}
        >
          {/* Navigation Links */}
          <nav className="flex items-center space-x-6 lg:space-x-10 pl-3 sm:pl-5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs uppercase tracking-widest transition-colors duration-300 font-medium",
                    isActive
                      ? "text-primary-dark font-bold underline underline-offset-4"
                      : "text-secondary-dark hover:text-primary-dark"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Theme Control + Mint CTA Pill */}
          <div className="flex items-center space-x-4 ml-6 flex-shrink-0">
            <ThemeToggle />
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center text-xs font-bold uppercase tracking-wider bg-mint text-[#171515] px-6 py-3.5 rounded-full hover:bg-[#5fe4b4] transition-all duration-300 flex-shrink-0"
            >
              <span>START A PROJECT</span>
              <ArrowUpRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle size="sm" />
          <Link
            href="/contact"
            className="text-[11px] font-bold uppercase tracking-wider bg-mint text-[#171515] px-3.5 py-2 rounded-full"
          >
            START
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center space-x-1.5 bg-white border border-editorial-border text-primary-dark px-3.5 py-2 rounded-full text-xs font-mono font-bold uppercase shadow-sm focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <span>MENU</span>
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[88px] bg-canvas z-40 flex flex-col justify-between p-8 border-t border-editorial-border md:hidden pointer-events-auto animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-6 mt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-bold uppercase tracking-tight text-primary-dark hover:text-secondary-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl font-bold uppercase tracking-tight text-primary-dark hover:text-secondary-dark transition-colors pt-4 border-t border-editorial-border"
            >
              CONTACT
            </Link>
          </nav>

          <div className="pt-8 border-t border-editorial-border text-xs font-mono text-secondary-dark uppercase tracking-widest flex items-center justify-between">
            <div>
              <p>GOLDSPADE STUDIO</p>
              <p>FORGED FOR FOUNDERS.</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
