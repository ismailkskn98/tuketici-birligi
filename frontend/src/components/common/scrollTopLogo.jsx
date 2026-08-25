"use client";

import { motion, useReducedMotion } from "motion/react";
import { MainLogo } from "@/components/common/mainLogo";

export function ScrollTopLogo({ className = "", visible = true }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={`inline-flex items-center justify-center ${className}`}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.92,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              scale: 1.06,
              transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-hidden="true"
    >
      <MainLogo className="size-full" />
    </motion.span>
  );
}
