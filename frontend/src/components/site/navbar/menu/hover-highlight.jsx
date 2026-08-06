"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { hoverTransition } from "./shared";

/**
 * Shared sliding highlight for nav / dropdown rows.
 * One visible instance per layoutId at a time → Motion morphs between them.
 */
export function HoverHighlight({ layoutId, className }) {
  return (
    <motion.span
      layoutId={layoutId}
      className={cn("pointer-events-none absolute inset-0 -z-10 rounded-md bg-ink/4.5", className)}
      transition={hoverTransition}
    />
  );
}

/** Active underline sits on the header bottom edge (parent link is full header height). */
export function ActiveNavUnderline({ className }) {
  return (
    <motion.span
      layoutId="nav-active-underline"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-3.5 bottom-0 h-0.5 rounded-full bg-secondary-dark xl:inset-x-4",
        className
      )}
      transition={hoverTransition}
    />
  );
}
