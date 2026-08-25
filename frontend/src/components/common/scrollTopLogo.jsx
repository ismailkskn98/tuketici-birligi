"use client";

import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { MainLogo } from "@/components/common/mainLogo";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1];

export function ScrollTopLogo({ className = "", visible = true }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={cn("relative inline-flex items-center justify-center", className)}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.92,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              scale: 1.05,
              transition: { duration: 0.22, ease: EASE },
            }
      }
      whileTap={
        reduceMotion
          ? undefined
          : {
              scale: 0.97,
              transition: { duration: 0.15, ease: EASE },
            }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.28,
        ease: EASE,
      }}
      aria-hidden="true"
    >
      <MainLogo className="size-full" omitGroups={["globe"]} />

      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            "inline-flex size-[36%] items-center justify-center",
            visible && !reduceMotion && "scroll-top-arrow-nudge",
          )}
        >
          <ArrowUp
            className="size-full text-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5"
            strokeWidth={2.35}
          />
        </span>
      </span>
    </motion.span>
  );
}
