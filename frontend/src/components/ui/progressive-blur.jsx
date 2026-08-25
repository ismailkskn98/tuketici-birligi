"use client";

import { cn } from "@/lib/utils";

export function ProgressiveBlur({ className, height = "2rem", position = "bottom" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10",
        position === "top" && "top-0 bg-linear-to-b from-white to-transparent",
        position === "bottom" && "bottom-0 bg-linear-to-t from-white to-transparent",
        position === "both" && "inset-y-0",
        className,
      )}
      style={{ height: position === "both" ? "100%" : height }}
    />
  );
}
