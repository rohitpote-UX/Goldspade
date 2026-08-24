"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Check if error is related to stale chunks / deployment transitions
    const isChunkError =
      error?.name === "ChunkLoadError" ||
      error?.message?.includes("Loading chunk") ||
      error?.message?.includes("Failed to fetch dynamically imported module") ||
      error?.message?.includes("Failed to load resource");

    if (isChunkError && typeof window !== "undefined") {
      const storageKey = "goldspade-chunk-retry";
      const hasRetried = sessionStorage.getItem(storageKey);

      if (!hasRetried) {
        sessionStorage.setItem(storageKey, "1");
        window.location.reload();
        return;
      }
    }

    // Log error safely without exposing confidential server stack to users
    console.error("[Goldspade Application Error]:", error);
  }, [error]);

  return (
    <div className="pt-36 pb-28 md:py-40 bg-canvas min-h-screen text-primary-dark flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500 bg-red-100 dark:bg-red-950/50 px-3 py-1.5 rounded-full inline-block border border-red-200 dark:border-red-800">
          SYSTEM NOTICE
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-primary-dark leading-tight">
          AN UNEXPECTED ISSUE OCCURRED
        </h1>

        <p className="text-base text-secondary-dark max-w-md mx-auto leading-relaxed">
          The system encountered a brief rendering exception. You can refresh the view or return to the main portal.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.removeItem("goldspade-chunk-retry");
              }
              reset();
            }}
            variant="primary"
            size="md"
          >
            RETRY ACTION
          </Button>
          <Button href="/" variant="secondary" size="md">
            RETURN HOME
          </Button>
        </div>
      </div>
    </div>
  );
}
