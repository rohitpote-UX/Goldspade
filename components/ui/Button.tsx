import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "mint" | "text";
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  children: React.ReactNode;
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  icon = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "group inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-mint disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary-dark text-canvas hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-white text-primary-dark border border-editorial-border hover:border-primary-dark active:scale-[0.98]",
    outline:
      "bg-transparent text-primary-dark border border-primary-dark hover:bg-primary-dark hover:text-canvas active:scale-[0.98]",
    mint:
      "bg-mint text-[#171515] hover:bg-[#5fe4b4] hover:scale-[1.02] active:scale-[0.98]",
    text: "text-primary-dark hover:text-secondary-dark px-0 underline-offset-4 hover:underline rounded-none",
  };

  const sizes = {
    sm: "text-xs px-4 py-2 uppercase tracking-wider h-10",
    md: "text-sm px-6 py-3 uppercase tracking-wider h-12",
    lg: "text-sm sm:text-base px-8 py-4 uppercase tracking-widest h-14 md:h-16",
  };

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowUpRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        suppressHydrationWarning
        className={cn(baseStyles, variants[variant], sizes[size], className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      suppressHydrationWarning
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {content}
    </button>
  );
}
