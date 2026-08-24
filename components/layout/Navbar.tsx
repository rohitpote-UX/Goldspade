"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
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
  const [isRendered, setIsRendered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle open / close with smooth unmount transition
  const openMenu = useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsRendered(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpen(true);
        setMobileMenuOpen(true);
      });
    });
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setMobileMenuOpen(false);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setIsRendered(false);
    }, 500);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [isOpen, openMenu, closeMenu]);

  // Lock background scroll when open without layout shift
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, closeMenu]);

  // Close on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 sm:pt-6 md:pt-10 px-4 sm:px-8 md:px-16 lg:px-20 pointer-events-none">
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

        {/* Independent Floating Navigation Pill on Right (Desktop Only) */}
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
            className="text-[11px] font-bold uppercase tracking-wider bg-mint text-[#171515] px-3.5 py-2 rounded-full shadow-2xs hover:bg-[#5fe4b4] transition-colors"
          >
            START
          </Link>
          <button
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            className="relative w-9 h-9 inline-flex items-center justify-center bg-white border border-editorial-border text-primary-dark rounded-full shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-mint transition-transform active:scale-95 cursor-pointer z-50"
          >
            <div className="relative w-4 h-3.5 flex flex-col justify-between items-center overflow-hidden">
              <span
                className={cn(
                  "w-4 h-[1.5px] bg-primary-dark rounded-full transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center",
                  isOpen ? "translate-y-[5.25px] rotate-45" : ""
                )}
              />
              <span
                className={cn(
                  "w-4 h-[1.5px] bg-primary-dark rounded-full transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                )}
              />
              <span
                className={cn(
                  "w-4 h-[1.5px] bg-primary-dark rounded-full transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center",
                  isOpen ? "-translate-y-[5.25px] -rotate-45" : ""
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Premium Cinematic Mobile Menu Overlay */}
      {isRendered && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-40 md:hidden pointer-events-auto"
        >
          {/* Editorial Backdrop Overlay */}
          <div
            onClick={closeMenu}
            className={cn(
              "absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-xs transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
          />

          {/* Sliding Door Navigation Panel */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 max-h-[100dvh] bg-canvas border-b border-editorial-border pt-20 sm:pt-24 pb-8 px-6 sm:px-8 shadow-2xl flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-y-auto",
              isOpen
                ? "translate-y-0 opacity-100 [clip-path:inset(0_0_0%_0)]"
                : "-translate-y-4 opacity-0 [clip-path:inset(0_0_100%_0)]"
            )}
          >
            {/* Staggered Navigation Links */}
            <nav className="flex flex-col space-y-4 mt-2">
              {NAV_LINKS.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <div
                    key={link.href}
                    style={{
                      transitionDelay: isOpen ? `${index * 50 + 60}ms` : "0ms",
                    }}
                    className={cn(
                      "transform transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-3 opacity-0"
                    )}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={cn(
                        "group inline-flex items-center text-2xl sm:text-3xl font-bold uppercase tracking-tight transition-colors duration-200",
                        isActive
                          ? "text-primary-dark underline underline-offset-8 decoration-mint decoration-2"
                          : "text-primary-dark/80 hover:text-primary-dark"
                      )}
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                        {link.label}
                      </span>
                    </Link>
                  </div>
                );
              })}

              {/* Start a Project CTA Button inside Drawer */}
              <div
                style={{
                  transitionDelay: isOpen ? `${NAV_LINKS.length * 50 + 80}ms` : "0ms",
                }}
                className={cn(
                  "pt-4 mt-2 border-t border-editorial-border transform transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                )}
              >
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="w-full group inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider bg-mint text-[#171515] px-6 py-4 rounded-full hover:bg-[#5fe4b4] transition-all duration-300 shadow-sm active:scale-[0.98]"
                >
                  <span>START A PROJECT</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </nav>

            {/* Bottom Footer Info & Theme Switcher */}
            <div
              style={{
                transitionDelay: isOpen ? `${(NAV_LINKS.length + 1) * 50 + 100}ms` : "0ms",
              }}
              className={cn(
                "pt-6 mt-6 border-t border-editorial-border text-xs font-mono text-secondary-dark uppercase tracking-widest flex items-center justify-between transform transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              )}
            >
              <div>
                <p className="font-bold text-primary-dark">GOLDSPADE STUDIO</p>
                <p className="text-[10px] text-secondary-dark">FORGED FOR FOUNDERS.</p>
              </div>
              <ThemeToggle size="sm" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
