"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils/cn";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  const sizeClasses =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : "w-9 h-9 text-sm";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      suppressHydrationWarning
      className={cn(
        "relative inline-flex items-center justify-center rounded-full border border-editorial-border bg-white text-primary-dark hover:border-primary-dark transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 active:scale-95 flex-shrink-0 cursor-pointer shadow-xs",
        sizeClasses,
        className
      )}
      aria-label={
        !mounted
          ? "Toggle theme"
          : isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        !mounted
          ? "Toggle theme"
          : isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
    >
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>

      {/* Sun icon for Dark mode (switch to light) */}
      <Sun
        className={cn(
          "w-4 h-4 transition-all duration-400 ease-out absolute",
          mounted && isDark
            ? "opacity-100 rotate-0 scale-100 text-mint"
            : "opacity-0 -rotate-90 scale-50 pointer-events-none"
        )}
      />

      {/* Moon icon for Light mode (switch to dark) */}
      <Moon
        className={cn(
          "w-4 h-4 transition-all duration-400 ease-out absolute",
          !mounted || !isDark
            ? "opacity-100 rotate-0 scale-100 text-primary-dark"
            : "opacity-0 rotate-90 scale-50 pointer-events-none"
        )}
      />
    </button>
  );
}
