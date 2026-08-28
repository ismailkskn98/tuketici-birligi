"use client";

import { Grid2X2, Rows3 } from "lucide-react";
import { motion } from "motion/react";

const modes = [
  { icon: Rows3, value: "single" },
  { icon: Grid2X2, value: "double" },
];

const indicatorSpring = {
  type: "spring",
  stiffness: 520,
  damping: 42,
  mass: 0.6,
};

export function BoardViewToggle({ labels, onChange, reduceMotion, value }) {
  return (
    <motion.div
      aria-label={labels.group}
      className="flex shrink-0 items-center gap-0.5 rounded-md border border-[#dfe3e8] bg-white p-0.5 sm:hidden"
      layoutRoot
      role="group"
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = value === mode.value;
        const label = mode.value === "single" ? labels.single : labels.double;

        return (
          <button
            aria-label={label}
            aria-pressed={isActive}
            className={`relative flex size-8 items-center justify-center rounded-[0.25rem] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
              isActive ? "text-[#14213d]" : "text-[#9aa3b1] hover:text-[#566174]"
            }`}
            key={mode.value}
            onClick={() => onChange(mode.value)}
            title={label}
            type="button"
          >
            {isActive ? (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[0.25rem] bg-[#eef1f5]"
                layoutId="board-mobile-view-indicator"
                transition={reduceMotion ? { duration: 0 } : indicatorSpring}
              />
            ) : null}
            <Icon aria-hidden="true" className="relative z-[1] size-4" strokeWidth={1.7} />
          </button>
        );
      })}
    </motion.div>
  );
}
