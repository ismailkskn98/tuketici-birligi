"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1];
const defaultViewport = { once: true, amount: 0.2 };

function MotionElement({ as = "div", children, ...props }) {
  switch (as) {
    case "article":
      return <motion.article {...props}>{children}</motion.article>;
    case "aside":
      return <motion.aside {...props}>{children}</motion.aside>;
    case "header":
      return <motion.header {...props}>{children}</motion.header>;
    case "h1":
      return <motion.h1 {...props}>{children}</motion.h1>;
    case "h2":
      return <motion.h2 {...props}>{children}</motion.h2>;
    case "h3":
      return <motion.h3 {...props}>{children}</motion.h3>;
    case "li":
      return <motion.li {...props}>{children}</motion.li>;
    case "p":
      return <motion.p {...props}>{children}</motion.p>;
    case "section":
      return <motion.section {...props}>{children}</motion.section>;
    case "ul":
      return <motion.ul {...props}>{children}</motion.ul>;
    default:
      return <motion.div {...props}>{children}</motion.div>;
  }
}

export function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  duration = 0.65,
  viewport = defaultViewport,
  y = 16,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionElement
      as={as}
      className={className}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : y }}
      transition={{ delay, duration: prefersReducedMotion ? 0.2 : duration, ease }}
      viewport={viewport}
      whileInView={{ opacity: 1, y: 0 }}
      {...props}
    >
      {children}
    </MotionElement>
  );
}

export function FadeIn({
  as = "div",
  children,
  className,
  delay = 0,
  duration = 0.6,
  viewport = defaultViewport,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionElement
      as={as}
      className={className}
      initial={{ opacity: 0 }}
      transition={{ delay, duration: prefersReducedMotion ? 0.2 : duration, ease }}
      viewport={viewport}
      whileInView={{ opacity: 1 }}
      {...props}
    >
      {children}
    </MotionElement>
  );
}

export function Stagger({
  as = "div",
  children,
  className,
  delay = 0,
  stagger = 0.06,
  viewport = defaultViewport,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionElement
      as={as}
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: prefersReducedMotion ? 0 : delay,
            staggerChildren: prefersReducedMotion ? 0 : stagger,
          },
        },
      }}
      viewport={viewport}
      whileInView="visible"
      {...props}
    >
      {children}
    </MotionElement>
  );
}

export function StaggerItem({ as = "div", children, className, duration = 0.6, y = 12, ...props }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionElement
      as={as}
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: prefersReducedMotion ? 0.2 : duration, ease },
        },
      }}
      {...props}
    >
      {children}
    </MotionElement>
  );
}
