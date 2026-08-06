"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Sticky header bar — publishes measured height as --site-header-height
 * so page content can offset itself under the fixed header.
 */
export function StickyMainBar({ children, className }) {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    function syncHeaderHeight() {
      const height = Math.ceil(bar.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--site-header-height", `${height}px`);
    }

    syncHeaderHeight();

    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(bar);
    window.addEventListener("orientationchange", syncHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", syncHeaderHeight);
    };
  }, []);

  return (
    <div ref={barRef} className={cn("sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur-sm", className)}>
      <motion.div layoutRoot>{children}</motion.div>
    </div>
  );
}
