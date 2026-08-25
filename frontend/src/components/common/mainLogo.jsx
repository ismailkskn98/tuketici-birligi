"use client";

import { motion, useReducedMotion } from "motion/react";
import logoGroups from "./main-logo-paths.json";

const EASE = [0.22, 1, 0.36, 1];

const groupVariants = {
  hidden: {
    opacity: 0,
    scale: 0.88,
  },
  visible: (delay) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.55,
      delay,
      ease: EASE,
    },
  }),
  hover: (delay) => ({
    opacity: [0, 1],
    scale: [0.9, 1],
    transition: {
      duration: 0.5,
      delay,
      ease: EASE,
    },
  }),
};

export function MainLogo({
  className = "",
  drawOnMount = false,
  drawOnHover = false,
  omitGroups = [],
}) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = !reduceMotion && (drawOnMount || drawOnHover);
  const groups =
    omitGroups.length > 0
      ? logoGroups.filter((group) => !omitGroups.includes(group.id))
      : logoGroups;

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 614.83 613.41"
      className={className}
      initial={drawOnMount && !reduceMotion ? "hidden" : "visible"}
      animate="visible"
      whileHover={drawOnHover && !reduceMotion ? "hover" : undefined}
      aria-hidden="true"
    >
      {groups.map((group) => (
        <motion.g
          key={group.id}
          custom={shouldAnimate ? group.delay : 0}
          variants={shouldAnimate ? groupVariants : undefined}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          {group.paths.map((path, index) => (
            <path key={`${group.id}-${index}`} d={path.d} fill={path.fill} />
          ))}
        </motion.g>
      ))}
    </motion.svg>
  );
}
