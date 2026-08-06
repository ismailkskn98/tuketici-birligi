"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function HeaderChrome2({ children, className }) {
  const barRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("pointer-events-none", className)}>
      <div className="gridContainer pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-end">
          <motion.div
            ref={barRef}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-xl bg-white text-ink"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
