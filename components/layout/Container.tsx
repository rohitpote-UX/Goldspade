import React from "react";
import { cn } from "@/lib/utils/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
